package com.SpringBatch.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Enables method-level security (@PreAuthorize)
public class SecurityConfig {


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Disable CSRF for testing; enable in production
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/brand/delete/**", "/item/delete/**", "/brand/update/**", "/brand/add", "/item/add", "/item/update/**")
                        .hasAnyRole("ADMIN", "MANAGER")  //  ALLOW BOTH ROLES
                        .anyRequest().permitAll() // Allow all other requests without authentication
                )
                .formLogin(withDefaults()) // Enables form-based login
                .httpBasic(withDefaults()); // Enables Basic Auth
        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails adminUser = User.builder()
                .username("Admin")
                .password(passwordEncoder().encode("admin123"))  // Use BCrypt hashing
                .roles("ADMIN")  // Assigns ADMIN role
                .build();

        UserDetails managerUser = User.builder()
                .username("Manager")
                .password(passwordEncoder().encode("manager123"))  // Use BCrypt hashing
                .roles("MANAGER")  // Assigns MANAGER role
                .build();

        return new InMemoryUserDetailsManager(adminUser, managerUser);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Use BCrypt encoder
    }
}