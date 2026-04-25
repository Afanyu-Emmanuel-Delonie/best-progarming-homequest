package com.homequest.transaction.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.model.PropertyStatus;
import com.homequest.property.repository.PropertyApplicationRepository;
import com.homequest.property.repository.PropertyRepository;
import com.homequest.transaction.dto.AgentDashboardResponse;
import com.homequest.transaction.dto.AgentDashboardResponse.MonthlyCommissionPoint;
import com.homequest.transaction.dto.CompanyDashboardResponse;
import com.homequest.transaction.dto.CompanyDashboardResponse.AgentLeaderboardEntry;
import com.homequest.transaction.dto.CompanyDashboardResponse.MonthlyTrendPoint;
import com.homequest.transaction.model.TransactionStatus;
import com.homequest.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyApplicationRepository applicationRepository;

    @Transactional(readOnly = true)
    public AgentDashboardResponse getAgentDashboard(String agentPublicId) {
        // property counts
        long totalListings = propertyRepository.countByListingAgentPublicId(agentPublicId);
        long activeListings = propertyRepository.countByListingAgentPublicIdAndStatus(agentPublicId, PropertyStatus.AVAILABLE);
        long soldListings = propertyRepository.countByListingAgentPublicIdAndStatus(agentPublicId, PropertyStatus.SOLD);

        // transaction counts
        long totalSalesClosed = transactionRepository.countBySellingAgentPublicIdAndStatus(agentPublicId, TransactionStatus.COMPLETED);
        long totalListingsTransacted = transactionRepository.countByListingAgentPublicIdAndStatus(agentPublicId, TransactionStatus.COMPLETED);

        // commission totals
        BigDecimal sellingCommission = transactionRepository.sumSellingCommissionByAgentAndStatus(agentPublicId, TransactionStatus.COMPLETED);
        BigDecimal listingCommission = transactionRepository.sumListingCommissionByAgentAndStatus(agentPublicId, TransactionStatus.COMPLETED);
        BigDecimal totalCommission = sellingCommission.add(listingCommission);

        // pending applications on my listings
        long pendingApplications = applicationRepository.countPendingApplicationsForAgent(agentPublicId);

        // listings by status breakdown
        Map<String, Long> listingsByStatus = propertyRepository.countByStatusForAgent(agentPublicId)
                .stream().collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> (Long) row[1],
                        (a, b) -> a,
                        LinkedHashMap::new));

        // monthly commission trend — last 12 months
        LocalDateTime from = LocalDateTime.now().minusMonths(12);
        List<MonthlyCommissionPoint> trend = transactionRepository
                .monthlyCommissionTrendByAgent(agentPublicId, from)
                .stream().map(row -> MonthlyCommissionPoint.builder()
                        .year(((Number) row[0]).intValue())
                        .month(((Number) row[1]).intValue())
                        .salesCount((Long) row[2])
                        .commissionEarned((BigDecimal) row[3])
                        .build())
                .collect(Collectors.toList());

        return AgentDashboardResponse.builder()
                .totalListings(totalListings)
                .activeListings(activeListings)
                .soldListings(soldListings)
                .totalSalesClosed(totalSalesClosed)
                .totalListingsTransacted(totalListingsTransacted)
                .totalSellingCommission(sellingCommission)
                .totalListingCommission(listingCommission)
                .totalCommissionEarned(totalCommission)
                .pendingApplicationsOnMyListings(pendingApplications)
                .listingsByStatus(listingsByStatus)
                .monthlyCommissionTrend(trend)
                .build();
    }

    @Transactional(readOnly = true)
    public CompanyDashboardResponse getCompanyDashboard(Long companyId) {
        // transaction metrics
        long completedSales = transactionRepository.countByCompanyIdAndStatus(companyId, TransactionStatus.COMPLETED);
        long pendingSales = transactionRepository.countByCompanyIdAndStatus(companyId, TransactionStatus.PENDING);
        BigDecimal totalRevenue = transactionRepository.sumSaleAmountByCompanyIdAndStatus(companyId, TransactionStatus.COMPLETED);
        BigDecimal totalCommission = transactionRepository.sumTotalCommissionByCompanyIdAndStatus(companyId, TransactionStatus.COMPLETED);
        BigDecimal companyCommission = transactionRepository.sumCompanyCommissionByCompanyIdAndStatus(companyId, TransactionStatus.COMPLETED);

        // property metrics
        long totalProperties = propertyRepository.countByCompanyId(companyId);
        long available = propertyRepository.countByCompanyIdAndStatus(companyId, PropertyStatus.AVAILABLE);
        long sold = propertyRepository.countByCompanyIdAndStatus(companyId, PropertyStatus.SOLD);
        long underOffer = propertyRepository.countByCompanyIdAndStatus(companyId, PropertyStatus.UNDER_OFFER);

        // pending applications
        long pendingApplications = applicationRepository.countPendingApplicationsForCompany(companyId);

        // breakdown maps
        Map<String, Long> byStatus = toMap(propertyRepository.countByStatusForCompany(companyId));
        Map<String, Long> byType = toMap(propertyRepository.countByTypeForCompany(companyId));
        Map<String, Long> byCity = toMap(propertyRepository.countByCityForCompany(companyId));
        Map<String, Long> byFunding = toMap(applicationRepository.countByFundingSourceForCompany(companyId));

        // monthly trend — last 12 months
        LocalDateTime from = LocalDateTime.now().minusMonths(12);
        List<MonthlyTrendPoint> trend = transactionRepository
                .monthlySalesTrendByCompany(companyId, from)
                .stream().map(row -> MonthlyTrendPoint.builder()
                        .year(((Number) row[0]).intValue())
                        .month(((Number) row[1]).intValue())
                        .count((Long) row[2])
                        .totalAmount((BigDecimal) row[3])
                        .build())
                .collect(Collectors.toList());

        // top agents leaderboard
        List<AgentLeaderboardEntry> topAgents = transactionRepository
                .topSellingAgentsByCompany(companyId)
                .stream().map(row -> AgentLeaderboardEntry.builder()
                        .agentPublicId(row[0].toString())
                        .totalCommission((BigDecimal) row[1])
                        .build())
                .collect(Collectors.toList());

        return CompanyDashboardResponse.builder()
                .totalCompletedSales(completedSales)
                .totalPendingSales(pendingSales)
                .totalRevenue(totalRevenue)
                .totalCommissionEarned(totalCommission)
                .companyCommissionEarned(companyCommission)
                .totalProperties(totalProperties)
                .availableProperties(available)
                .soldProperties(sold)
                .underOfferProperties(underOffer)
                .pendingApplications(pendingApplications)
                .propertiesByStatus(byStatus)
                .propertiesByType(byType)
                .propertiesByCity(byCity)
                .applicationsByFundingSource(byFunding)
                .monthlySalesTrend(trend)
                .topAgents(topAgents)
                .build();
    }

    private Map<String, Long> toMap(List<Object[]> rows) {
        return rows.stream().collect(Collectors.toMap(
                row -> row[0].toString(),
                row -> (Long) row[1],
                (a, b) -> a,
                LinkedHashMap::new));
    }
}
