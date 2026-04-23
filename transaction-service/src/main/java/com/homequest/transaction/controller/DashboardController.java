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

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    // agent sees their own dashboard
    @GetMapping("/agent")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    public ResponseEntity<AgentDashboardResponse> getAgentDashboard(Authentication auth) {
        return ResponseEntity.ok(dashboardService.getAgentDashboard((String) auth.getPrincipal()));
    }

    // company admin/manager sees company dashboard
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<CompanyDashboardResponse> getCompanyDashboard(@PathVariable Long companyId) {
        return ResponseEntity.ok(dashboardService.getCompanyDashboard(companyId));
    }
}
