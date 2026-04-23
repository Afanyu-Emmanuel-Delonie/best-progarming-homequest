package com.homequest.auth.service;

import java.util.Locale;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.auth.dto.AuthResponse;
import com.homequest.auth.dto.LoginRequest;
import com.homequest.auth.dto.RegistrationRequest;
import com.homequest.auth.model.Role;
import com.homequest.auth.model.User;
import com.homequest.auth.repository.UserRepository;
import com.homequest.auth.security.JwtUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ProfileProvisioningService profileProvisioningService;

    @Transactional
    public AuthResponse register(RegistrationRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        String username = (request.getFirstName().trim() + request.getLastName().trim())
                .toLowerCase(Locale.ROOT).replaceAll("\\s+", "");

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role role = Role.ROLE_AGENT;
        if (request.getRole() != null) {
            try {
                role = Role.valueOf(request.getRole().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        profileProvisioningService.provision(
                savedUser.getPublicId().toString(),
                request.getFirstName(),
                request.getLastName(),
                request.getLicenseNumber(),
                request.getCompanyId(),
                role);
        String token = jwtUtil.generateToken(savedUser, role.name());

        return AuthResponse.builder()
                .id(savedUser.getId())
                .publicId(savedUser.getPublicId() != null ? savedUser.getPublicId().toString() : null)
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .role(role.name())
                .token(token)
                .message("Registration successful")
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username/email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid username/email or password");
        }

        String role = user.getRole().name();
        String token = jwtUtil.generateToken(user, role);

        return AuthResponse.builder()
                .id(user.getId())
                .publicId(user.getPublicId() != null ? user.getPublicId().toString() : null)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(role)
                .token(token)
                .message("Login successful")
                .build();
    }
}
