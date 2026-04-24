package com.homequest.property.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.property.dto.PageResponse;
import com.homequest.property.dto.PropertyApplicationRequest;
import com.homequest.property.dto.PropertyApplicationResponse;
import com.homequest.property.service.PropertyApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@Tag(name = "Property Applications", description = "Bid/offer lifecycle — submit, accept, reject, withdraw")
public class PropertyApplicationController {

    private final PropertyApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_OWNER')")
    @Operation(summary = "Submit a bid")
    public ResponseEntity<PropertyApplicationResponse> submit(
            @Valid @RequestBody PropertyApplicationRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(applicationService.submit(request, (String) auth.getPrincipal()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get application by ID")
    public ResponseEntity<PropertyApplicationResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(applicationService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @Operation(summary = "Get all applications (paginated)", description = "page, size, sortBy (default: createdAt)")
    public ResponseEntity<PageResponse<PropertyApplicationResponse>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(applicationService.getAll(page, size, sortBy));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_OWNER')")
    @Operation(summary = "Get my submitted bids (paginated)")
    public ResponseEntity<PageResponse<PropertyApplicationResponse>> getMyApplications(
            Authentication auth,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getMyApplications((String) auth.getPrincipal(), page, size));
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    @Operation(summary = "Get all applications on my listed properties")
    public ResponseEntity<PageResponse<PropertyApplicationResponse>> getMyListingApplications(
            Authentication auth,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "100") int size) {
        return ResponseEntity.ok(applicationService.getByListingAgent((String) auth.getPrincipal(), page, size));
    }

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_ADMIN')")
    @Operation(summary = "Get all bids on a property (paginated)")
    public ResponseEntity<PageResponse<PropertyApplicationResponse>> getByProperty(
            @PathVariable Long propertyId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getByProperty(propertyId, page, size));
    }

    @PatchMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Accept a bid")
    public ResponseEntity<PropertyApplicationResponse> accept(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(applicationService.accept(id, (String) auth.getPrincipal()));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_OWNER', 'ROLE_ADMIN')")
    @Operation(summary = "Reject a bid")
    public ResponseEntity<PropertyApplicationResponse> reject(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(applicationService.reject(id, (String) auth.getPrincipal()));
    }

    @PatchMapping("/{id}/withdraw")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_OWNER')")
    @Operation(summary = "Withdraw my bid")
    public ResponseEntity<PropertyApplicationResponse> withdraw(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(applicationService.withdraw(id, (String) auth.getPrincipal()));
    }
}
