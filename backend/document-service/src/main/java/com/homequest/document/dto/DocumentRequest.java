package com.homequest.document.dto;

import com.homequest.document.model.DocumentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DocumentRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "File URL is required")
    private String fileUrl;

    @NotNull(message = "Type is required")
    private DocumentType type;

    private Long propertyId;
    private Long applicationId;
}
