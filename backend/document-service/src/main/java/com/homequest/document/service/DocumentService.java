package com.homequest.document.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.document.dto.DocumentRequest;
import com.homequest.document.dto.DocumentResponse;
import com.homequest.document.model.Document;
import com.homequest.document.model.DocumentStatus;
import com.homequest.document.repository.DocumentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DocumentService {

    private final DocumentRepository documentRepository;

    @Transactional
    public DocumentResponse upload(DocumentRequest request, String uploaderPublicId) {
        Document doc = Document.builder()
                .name(request.getName())
                .fileUrl(request.getFileUrl())
                .type(request.getType())
                .propertyId(request.getPropertyId())
                .applicationId(request.getApplicationId())
                .uploadedBy(uploaderPublicId)
                .build();
        return toResponse(documentRepository.save(doc));
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getAll() {
        return documentRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getByUploader(String uploaderPublicId) {
        return documentRepository.findByUploadedBy(uploaderPublicId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getByApplication(Long applicationId) {
        return documentRepository.findByApplicationId(applicationId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public DocumentResponse verify(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        doc.setStatus(DocumentStatus.VERIFIED);
        return toResponse(documentRepository.save(doc));
    }

    @Transactional
    public DocumentResponse reject(Long id) {
        Document doc = documentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Document not found"));
        doc.setStatus(DocumentStatus.REJECTED);
        return toResponse(documentRepository.save(doc));
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getMy(String uploaderPublicId) {
        return documentRepository.findByUploadedBy(uploaderPublicId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<DocumentResponse> getByProperty(Long propertyId) {
        return documentRepository.findByPropertyId(propertyId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void delete(Long id) {
        documentRepository.deleteById(id);
    }

    private DocumentResponse toResponse(Document d) {
        return DocumentResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .fileUrl(d.getFileUrl())
                .type(d.getType())
                .propertyId(d.getPropertyId())
                .applicationId(d.getApplicationId())
                .uploadedBy(d.getUploadedBy())
                .status(d.getStatus())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
