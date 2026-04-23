package com.homequest.gateway.notification;

import org.springframework.stereotype.Service;

// NotificationService — WebSocket disabled temporarily
@Service
public class NotificationService {

    public void notifyUser(String userPublicId, NotificationEvent event) {}
    public void notifyCompany(Long companyId, NotificationEvent event) {}
    public void notifyProperty(Long propertyId, NotificationEvent event) {}
    public void notifyTransaction(Long transactionId, NotificationEvent event) {}
}
