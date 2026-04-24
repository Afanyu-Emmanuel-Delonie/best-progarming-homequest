package com.homequest.document.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.document.dto.DocumentRequest;
import com.homequest.document.dto.DocumentRequestDto;
import com.homequest.document.dto.DocumentResponse;
import com.homequest.document.service.DocumentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DocumentResponse> upload(@Valid @RequestBody DocumentRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.upload(request, (String) auth.getPrincipal()));
    }

    @PostMapping("/request")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<DocumentResponse> requestDocument(@Valid @RequestBody DocumentRequestDto dto, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.requestDocument(dto, (String) auth.getPrincipal()));
    }

    @GetMapping("/requested/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DocumentResponse>> getMyRequested(Authentication auth) {
        return ResponseEntity.ok(documentService.getRequestedForUser((String) auth.getPrincipal()));
    }

    @GetMapping("/uploader/{publicId}")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<List<DocumentResponse>> getByUploader(@PathVariable String publicId) {
        return ResponseEntity.ok(documentService.getByUploader(publicId));
    }

    @GetMapping("/application/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DocumentResponse>> getByApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(documentService.getByApplication(applicationId));
    }

    @PatchMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<DocumentResponse> verify(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.verify(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_ADMIN')")
    public ResponseEntity<DocumentResponse> reject(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.reject(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<DocumentResponse>> getAll() {
        return ResponseEntity.ok(documentService.getAll());
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DocumentResponse>> getMy(Authentication auth) {
        return ResponseEntity.ok(documentService.getMy((String) auth.getPrincipal()));
    }

    @GetMapping("/property/{propertyId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<DocumentResponse>> getByProperty(@PathVariable Long propertyId) {
        return ResponseEntity.ok(documentService.getByProperty(propertyId));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        documentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
