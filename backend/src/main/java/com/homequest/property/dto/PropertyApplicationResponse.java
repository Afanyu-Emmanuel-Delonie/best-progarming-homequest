package com.homequest.property.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.FundingSource;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PropertyApplicationResponse {
    private Long id;
    private Long propertyId;
    private String buyerPublicId;
    private String buyerFullName;
    private String buyerNationalId;
    private String buyerPhone;
    private BigDecimal offerAmount;
    private BigDecimal depositAmount;
    private FundingSource fundingSource;
    private LocalDate proposedClosingDate;
    private LocalDate offerExpirationDate;
    private String specialConditions;
    private String assignedAgentPublicId;
    private ApplicationStatus status;
    private String reviewedBy;
    private LocalDateTime createdAt;
}
