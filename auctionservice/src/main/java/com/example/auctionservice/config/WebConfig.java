package com.example.auctionservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Value("${cors.allowed-origin}")
    private String allowedOrigin;

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin(allowedOrigin); // Allow Vite dev server
        config.addAllowedMethod("*");    // GET, POST, PUT, DELETE...
        config.addAllowedHeader("*");    // Allow any headers
        config.setAllowCredentials(true); // If you need credentials (cookies, etc.)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Apply CORS config to all endpoints
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
