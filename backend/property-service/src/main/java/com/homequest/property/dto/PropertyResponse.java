package com.homequest.property.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.homequest.property.model.PropertyStatus;
import com.homequest.property.model.PropertyType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private String address;
    private String city;
    private String country;
    private Integer bedrooms;
    private Integer bathrooms;
    private BigDecimal areaSqm;
    private PropertyType type;
    private PropertyStatus status;
    private String listingAgentPublicId;
    private String sellingAgentPublicId;
    private String ownerPublicId;
    private String buyerPublicId;
    private Long companyId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
