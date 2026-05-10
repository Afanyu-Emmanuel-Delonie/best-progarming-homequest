package com.homequest.transaction.dto;

import java.math.BigDecimal;

import com.homequest.transaction.model.TransactionType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TransactionRequest {

    @NotNull(message = "Property ID is required")
    private Long propertyId;

    @NotBlank(message = "Selling agent is required")
    private String sellingAgentPublicId;

    @NotBlank(message = "Owner is required")
    private String ownerPublicId;

    @NotBlank(message = "Buyer is required")
    private String buyerPublicId;

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotNull(message = "Sale amount is required")
    private BigDecimal saleAmount;

    @NotNull(message = "Commission rate is required")
    private BigDecimal commissionRate;

    private TransactionType type;
}
