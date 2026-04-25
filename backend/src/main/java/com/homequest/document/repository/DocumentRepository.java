package com.homequest.document.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.homequest.document.model.Document;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUploadedBy(String uploadedBy);
    List<Document> findByPropertyId(Long propertyId);
    List<Document> findByApplicationId(Long applicationId);
    List<Document> findByRecipientPublicId(String recipientPublicId);
    List<Document> findByRequestedBy(String requestedBy);
}
