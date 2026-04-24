package com.homequest.transaction.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.gateway.notification.NotificationEvent;
import com.homequest.gateway.notification.NotificationService;
import com.homequest.transaction.dto.CommissionResponse;
import com.homequest.transaction.dto.TransactionRequest;
import com.homequest.transaction.dto.TransactionResponse;
import com.homequest.transaction.model.Commission;
import com.homequest.transaction.model.CommissionRecipientType;
import com.homequest.transaction.model.CommissionStatus;
import com.homequest.transaction.model.Transaction;
import com.homequest.transaction.model.TransactionStatus;
import com.homequest.transaction.model.TransactionType;
import com.homequest.transaction.repository.CommissionRepository;
import com.homequest.transaction.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private static final BigDecimal COMPANY_RATE      = new BigDecimal("0.10");
    private static final BigDecimal LISTING_AGENT_RATE = new BigDecimal("0.30");
    private static final BigDecimal SELLING_AGENT_RATE = new BigDecimal("0.70");

    private final TransactionRepository transactionRepository;
    private final CommissionRepository commissionRepository;
    private final NotificationService notificationService;

    @Transactional
    public TransactionResponse create(TransactionRequest request, String listingAgentPublicId) {
        BigDecimal totalCommission = request.getSaleAmount()
                .multiply(request.getCommissionRate())
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal companyCommission = totalCommission
                .multiply(COMPANY_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal agentPool = totalCommission.subtract(companyCommission);

        BigDecimal listingAgentCommission = agentPool
                .multiply(LISTING_AGENT_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal sellingAgentCommission = agentPool
                .multiply(SELLING_AGENT_RATE)
                .setScale(2, RoundingMode.HALF_UP);

        Transaction transaction = Transaction.builder()
                .propertyId(request.getPropertyId())
                .listingAgentPublicId(listingAgentPublicId)
                .sellingAgentPublicId(request.getSellingAgentPublicId())
                .ownerPublicId(request.getOwnerPublicId())
                .buyerPublicId(request.getBuyerPublicId())
                .companyId(request.getCompanyId())
                .saleAmount(request.getSaleAmount())
                .commissionRate(request.getCommissionRate())
                .totalCommission(totalCommission)
                .companyCommission(companyCommission)
                .listingAgentCommission(listingAgentCommission)
                .sellingAgentCommission(sellingAgentCommission)
                .type(request.getType() != null ? request.getType() : TransactionType.SALE)
                .build();

        Transaction saved = transactionRepository.save(transaction);

        // create individual commission records
        commissionRepository.save(Commission.builder()
                .transactionId(saved.getId())
                .recipientPublicId(listingAgentPublicId)
                .recipientType(CommissionRecipientType.LISTING_AGENT)
                .amount(listingAgentCommission)
                .build());

        commissionRepository.save(Commission.builder()
                .transactionId(saved.getId())
                .recipientPublicId(request.getSellingAgentPublicId())
                .recipientType(CommissionRecipientType.SELLING_AGENT)
                .amount(sellingAgentCommission)
                .build());

        commissionRepository.save(Commission.builder()
                .transactionId(saved.getId())
                .recipientPublicId(String.valueOf(request.getCompanyId()))
                .recipientType(CommissionRecipientType.COMPANY)
                .amount(companyCommission)
                .build());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByListingAgent(String agentPublicId) {
        return transactionRepository.findByListingAgentPublicId(agentPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getBySellingAgent(String agentPublicId) {
        return transactionRepository.findBySellingAgentPublicId(agentPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByOwner(String ownerPublicId) {
        return transactionRepository.findByOwnerPublicId(ownerPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByBuyer(String buyerPublicId) {
        return transactionRepository.findByBuyerPublicId(buyerPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getByCompany(Long companyId) {
        return transactionRepository.findByCompanyId(companyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    /** All transactions — admin console only. */
    @Transactional(readOnly = true)
    public List<TransactionResponse> getAll() {
        return transactionRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommissionResponse> getCommissionsByAgent(String agentPublicId) {
        return commissionRepository.findByRecipientPublicId(agentPublicId)
                .stream().map(this::toCommissionResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CommissionResponse> getCommissionsByTransaction(Long transactionId) {
        return commissionRepository.findByTransactionId(transactionId)
                .stream().map(this::toCommissionResponse).collect(Collectors.toList());
    }

    @Transactional
    public TransactionResponse updateStatus(Long id, TransactionStatus status) {
        Transaction transaction = findOrThrow(id);
        transaction.setStatus(status);
        Transaction saved = transactionRepository.save(transaction);
        TransactionResponse response = toResponse(saved);

        if (status == TransactionStatus.COMPLETED) {
            // notify listing agent
            notificationService.notifyUser(saved.getListingAgentPublicId(),
                    NotificationEvent.builder()
                            .type(NotificationEvent.Types.TRANSACTION_COMPLETED)
                            .title("Transaction Completed")
                            .message("Transaction #" + saved.getId() + " has been completed. Your commission: " + saved.getListingAgentCommission())
                            .recipientPublicId(saved.getListingAgentPublicId())
                            .payload(response)
                            .build());
            // notify selling agent
            notificationService.notifyUser(saved.getSellingAgentPublicId(),
                    NotificationEvent.builder()
                            .type(NotificationEvent.Types.TRANSACTION_COMPLETED)
                            .title("Transaction Completed")
                            .message("Transaction #" + saved.getId() + " has been completed. Your commission: " + saved.getSellingAgentCommission())
                            .recipientPublicId(saved.getSellingAgentPublicId())
                            .payload(response)
                            .build());
            // notify owner
            notificationService.notifyUser(saved.getOwnerPublicId(),
                    NotificationEvent.builder()
                            .type(NotificationEvent.Types.TRANSACTION_COMPLETED)
                            .title("Sale Completed")
                            .message("Your property has been sold for " + saved.getSaleAmount())
                            .recipientPublicId(saved.getOwnerPublicId())
                            .payload(response)
                            .build());
            // notify company
            notificationService.notifyCompany(saved.getCompanyId(),
                    NotificationEvent.builder()
                            .type(NotificationEvent.Types.DASHBOARD_UPDATED)
                            .title("Dashboard Updated")
                            .message("A new transaction has been completed")
                            .payload(response)
                            .build());
        }
        return response;
    }

    private Transaction findOrThrow(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found"));
    }

    private TransactionResponse toResponse(Transaction t) {
        return TransactionResponse.builder()
                .id(t.getId())
                .propertyId(t.getPropertyId())
                .listingAgentPublicId(t.getListingAgentPublicId())
                .sellingAgentPublicId(t.getSellingAgentPublicId())
                .ownerPublicId(t.getOwnerPublicId())
                .buyerPublicId(t.getBuyerPublicId())
                .companyId(t.getCompanyId())
                .saleAmount(t.getSaleAmount())
                .commissionRate(t.getCommissionRate())
                .totalCommission(t.getTotalCommission())
                .companyCommission(t.getCompanyCommission())
                .listingAgentCommission(t.getListingAgentCommission())
                .sellingAgentCommission(t.getSellingAgentCommission())
                .type(t.getType())
                .status(t.getStatus())
                .createdAt(t.getCreatedAt())
                .build();
    }

    private CommissionResponse toCommissionResponse(Commission c) {
        return CommissionResponse.builder()
                .id(c.getId())
                .transactionId(c.getTransactionId())
                .recipientPublicId(c.getRecipientPublicId())
                .recipientType(c.getRecipientType())
                .amount(c.getAmount())
                .status(c.getStatus())
                .paidAt(c.getPaidAt())
                .createdAt(c.getCreatedAt())
                .build();
    }
}
