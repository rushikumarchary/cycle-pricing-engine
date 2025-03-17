package com.SpringBatch;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
//@OpenAPIDefinition(
//		info = @Info(title = "Cycle Pricing API", version = "1.0", description = "API for managing cycle pricing")
//)
public class CyclePricingEngineApplication {

	public static void main(String[] args) {

		SpringApplication.run(CyclePricingEngineApplication.class, args);
	}

}
