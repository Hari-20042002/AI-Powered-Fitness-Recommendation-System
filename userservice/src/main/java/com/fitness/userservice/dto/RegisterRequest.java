package com.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class RegisterRequest {
    @NotBlank (message = "Email is required")
    @Email (message = "Invalid email format")
    private String email;

    private String keycloakId;

    @NotBlank (message = "Password is required")
    @Size (min = 6, message = "Password should have least 6 characters")
    private String password;

    private String firstName;
    private String lastName;

}
