package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.OrderRequest;
import com.itrosys.cycle_engine.dto.PaymentVerificationRequest;
import com.itrosys.cycle_engine.entity.*;
import com.itrosys.cycle_engine.enums.OrderStatus;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.exception.PaymentException;
import com.itrosys.cycle_engine.repository.*;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentOrderRepository paymentOrderRepository;
    private final PaymentOrderMappingRepository paymentOrderMappingRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CartRepository cartRepository;
    private final OrderRepository orderRepository;
    private final SpecificationsRepository specificationsRepository;
    private final CouponsRepository couponsRepository;
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(PaymentOrderRepository paymentOrderRepository,
            PaymentOrderMappingRepository paymentOrderMappingRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            CartRepository cartRepository,
            OrderRepository orderRepository,
            SpecificationsRepository specificationsRepository,
            CouponsRepository couponsRepository) {
        this.paymentOrderRepository = paymentOrderRepository;
        this.paymentOrderMappingRepository = paymentOrderMappingRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.cartRepository = cartRepository;
        this.orderRepository = orderRepository;
        this.specificationsRepository = specificationsRepository;
        this.couponsRepository = couponsRepository;
    }

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    @Transactional
    public Map<String, Object> createOrder(OrderRequest orderRequest) {
        try {
            // Find user and address
            User user = userRepository.findById(orderRequest.getUserId())
                    .orElseThrow(() -> new PaymentException("User not found"));

            Address address = addressRepository.findById(orderRequest.getAddressId())
                    .orElseThrow(() -> new PaymentException("Address not found"));

            // Find all carts
            List<Cart> carts = cartRepository.findAllById(orderRequest.getCartIds());
            if (carts.isEmpty()) {
                throw new PaymentException("No carts found");
            }

            List<Orders> orders = new ArrayList<>();
            BigDecimal totalSubtotal = BigDecimal.ZERO;

            // Create an order for each cart
            for (Cart cart : carts) {
                Orders order = new Orders();
                order.setUser(user);
                order.setAddress(address);
                LocalDateTime orderDate = LocalDateTime.now(ZoneId.of("Asia/Kolkata"));
                order.setOrderDate(orderDate);
                // Set estimated delivery date to 7 days from order date
                order.setEstimatedDeliveryDate(orderDate.plusDays(7));
                order.setStatus(OrderStatus.Pending);

                // Set cart details
                order.setBrand(cart.getBrand().getBrandName());
                order.setQuantity(cart.getQuantity());
                order.setThumbnail(cart.getThumbnail());

                // Calculate prices for all items in the cart
                BigDecimal cartItemsTotal = BigDecimal.ZERO;
                for (CartItem cartItem : cart.getCartItems()) {
                    Item item = cartItem.getItem();
                    cartItemsTotal = cartItemsTotal.add(item.getPrice());
                }

                // Set unit price as sum of all items' prices
                order.setUnitPrice(cartItemsTotal.doubleValue());

                // Calculate subtotal (total price * quantity)
                BigDecimal subtotal = cartItemsTotal.multiply(BigDecimal.valueOf(cart.getQuantity()));
                totalSubtotal = totalSubtotal.add(subtotal);
                order.setSubtotal(subtotal.doubleValue());

                // Create and set specifications from all cart items
                if (!cart.getCartItems().isEmpty()) {
                    Specifications specs = new Specifications();
                    // Initialize with "Not Selected"
                    specs.setFrame("Not Selected");
                    specs.setHandlebar("Not Selected");
                    specs.setSeating("Not Selected");
                    specs.setWheel("Not Selected");
                    specs.setBrakes("Not Selected");
                    specs.setTyre("Not Selected");
                    specs.setChainAssembly("Not Selected");

                    // Update specifications from all items in the cart
                    for (CartItem cartItem : cart.getCartItems()) {
                        Item currentItem = cartItem.getItem();
                        switch (currentItem.getItemType().toLowerCase()) {
                            case "frame":
                                specs.setFrame(currentItem.getItemName());
                                break;
                            case "handlebar":
                                specs.setHandlebar(currentItem.getItemName());
                                break;
                            case "seating":
                                specs.setSeating(currentItem.getItemName());
                                break;
                            case "wheel":
                                specs.setWheel(currentItem.getItemName());
                                break;
                            case "brakes":
                                specs.setBrakes(currentItem.getItemName());
                                break;
                            case "tyre":
                                specs.setTyre(currentItem.getItemName());
                                break;
                            case "chain assembly":
                                specs.setChainAssembly(currentItem.getItemName());
                                break;
                            default:
                                throw new IllegalArgumentException("Unknown ItemType: " + currentItem.getItemType());
                        }
                    }
                    specs.setOrder(order); // Associate specifications with order
                    order.setSpecifications(specs);
                }

                orders.add(order);
            }

            // Calculate final amounts using BigDecimal for precision
            BigDecimal discountAmount = BigDecimal.ZERO;

            // Check if coupon code exists and is active
            if (orderRequest.getCouponCode() != null && !orderRequest.getCouponCode().isEmpty()) {
                Coupons coupon = couponsRepository.findByCouponCode(orderRequest.getCouponCode())
                        .orElse(null);

                if (coupon != null && coupon.getIsActive() == IsActive.Y) {
                    discountAmount = totalSubtotal.multiply(BigDecimal.valueOf(coupon.getDiscountPercentage() / 100))
                            .setScale(2, RoundingMode.HALF_UP);
                }
            }

            BigDecimal subtotalAfterDiscount = totalSubtotal.subtract(discountAmount);
            BigDecimal gstAmount = calculateGST(subtotalAfterDiscount);
            BigDecimal shippingCost = BigDecimal.valueOf(orderRequest.getShippingCost());
            BigDecimal finalAmount = subtotalAfterDiscount.add(gstAmount).add(shippingCost);

            // Update all orders with the calculated amounts
            for (Orders order : orders) {
                BigDecimal orderSubtotal = BigDecimal.valueOf(order.getSubtotal());
                BigDecimal ratio = orderSubtotal.divide(totalSubtotal, 10, RoundingMode.HALF_UP);

                // Calculate individual order amounts
                BigDecimal orderDiscountAmount = discountAmount.multiply(ratio).setScale(2, RoundingMode.HALF_UP);
                BigDecimal orderGstAmount = gstAmount.multiply(ratio).setScale(2, RoundingMode.HALF_UP);
                BigDecimal orderShippingCost = shippingCost.divide(BigDecimal.valueOf(orders.size()), 2,
                        RoundingMode.HALF_UP);
                BigDecimal orderTotalAmount = finalAmount.multiply(ratio).setScale(2, RoundingMode.HALF_UP);

                order.setDiscountAmount(orderDiscountAmount.doubleValue());
                order.setGstAmount(orderGstAmount.doubleValue());
                order.setShippingCost(orderShippingCost.doubleValue());
                order.setTotalAmount(orderTotalAmount.doubleValue());
            }

            // Save all orders with their specifications
            List<Orders> savedOrders = orderRepository.saveAll(orders);

            // Create Razorpay order
            Order razorpayOrder = createRazorpayOrder(finalAmount.doubleValue());
            savePaymentOrder(razorpayOrder, savedOrders);

            // Delete all carts after successful order creation
            cartRepository.deleteAllById(orderRequest.getCartIds());

            return generateOrderResponse(razorpayOrder, savedOrders);

        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage());
            throw new PaymentException("Order creation failed: " + e.getMessage());
        }
    }

    private BigDecimal calculateGST(BigDecimal amount) {
        return amount.multiply(BigDecimal.valueOf(0.18)).setScale(2, RoundingMode.HALF_UP); // 18% GST
    }

    private Order createRazorpayOrder(Double totalAmount) throws RazorpayException {
        JSONObject orderRequestJson = new JSONObject();
        int amountInPaise = (int) Math.round(totalAmount * 100);
        orderRequestJson.put("amount", amountInPaise);
        orderRequestJson.put("currency", "INR");
        orderRequestJson.put("receipt", "txn_" + System.currentTimeMillis());

        return razorpayClient.orders.create(orderRequestJson);
    }

    private void savePaymentOrder(Order razorpayOrder, List<Orders> orders) {
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setRazorpayOrderId(razorpayOrder.get("id"));
        paymentOrder.setAmount(Double.valueOf(razorpayOrder.get("amount").toString()) / 100);
        paymentOrder.setCurrency(razorpayOrder.get("currency"));
        paymentOrder.setStatus("CREATED");
        
        // Save the payment order first
        paymentOrder = paymentOrderRepository.save(paymentOrder);

        // Create and save mappings for each order
        for (Orders order : orders) {
            PaymentOrderMapping mapping = new PaymentOrderMapping();
            mapping.setPaymentOrder(paymentOrder);
            mapping.setOrder(order);
            paymentOrderMappingRepository.save(mapping);
        }
    }

    private Map<String, Object> generateOrderResponse(Order razorpayOrder, List<Orders> orders) {
        Map<String, Object> response = new HashMap<>();

        // Razorpay order details
        response.put("razorpayKeyId", razorpayKeyId);
        response.put("orderId", razorpayOrder.get("id"));
        response.put("amount", razorpayOrder.get("amount"));
        response.put("currency", razorpayOrder.get("currency"));
        response.put("status", razorpayOrder.get("status"));
        response.put("orderIds", orders.stream().map(Orders::getOrderId).toList());

        // Calculate totals from all orders
        BigDecimal totalSubtotal = BigDecimal.ZERO;
        BigDecimal totalDiscountAmount = BigDecimal.ZERO;
        BigDecimal totalGstAmount = BigDecimal.ZERO;
        BigDecimal totalShippingCost = BigDecimal.ZERO;

        for (Orders order : orders) {
            totalSubtotal = totalSubtotal.add(BigDecimal.valueOf(order.getSubtotal()));
            totalDiscountAmount = totalDiscountAmount.add(BigDecimal.valueOf(order.getDiscountAmount()));
            totalGstAmount = totalGstAmount.add(BigDecimal.valueOf(order.getGstAmount()));
            totalShippingCost = totalShippingCost.add(BigDecimal.valueOf(order.getShippingCost()));
        }

        // Add totals to response
        response.put("subtotal", totalSubtotal.setScale(2, RoundingMode.HALF_UP).doubleValue());
        response.put("discountAmount", totalDiscountAmount.setScale(2, RoundingMode.HALF_UP).doubleValue());
        response.put("gstAmount", totalGstAmount.setScale(2, RoundingMode.HALF_UP).doubleValue());
        response.put("shippingCost", totalShippingCost.setScale(2, RoundingMode.HALF_UP).doubleValue());

        return response;
    }

    @Transactional
    public boolean verifyPayment(PaymentVerificationRequest request) {
        PaymentOrder paymentOrder = paymentOrderRepository.findByRazorpayOrderId(request.getOrderId())
                .orElseThrow(() -> new PaymentException("Order not found"));

        if (verifyRazorpaySignature(request)) {
            paymentOrder.setStatus("PAID");
            paymentOrder.setPaymentId(request.getPaymentId());
            paymentOrder.setSignature(request.getSignature());
            paymentOrderRepository.save(paymentOrder);

            // Update status for all orders in this payment
            List<PaymentOrderMapping> mappings = paymentOrderMappingRepository.findByPaymentOrderId(paymentOrder.getId());
            for (PaymentOrderMapping mapping : mappings) {
                updateOrderStatus(mapping.getOrder().getOrderId(), OrderStatus.Confirmed);
            }
            return true;
        } else {
            paymentOrder.setStatus("FAILED");
            paymentOrderRepository.save(paymentOrder);
            throw new PaymentException("Payment verification failed");
        }
    }

    private boolean verifyRazorpaySignature(PaymentVerificationRequest request) {
        try {
            Map<String, String> params = Map.of(
                    "razorpay_order_id", request.getOrderId(),
                    "razorpay_payment_id", request.getPaymentId(),
                    "razorpay_signature", request.getSignature());
            Utils.verifyPaymentSignature(new JSONObject(params), razorpayKeySecret);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void updateOrderStatus(Long orderId, OrderStatus status) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new PaymentException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }
}
