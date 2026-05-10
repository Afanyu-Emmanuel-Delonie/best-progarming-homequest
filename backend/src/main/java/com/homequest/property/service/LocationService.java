package com.homequest.property.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homequest.property.dto.LocationRequest;
import com.homequest.property.dto.LocationResponse;
import com.homequest.property.model.Location;
import com.homequest.property.model.LocationType;
import com.homequest.property.repository.LocationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;

    @Transactional
    public LocationResponse create(LocationRequest request) {
        if (locationRepository.findByCode(request.getCode()).isPresent()) {
            throw new IllegalArgumentException("Location code already exists");
        }
        Location parent = null;
        if (request.getParentCode() != null) {
            parent = locationRepository.findByCode(request.getParentCode())
                    .orElseThrow(() -> new IllegalArgumentException("Parent location not found"));
        }
        Location location = Location.builder()
                .code(request.getCode())
                .name(request.getName())
                .type(request.getType())
                .parent(parent)
                .build();
        return toResponse(locationRepository.save(location), false);
    }

    @Transactional(readOnly = true)
    public LocationResponse getByCode(String code) {
        Location location = locationRepository.findByCode(code)
                .orElseThrow(() -> new IllegalArgumentException("Location not found"));
        return toResponse(location, true);
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getByType(LocationType type) {
        return locationRepository.findByType(type)
                .stream().map(l -> toResponse(l, false)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getChildren(String parentCode) {
        return locationRepository.findByParentCode(parentCode)
                .stream().map(l -> toResponse(l, false)).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<LocationResponse> getRoots() {
        return locationRepository.findByType(LocationType.COUNTRY)
                .stream().map(l -> toResponse(l, true)).collect(Collectors.toList());
    }

    private LocationResponse toResponse(Location location, boolean includeChildren) {
        List<LocationResponse> children = null;
        if (includeChildren && location.getChildren() != null) {
            children = location.getChildren().stream()
                    .map(c -> toResponse(c, false))
                    .collect(Collectors.toList());
        }
        return LocationResponse.builder()
                .id(location.getId())
                .code(location.getCode())
                .name(location.getName())
                .type(location.getType())
                .parentCode(location.getParent() != null ? location.getParent().getCode() : null)
                .children(children)
                .build();
    }
}
