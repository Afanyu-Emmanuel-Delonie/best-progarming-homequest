package com.homequest.reporting;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.homequest.auth.model.Role;
import com.homequest.auth.model.User;
import com.homequest.auth.repository.UserRepository;
import com.homequest.property.dto.PageResponse;
import com.homequest.property.dto.PropertyApplicationResponse;
import com.homequest.property.dto.PropertyResponse;
import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.FundingSource;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.model.PropertyType;
import com.homequest.property.service.PropertyApplicationService;
import com.homequest.property.service.PropertyService;
import com.homequest.transaction.dto.AgentDashboardResponse;
import com.homequest.transaction.dto.CommissionResponse;
import com.homequest.transaction.dto.TransactionResponse;
import com.homequest.transaction.model.CommissionRecipientType;
import com.homequest.transaction.model.CommissionStatus;
import com.homequest.transaction.model.TransactionStatus;
import com.homequest.transaction.model.TransactionType;
import com.homequest.transaction.service.DashboardService;
import com.homequest.transaction.service.TransactionService;
import com.homequest.user.agent.model.Agent;
import com.homequest.user.agent.model.AgentStatus;
import com.homequest.user.agent.repository.AgentRepository;
import com.homequest.user.client.repository.ClientRepository;
import com.homequest.user.owner.repository.OwnerRepository;

@ExtendWith(MockitoExtension.class)
class ReportExportServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private ClientRepository clientRepository;
    @Mock private OwnerRepository ownerRepository;
    @Mock private AgentRepository agentRepository;
    @Mock private DashboardService dashboardService;
    @Mock private PropertyService propertyService;
    @Mock private PropertyApplicationService applicationService;
    @Mock private TransactionService transactionService;

    @InjectMocks
    private ReportExportService reportExportService;

    @Test
    void exportUsersProducesAccountRows() {
        User user = User.builder()
                .id(9L)
                .publicId(java.util.UUID.fromString("11111111-1111-1111-1111-111111111111"))
                .username("jane")
                .email("jane@example.com")
                .password("secret")
                .role(Role.ROLE_CUSTOMER)
                .isActive(true)
                .createdAt(LocalDateTime.of(2026, 5, 14, 9, 30))
                .build();
        when(userRepository.count()).thenReturn(1L);
        when(userRepository.findAll()).thenReturn(List.of(user));

        ReportDownload report = reportExportService.exportUsers();
        String csv = new String(report.content(), StandardCharsets.UTF_8);

        assertTrue(report.filename().startsWith("users-report-2026-05-14"));
        assertTrue(csv.contains("\"account\",\"11111111-1111-1111-1111-111111111111\",\"email\",\"jane@example.com\""));
        assertTrue(csv.contains("\"account\",\"11111111-1111-1111-1111-111111111111\",\"status\",\"ACTIVE\""));
    }

    @Test
    void exportAgentIncludesDashboardAndDetailSections() {
        String publicId = "agent-123";
        Agent agent = Agent.builder()
                .id(1L)
                .userPublicId(publicId)
                .firstName("Ava")
                .lastName("Stone")
                .phone("+250700000000")
                .licenseNumber("LIC-1")
                .companyId(7L)
                .status(AgentStatus.ACTIVE)
                .createdAt(LocalDateTime.of(2026, 5, 14, 10, 0))
                .build();
        User user = User.builder()
                .id(2L)
                .publicId(java.util.UUID.fromString("22222222-2222-2222-2222-222222222222"))
                .username("avastone")
                .email("ava@example.com")
                .password("secret")
                .role(Role.ROLE_AGENT)
                .isActive(true)
                .createdAt(LocalDateTime.of(2026, 5, 14, 9, 0))
                .build();

        AgentDashboardResponse dashboard = AgentDashboardResponse.builder()
                .totalListings(3)
                .activeListings(2)
                .soldListings(1)
                .totalSalesClosed(4)
                .totalListingsTransacted(2)
                .totalSellingCommission(new BigDecimal("1200.00"))
                .totalListingCommission(new BigDecimal("500.00"))
                .totalCommissionEarned(new BigDecimal("1700.00"))
                .pendingApplicationsOnMyListings(6)
                .build();
        dashboard.setListingsByStatus(java.util.Map.of("AVAILABLE", 2L, "SOLD", 1L));

        PropertyResponse property = PropertyResponse.builder()
                .id(10L)
                .title("Lake House")
                .city("Kigali")
                .price(new BigDecimal("250000"))
                .status(PropertyStatus.AVAILABLE)
                .buyerPublicId(null)
                .updatedAt(LocalDateTime.of(2026, 5, 14, 11, 0))
                .build();
        PropertyApplicationResponse application = PropertyApplicationResponse.builder()
                .id(20L)
                .propertyId(10L)
                .buyerFullName("John Doe")
                .offerAmount(new BigDecimal("245000"))
                .depositAmount(new BigDecimal("5000"))
                .fundingSource(FundingSource.CASH)
                .status(ApplicationStatus.PENDING)
                .createdAt(LocalDateTime.of(2026, 5, 14, 11, 30))
                .build();
        TransactionResponse transaction = TransactionResponse.builder()
                .id(30L)
                .propertyId(10L)
                .saleAmount(new BigDecimal("250000"))
                .totalCommission(new BigDecimal("12500"))
                .status(TransactionStatus.COMPLETED)
                .type(TransactionType.SALE)
                .createdAt(LocalDateTime.of(2026, 5, 14, 12, 0))
                .build();
        CommissionResponse commission = CommissionResponse.builder()
                .id(40L)
                .transactionId(30L)
                .recipientType(CommissionRecipientType.LISTING_AGENT)
                .amount(new BigDecimal("3750"))
                .status(CommissionStatus.PAID)
                .paidAt(LocalDateTime.of(2026, 5, 14, 12, 5))
                .build();

        when(agentRepository.findByUserPublicId(publicId)).thenReturn(Optional.of(agent));
        when(userRepository.findAll()).thenReturn(List.of(user));
        when(dashboardService.getAgentDashboard(publicId)).thenReturn(dashboard);
        when(propertyService.getByListingAgent(publicId, 0, Integer.MAX_VALUE))
                .thenReturn(PageResponse.<PropertyResponse>builder().content(List.of(property)).page(0).size(1).totalElements(1).totalPages(1).build());
        when(applicationService.getByListingAgent(publicId, 0, Integer.MAX_VALUE))
                .thenReturn(PageResponse.<PropertyApplicationResponse>builder().content(List.of(application)).page(0).size(1).totalElements(1).totalPages(1).build());
        when(transactionService.getByListingAgent(publicId)).thenReturn(List.of(transaction));
        when(transactionService.getCommissionsByAgent(publicId)).thenReturn(List.of(commission));

        ReportDownload report = reportExportService.exportAgent(publicId);
        String csv = new String(report.content(), StandardCharsets.UTF_8);

        assertTrue(report.filename().startsWith("agent-report-agent-123"));
        assertTrue(csv.contains("\"summary\",\"\",\"totalCommissionEarned\",\"1700.00\""));
        assertTrue(csv.contains("\"listings\",\"10\",\"title\",\"Lake House\""));
        assertTrue(csv.contains("\"applications\",\"20\",\"buyerFullName\",\"John Doe\""));
        assertTrue(csv.contains("\"commissions\",\"40\",\"status\",\"PAID\""));
    }
}
