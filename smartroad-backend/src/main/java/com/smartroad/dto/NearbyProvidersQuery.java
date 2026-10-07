package com.smartroad.dto;

import lombok.Data;

@Data
public class NearbyProvidersQuery {
    private Double latitude;
    private Double longitude;
    private String serviceType;
    private Double radiusKm;
}
