package com.homequest.property.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.dto.PageResponse;
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
    public PageResponse<PropertyResponse> getAll(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        var p = propertyRepository.findAll(pageable);
        return PageResponse.<PropertyResponse>builder()
                .content(p.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(p.getNumber()).size(p.getSize())
                .totalElements(p.getTotalElements()).totalPages(p.getTotalPages())
                .build();
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getByListingAgent(String agentPublicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var p = propertyRepository.findByListingAgentPublicId(agentPublicId, pageable);
        return toPage(p);
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getBySellingAgent(String agentPublicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(propertyRepository.findBySellingAgentPublicId(agentPublicId, pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getByOwner(String ownerPublicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(propertyRepository.findByOwnerPublicId(ownerPublicId, pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getByBuyer(String buyerPublicId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(propertyRepository.findByBuyerPublicId(buyerPublicId, pageable));
    }

    @Transactional(readOnly = true)
    public PageResponse<PropertyResponse> getByCompany(Long companyId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return toPage(propertyRepository.findByCompanyId(companyId, pageable));
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

    private PageResponse<PropertyResponse> toPage(org.springframework.data.domain.Page<Property> p) {
        return PageResponse.<PropertyResponse>builder()
                .content(p.getContent().stream().map(this::toResponse).collect(Collectors.toList()))
                .page(p.getNumber()).size(p.getSize())
                .totalElements(p.getTotalElements()).totalPages(p.getTotalPages())
                .build();
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
