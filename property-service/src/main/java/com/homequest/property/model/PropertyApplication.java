package com.homequest.property.model;

import java.math.BigDecimal;
import java.time.LocalDate;
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
@Table(name = "property_applications")
public class PropertyApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    // who submitted the bid
    @Column(name = "buyer_public_id", nullable = false)
    private String buyerPublicId;

    // buyer profile info captured at time of bid
    @Column(name = "buyer_full_name", nullable = false)
    private String buyerFullName;

    @Column(name = "buyer_national_id", nullable = false)
    private String buyerNationalId;

    @Column(name = "buyer_phone", nullable = false)
    private String buyerPhone;

    // the financial offer
    @Column(name = "offer_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal offerAmount;

    @Column(name = "deposit_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal depositAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "funding_source", nullable = false)
    private FundingSource fundingSource;

    // terms of sale
    @Column(name = "proposed_closing_date", nullable = false)
    private LocalDate proposedClosingDate;

    @Column(name = "offer_expiration_date", nullable = false)
    private LocalDate offerExpirationDate;

    @Column(name = "special_conditions", columnDefinition = "TEXT")
    private String specialConditions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "reviewed_by")
    private String reviewedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
