package com.homequest.property.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homequest.property.model.ApplicationStatus;
import com.homequest.property.model.PropertyApplication;

@Repository
public interface PropertyApplicationRepository extends JpaRepository<PropertyApplication, Long> {
    List<PropertyApplication> findByPropertyId(Long propertyId);
    List<PropertyApplication> findByBuyerPublicId(String buyerPublicId);
    List<PropertyApplication> findByStatus(ApplicationStatus status);
    List<PropertyApplication> findByOfferExpirationDateBeforeAndStatus(LocalDate date, ApplicationStatus status);

    // applications grouped by status for a property [status, count]
    @Query("SELECT a.status, COUNT(a) FROM PropertyApplication a WHERE a.propertyId = :propertyId GROUP BY a.status")
    List<Object[]> countByStatusForProperty(@Param("propertyId") Long propertyId);

    // total pending applications for all properties of an agent
    @Query("SELECT COUNT(a) FROM PropertyApplication a " +
           "WHERE a.propertyId IN (SELECT p.id FROM Property p WHERE p.listingAgentPublicId = :agentPublicId) " +
           "AND a.status = 'PENDING'")
    long countPendingApplicationsForAgent(@Param("agentPublicId") String agentPublicId);

    // total pending applications for all properties of a company
    @Query("SELECT COUNT(a) FROM PropertyApplication a " +
           "WHERE a.propertyId IN (SELECT p.id FROM Property p WHERE p.companyId = :companyId) " +
           "AND a.status = 'PENDING'")
    long countPendingApplicationsForCompany(@Param("companyId") Long companyId);

    // applications grouped by funding source [fundingSource, count]
    @Query("SELECT a.fundingSource, COUNT(a) FROM PropertyApplication a " +
           "WHERE a.propertyId IN (SELECT p.id FROM Property p WHERE p.companyId = :companyId) " +
           "GROUP BY a.fundingSource")
    List<Object[]> countByFundingSourceForCompany(@Param("companyId") Long companyId);
}
