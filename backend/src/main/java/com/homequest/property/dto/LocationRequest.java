package com.homequest.property.dto;

import com.homequest.property.model.LocationType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationRequest {
    @NotBlank(message = "Code is required")
    private String code;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Type is required")
    private LocationType type;

    private String parentCode;
}
