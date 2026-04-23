package com.homequest.user.owner.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.user.owner.dto.OwnerRequest;
import com.homequest.user.owner.dto.OwnerResponse;
import com.homequest.user.owner.model.Owner;
import com.homequest.user.owner.repository.OwnerRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private final OwnerRepository ownerRepository;

    @Transactional
    public OwnerResponse createProfile(String userPublicId, OwnerRequest request) {
        if (ownerRepository.findByUserPublicId(userPublicId).isPresent()) {
            throw new IllegalArgumentException("Owner profile already exists");
        }
        Owner owner = Owner.builder()
                .userPublicId(userPublicId)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .nationalId(request.getNationalId())
                .build();
        return toResponse(ownerRepository.save(owner));
    }

    @Transactional(readOnly = true)
    public OwnerResponse getByUserPublicId(String userPublicId) {
        return toResponse(ownerRepository.findByUserPublicId(userPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found")));
    }

    @Transactional
    public OwnerResponse updateProfile(String userPublicId, OwnerRequest request) {
        Owner owner = ownerRepository.findByUserPublicId(userPublicId)
                .orElseThrow(() -> new IllegalArgumentException("Owner profile not found"));
        owner.setFirstName(request.getFirstName());
        owner.setLastName(request.getLastName());
        owner.setPhone(request.getPhone());
        owner.setNationalId(request.getNationalId());
        return toResponse(ownerRepository.save(owner));
    }

    private OwnerResponse toResponse(Owner owner) {
        return OwnerResponse.builder()
                .id(owner.getId())
                .userPublicId(owner.getUserPublicId())
                .firstName(owner.getFirstName())
                .lastName(owner.getLastName())
                .phone(owner.getPhone())
                .nationalId(owner.getNationalId())
                .build();
    }
}
