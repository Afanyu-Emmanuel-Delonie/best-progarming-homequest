package com.homequest.transaction.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompanyDashboardResponse {

    // transaction metrics
    private long totalCompletedSales;
    private long totalPendingSales;
    private BigDecimal totalRevenue;
    private BigDecimal totalCommissionEarned;
    private BigDecimal companyCommissionEarned;

    // property metrics
    private long totalProperties;
    private long availableProperties;
    private long soldProperties;
    private long underOfferProperties;

    // applications
    private long pendingApplications;

    // breakdown charts data
    private Map<String, Long> propertiesByStatus;
    private Map<String, Long> propertiesByType;
    private Map<String, Long> propertiesByCity;
    private Map<String, Long> applicationsByFundingSource;

    // trend data for line/bar charts — each entry: {year, month, count, amount}
    private List<MonthlyTrendPoint> monthlySalesTrend;

    // top agents leaderboard
    private List<AgentLeaderboardEntry> topAgents;

    @Data
    @Builder
    public static class MonthlyTrendPoint {
        private int year;
        private int month;
        private long count;
        private BigDecimal totalAmount;
    }

    @Data
    @Builder
    public static class AgentLeaderboardEntry {
        private String agentPublicId;
        private BigDecimal totalCommission;
    }
}
