package com.homequest.user.client.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.user.client.dto.ClientRequest;
import com.homequest.user.client.dto.ClientResponse;
import com.homequest.user.client.model.Client;
import com.homequest.user.client.repository.ClientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional
    public ClientResponse createProfile(String userPublicId, ClientRequest request) {
        if (clientRepository.findByUserPublicId(userPublicId).isPresent()) {
            throw new IllegalArgumentException("Client profile already exists");
        }
        Client client = Client.builder()
                .userPublicId(userPublicId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .build();
        return toResponse(clientRepository.save(client));
    }

    @Transactional(readOnly = true)
    public ClientResponse getByUserPublicId(String userPublicId) {
        return toResponse(clientRepository.findByUserPublicId(userPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found")));
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> getAll() {
        return clientRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClientResponse> getByCompany(Long companyId) {
        return clientRepository.findByCompanyId(companyId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ClientResponse updateProfile(String userPublicId, ClientRequest request) {
        Client client = clientRepository.findByUserPublicId(userPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Client profile not found"));
        client.setFirstName(request.getFirstName());
        client.setLastName(request.getLastName());
        client.setPhone(request.getPhone());
        return toResponse(clientRepository.save(client));
    }

    private ClientResponse toResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .userPublicId(client.getUserPublicId())
                .firstName(client.getFirstName())
                .lastName(client.getLastName())
                .phone(client.getPhone())
                .companyId(client.getCompanyId())
                .build();
    }
}
