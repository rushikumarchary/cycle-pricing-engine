package CyclePriceEngine.Configuration;

import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class SwaggerConfiguration {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("Cycle Pricing Engine API")
                        .version("1.0")
                        .description("API for calculating cycle price based on selected parts, quantity, size, and type.")
                        .contact(new Contact()
                                .name("Support Team")
                                .email("support@cycle.com")));
    }
}