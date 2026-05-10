package com.homequest.property.dto;

import java.util.List;

import com.homequest.property.model.LocationType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LocationResponse {
    private Long id;
    private String code;
    private String name;
    private LocationType type;
    private String parentCode;
    private List<LocationResponse> children;
}
