package com.homequest.gateway.notification;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    // push to a specific user's personal topic
    public void notifyUser(String userPublicId, NotificationEvent event) {
        messagingTemplate.convertAndSend("/topic/user/" + userPublicId, event);
    }

    // push to all subscribers of a company topic
    public void notifyCompany(Long companyId, NotificationEvent event) {
        messagingTemplate.convertAndSend("/topic/company/" + companyId, event);
    }

    // push to all subscribers of a property topic
    public void notifyProperty(Long propertyId, NotificationEvent event) {
        messagingTemplate.convertAndSend("/topic/property/" + propertyId, event);
    }

    // push to all subscribers of a transaction topic
    public void notifyTransaction(Long transactionId, NotificationEvent event) {
        messagingTemplate.convertAndSend("/topic/transaction/" + transactionId, event);
    }
}
