package com.example.userservice.service;

import com.example.userservice.event.UserRegisteredEvent;
import com.example.userservice.model.User;
import com.example.userservice.repository.UserRepository;
import com.example.userservice.security.JwtUtil;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routingkey}")
    private String routingKey;

    // Register a new user
    public void registerUser(User user) throws Exception {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new Exception("Email is already in use!");
        }

        // Encode the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save the user
        userRepository.save(user);

        UserRegisteredEvent event = new UserRegisteredEvent(
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );

        rabbitTemplate.convertAndSend(exchange, routingKey, event);
    }

    // Authenticate user and return JWT token
    public String authenticateUser(String email, String password) throws Exception {
        try {
            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            // Retrieve UserDetails from authentication
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Generate and return the JWT token using the user's email
            String token = jwtUtil.generateToken(userDetails.getUsername());
            System.out.println("Generated Token: " + token);

            return token;
        } catch (BadCredentialsException e) {
            throw new Exception("Invalid email or password");
        }
    }
}

