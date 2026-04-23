package com.homequest.transaction.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.homequest.transaction.model.Transaction;
import com.homequest.transaction.model.TransactionStatus;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByListingAgentPublicId(String agentPublicId);
    List<Transaction> findBySellingAgentPublicId(String agentPublicId);
    List<Transaction> findByOwnerPublicId(String ownerPublicId);
    List<Transaction> findByBuyerPublicId(String buyerPublicId);
    List<Transaction> findByCompanyId(Long companyId);
    List<Transaction> findByPropertyId(Long propertyId);

    // --- company dashboard ---
    long countByCompanyIdAndStatus(Long companyId, TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.saleAmount), 0) FROM Transaction t WHERE t.companyId = :companyId AND t.status = :status")
    BigDecimal sumSaleAmountByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.companyCommission), 0) FROM Transaction t WHERE t.companyId = :companyId AND t.status = :status")
    BigDecimal sumCompanyCommissionByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.totalCommission), 0) FROM Transaction t WHERE t.companyId = :companyId AND t.status = :status")
    BigDecimal sumTotalCommissionByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") TransactionStatus status);

    // monthly sales trend — returns [year, month, count, totalSaleAmount]
    @Query("SELECT YEAR(t.createdAt), MONTH(t.createdAt), COUNT(t), COALESCE(SUM(t.saleAmount), 0) " +
           "FROM Transaction t WHERE t.companyId = :companyId AND t.createdAt >= :from " +
           "GROUP BY YEAR(t.createdAt), MONTH(t.createdAt) ORDER BY YEAR(t.createdAt), MONTH(t.createdAt)")
    List<Object[]> monthlySalesTrendByCompany(@Param("companyId") Long companyId, @Param("from") LocalDateTime from);

    // top agents by commission earned for a company
    @Query("SELECT t.sellingAgentPublicId, COALESCE(SUM(t.sellingAgentCommission), 0) " +
           "FROM Transaction t WHERE t.companyId = :companyId AND t.status = 'COMPLETED' " +
           "GROUP BY t.sellingAgentPublicId ORDER BY SUM(t.sellingAgentCommission) DESC")
    List<Object[]> topSellingAgentsByCompany(@Param("companyId") Long companyId);

    // --- agent dashboard ---
    long countBySellingAgentPublicIdAndStatus(String agentPublicId, TransactionStatus status);
    long countByListingAgentPublicIdAndStatus(String agentPublicId, TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.sellingAgentCommission), 0) FROM Transaction t WHERE t.sellingAgentPublicId = :agentPublicId AND t.status = :status")
    BigDecimal sumSellingCommissionByAgentAndStatus(@Param("agentPublicId") String agentPublicId, @Param("status") TransactionStatus status);

    @Query("SELECT COALESCE(SUM(t.listingAgentCommission), 0) FROM Transaction t WHERE t.listingAgentPublicId = :agentPublicId AND t.status = :status")
    BigDecimal sumListingCommissionByAgentAndStatus(@Param("agentPublicId") String agentPublicId, @Param("status") TransactionStatus status);

    @Query("SELECT YEAR(t.createdAt), MONTH(t.createdAt), COUNT(t), COALESCE(SUM(t.sellingAgentCommission), 0) " +
           "FROM Transaction t WHERE t.sellingAgentPublicId = :agentPublicId AND t.createdAt >= :from " +
           "GROUP BY YEAR(t.createdAt), MONTH(t.createdAt) ORDER BY YEAR(t.createdAt), MONTH(t.createdAt)")
    List<Object[]> monthlyCommissionTrendByAgent(@Param("agentPublicId") String agentPublicId, @Param("from") LocalDateTime from);
}
