package com.homequest.gateway.notification;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    public static final String TOPIC_LIVE_EVENTS = "/topic/events";

    private final SimpMessagingTemplate messagingTemplate;

    public void notifyUser(String userPublicId, NotificationEvent event) {
        publish(event);
    }

    public void notifyCompany(Long companyId, NotificationEvent event) {
        publish(event);
    }

    public void notifyProperty(Long propertyId, NotificationEvent event) {
        publish(event);
    }

    public void notifyTransaction(Long transactionId, NotificationEvent event) {
        publish(event);
    }

    private void publish(NotificationEvent event) {
        try {
            messagingTemplate.convertAndSend(TOPIC_LIVE_EVENTS, event);
        } catch (Exception e) {
            log.warn("WebSocket publish skipped: {}", e.getMessage());
        }
    }
}
