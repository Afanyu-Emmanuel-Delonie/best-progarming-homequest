package com.homequest.user.company.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompanyRequest {
    @NotBlank(message = "Company name is required")
    private String name;
    private String email;
    private String phone;
    private String address;
}
