package com.itrosys.cycle_engine.controller;

import com.itrosys.cycle_engine.dto.OrderRequest;
import com.itrosys.cycle_engine.dto.PaymentVerificationRequest;
import com.itrosys.cycle_engine.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest orderRequest) {
        Map<String, Object> response = paymentService.createOrder(orderRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            boolean isValid = paymentService.verifyPayment(request);
            if (isValid) {
                return ResponseEntity.ok(Map.of("success", "Payment verified successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Invalid payment signature"));
            }
        } catch (Exception e) {
            logger.error("Payment verification failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Payment verification failed: " + e.getMessage()));
        }
    }
}
