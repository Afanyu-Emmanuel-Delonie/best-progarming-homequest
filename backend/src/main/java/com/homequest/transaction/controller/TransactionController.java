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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Sale/rent transactions with automatic 70/30 commission split and 10% company fee")
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_AGENT', 'ROLE_ADMIN')")
    @Operation(summary = "Create a transaction", description = "Automatically calculates: totalCommission = saleAmount × commissionRate, companyFee = 10%, listingAgent = 30% of remainder, sellingAgent = 70% of remainder")
    public ResponseEntity<TransactionResponse> create(@Valid @RequestBody TransactionRequest request, Authentication auth) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.create(request, (String) auth.getPrincipal()));
    }

    @GetMapping("/{id:\\d+}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get transaction by ID")
    public ResponseEntity<TransactionResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getById(id));
    }

    @GetMapping("/my/listings")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    @Operation(summary = "Transactions where I was the listing agent")
    public ResponseEntity<List<TransactionResponse>> getMyListingTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getByListingAgent((String) auth.getPrincipal()));
    }

    @GetMapping("/my/sales")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    @Operation(summary = "Transactions where I closed the sale")
    public ResponseEntity<List<TransactionResponse>> getMySaleTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getBySellingAgent((String) auth.getPrincipal()));
    }

    @GetMapping("/my/owner")
    @PreAuthorize("hasAuthority('ROLE_OWNER')")
    @Operation(summary = "Transactions on my properties (as owner/seller)")
    public ResponseEntity<List<TransactionResponse>> getMyOwnerTransactions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getByOwner((String) auth.getPrincipal()));
    }

    @GetMapping("/my/purchases")
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_OWNER')")
    @Operation(summary = "My purchase transactions (as buyer)")
    public ResponseEntity<List<TransactionResponse>> getMyPurchases(Authentication auth) {
        return ResponseEntity.ok(transactionService.getByBuyer((String) auth.getPrincipal()));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "All transactions (admin)")
    public ResponseEntity<List<TransactionResponse>> getAllForAdmin() {
        return ResponseEntity.ok(transactionService.getAll());
    }

    @GetMapping("/company/{companyId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "All transactions for a company")
    public ResponseEntity<List<TransactionResponse>> getByCompany(@PathVariable Long companyId) {
        return ResponseEntity.ok(transactionService.getByCompany(companyId));
    }

    @GetMapping("/my/commissions")
    @PreAuthorize("hasAuthority('ROLE_AGENT')")
    @Operation(summary = "My commission records")
    public ResponseEntity<List<CommissionResponse>> getMyCommissions(Authentication auth) {
        return ResponseEntity.ok(transactionService.getCommissionsByAgent((String) auth.getPrincipal()));
    }

    @GetMapping("/{id:\\d+}/commissions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "All commission records for a transaction")
    public ResponseEntity<List<CommissionResponse>> getTransactionCommissions(@PathVariable Long id) {
        return ResponseEntity.ok(transactionService.getCommissionsByTransaction(id));
    }

    @PatchMapping("/{id:\\d+}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @Operation(summary = "Update transaction status", description = "PENDING, COMPLETED, CANCELLED. Completing triggers real-time notifications to all parties.")
    public ResponseEntity<TransactionResponse> updateStatus(@PathVariable Long id, @RequestParam TransactionStatus status) {
        return ResponseEntity.ok(transactionService.updateStatus(id, status));
    }
}
