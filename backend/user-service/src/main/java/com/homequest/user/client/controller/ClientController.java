package com.homequest.user.client.controller;

import java.util.List;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.user.client.dto.ClientRequest;
import com.homequest.user.client.dto.ClientResponse;
import com.homequest.user.client.service.ClientService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<ClientResponse>> getAll() {
        return ResponseEntity.ok(clientService.getAll());
    }

    @GetMapping("/by-company")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<List<ClientResponse>> getByCompany(@RequestParam Long companyId) {
        return ResponseEntity.ok(clientService.getByCompany(companyId));
    }

    @PostMapping("/me")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ClientResponse> createMyProfile(@Valid @RequestBody ClientRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.createProfile((String) auth.getPrincipal(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ClientResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(clientService.getByUserPublicId((String) auth.getPrincipal()));
    }

    @GetMapping("/by-public-id/{publicId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ClientResponse> getByPublicId(@PathVariable String publicId) {
        return ResponseEntity.ok(clientService.getByUserPublicId(publicId));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<ClientResponse> updateMyProfile(@Valid @RequestBody ClientRequest request,
            Authentication auth) {
        return ResponseEntity.ok(clientService.updateProfile((String) auth.getPrincipal(), request));
    }
}
