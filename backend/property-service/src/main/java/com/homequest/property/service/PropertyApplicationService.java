package com.homequest.property.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.dto.PropertyApplicationRequest;
import com.homequest.property.dto.PropertyApplicationResponse;
import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.PropertyApplication;
import com.homequest.gateway.notification.NotificationEvent;
import com.homequest.gateway.notification.NotificationService;
import com.homequest.property.repository.PropertyApplicationRepository;
import com.homequest.property.repository.PropertyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyApplicationService {

    private final PropertyApplicationRepository applicationRepository;
    private final PropertyRepository propertyRepository;
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
                .build();

        PropertyApplicationResponse response = toResponse(applicationRepository.save(application));

        // notify the listing agent a new bid has arrived
        propertyRepository.findById(request.getPropertyId()).ifPresent(property ->
                notificationService.notifyUser(property.getListingAgentPublicId(),
                        NotificationEvent.builder()
                                .type(NotificationEvent.Types.APPLICATION_SUBMITTED)
                                .title("New Bid Received")
                                .message(request.getBuyerFullName() + " submitted a bid of " + request.getOfferAmount())
                                .recipientPublicId(property.getListingAgentPublicId())
                                .payload(response)
                                .build()));
        return response;
    }

    @Transactional(readOnly = true)
    public PropertyApplicationResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<PropertyApplicationResponse> getByProperty(Long propertyId) {
        return applicationRepository.findByPropertyId(propertyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyApplicationResponse> getMyApplications(String buyerPublicId) {
        return applicationRepository.findByBuyerPublicId(buyerPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public PropertyApplicationResponse accept(Long id, String reviewerPublicId) {
        PropertyApplication application = findOrThrow(id);
        application.setStatus(ApplicationStatus.ACCEPTED);
        application.setReviewedBy(reviewerPublicId);
        PropertyApplicationResponse response = toResponse(applicationRepository.save(application));
        notificationService.notifyUser(application.getBuyerPublicId(),
                NotificationEvent.builder()
                        .type(NotificationEvent.Types.APPLICATION_ACCEPTED)
                        .title("Bid Accepted")
                        .message("Your bid on property " + application.getPropertyId() + " has been accepted")
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

    // runs every day at midnight to expire overdue pending applications
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
                .status(a.getStatus())
                .reviewedBy(a.getReviewedBy())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
