package com.homequest.transaction.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.transaction.dto.AgentDashboardResponse;
import com.homequest.transaction.dto.CompanyDashboardResponse;
import com.homequest.transaction.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated metrics and chart data for agent and company portals")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/agent")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    @Operation(summary = "Agent dashboard", description = "Returns KPI cards, listings by status breakdown, and monthly commission trend for the authenticated agent")
    public ResponseEntity<AgentDashboardResponse> getAgentDashboard(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAgentDashboard((String) auth.getPrincipal()));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyAuthority('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    @Operation(summary = "Company dashboard", description = "Returns total revenue, commission breakdown, properties by status/type/city, monthly sales trend and top agents leaderboard")
    public ResponseEntity<CompanyDashboardResponse> getCompanyDashboard(@PathVariable Long companyId) {
        return ResponseEntity.ok(dashboardService.getCompanyDashboard(companyId));
    }
}
