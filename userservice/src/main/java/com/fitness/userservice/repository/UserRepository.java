package com.fitness.userservice.repository;

import com.fitness.userservice.model.User; // Import your User entity
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Optional, but good practice for clarity

@Repository // Tells Spring this is a repository component
public interface UserRepository extends JpaRepository<User, String> {

    boolean existsByEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email);

    User findByEmail(@NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email);


    Boolean existsByKeycloakId(String userId);
}