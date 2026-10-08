package com.smartroad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NearbyProviderResponse {
    private String providerId;
    private String businessName;
    private String phone;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private Double rating;
    private int totalRatings;
    private Double baseFee;
    private List<String> servicesOffered;
    private Integer etaMinutes;
    private String etaRange;
    private Double suitabilityScore;
    private boolean isRecommended;
    private Boolean open24x7;
    private Double distanceFromMRUKm;
}
