package com.homequest.property.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.property.dto.LocationRequest;
import com.homequest.property.dto.LocationResponse;
import com.homequest.property.model.LocationType;
import com.homequest.property.service.LocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor
@Tag(name = "Locations", description = "Geographic hierarchy — Country → Province → District → Sector → Cell → Village")
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN')")
    @Operation(summary = "Create a location node")
    public ResponseEntity<LocationResponse> create(@Valid @RequestBody LocationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(locationService.create(request));
    }

    @GetMapping("/tree")
    @Operation(summary = "Get full location tree", description = "Returns the full hierarchy from country level down with children. Public endpoint.")
    public ResponseEntity<List<LocationResponse>> getTree() {
        return ResponseEntity.ok(locationService.getRoots());
    }

    @GetMapping("/{code}")
    @Operation(summary = "Get location by code with its direct children")
    public ResponseEntity<LocationResponse> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(locationService.getByCode(code));
    }

    @GetMapping("/{code}/children")
    @Operation(summary = "Get direct children of a location", description = "e.g. pass a province code to get all its districts")
    public ResponseEntity<List<LocationResponse>> getChildren(@PathVariable String code) {
        return ResponseEntity.ok(locationService.getChildren(code));
    }

    @GetMapping("/type/{type}")
    @Operation(summary = "Get all locations of a specific level", description = "COUNTRY, PROVINCE, DISTRICT, SECTOR, CELL, VILLAGE")
    public ResponseEntity<List<LocationResponse>> getByType(@PathVariable LocationType type) {
        return ResponseEntity.ok(locationService.getByType(type));
    }
}
