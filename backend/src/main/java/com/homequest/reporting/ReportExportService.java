package com.homequest.reporting;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.auth.model.User;
import com.homequest.auth.repository.UserRepository;
import com.homequest.property.dto.PropertyApplicationResponse;
import com.homequest.property.dto.PropertyResponse;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.service.PropertyApplicationService;
import com.homequest.property.service.PropertyService;
import com.homequest.transaction.dto.AgentDashboardResponse;
import com.homequest.transaction.dto.CompanyDashboardResponse;
import com.homequest.transaction.dto.CommissionResponse;
import com.homequest.transaction.dto.TransactionResponse;
import com.homequest.transaction.service.DashboardService;
import com.homequest.transaction.service.TransactionService;
import com.homequest.user.agent.model.Agent;
import com.homequest.user.agent.repository.AgentRepository;
import com.homequest.user.client.model.Client;
import com.homequest.user.client.repository.ClientRepository;
import com.homequest.user.owner.model.Owner;
import com.homequest.user.owner.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportExportService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final OwnerRepository ownerRepository;
    private final AgentRepository agentRepository;
    private final DashboardService dashboardService;
    private final PropertyService propertyService;
    private final PropertyApplicationService applicationService;
    private final TransactionService transactionService;
    private final CsvReportWriter csvReportWriter = new CsvReportWriter();

    @Transactional(readOnly = true)
    public ReportDownload exportUsers() {
        List<CsvReportWriter.CsvRow> rows = new ArrayList<>();
        rows.add(row("summary", "", "totalUsers", String.valueOf(userRepository.count())));
        for (User user : userRepository.findAll()) {
            String item = accountKey(user.getPublicId() != null ? user.getPublicId().toString() : String.valueOf(user.getId()));
            rows.add(row("account", item, "id", user.getId()));
            rows.add(row("account", item, "publicId", user.getPublicId()));
            rows.add(row("account", item, "username", user.getUsername()));
            rows.add(row("account", item, "email", user.getEmail()));
            rows.add(row("account", item, "role", user.getRole() != null ? user.getRole().name() : ""));
            rows.add(row("account", item, "status", user.isActive() ? "ACTIVE" : "SUSPENDED"));
            rows.add(row("account", item, "createdAt", user.getCreatedAt()));
        }
        return file("users-report", rows);
    }

    @Transactional(readOnly = true)
    public ReportDownload exportClients() {
        Map<String, User> usersByPublicId = userRepository.findAll().stream()
                .filter(u -> u.getPublicId() != null)
                .collect(Collectors.toMap(u -> u.getPublicId().toString(), Function.identity(), (a, b) -> a, LinkedHashMap::new));

        List<CsvReportWriter.CsvRow> rows = new ArrayList<>();
        rows.add(row("summary", "", "totalClients", String.valueOf(clientRepository.count())));
        for (Client client : clientRepository.findAll()) {
            User user = usersByPublicId.get(client.getUserPublicId());
            String item = accountKey(client.getUserPublicId());
            addUserRows(rows, item, user);
            rows.add(row("profile", item, "id", client.getId()));
            rows.add(row("profile", item, "firstName", client.getFirstName()));
            rows.add(row("profile", item, "lastName", client.getLastName()));
            rows.add(row("profile", item, "phone", client.getPhone()));
            rows.add(row("profile", item, "companyId", client.getCompanyId()));
            rows.add(row("profile", item, "joinedAt", client.getCreatedAt()));
        }
        return file("clients-report", rows);
    }

    @Transactional(readOnly = true)
    public ReportDownload exportAgent(String publicId) {
        Agent agent = agentRepository.findByUserPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Agent profile not found"));
        User user = userRepository.findAll().stream()
                .filter(u -> publicId.equals(u.getPublicId() != null ? u.getPublicId().toString() : null))
                .findFirst()
                .orElse(null);
        AgentDashboardResponse dashboard = dashboardService.getAgentDashboard(publicId);
        List<PropertyResponse> listings = propertyService.getByListingAgent(publicId, 0, Integer.MAX_VALUE).getContent();
        List<PropertyApplicationResponse> applications = applicationService.getByListingAgent(publicId, 0, Integer.MAX_VALUE).getContent();
        List<TransactionResponse> transactions = transactionService.getByListingAgent(publicId);
        List<CommissionResponse> commissions = transactionService.getCommissionsByAgent(publicId);

        List<CsvReportWriter.CsvRow> rows = new ArrayList<>();
        rows.add(row("summary", "", "totalListings", dashboard.getTotalListings()));
        rows.add(row("summary", "", "activeListings", dashboard.getActiveListings()));
        rows.add(row("summary", "", "soldListings", dashboard.getSoldListings()));
        rows.add(row("summary", "", "totalSalesClosed", dashboard.getTotalSalesClosed()));
        rows.add(row("summary", "", "totalListingsTransacted", dashboard.getTotalListingsTransacted()));
        rows.add(row("summary", "", "totalSellingCommission", dashboard.getTotalSellingCommission()));
        rows.add(row("summary", "", "totalListingCommission", dashboard.getTotalListingCommission()));
        rows.add(row("summary", "", "totalCommissionEarned", dashboard.getTotalCommissionEarned()));
        rows.add(row("summary", "", "pendingApplicationsOnMyListings", dashboard.getPendingApplicationsOnMyListings()));
        addUserRows(rows, publicId, user);
        rows.add(row("profile", publicId, "id", agent.getId()));
        rows.add(row("profile", publicId, "firstName", agent.getFirstName()));
        rows.add(row("profile", publicId, "lastName", agent.getLastName()));
        rows.add(row("profile", publicId, "phone", agent.getPhone()));
        rows.add(row("profile", publicId, "licenseNumber", agent.getLicenseNumber()));
        rows.add(row("profile", publicId, "companyId", agent.getCompanyId()));
        rows.add(row("profile", publicId, "status", agent.getStatus()));
        rows.add(row("profile", publicId, "joinedAt", agent.getCreatedAt()));

        dashboard.getListingsByStatus().forEach((status, count) ->
                rows.add(row("status_breakdown", publicId, status, count)));
        if (dashboard.getMonthlyCommissionTrend() != null) {
            dashboard.getMonthlyCommissionTrend().forEach(point -> {
                String item = point.getYear() + "-" + String.format("%02d", point.getMonth());
                rows.add(row("monthly_commission", item, "salesCount", point.getSalesCount()));
                rows.add(row("monthly_commission", item, "commissionEarned", point.getCommissionEarned()));
            });
        }
        for (PropertyResponse listing : listings) {
            String item = listing.getId() != null ? listing.getId().toString() : listing.getTitle();
            rows.add(row("listings", item, "title", listing.getTitle()));
            rows.add(row("listings", item, "city", listing.getCity()));
            rows.add(row("listings", item, "price", listing.getPrice()));
            rows.add(row("listings", item, "status", listing.getStatus()));
            rows.add(row("listings", item, "buyerPublicId", listing.getBuyerPublicId()));
            rows.add(row("listings", item, "updatedAt", listing.getUpdatedAt()));
        }
        for (PropertyApplicationResponse application : applications) {
            String item = application.getId() != null ? application.getId().toString() : application.getBuyerPublicId();
            rows.add(row("applications", item, "propertyId", application.getPropertyId()));
            rows.add(row("applications", item, "buyerFullName", application.getBuyerFullName()));
            rows.add(row("applications", item, "offerAmount", application.getOfferAmount()));
            rows.add(row("applications", item, "depositAmount", application.getDepositAmount()));
            rows.add(row("applications", item, "status", application.getStatus()));
            rows.add(row("applications", item, "createdAt", application.getCreatedAt()));
        }
        for (TransactionResponse transaction : transactions) {
            String item = transaction.getId() != null ? transaction.getId().toString() : accountKey(publicId);
            rows.add(row("transactions", item, "propertyId", transaction.getPropertyId()));
            rows.add(row("transactions", item, "saleAmount", transaction.getSaleAmount()));
            rows.add(row("transactions", item, "totalCommission", transaction.getTotalCommission()));
            rows.add(row("transactions", item, "status", transaction.getStatus()));
            rows.add(row("transactions", item, "createdAt", transaction.getCreatedAt()));
        }
        for (CommissionResponse commission : commissions) {
            String item = commission.getId() != null ? commission.getId().toString() : publicId;
            rows.add(row("commissions", item, "transactionId", commission.getTransactionId()));
            rows.add(row("commissions", item, "recipientType", commission.getRecipientType()));
            rows.add(row("commissions", item, "amount", commission.getAmount()));
            rows.add(row("commissions", item, "status", commission.getStatus()));
            rows.add(row("commissions", item, "paidAt", commission.getPaidAt()));
        }

        return file("agent-report-" + publicId, rows);
    }

    @Transactional(readOnly = true)
    public ReportDownload exportOwner(String publicId) {
        Owner owner = ownerRepository.findByUserPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found"));
        User user = userRepository.findAll().stream()
                .filter(u -> publicId.equals(u.getPublicId() != null ? u.getPublicId().toString() : null))
                .findFirst()
                .orElse(null);
        List<PropertyResponse> properties = propertyService.getByOwner(publicId, 0, Integer.MAX_VALUE).getContent();
        List<TransactionResponse> transactions = transactionService.getByOwner(publicId);

        List<CsvReportWriter.CsvRow> rows = new ArrayList<>();
        addUserRows(rows, publicId, user);
        rows.add(row("profile", publicId, "id", owner.getId()));
        rows.add(row("profile", publicId, "firstName", owner.getFirstName()));
        rows.add(row("profile", publicId, "lastName", owner.getLastName()));
        rows.add(row("profile", publicId, "phone", owner.getPhone()));
        rows.add(row("profile", publicId, "nationalId", owner.getNationalId()));
        rows.add(row("profile", publicId, "joinedAt", owner.getCreatedAt()));

        rows.add(row("summary", "", "totalProperties", properties.size()));
        rows.add(row("summary", "", "totalTransactions", transactions.size()));
        rows.add(row("summary", "", "availableProperties", properties.stream().filter(p -> p.getStatus() == PropertyStatus.AVAILABLE).count()));
        rows.add(row("summary", "", "soldProperties", properties.stream().filter(p -> p.getStatus() == PropertyStatus.SOLD).count()));

        for (PropertyResponse property : properties) {
            String item = property.getId() != null ? property.getId().toString() : property.getTitle();
            rows.add(row("properties", item, "title", property.getTitle()));
            rows.add(row("properties", item, "city", property.getCity()));
            rows.add(row("properties", item, "price", property.getPrice()));
            rows.add(row("properties", item, "status", property.getStatus()));
            rows.add(row("properties", item, "buyerPublicId", property.getBuyerPublicId()));
            rows.add(row("properties", item, "createdAt", property.getCreatedAt()));
        }
        for (TransactionResponse transaction : transactions) {
            String item = transaction.getId() != null ? transaction.getId().toString() : publicId;
            rows.add(row("transactions", item, "propertyId", transaction.getPropertyId()));
            rows.add(row("transactions", item, "saleAmount", transaction.getSaleAmount()));
            rows.add(row("transactions", item, "status", transaction.getStatus()));
            rows.add(row("transactions", item, "createdAt", transaction.getCreatedAt()));
        }

        return file("owner-report-" + publicId, rows);
    }

    @Transactional(readOnly = true)
    public ReportDownload exportClient(String publicId) {
        User user = userRepository.findAll().stream()
                .filter(u -> publicId.equals(u.getPublicId() != null ? u.getPublicId().toString() : null))
                .findFirst()
                .orElse(null);
        Client client = clientRepository.findByUserPublicId(publicId)
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found"));
        List<PropertyApplicationResponse> applications = applicationService.getMyApplications(publicId, 0, Integer.MAX_VALUE).getContent();
        List<PropertyResponse> purchases = propertyService.getByBuyer(publicId, 0, Integer.MAX_VALUE).getContent();
        List<TransactionResponse> transactions = transactionService.getByBuyer(publicId);

        List<CsvReportWriter.CsvRow> rows = new ArrayList<>();
        addUserRows(rows, publicId, user);
        rows.add(row("profile", publicId, "id", client.getId()));
        rows.add(row("profile", publicId, "firstName", client.getFirstName()));
        rows.add(row("profile", publicId, "lastName", client.getLastName()));
        rows.add(row("profile", publicId, "phone", client.getPhone()));
        rows.add(row("profile", publicId, "companyId", client.getCompanyId()));
        rows.add(row("profile", publicId, "joinedAt", client.getCreatedAt()));

        rows.add(row("summary", "", "totalApplications", applications.size()));
        rows.add(row("summary", "", "totalPurchases", purchases.size()));
        rows.add(row("summary", "", "totalTransactions", transactions.size()));

        for (PropertyApplicationResponse application : applications) {
            String item = application.getId() != null ? application.getId().toString() : publicId;
            rows.add(row("applications", item, "propertyId", application.getPropertyId()));
            rows.add(row("applications", item, "offerAmount", application.getOfferAmount()));
            rows.add(row("applications", item, "depositAmount", application.getDepositAmount()));
            rows.add(row("applications", item, "fundingSource", application.getFundingSource()));
            rows.add(row("applications", item, "status", application.getStatus()));
            rows.add(row("applications", item, "createdAt", application.getCreatedAt()));
        }
        for (PropertyResponse property : purchases) {
            String item = property.getId() != null ? property.getId().toString() : property.getTitle();
            rows.add(row("purchases", item, "title", property.getTitle()));
            rows.add(row("purchases", item, "city", property.getCity()));
            rows.add(row("purchases", item, "price", property.getPrice()));
            rows.add(row("purchases", item, "status", property.getStatus()));
            rows.add(row("purchases", item, "createdAt", property.getCreatedAt()));
        }
        for (TransactionResponse transaction : transactions) {
            String item = transaction.getId() != null ? transaction.getId().toString() : publicId;
            rows.add(row("transactions", item, "propertyId", transaction.getPropertyId()));
            rows.add(row("transactions", item, "saleAmount", transaction.getSaleAmount()));
            rows.add(row("transactions", item, "status", transaction.getStatus()));
            rows.add(row("transactions", item, "createdAt", transaction.getCreatedAt()));
        }

        return file("client-report-" + publicId, rows);
    }

    @Transactional(readOnly = true)
    public ReportDownload exportCompany(Long companyId) {
        CompanyDashboardResponse dashboard = dashboardService.getCompanyDashboard(companyId);
        List<PropertyResponse> properties = propertyService.getByCompany(companyId, 0, Integer.MAX_VALUE).getContent();
        List<TransactionResponse> transactions = transactionService.getByCompany(companyId);

        List<CsvReportWriter.CsvRow> rows = new ArrayList<>();
        rows.add(row("summary", "", "totalCompletedSales", dashboard.getTotalCompletedSales()));
        rows.add(row("summary", "", "totalPendingSales", dashboard.getTotalPendingSales()));
        rows.add(row("summary", "", "totalRevenue", dashboard.getTotalRevenue()));
        rows.add(row("summary", "", "totalCommissionEarned", dashboard.getTotalCommissionEarned()));
        rows.add(row("summary", "", "companyCommissionEarned", dashboard.getCompanyCommissionEarned()));
        rows.add(row("summary", "", "totalProperties", dashboard.getTotalProperties()));
        rows.add(row("summary", "", "availableProperties", dashboard.getAvailableProperties()));
        rows.add(row("summary", "", "soldProperties", dashboard.getSoldProperties()));
        rows.add(row("summary", "", "underOfferProperties", dashboard.getUnderOfferProperties()));
        rows.add(row("summary", "", "pendingApplications", dashboard.getPendingApplications()));

        dashboard.getPropertiesByStatus().forEach((key, value) -> rows.add(row("properties_by_status", String.valueOf(companyId), key, value)));
        dashboard.getPropertiesByType().forEach((key, value) -> rows.add(row("properties_by_type", String.valueOf(companyId), key, value)));
        dashboard.getPropertiesByCity().forEach((key, value) -> rows.add(row("properties_by_city", String.valueOf(companyId), key, value)));
        dashboard.getApplicationsByFundingSource().forEach((key, value) -> rows.add(row("applications_by_funding", String.valueOf(companyId), key, value)));
        dashboard.getMonthlySalesTrend().forEach(point -> {
            String item = point.getYear() + "-" + String.format("%02d", point.getMonth());
            rows.add(row("monthly_sales", item, "count", point.getCount()));
            rows.add(row("monthly_sales", item, "totalAmount", point.getTotalAmount()));
        });
        dashboard.getTopAgents().forEach(agent -> {
            rows.add(row("top_agents", agent.getAgentPublicId(), "totalCommission", agent.getTotalCommission()));
        });
        for (PropertyResponse property : properties) {
            String item = property.getId() != null ? property.getId().toString() : property.getTitle();
            rows.add(row("properties", item, "title", property.getTitle()));
            rows.add(row("properties", item, "status", property.getStatus()));
            rows.add(row("properties", item, "city", property.getCity()));
            rows.add(row("properties", item, "price", property.getPrice()));
            rows.add(row("properties", item, "ownerPublicId", property.getOwnerPublicId()));
        }
        for (TransactionResponse transaction : transactions) {
            String item = transaction.getId() != null ? transaction.getId().toString() : String.valueOf(companyId);
            rows.add(row("transactions", item, "propertyId", transaction.getPropertyId()));
            rows.add(row("transactions", item, "saleAmount", transaction.getSaleAmount()));
            rows.add(row("transactions", item, "status", transaction.getStatus()));
            rows.add(row("transactions", item, "createdAt", transaction.getCreatedAt()));
        }

        return file("company-report-" + companyId, rows);
    }

    private void addUserRows(List<CsvReportWriter.CsvRow> rows, String item, User user) {
        if (user == null) {
            return;
        }
        rows.add(row("account", item, "userId", user.getId()));
        rows.add(row("account", item, "publicId", user.getPublicId()));
        rows.add(row("account", item, "username", user.getUsername()));
        rows.add(row("account", item, "email", user.getEmail()));
        rows.add(row("account", item, "role", user.getRole() != null ? user.getRole().name() : ""));
        rows.add(row("account", item, "status", user.isActive() ? "ACTIVE" : "SUSPENDED"));
        rows.add(row("account", item, "createdAt", user.getCreatedAt()));
    }

    private CsvReportWriter.CsvRow row(String section, String item, String field, Object value) {
        return new CsvReportWriter.CsvRow(section, item, field, value == null ? "" : String.valueOf(value));
    }

    private ReportDownload file(String slug, List<CsvReportWriter.CsvRow> rows) {
        String filename = slug + "-" + LocalDate.now() + ".csv";
        return new ReportDownload(filename, csvReportWriter.write(rows));
    }

    private String accountKey(String value) {
        return value == null || value.isBlank() ? "unknown" : value;
    }
}
