package com.example.cpe.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Cycle Pricing Engine API"
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Server"),
        @Server(url = "https://api.cyclepricing.com", description = "Production Server")
    }
)
public class SwaggerConfig {
}

