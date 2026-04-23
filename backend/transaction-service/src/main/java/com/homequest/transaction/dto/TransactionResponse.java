package com.homequest.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.homequest.transaction.model.TransactionStatus;
import com.homequest.transaction.model.TransactionType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TransactionResponse {
    private Long id;
    private Long propertyId;
    private String listingAgentPublicId;
    private String sellingAgentPublicId;
    private String ownerPublicId;
    private String buyerPublicId;
    private Long companyId;
    private BigDecimal saleAmount;
    private BigDecimal commissionRate;
    private BigDecimal totalCommission;
    private BigDecimal companyCommission;
    private BigDecimal listingAgentCommission;
    private BigDecimal sellingAgentCommission;
    private TransactionType type;
    private TransactionStatus status;
    private LocalDateTime createdAt;
}
