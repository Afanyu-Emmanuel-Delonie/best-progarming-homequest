package com.homequest.property.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.dto.PropertyRequest;
import com.homequest.property.dto.PropertyResponse;
import com.homequest.property.model.Property;
import com.homequest.property.model.PropertyStatus;
import com.homequest.property.model.PropertyType;
import com.homequest.property.repository.PropertyRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;

    @Transactional
    public PropertyResponse create(PropertyRequest request, String listingAgentPublicId, Long companyId) {
        Property property = Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .address(request.getAddress())
                .city(request.getCity())
                .country(request.getCountry())
                .bedrooms(request.getBedrooms())
                .bathrooms(request.getBathrooms())
                .areaSqm(request.getAreaSqm())
                .type(request.getType() != null ? request.getType() : PropertyType.APARTMENT)
                .listingAgentPublicId(listingAgentPublicId)
                .ownerPublicId(request.getOwnerPublicId())
                .companyId(companyId)
                .build();
        return toResponse(propertyRepository.save(property));
    }

    @Transactional(readOnly = true)
    public PropertyResponse getById(Long id) {
        return toResponse(findOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getAll() {
        return propertyRepository.findAll().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getByListingAgent(String agentPublicId) {
        return propertyRepository.findByListingAgentPublicId(agentPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getBySellingAgent(String agentPublicId) {
        return propertyRepository.findBySellingAgentPublicId(agentPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getByOwner(String ownerPublicId) {
        return propertyRepository.findByOwnerPublicId(ownerPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getByBuyer(String buyerPublicId) {
        return propertyRepository.findByBuyerPublicId(buyerPublicId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PropertyResponse> getByCompany(Long companyId) {
        return propertyRepository.findByCompanyId(companyId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public PropertyResponse update(Long id, PropertyRequest request) {
        Property property = findOrThrow(id);
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setAddress(request.getAddress());
        property.setCity(request.getCity());
        property.setCountry(request.getCountry());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setAreaSqm(request.getAreaSqm());
        if (request.getType() != null) property.setType(request.getType());
        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse updateStatus(Long id, PropertyStatus status) {
        Property property = findOrThrow(id);
        property.setStatus(status);
        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse assignSellingAgent(Long id, String sellingAgentPublicId) {
        Property property = findOrThrow(id);
        property.setSellingAgentPublicId(sellingAgentPublicId);
        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public PropertyResponse assignBuyer(Long id, String buyerPublicId) {
        Property property = findOrThrow(id);
        property.setBuyerPublicId(buyerPublicId);
        return toResponse(propertyRepository.save(property));
    }

    @Transactional
    public void delete(Long id) {
        propertyRepository.delete(findOrThrow(id));
    }

    private Property findOrThrow(Long id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Property not found"));
    }

    private PropertyResponse toResponse(Property p) {
        return PropertyResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .price(p.getPrice())
                .address(p.getAddress())
                .city(p.getCity())
                .country(p.getCountry())
                .bedrooms(p.getBedrooms())
                .bathrooms(p.getBathrooms())
                .areaSqm(p.getAreaSqm())
                .type(p.getType())
                .status(p.getStatus())
                .listingAgentPublicId(p.getListingAgentPublicId())
                .sellingAgentPublicId(p.getSellingAgentPublicId())
                .ownerPublicId(p.getOwnerPublicId())
                .buyerPublicId(p.getBuyerPublicId())
                .companyId(p.getCompanyId())
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
