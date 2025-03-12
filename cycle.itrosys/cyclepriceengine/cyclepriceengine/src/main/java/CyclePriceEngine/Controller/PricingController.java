package CyclePriceEngine.Controller;

import CyclePriceEngine.DTO.PricingRequestDTO;
import CyclePriceEngine.DTO.PricingResponseDTO;
import CyclePriceEngine.Service.PricingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/pricing")
@Tag(name = "Pricing API", description = "APIs for calculating cycle pricing")
public class PricingController {
    private final PricingService pricingService;

    public PricingController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @Operation(
            summary = "Calculate Price",
            description = "Calculates the total price based on selected cycle components and date."
    )
    @PostMapping("/calculate")
    public ResponseEntity<PricingResponseDTO> calculatePrice(@RequestBody PricingRequestDTO request) {
        return ResponseEntity.ok(pricingService.calculatePricing(request));
    }
}
