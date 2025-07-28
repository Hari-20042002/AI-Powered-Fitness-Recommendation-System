package com.fitness.userservice.service;

import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository repository;

    public UserResponse register( RegisterRequest request) {
            if (repository.existsByEmail(request.getEmail())){
                User existingUser = repository.findByEmail(request.getEmail());
                UserResponse userResponse = new UserResponse();
                userResponse.setId(existingUser.getId());
                userResponse.setEmail(existingUser.getEmail());
                userResponse.setKeycloakId(existingUser.getKeycloakId());
                userResponse.setPassword(existingUser.getPassword());
                userResponse.setFirstName(existingUser.getFirstName());
                userResponse.setLastName(existingUser.getLastName());
                userResponse.setCreatedAt(existingUser.getCreatedAt());
                userResponse.setUpdatedAt(existingUser.getUpdatedAt());
                return userResponse;
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setKeycloakId(request.getKeycloakId());
        user.setPassword(request.getPassword());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = repository.save(user);
        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getId());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setKeycloakId(savedUser.getKeycloakId());
        userResponse.setPassword(savedUser.getPassword());
        userResponse.setFirstName(savedUser.getFirstName());
        userResponse.setLastName(savedUser.getLastName());
        userResponse.setCreatedAt(savedUser.getCreatedAt());
        userResponse.setUpdatedAt(savedUser.getUpdatedAt());
        return userResponse;
    }

    public UserResponse getUserProfile(String UserId){
        User user = repository.findById(UserId).orElseThrow(() -> new RuntimeException("User not found"));
        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setPassword(user.getPassword());
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setCreatedAt(user.getCreatedAt());
        userResponse.setUpdatedAt(user.getUpdatedAt());
        userResponse.setEmail(user.getEmail());
        return userResponse;
    }

    public Boolean existByUserId(String userId) {
        return repository.existsByKeycloakId(userId);

    }
}
