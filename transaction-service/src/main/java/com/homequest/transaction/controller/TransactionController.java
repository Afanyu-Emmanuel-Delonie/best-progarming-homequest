package com.homequest.transaction.controller;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.homequest.transaction.dto.CommissionResponse;
import com.homequest.transaction.dto.TransactionRequest;
import com.homequest.transaction.dto.TransactionResponse;
import com.homequest.transaction.model.TransactionStatus;
import com.homequest.transaction.service.TransactionService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    // listing agent creates the transaction when a sale is closed
    @PostMapping
    @PreAuthorize("hasAnyRole('ROLE_AGENT', 'ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody TransactionRequest request,
            Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(request, (String) auth.getPrincipal()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TransactionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(id));
    }

    // agent sees transactions where they were the listing agent
    @GetMapping("/my/listings")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    public ResponseEntity<List<TransactionResponse>> getMyListingTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getByListingAgent((String) auth.getPrincipal()));
    }

    // agent sees transactions where they closed the sale
    @GetMapping("/my/sales")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    public ResponseEntity<List<TransactionResponse>> getMySaleTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getBySellingAgent((String) auth.getPrincipal()));
    }

    // owner sees all transactions on their properties
    @GetMapping("/my/owner")
    @PreAuthorize("hasRole('ROLE_OWNER')")
    public ResponseEntity<List<TransactionResponse>> getMyOwnerTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getByOwner((String) auth.getPrincipal()));
    }

    // buyer sees their purchase transactions
    @GetMapping("/my/purchases")
    @PreAuthorize("hasAnyRole('ROLE_CLIENT', 'ROLE_OWNER')")
    public ResponseEntity<List<TransactionResponse>> getMyPurchases(Authentication auth) {
        return ResponseEntity.ok(transactionService.getByBuyer((String) auth.getPrincipal()));
    }

    // company admin sees all company transactions
    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<TransactionResponse>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(transactionService.getByCompany(companyId));
    }

    // agent sees their own commissions
    @GetMapping("/my/commissions")
    @PreAuthorize("hasRole('ROLE_AGENT')")
    public ResponseEntity<List<CommissionResponse>> getMyCommissions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getCommissionsByAgent((String) auth.getPrincipal()));
    }

    // admin sees all commissions for a transaction
    @GetMapping("/{id}/commissions")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<List<CommissionResponse>> getTransactionCommissions(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getCommissionsByTransaction(id));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ROLE_COMPANY_ADMIN', 'ROLE_MANAGER')")
    public ResponseEntity<TransactionResponse> updateStatus(@PathVariable Long id,
            @RequestParam TransactionStatus status) {
        return ResponseEntity.ok(transactionService.updateStatus(id, status));
    }
}
