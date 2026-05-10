package com.homequest.document.dto;

import java.time.LocalDateTime;
import com.homequest.document.model.DocumentType;
import com.homequest.document.model.DocumentStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DocumentResponse {
    private Long id;
    private String name;
    private String fileUrl;
    private DocumentType type;
    private Long propertyId;
    private Long applicationId;
    private String uploadedBy;
    private String requestedBy;
    private String recipientPublicId;
    private String description;
    private DocumentStatus status;
    private LocalDateTime createdAt;
}
