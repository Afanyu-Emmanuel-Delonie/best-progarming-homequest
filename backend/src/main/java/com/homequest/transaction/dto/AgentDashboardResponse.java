package com.homequest.transaction.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgentDashboardResponse {

    // property metrics
    private long totalListings;
    private long activeListings;
    private long soldListings;

    // transaction metrics
    private long totalSalesClosed;
    private long totalListingsTransacted;

    // commission metrics
    private BigDecimal totalSellingCommission;
    private BigDecimal totalListingCommission;
    private BigDecimal totalCommissionEarned;

    // applications
    private long pendingApplicationsOnMyListings;

    // breakdown charts
    private Map<String, Long> listingsByStatus;

    // trend data for line/bar charts
    private List<MonthlyCommissionPoint> monthlyCommissionTrend;

    @Data
    @Builder
    public static class MonthlyCommissionPoint {
        private int year;
        private int month;
        private long salesCount;
        private BigDecimal commissionEarned;
    }
}
