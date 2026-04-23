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

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/locations")
@RequiredArgsConstructor
public class LocationController {

    private final LocationService locationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_SUPER_ADMIN', 'ROLE_COMPANY_ADMIN')")
    public ResponseEntity<LocationResponse> create(@Valid @RequestBody LocationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(locationService.create(request));
    }

    // get full hierarchy tree from root
    @GetMapping("/tree")
    public ResponseEntity<List<LocationResponse>> getTree() {
        return ResponseEntity.ok(locationService.getRoots());
    }

    // get a single location with its direct children
    @GetMapping("/{code}")
    public ResponseEntity<LocationResponse> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(locationService.getByCode(code));
    }

    // get direct children of a location (e.g. all districts under a province)
    @GetMapping("/{code}/children")
    public ResponseEntity<List<LocationResponse>> getChildren(@PathVariable String code) {
        return ResponseEntity.ok(locationService.getChildren(code));
    }

    // get all locations of a specific level
    @GetMapping("/type/{type}")
    public ResponseEntity<List<LocationResponse>> getByType(@PathVariable LocationType type) {
        return ResponseEntity.ok(locationService.getByType(type));
    }
}
