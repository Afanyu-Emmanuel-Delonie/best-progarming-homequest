package com.homequest.transaction.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "listing_agent_public_id", nullable = false)
    private String listingAgentPublicId;

    @Column(name = "selling_agent_public_id", nullable = false)
    private String sellingAgentPublicId;

    @Column(name = "owner_public_id", nullable = false)
    private String ownerPublicId;

    @Column(name = "buyer_public_id", nullable = false)
    private String buyerPublicId;

    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Column(name = "sale_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal saleAmount;

    @Column(name = "commission_rate", nullable = false, precision = 5, scale = 4)
    private BigDecimal commissionRate;

    @Column(name = "total_commission", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalCommission;

    @Column(name = "company_commission", nullable = false, precision = 15, scale = 2)
    private BigDecimal companyCommission;

    @Column(name = "listing_agent_commission", nullable = false, precision = 15, scale = 2)
    private BigDecimal listingAgentCommission;

    @Column(name = "selling_agent_commission", nullable = false, precision = 15, scale = 2)
    private BigDecimal sellingAgentCommission;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TransactionType type = TransactionType.SALE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TransactionStatus status = TransactionStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
