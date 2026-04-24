package com.homequest.auth.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String publicId;
    private String username;
    private String email;
    private String role;
    private String status;
    private String token;
    private String message;
    private LocalDateTime createdAt;
}
