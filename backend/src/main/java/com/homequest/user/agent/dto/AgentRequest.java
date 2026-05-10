package com.homequest.user.agent.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AgentRequest {
    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phone;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    private String profileImage;
}
