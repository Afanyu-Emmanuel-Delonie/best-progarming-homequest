package com.homequest.user.agent.service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.repository.PropertyRepository;
import com.homequest.user.agent.dto.AgentCardResponse;
import com.homequest.user.agent.dto.AgentRequest;
import com.homequest.user.agent.dto.AgentResponse;
import com.homequest.user.agent.model.Agent;
import com.homequest.user.agent.model.AgentStatus;
import com.homequest.user.agent.repository.AgentRepository;
import com.homequest.user.company.model.Company;
import com.homequest.user.company.repository.CompanyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final PropertyRepository propertyRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public AgentResponse createProfile(String userPublicId, AgentRequest request) {
        if (agentRepository.findByUserPublicId(userPublicId).isPresent()) {
            throw new IllegalArgumentException("Agent profile already exists");
        }
        if (request.getLicenseNumber() != null && agentRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new IllegalArgumentException("License number already in use");
        }
        Agent agent = Agent.builder()
                .userPublicId(userPublicId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .licenseNumber(request.getLicenseNumber())
                .profileImage(request.getProfileImage())
                .build();
        return toResponse(agentRepository.save(agent));
    }

    @Transactional(readOnly = true)
    public AgentResponse getByUserPublicId(String userPublicId) {
        return toResponse(findOrThrow(userPublicId));
    }

    @Transactional(readOnly = true)
    public AgentResponse getById(Long id) {
        return toResponse(agentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found")));
    }

    @Transactional(readOnly = true)
    public List<AgentResponse> getByCompany(Long companyId) {
        return agentRepository.findByCompanyId(companyId).stream()
                .map(this::toResponse).collect(Collectors.toList());
    }

    /** Active agents ranked by listing count — public landing page. */
    @Transactional(readOnly = true)
    public List<AgentCardResponse> getTopPublicAgents(int limit) {
        int cap = limit == Integer.MAX_VALUE ? Integer.MAX_VALUE : Math.min(Math.max(limit, 1), 24);
        Map<String, String> defaultSocial = Map.of("twitter", "#", "linkedin", "#", "instagram", "#");
        return agentRepository.findByStatus(AgentStatus.ACTIVE).stream()
                .map(a -> {
                    int listings = (int) propertyRepository.countByListingAgentPublicId(a.getUserPublicId());
                    String companyName = companyRepository.findById(a.getCompanyId())
                            .map(Company::getName)
                            .orElse("HomeQuest Realty");
                    double rating = 4.5 + (a.getId() % 6) * 0.08;
                    rating = Math.round(rating * 10) / 10.0;
                    String bio = String.format(
                            "%s %s is a verified HomeQuest agent helping buyers and sellers across Rwanda.",
                            a.getFirstName(), a.getLastName());
                    return AgentCardResponse.builder()
                            .id(a.getId())
                            .userPublicId(a.getUserPublicId())
                            .firstName(a.getFirstName())
                            .lastName(a.getLastName())
                            .phone(a.getPhone())
                            .licenseNumber(a.getLicenseNumber())
                            .profileImage(a.getProfileImage())
                            .companyName(companyName)
                            .listings(listings)
                            .rating(rating)
                            .bio(bio)
                            .location("Rwanda")
                            .social(defaultSocial)
                            .build();
                })
                .sorted(Comparator.comparingInt(AgentCardResponse::getListings).reversed())
                .limit(cap)
                .collect(Collectors.toList());
    }

    @Transactional
    public AgentResponse updateProfile(String userPublicId, AgentRequest request) {
        Agent agent = findOrThrow(userPublicId);
        agent.setFirstName(request.getFirstName());
        agent.setLastName(request.getLastName());
        agent.setPhone(request.getPhone());
        agent.setProfileImage(request.getProfileImage());
        if (request.getLicenseNumber() != null) agent.setLicenseNumber(request.getLicenseNumber());
        return toResponse(agentRepository.save(agent));
    }

    @Transactional
    public AgentResponse updateStatus(Long id, AgentStatus status) {
        Agent agent = agentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Agent not found"));
        agent.setStatus(status);
        return toResponse(agentRepository.save(agent));
    }

    private Agent findOrThrow(String userPublicId) {
        return agentRepository.findByUserPublicId(userPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Agent profile not found"));
    }

    private AgentResponse toResponse(Agent agent) {
        return AgentResponse.builder()
                .id(agent.getId())
                .userPublicId(agent.getUserPublicId())
                .firstName(agent.getFirstName())
                .lastName(agent.getLastName())
                .phone(agent.getPhone())
                .licenseNumber(agent.getLicenseNumber())
                .profileImage(agent.getProfileImage())
                .companyId(agent.getCompanyId())
                .status(agent.getStatus())
                .build();
    }
}
