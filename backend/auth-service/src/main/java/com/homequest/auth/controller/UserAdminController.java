package com.homequest.auth.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.auth.dto.AuthResponse;
import com.homequest.auth.model.User;
import com.homequest.auth.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserAdminController {

    private final UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<AuthResponse>> getAll() {
        List<AuthResponse> users = userRepository.findAll().stream().map(u -> AuthResponse.builder()
                .id(u.getId())
                .publicId(u.getPublicId() != null ? u.getPublicId().toString() : null)
                .username(u.getUsername())
                .email(u.getEmail())
                .role(u.getRole().name())
                .status(u.isActive() ? "ACTIVE" : "SUSPENDED")
                .createdAt(u.getCreatedAt())
                .build()).toList();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/suspend")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> suspend(@PathVariable Long id) {
        userRepository.findById(id).ifPresent(u -> {
            u.setActive(false);
            userRepository.save(u);
        });
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/activate")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> activate(@PathVariable Long id) {
        userRepository.findById(id).ifPresent(u -> {
            u.setActive(true);
            userRepository.save(u);
        });
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
