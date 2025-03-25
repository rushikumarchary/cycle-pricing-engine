package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.OrderItemRequest;
import com.itrosys.cycle_engine.dto.OrderRequest;
import com.itrosys.cycle_engine.dto.PaymentVerificationRequest;
import com.itrosys.cycle_engine.entity.*;
import com.itrosys.cycle_engine.enums.OrderStatus;
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
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentOrderRepository paymentOrderRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final OrderDetailsRepository orderDetailsRepository;
    private final OrderItemRepository orderItemRepository;
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(PaymentOrderRepository paymentOrderRepository,
                          UserRepository userRepository,
                          AddressRepository addressRepository,
                          OrderDetailsRepository orderDetailsRepository,
                          OrderItemRepository orderItemRepository) {
        this.paymentOrderRepository = paymentOrderRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.orderDetailsRepository = orderDetailsRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }
    public Map<String, Object> createOrder(OrderRequest orderRequest) {
        try {
            User user = userRepository.findById(orderRequest.getUserId())
                    .orElseThrow(() -> new PaymentException("User not found"));

            System.out.println("Address ID: " + orderRequest.getAddressId());
            Address address = addressRepository.findById(orderRequest.getAddressId()) // Fetch full entity
                    .orElseThrow(() -> new PaymentException("Address not found"));

            System.out.println("Address: found");
            System.out.println("start the crate orderDetails " );
            OrderDetails orderDetails = new OrderDetails();
            orderDetails.setUser(user);
            orderDetails.setOrderDate(LocalDateTime.now(ZoneId.of("Asia/Kolkata")));
            
            // Calculate subtotal, GST, and final amount
            double subtotal = orderRequest.calculateTotalAmount(orderRequest.getItems());
            double gst = orderRequest.calculateGST(subtotal);
            double shippingCost = orderRequest.getShippingCost();
            double finalAmount = subtotal + gst + shippingCost;
            
            // Set all the amounts
            orderDetails.setSubtotal(subtotal);
            orderDetails.setGstAmount(gst);
            orderDetails.setShippingCost(shippingCost);
            orderDetails.setTotalAmount(finalAmount);
            
            orderDetails.setStatus(OrderStatus.Pending);
            orderDetails.setAddress(address);

            // Initialize items list
            orderDetails.setItems(new ArrayList<>());
            System.out.println("orderDetails items start initializing ");
            if (orderRequest.getItems() != null) {
                for (OrderItemRequest itemRequest : orderRequest.getItems()) {
                    OrderItem item = new OrderItem();
                    BeanUtils.copyProperties(itemRequest, item);
                    item.setOrderDetails(orderDetails);
                    item.setTotalPrice(itemRequest.calculateItemTotal());
                    orderDetails.getItems().add(item);
                }
            }
            System.out.println("orderDetails items end initializing ");

            // Save orderDetails before using its ID
            orderDetails = orderDetailsRepository.save(orderDetails);
            System.out.println("orderDetails saved with ID: " + orderDetails.getOrderId());
            logger.info("Order saved with ID: {}", orderDetails.getOrderId());

            // Log items
            for (OrderItemRequest item : orderRequest.getItems()) {
                logger.info("Item: Brand={} Quantity={}", item.getBrand(), item.getQuantity());
            }
            System.out.println("items loged ");
            System.out.println("start the createRazorpayOrder ");

            // Use the final amount (including GST and shipping) for payment
            Order razorpayOrder = createRazorpayOrder(orderDetails.getTotalAmount());
            System.out.println("createRazorpayOrder end ");
            System.out.println("start the savePaymentOrder ");  
            savePaymentOrder(razorpayOrder, orderDetails);
            System.out.println("savePaymentOrder end ");
            System.out.println("start the generateOrderResponse ");
            return generateOrderResponse(razorpayOrder, orderDetails);
        } catch (Exception e) {
            logger.error("Error creating order: {}", e.getMessage());
            throw new PaymentException("Order creation failed " + e);
        }
    }

    private Order createRazorpayOrder(Double totalAmount) throws RazorpayException {
        JSONObject orderRequestJson = new JSONObject();
        // Convert amount to paise and ensure it's an integer
        int amountInPaise = (int) Math.round(totalAmount * 100);
        orderRequestJson.put("amount", amountInPaise);
        orderRequestJson.put("currency", "INR");
        orderRequestJson.put("receipt", "txn_" + System.currentTimeMillis());

        return razorpayClient.orders.create(orderRequestJson);
    }

    private void savePaymentOrder(Order razorpayOrder, OrderDetails orderDetails) {
        PaymentOrder newOrder = new PaymentOrder();
        newOrder.setRazorpayOrderId(razorpayOrder.get("id"));
        newOrder.setAmount(orderDetails.getTotalAmount());
        newOrder.setCurrency(razorpayOrder.get("currency"));
        newOrder.setStatus("CREATED");
        newOrder.setOrderId(orderDetails.getOrderId());
        paymentOrderRepository.save(newOrder);
    }

    private Map<String, Object> generateOrderResponse(Order razorpayOrder, OrderDetails orderDetails) {
        Map<String, Object> response = new HashMap<>();
        response.put("orderId", razorpayOrder.get("id"));
        response.put("amount", razorpayOrder.get("amount"));
        response.put("currency", razorpayOrder.get("currency"));
        response.put("status", razorpayOrder.get("status"));
        response.put("orderDetailsId", orderDetails.getOrderId());
        response.put("subtotal", orderDetails.getSubtotal());
        response.put("gstAmount", orderDetails.getGstAmount());
        response.put("shippingCost", orderDetails.getShippingCost());
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

            updateOrderStatus(paymentOrder.getOrderId(), OrderStatus.Confirmed);
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
                    "razorpay_signature", request.getSignature()
            );
            Utils.verifyPaymentSignature(new JSONObject(params), razorpayKeySecret);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private void updateOrderStatus(Long orderId, OrderStatus status) {
        OrderDetails orderDetails = orderDetailsRepository.findById(orderId)
                .orElseThrow(() -> new PaymentException("Order details not found"));
        orderDetails.setStatus(status);
        orderDetailsRepository.save(orderDetails);
    }
}
