package com.homequest.property.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.dto.PageResponse;
import com.homequest.property.dto.PropertyApplicationRequest;
import com.homequest.property.dto.PropertyApplicationResponse;
import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.PropertyApplication;
import com.homequest.gateway.notification.NotificationEvent;
import com.homequest.gateway.notification.NotificationService;
import com.homequest.property.repository.PropertyApplicationRepository;
import com.homequest.property.repository.PropertyRepository;
import com.homequest.transaction.dto.TransactionRequest;
import com.homequest.transaction.model.TransactionType;
import com.homequest.transaction.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyApplicationService {

    private final PropertyApplicationRepository applicationRepository;
    private final PropertyRepository propertyRepository;
    private final TransactionService transactionService;
    private final NotificationService notificationService;

    @Transactional
    public PropertyApplicationResponse submit(PropertyApplicationRequest request, String buyerPublicId) {
        propertyRepository.findById(request.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));

        PropertyApplication application = PropertyApplication.builder()
                .propertyId(request.getPropertyId())
                .buyerPublicId(buyerPublicId)
                .buyerFullName(request.getBuyerFullName())
                .buyerNationalId(request.getBuyerNationalId())
                .buyerPhone(request.getBuyerPhone())
                .offerAmount(request.getOfferAmount())
                .depositAmount(request.getDepositAmount())
                .fundingSource(request.getFundingSource())
                .proposedClosingDate(request.getProposedClosingDate())
                .offerExpirationDate(request.getOfferExpirationDate())
                .specialConditions(request.getSpecialConditions())
                .assignedAgentPublicId(request.getAssignedAgentPublicId())
                .build();

        PropertyApplicationResponse response = toResponse(applicationRepository.save(application));

        propertyRepository.findById(request.getPropertyId()).ifPresent(property -> {
                String notifyAgent = request.getAssignedAgentPublicId() != null
                        ? request.getAssignedAgentPublicId()
                        : property.getListingAgentPublicId();
                notificationService.notifyUser(notifyAgent,
                        NotificationEvent.builder()
                                .type(NotificationEvent.Types.APPLICATION_SUBMITTED)
                                .title("New Bid Received")
                                .message(request.getBuyerFullName() + " submitted a bid of " + request.getOfferAmount())
                                .recipientPublicId(notifyAgent)
                                .payload(response)
                                .build());
        });
        return response;
    }

    @Transactional(readOnly = true)
    public PropertyApplicationResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyApplicationResponse> getAll(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        return toPage(applicationRepository.findAll(pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyApplicationResponse> getByAssignedAgent(String agentPublicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(applicationRepository.findByAssignedAgentPublicId(agentPublicId, pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyApplicationResponse> getByListingAgent(String agentPublicId, int page, int size) {
        List<Long> propertyIds = propertyRepository.findByListingAgentPublicId(
                agentPublicId, PageRequest.of(0, Integer.MAX_VALUE, Sort.by("createdAt")))
                .stream().map(p -> p.getId()).collect(Collectors.toList());
        if (propertyIds.isEmpty()) return PageResponse.<PropertyApplicationResponse>builder()
                .content(List.of()).page(page).size(size).totalElements(0).totalPages(0).build();
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(applicationRepository.findByPropertyIdIn(propertyIds, pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyApplicationResponse> getByProperty(Long propertyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(applicationRepository.findByPropertyId(propertyId, pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyApplicationResponse> getMyApplications(String buyerPublicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(applicationRepository.findByBuyerPublicId(buyerPublicId, pageable));
    }

    @Transactional
    public PropertyApplicationResponse accept(Long id, String reviewerPublicId) {
        PropertyApplication application = findOrThrow(id);
        if (application.getTransactionId() != null) {
            return toResponse(application);
        }

        var property = propertyRepository.findById(application.getPropertyId())
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));

        String listingAgentPublicId = property.getListingAgentPublicId() != null
                ? property.getListingAgentPublicId()
                : reviewerPublicId;
        String sellingAgentPublicId = application.getAssignedAgentPublicId() != null
                ? application.getAssignedAgentPublicId()
                : (property.getSellingAgentPublicId() != null ? property.getSellingAgentPublicId() : listingAgentPublicId);

        TransactionRequest request = new TransactionRequest();
        request.setPropertyId(application.getPropertyId());
        request.setSellingAgentPublicId(sellingAgentPublicId);
        request.setOwnerPublicId(property.getOwnerPublicId());
        request.setBuyerPublicId(application.getBuyerPublicId());
        request.setCompanyId(property.getCompanyId());
        request.setSaleAmount(application.getOfferAmount());
        request.setCommissionRate(new java.math.BigDecimal("0.05"));
        request.setType(TransactionType.SALE);

        var transaction = transactionService.create(request, listingAgentPublicId);

        application.setStatus(ApplicationStatus.ACCEPTED);
        application.setReviewedBy(reviewerPublicId);
        application.setTransactionId(transaction.getId());
        PropertyApplicationResponse response = toResponse(applicationRepository.save(application));

        property.setStatus(com.homequest.property.model.PropertyStatus.UNDER_OFFER);
        property.setBuyerPublicId(application.getBuyerPublicId());
        property.setSellingAgentPublicId(sellingAgentPublicId);
        propertyRepository.save(property);

        notificationService.notifyUser(application.getBuyerPublicId(),
                NotificationEvent.builder()
                        .type(NotificationEvent.Types.APPLICATION_ACCEPTED)
                        .title("Bid Accepted")
                        .message("Your bid on property " + application.getPropertyId() + " has been accepted and a pending transaction has been created")
                        .recipientPublicId(application.getBuyerPublicId())
                        .payload(response)
                        .build());
        return response;
    }

    @Transactional
    public PropertyApplicationResponse reject(Long id, String reviewerPublicId) {
        PropertyApplication application = findOrThrow(id);
        application.setStatus(ApplicationStatus.REJECTED);
        application.setReviewedBy(reviewerPublicId);
        PropertyApplicationResponse response = toResponse(applicationRepository.save(application));
        notificationService.notifyUser(application.getBuyerPublicId(),
                NotificationEvent.builder()
                        .type(NotificationEvent.Types.APPLICATION_REJECTED)
                        .title("Bid Rejected")
                        .message("Your bid on property " + application.getPropertyId() + " has been rejected")
                        .recipientPublicId(application.getBuyerPublicId())
                        .payload(response)
                        .build());
        return response;
    }

    @Transactional
    public PropertyApplicationResponse withdraw(Long id, String buyerPublicId) {
        PropertyApplication application = findOrThrow(id);
        if (!application.getBuyerPublicId().equals(buyerPublicId)) {
            throw new IllegalArgumentException("You can only withdraw your own application");
        }
        application.setStatus(ApplicationStatus.WITHDRAWN);
        return toResponse(applicationRepository.save(application));
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expireApplications() {
        List<PropertyApplication> expired = applicationRepository
                .findByOfferExpirationDateBeforeAndStatus(LocalDate.now(), ApplicationStatus.PENDING);
        expired.forEach(a -> a.setStatus(ApplicationStatus.EXPIRED));
        applicationRepository.saveAll(expired);
    }

    private PropertyApplication findOrThrow(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Application not found"));
    }

    private PageResponse<PropertyApplicationResponse> toPage(Page<PropertyApplication> page) {
        return PageResponse.<PropertyApplicationResponse>builder()
                .content(page.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .build();
    }

    private PropertyApplicationResponse toResponse(PropertyApplication a) {
        return PropertyApplicationResponse.builder()
                .id(a.getId())
                .propertyId(a.getPropertyId())
                .buyerPublicId(a.getBuyerPublicId())
                .buyerFullName(a.getBuyerFullName())
                .buyerNationalId(a.getBuyerNationalId())
                .buyerPhone(a.getBuyerPhone())
                .offerAmount(a.getOfferAmount())
                .depositAmount(a.getDepositAmount())
                .fundingSource(a.getFundingSource())
                .proposedClosingDate(a.getProposedClosingDate())
                .offerExpirationDate(a.getOfferExpirationDate())
                .specialConditions(a.getSpecialConditions())
                .assignedAgentPublicId(a.getAssignedAgentPublicId())
                .transactionId(a.getTransactionId())
                .status(a.getStatus())
                .reviewedBy(a.getReviewedBy())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
