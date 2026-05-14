package com.homequest.reporting;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportExportService reportExportService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> exportUsers() {
        return download(reportExportService.exportUsers());
    }

    @GetMapping("/clients")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> exportClients() {
        return download(reportExportService.exportClients());
    }

    @GetMapping("/agent/me")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    public ResponseEntity<byte[]> exportMyAgentReport(Authentication auth) {
        return download(reportExportService.exportAgent((String) auth.getPrincipal()));
    }

    @GetMapping("/owner/me")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    public ResponseEntity<byte[]> exportMyOwnerReport(Authentication auth) {
        return download(reportExportService.exportOwner((String) auth.getPrincipal()));
    }

    @GetMapping("/client/me")
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    public ResponseEntity<byte[]> exportMyClientReport(Authentication auth) {
        return download(reportExportService.exportClient((String) auth.getPrincipal()));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<byte[]> exportCompanyReport(@PathVariable Long companyId) {
        return download(reportExportService.exportCompany(companyId));
    }

    private ResponseEntity<byte[]> download(ReportDownload report) {
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + report.filename() + "\"")
                .contentType(MediaType.valueOf("text/csv"))
                .body(report.content());
    }
}
