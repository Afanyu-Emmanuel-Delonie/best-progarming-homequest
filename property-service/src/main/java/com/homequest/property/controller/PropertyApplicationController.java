package com.homequest.property.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.property.dto.PropertyApplicationRequest;
import com.homequest.property.dto.PropertyApplicationResponse;
import com.homequest.property.service.PropertyApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class PropertyApplicationController {

    private final PropertyApplicationService applicationService;

    // buyer submits a bid
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_OWNER')")
    public ResponseEntity<PropertyApplicationResponse> submit(
            @Valid @RequestBody PropertyApplicationRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.submit(request, (String) auth.getPrincipal()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PropertyApplicationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(id));
    }

    // buyer sees their own bids
    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_OWNER')")
    public ResponseEntity<List<PropertyApplicationResponse>> getMyApplications(Authentication auth) {
        return ResponseEntity.ok(applicationService.getMyApplications((String) auth.getPrincipal()));
    }

    // agent/admin sees all bids on a property
    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<PropertyApplicationResponse>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(applicationService.getByProperty(propertyId));
    }

    // owner/agent accepts a bid
    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_OWNER', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyApplicationResponse> accept(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(applicationService.accept(id, (String) auth.getPrincipal()));
    }

    // owner/agent rejects a bid
    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_OWNER', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyApplicationResponse> reject(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(applicationService.reject(id, (String) auth.getPrincipal()));
    }

    // buyer withdraws their own bid
    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_OWNER')")
    public ResponseEntity<PropertyApplicationResponse> withdraw(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(applicationService.withdraw(id, (String) auth.getPrincipal()));
    }
}
