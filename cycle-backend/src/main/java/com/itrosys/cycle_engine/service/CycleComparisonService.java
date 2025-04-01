package com.itrosys.cycle_engine.service;


import com.itrosys.cycle_engine.dto.CycleComparisonResponse;
import com.itrosys.cycle_engine.entity.*;
import com.itrosys.cycle_engine.enums.VariantType;
import com.itrosys.cycle_engine.repository.*;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CycleComparisonService {

    private final CycleComparisonRepository cycleComparisonRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    public CycleComparisonService(CycleComparisonRepository cycleComparisonRepository, 
                                  CartRepository cartRepository,
                                  UserRepository userRepository) {
        this.cycleComparisonRepository = cycleComparisonRepository;
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Integer addCycleToComparison(Long userId, Long cartId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cycleComparisonRepository.existsByUserAndCart(user, cart)) {
            throw new RuntimeException("Cycle already added to comparison");
        }

        VariantType variantType = determineVariant(cart);

        CycleComparison cycleComparison = new CycleComparison();
        cycleComparison.setUser(user);
        cycleComparison.setCart(cart);
        cycleComparison.setVariant(variantType);
        
        
        cycleComparisonRepository.save(cycleComparison);
        
        return cycleComparisonRepository.getCountOfItemUserId(userId);
    }

    private VariantType determineVariant(Cart cart) {
        cart.getCartItems().forEach(item -> {
            System.out.println("ItemName: " + item.getItem().getItemName() +
                    ", ItemType: " + item.getItem().getItemType());
        });

        // Extract frame material by checking itemType == "Frame"
        String frameMaterial = cart.getCartItems().stream()
                .map(CartItem::getItem)
                .filter(item -> "Frame".equalsIgnoreCase(item.getItemType()))
                .map(Item::getItemName) 
                .findFirst()
                .orElse("Standard"); 

        System.out.println("Extracted Frame Material: " + frameMaterial);

        return switch (frameMaterial.toLowerCase()) {
            case "steel" -> VariantType.STANDARD;
            case "aluminum" -> VariantType.DELUXE;
            case "carbon fiber" -> VariantType.PREMIUM;
            default -> VariantType.STANDARD; 
        };
    }



    public List<CycleComparisonResponse> getComparedCycles(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cycleComparisonRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .toList();
    }

    private CycleComparisonResponse mapToResponse(CycleComparison cycleComparison) {
        List<CycleComparisonResponse.ItemComparison> itemDetails = cycleComparison.getCart()
                .getCartItems().stream()
                .map(cartItem -> new CycleComparisonResponse.ItemComparison(
                        cartItem.getItem().getItemName(),
                        cartItem.getItem().getItemType(),
                        cartItem.getItem().getPrice()
                )).toList();

        double totalPartsPrice = itemDetails.stream()
        	    .mapToDouble(item -> item.getPrice().doubleValue())
        	    .sum();

        double gst = totalPartsPrice * 0.18;
        double finalPrice = totalPartsPrice + gst;

        return new CycleComparisonResponse(
                cycleComparison.getId(),
                new CycleComparisonResponse.UserResponse(
                        cycleComparison.getUser().getId(),
                        cycleComparison.getUser().getUsername()
                ),
                new CycleComparisonResponse.CartResponse(
                		cycleComparison.getCart().getBrand().getBrandName(),
                        cycleComparison.getCart().getCartId(),
                        cycleComparison.getCart().getQuantity(),
                        cycleComparison.getCart().getThumbnail()
                ),
                cycleComparison.getVariant(),
                itemDetails,
                new CycleComparisonResponse.PriceBreakdown(totalPartsPrice, gst, finalPrice)
        );
    }

    
    
		    public void deleteComparisonById(Long comparisonId) {
		        if (cycleComparisonRepository.existsById(comparisonId)) {
		            cycleComparisonRepository.deleteById(comparisonId);
		        } else {
		            throw new RuntimeException("Comparison not found with ID: " + comparisonId);
		        }
		    }

}
