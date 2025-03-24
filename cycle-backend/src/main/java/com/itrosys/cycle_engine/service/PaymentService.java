package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.OrderRequest;
import com.itrosys.cycle_engine.dto.PaymentVerificationRequest;
import com.itrosys.cycle_engine.entity.PaymentOrder;
import com.itrosys.cycle_engine.repository.PaymentOrderRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import jakarta.annotation.PostConstruct;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class PaymentService {
    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentOrderRepository paymentOrderRepository;
    private RazorpayClient razorpayClient;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;
    @Autowired
    public PaymentService(PaymentOrderRepository paymentOrderRepository) {
        this.paymentOrderRepository = paymentOrderRepository;
    }

    @PostConstruct
    public void init() throws RazorpayException {
        this.razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
    }

    public Map<String, Object> createOrder(OrderRequest orderRequest) throws RazorpayException {
        JSONObject orderRequestJson = new JSONObject();
        orderRequestJson.put("amount", orderRequest.getAmount() * 100);
        orderRequestJson.put("currency", "INR");
        orderRequestJson.put("receipt", "txn_" + System.currentTimeMillis());

        Order order = razorpayClient.orders.create(orderRequestJson);

        PaymentOrder newOrder = new PaymentOrder();
        newOrder.setRazorpayOrderId(order.get("id"));
        newOrder.setAmount(orderRequest.getAmount());
        newOrder.setCurrency(order.get("currency"));
        newOrder.setStatus("CREATED");
        paymentOrderRepository.save(newOrder);

        logger.info("Created Razorpay order: {}", Optional.ofNullable(order.get("id")));

        Map<String, Object> response = new HashMap<>();
        response.put("orderId", order.get("id"));
        response.put("amount", order.get("amount"));
        response.put("currency", order.get("currency"));
        response.put("status", order.get("status"));

        return response;
    }

    public boolean verifyPayment(PaymentVerificationRequest request) throws Exception {
        Optional<PaymentOrder> optionalOrder = paymentOrderRepository.findByRazorpayOrderId(request.getOrderId());

        if (optionalOrder.isEmpty()) {
            logger.error("Order not found for ID: {}", request.getOrderId());
            throw new Exception("Order not found");
        }

        PaymentOrder order = optionalOrder.get();

        Map<String, String> params = new HashMap<>();
        params.put("razorpay_order_id", request.getOrderId());
        params.put("razorpay_payment_id", request.getPaymentId());
        params.put("razorpay_signature", request.getSignature());

        try {
            JSONObject jsonParams = new JSONObject(params);
            Utils.verifyPaymentSignature(jsonParams, razorpayKeySecret); // Fixed

            order.setStatus("PAID");
            order.setPaymentId(request.getPaymentId());
            order.setSignature(request.getSignature());
            paymentOrderRepository.save(order);
            logger.info("Payment verified successfully for order: {}", request.getOrderId());
            return true;
        } catch (Exception e) {
            order.setStatus("FAILED");
            paymentOrderRepository.save(order);
            logger.error("Payment verification failed for order: {}", request.getOrderId(), e);
            return false;
        }
    }

}
