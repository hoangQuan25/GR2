package com.example.userservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    // Generate JWT token
    public String generateToken(String username) {
        try {
            System.out.println("Starting token generation for username: " + username);

            // Log the issued at date
            Date issuedAt = new Date();
            System.out.println("Issued At: " + issuedAt);

            // Log the expiration date
            Date expiration = new Date(System.currentTimeMillis() + jwtExpirationMs);
            System.out.println("Expiration: " + expiration);

            // Generate the signing key
            SecretKey signingKey = getSigningKey();
            System.out.println("Signing Key: " + signingKey);

            // Build the JWT
            String token = Jwts.builder()
                    .setSubject(username)
                    .setIssuedAt(issuedAt)
                    .setExpiration(expiration)
                    .signWith(signingKey, SignatureAlgorithm.HS512)
                    .compact();

            System.out.println("Generated Token: " + token);
            return token;
        } catch (Exception e) {
            System.err.println("Error during token generation: " + e.getMessage());
            e.printStackTrace();
            throw e; // Rethrow the exception for higher-level handling
        }
    }


    // Get username from JWT token
    public String getUsernameFromJwt(String token) {
        try {
            System.out.println("Extracting username from token: " + token);

            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(jwtSecret.getBytes())) // Ensure this uses the same key as signing
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (Exception e) {
            System.err.println("Error extracting username from JWT: " + e.getMessage());
            e.printStackTrace();
            throw e; // Optionally rethrow to surface the error
        }
    }

    // Validate JWT token
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            System.err.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}
