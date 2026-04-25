package com.homequest.transaction.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.homequest.transaction.model.CommissionRecipientType;
import com.homequest.transaction.model.CommissionStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommissionResponse {
    private Long id;
    private Long transactionId;
    private String recipientPublicId;
    private CommissionRecipientType recipientType;
    private BigDecimal amount;
    private CommissionStatus status;
    private LocalDateTime paidAt;
    private LocalDateTime createdAt;
}
