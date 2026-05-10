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

import com.homequest.property.dto.PageResponse;
import com.homequest.property.dto.PropertyRequest;
import com.homequest.property.dto.PropertyResponse;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.service.PropertyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/properties")
@RequiredArgsConstructor
@Tag(name = "Properties", description = "Property listing management — create, update, assign agents and track status")
public class PropertyController {

    private final PropertyService propertyService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    @Operation(summary = "Create a property listing", description = "Agent registers a new property. The listing agent is set from the JWT token.")
    public ResponseEntity<PropertyResponse> create(@Valid @RequestBody PropertyRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(propertyService.create(request, (String) auth.getPrincipal(), null));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get property by ID")
    public ResponseEntity<PropertyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.getById(id));
    }

    @GetMapping
    @Operation(summary = "Get all properties (paginated)", description = "page, size, sortBy (default: createdAt). Public endpoint.")
    public ResponseEntity<PageResponse<PropertyResponse>> getAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(propertyService.getAll(page, size, sortBy));
    }

    @GetMapping("/my/listings")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    @Operation(summary = "Get my listed properties (paginated)")
    public ResponseEntity<PageResponse<PropertyResponse>> getMyListings(
            Authentication auth,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getByListingAgent((String) auth.getPrincipal(), page, size));
    }

    @GetMapping("/my/sales")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    @Operation(summary = "Get properties I am selling (paginated)")
    public ResponseEntity<PageResponse<PropertyResponse>> getMySales(
            Authentication auth,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getBySellingAgent((String) auth.getPrincipal(), page, size));
    }

    @GetMapping("/my/owned")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    @Operation(summary = "Get my owned properties (paginated)")
    public ResponseEntity<PageResponse<PropertyResponse>> getMyOwnedProperties(
            Authentication auth,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getByOwner((String) auth.getPrincipal(), page, size));
    }

    @GetMapping("/my/buying")
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER')")
    @Operation(summary = "Get properties I am purchasing (paginated)")
    public ResponseEntity<PageResponse<PropertyResponse>> getMyPurchases(
            Authentication auth,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getByBuyer((String) auth.getPrincipal(), page, size));
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Get all properties for a company (paginated)")
    public ResponseEntity<PageResponse<PropertyResponse>> getByCompany(
            @PathVariable Long companyId,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(propertyService.getByCompany(companyId, page, size));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    @Operation(summary = "Update a property")
    public ResponseEntity<PropertyResponse> update(@PathVariable Long id, @Valid @RequestBody PropertyRequest request) {
        return ResponseEntity.ok(propertyService.update(id, request));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    @Operation(summary = "Update property status", description = "AVAILABLE, UNDER_OFFER, SOLD, RENTED, INACTIVE")
    public ResponseEntity<PropertyResponse> updateStatus(@PathVariable Long id, @RequestParam PropertyStatus status) {
        return ResponseEntity.ok(propertyService.updateStatus(id, status));
    }

    @PatchMapping("/{id}/selling-agent")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Assign a selling agent to a property")
    public ResponseEntity<PropertyResponse> assignSellingAgent(@PathVariable Long id, @RequestParam String agentPublicId) {
        return ResponseEntity.ok(propertyService.assignSellingAgent(id, agentPublicId));
    }

    @PatchMapping("/{id}/buyer")
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    @Operation(summary = "Assign a buyer to a property")
    public ResponseEntity<PropertyResponse> assignBuyer(@PathVariable Long id, @RequestParam String buyerPublicId) {
        return ResponseEntity.ok(propertyService.assignBuyer(id, buyerPublicId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Delete a property")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
