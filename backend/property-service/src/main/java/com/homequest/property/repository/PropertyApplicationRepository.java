package com.homequest.property.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.PropertyApplication;

@Repository
public interface PropertyApplicationRepository extends JpaRepository<PropertyApplication, Long> {
    Page<PropertyApplication> findByPropertyId(Long propertyId, Pageable pageable);
    Page<PropertyApplication> findByBuyerPublicId(String buyerPublicId, Pageable pageable);
    Page<PropertyApplication> findByStatus(ApplicationStatus status, Pageable pageable);
    Page<PropertyApplication> findAll(Pageable pageable);
    List<PropertyApplication> findByOfferExpirationDateBeforeAndStatus(LocalDate date, ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM PropertyApplication a WHERE a.propertyId = :propertyId GROUP BY a.status")
    List<Object[]> countByStatusForProperty(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(a) FROM PropertyApplication a " +
           "WHERE a.propertyId IN (SELECT p.id FROM Property p WHERE p.listingAgentPublicId = :agentPublicId) " +
           "AND a.status = 'PENDING'")
    long countPendingApplicationsForAgent(@Param("agentPublicId") String agentPublicId);

    @Query("SELECT COUNT(a) FROM PropertyApplication a " +
           "WHERE a.propertyId IN (SELECT p.id FROM Property p WHERE p.companyId = :companyId) " +
           "AND a.status = 'PENDING'")
    long countPendingApplicationsForCompany(@Param("companyId") Long companyId);

    @Query("SELECT a.fundingSource, COUNT(a) FROM PropertyApplication a " +
           "WHERE a.propertyId IN (SELECT p.id FROM Property p WHERE p.companyId = :companyId) " +
           "GROUP BY a.fundingSource")
    List<Object[]> countByFundingSourceForCompany(@Param("companyId") Long companyId);
}
