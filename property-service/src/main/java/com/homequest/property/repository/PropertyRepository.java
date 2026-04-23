package com.homequest.property.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homequest.property.model.Property;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.model.PropertyType;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByListingAgentPublicId(String agentPublicId);
    List<Property> findBySellingAgentPublicId(String agentPublicId);
    List<Property> findByOwnerPublicId(String ownerPublicId);
    List<Property> findByBuyerPublicId(String buyerPublicId);
    List<Property> findByCompanyId(Long companyId);
    List<Property> findByStatus(PropertyStatus status);
    List<Property> findByCity(String city);

    // --- company dashboard ---
    long countByCompanyIdAndStatus(Long companyId, PropertyStatus status);
    long countByCompanyId(Long companyId);

    // properties grouped by status for a company [status, count]
    @Query("SELECT p.status, COUNT(p) FROM Property p WHERE p.companyId = :companyId GROUP BY p.status")
    List<Object[]> countByStatusForCompany(@Param("companyId") Long companyId);

    // properties grouped by type for a company [type, count]
    @Query("SELECT p.type, COUNT(p) FROM Property p WHERE p.companyId = :companyId GROUP BY p.type")
    List<Object[]> countByTypeForCompany(@Param("companyId") Long companyId);

    // properties grouped by city for a company [city, count]
    @Query("SELECT p.city, COUNT(p) FROM Property p WHERE p.companyId = :companyId GROUP BY p.city ORDER BY COUNT(p) DESC")
    List<Object[]> countByCityForCompany(@Param("companyId") Long companyId);

    // --- agent dashboard ---
    long countByListingAgentPublicId(String agentPublicId);
    long countBySellingAgentPublicId(String agentPublicId);
    long countByListingAgentPublicIdAndStatus(String agentPublicId, PropertyStatus status);

    // agent properties grouped by status [status, count]
    @Query("SELECT p.status, COUNT(p) FROM Property p WHERE p.listingAgentPublicId = :agentPublicId GROUP BY p.status")
    List<Object[]> countByStatusForAgent(@Param("agentPublicId") String agentPublicId);
}
