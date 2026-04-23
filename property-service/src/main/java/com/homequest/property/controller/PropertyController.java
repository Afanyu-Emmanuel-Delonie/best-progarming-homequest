package com.homequest.property.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.property.dto.PropertyRequest;
import com.homequest.property.dto.PropertyResponse;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.service.PropertyService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
public class PropertyController {

    private final PropertyService propertyService;

    // agent registers a property listing
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propertyService.create(request, (String) auth.getPrincipal(), null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> getAll() {
        return ResponseEntity.ok(propertyService.getAll());
    }

    // agent sees properties they listed
    @GetMapping("/my/listings")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    public ResponseEntity<List<PropertyResponse>> getMyListings(Authentication auth) {
        return ResponseEntity.ok(propertyService.getByListingAgent((String) auth.getPrincipal()));
    }

    // agent sees properties they are selling
    @GetMapping("/my/sales")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    public ResponseEntity<List<PropertyResponse>> getMySales(Authentication auth) {
        return ResponseEntity.ok(propertyService.getBySellingAgent((String) auth.getPrincipal()));
    }

    // owner sees their properties
    @GetMapping("/my/owned")
    @PreAuthorize("hasRole('ROLE_OWNER')")
    public ResponseEntity<List<PropertyResponse>> getMyOwnedProperties(Authentication auth) {
        return ResponseEntity.ok(propertyService.getByOwner((String) auth.getPrincipal()));
    }

    // buyer/client sees properties they are purchasing
    @GetMapping("/my/buying")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_OWNER')")
    public ResponseEntity<List<PropertyResponse>> getMyPurchases(Authentication auth) {
        return ResponseEntity.ok(propertyService.getByBuyer((String) auth.getPrincipal()));
    }

    // company admin/manager sees all company properties
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<PropertyResponse>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(propertyService.getByCompany(companyId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyResponse> update(@PathVariable Long id,
            @Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.ok(propertyService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyResponse> updateStatus(@PathVariable Long id,
            @RequestParam PropertyStatus status) {
        return ResponseEntity.ok(propertyService.updateStatus(id, status));
    }

    // assign a selling agent to a property
    @PatchMapping("/{id}/selling-agent")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyResponse> assignSellingAgent(@PathVariable Long id,
            @RequestParam String agentPublicId) {
        return ResponseEntity.ok(propertyService.assignSellingAgent(id, agentPublicId));
    }

    // assign buyer to a property
    @PatchMapping("/{id}/buyer")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<PropertyResponse> assignBuyer(@PathVariable Long id,
            @RequestParam String buyerPublicId) {
        return ResponseEntity.ok(propertyService.assignBuyer(id, buyerPublicId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
