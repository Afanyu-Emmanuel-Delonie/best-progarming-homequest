package com.homequest.property.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.homequest.property.model.FundingSource;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PropertyApplicationRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Full name is required")
    private String buyerFullName;

    @NotBlank(message = "National ID or passport number is required")
    private String buyerNationalId;

    @NotBlank(message = "Phone number is required")
    private String buyerPhone;

    @NotNull(message = "Offer amount is required")
    private BigDecimal offerAmount;

    @NotNull(message = "Deposit amount is required")
    private BigDecimal depositAmount;

    @NotNull(message = "Funding source is required")
    private FundingSource fundingSource;

    @NotNull(message = "Proposed closing date is required")
    @Future(message = "Closing date must be in the future")
    private LocalDate proposedClosingDate;

    @NotNull(message = "Offer expiration date is required")
    @Future(message = "Expiration date must be in the future")
    private LocalDate offerExpirationDate;

    private String specialConditions;
}
