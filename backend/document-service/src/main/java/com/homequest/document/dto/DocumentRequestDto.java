package com.homequest.document.dto;

import com.homequest.document.model.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentRequestDto {

    @NotBlank(message = "Recipient public ID is required")
    private String recipientPublicId;

    @NotNull(message = "Document type is required")
    private DocumentType type;

    @NotBlank(message = "Description is required")
    private String description;

    private Long propertyId;
    private Long applicationId;
}
