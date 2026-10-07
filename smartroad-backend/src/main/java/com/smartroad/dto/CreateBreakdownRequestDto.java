package com.smartroad.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateBreakdownRequestDto {
    private Integer vehicleIndex;

    @NotBlank(message = "Breakdown type is required")
    private String breakdownType;

    private String symptoms;
    private String imageUrl;

    private String aiPrediction;
    private Double aiConfidence;
    private String recommendedService;

    private Double latitude;
    private Double longitude;
    private String address;

    @NotBlank(message = "Please select a service provider")
    private String selectedProviderId;
}
