package com.homequest.property.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homequest.property.model.Property;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.model.PropertyType;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    Page<Property> findAll(Pageable pageable);
    Page<Property> findByListingAgentPublicId(String agentPublicId, Pageable pageable);
    Page<Property> findBySellingAgentPublicId(String agentPublicId, Pageable pageable);
    Page<Property> findByOwnerPublicId(String ownerPublicId, Pageable pageable);
    Page<Property> findByBuyerPublicId(String buyerPublicId, Pageable pageable);
    Page<Property> findByCompanyId(Long companyId, Pageable pageable);
    Page<Property> findByStatus(PropertyStatus status, Pageable pageable);
    List<Property> findByCity(String city);

    long countByCompanyIdAndStatus(Long companyId, PropertyStatus status);
    long countByCompanyId(Long companyId);

    @Query("SELECT p.status, COUNT(p) FROM Property p WHERE p.companyId = :companyId GROUP BY p.status")
    List<Object[]> countByStatusForCompany(@Param("companyId") Long companyId);

    @Query("SELECT p.type, COUNT(p) FROM Property p WHERE p.companyId = :companyId GROUP BY p.type")
    List<Object[]> countByTypeForCompany(@Param("companyId") Long companyId);

    @Query("SELECT p.city, COUNT(p) FROM Property p WHERE p.companyId = :companyId GROUP BY p.city ORDER BY COUNT(p) DESC")
    List<Object[]> countByCityForCompany(@Param("companyId") Long companyId);

    long countByListingAgentPublicId(String agentPublicId);
    long countBySellingAgentPublicId(String agentPublicId);
    long countByListingAgentPublicIdAndStatus(String agentPublicId, PropertyStatus status);

    @Query("SELECT p.status, COUNT(p) FROM Property p WHERE p.listingAgentPublicId = :agentPublicId GROUP BY p.status")
    List<Object[]> countByStatusForAgent(@Param("agentPublicId") String agentPublicId);
}
