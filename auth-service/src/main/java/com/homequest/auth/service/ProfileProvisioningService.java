package com.homequest.auth.service;

import org.springframework.stereotype.Service;

import com.homequest.auth.model.Role;
import com.homequest.user.agent.model.Agent;
import com.homequest.user.agent.repository.AgentRepository;
import com.homequest.user.client.model.Client;
import com.homequest.user.client.repository.ClientRepository;
import com.homequest.user.owner.model.Owner;
import com.homequest.user.owner.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProfileProvisioningService {

    private final AgentRepository agentRepository;
    private final OwnerRepository ownerRepository;
    private final ClientRepository clientRepository;

    public void provision(String userPublicId, String firstName, String lastName, String licenseNumber, Long companyId, Role role) {
        switch (role) {
            case ROLE_AGENT, ROLE_MANAGER, ROLE_COMPANY_ADMIN -> agentRepository.save(
                    Agent.builder()
                            .userPublicId(userPublicId)
                            .firstName(firstName)
                            .lastName(lastName)
                            .licenseNumber(licenseNumber)
                            .companyId(companyId)
                            .build());
            case ROLE_OWNER -> ownerRepository.save(
                    Owner.builder()
                            .userPublicId(userPublicId)
                            .firstName(firstName)
                            .lastName(lastName)
                            .build());
            case ROLE_CLIENT -> clientRepository.save(
                    Client.builder()
                            .userPublicId(userPublicId)
                            .firstName(firstName)
                            .lastName(lastName)
                            .build());
            default -> { }
        }
    }
}
