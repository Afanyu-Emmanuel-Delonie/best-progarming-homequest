package com.homequest.user.client.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @PostMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> createMyProfile(@Valid @RequestBody ClientRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(clientService.createProfile((String) auth.getPrincipal(), request));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(clientService.getByUserPublicId((String) auth.getPrincipal()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientResponse> updateMyProfile(@Valid @RequestBody ClientRequest request,
            Authentication auth) {
        return ResponseEntity.ok(clientService.updateProfile((String) auth.getPrincipal(), request));
    }
}
