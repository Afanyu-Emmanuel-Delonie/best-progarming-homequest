package com.homequest.property.dto;

import java.math.BigDecimal;

import com.homequest.property.model.PropertyType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PropertyRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String address;
    private String city;
    private String country;
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal areaSqm;
    private PropertyType type;
    private String ownerPublicId;
}
