package com.example.userservice.dto;

import lombok.Data;

// DTOs
@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    // Add validation annotations if needed

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}
