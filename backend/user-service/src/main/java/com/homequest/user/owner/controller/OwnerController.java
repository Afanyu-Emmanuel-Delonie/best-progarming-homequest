package com.homequest.user.owner.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.user.owner.dto.OwnerRequest;
import com.homequest.user.owner.dto.OwnerResponse;
import com.homequest.user.owner.service.OwnerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/owners")
@RequiredArgsConstructor
public class OwnerController {

    private final OwnerService ownerService;

    @PostMapping("/me")
    @PreAuthorize("hasRole('ROLE_OWNER')")
    public ResponseEntity<OwnerResponse> createMyProfile(@Valid @RequestBody OwnerRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ownerService.createProfile((String) auth.getPrincipal(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_OWNER')")
    public ResponseEntity<OwnerResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(ownerService.getByUserPublicId((String) auth.getPrincipal()));
    }

    @GetMapping("/by-public-id/{publicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<OwnerResponse> getByPublicId(@PathVariable String publicId) {
        return ResponseEntity.ok(ownerService.getByUserPublicId(publicId));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ROLE_OWNER')")
    public ResponseEntity<OwnerResponse> updateMyProfile(@Valid @RequestBody OwnerRequest request,
            Authentication auth) {
        return ResponseEntity.ok(ownerService.updateProfile((String) auth.getPrincipal(), request));
    }
}
