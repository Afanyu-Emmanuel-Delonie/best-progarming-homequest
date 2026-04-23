package com.homequest.user.agent.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homequest.user.agent.model.Agent;
import com.homequest.user.agent.model.AgentStatus;

@Repository
public interface AgentRepository extends JpaRepository<Agent, Long> {
    Optional<Agent> findByUserPublicId(String userPublicId);
    List<Agent> findByCompanyId(Long companyId);
    List<Agent> findByStatus(AgentStatus status);
    boolean existsByLicenseNumber(String licenseNumber);
}
