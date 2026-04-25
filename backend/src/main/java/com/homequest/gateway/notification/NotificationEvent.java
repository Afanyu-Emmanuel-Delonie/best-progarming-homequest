package com.homequest.gateway.notification;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationEvent {

    private String type;
    private String title;
    private String message;
    private String recipientPublicId;
    private Object payload;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static class Types {
        public static final String APPLICATION_SUBMITTED   = "APPLICATION_SUBMITTED";
        public static final String APPLICATION_ACCEPTED    = "APPLICATION_ACCEPTED";
        public static final String APPLICATION_REJECTED    = "APPLICATION_REJECTED";
        public static final String APPLICATION_WITHDRAWN   = "APPLICATION_WITHDRAWN";
        public static final String PROPERTY_STATUS_CHANGED = "PROPERTY_STATUS_CHANGED";
        public static final String TRANSACTION_COMPLETED   = "TRANSACTION_COMPLETED";
        public static final String COMMISSION_PAID         = "COMMISSION_PAID";
        public static final String DASHBOARD_UPDATED       = "DASHBOARD_UPDATED";
    }
}
