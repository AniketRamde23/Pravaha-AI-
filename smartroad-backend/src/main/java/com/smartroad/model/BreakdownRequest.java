package com.smartroad.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "breakdown_requests")
public class BreakdownRequest {

    @Id
    private String id;

    private String driverId;
    private String driverName;
    private String driverPhone;

    private Vehicle vehicle;

    private String breakdownType;
    private String symptoms;
    private String imageUrl;

    // AI Classification outputs
    private String aiPrediction;
    private Double aiConfidence;
    private String recommendedService;

    // Locations
    private GeoLocation driverLocation;
    private GeoLocation providerLocation;

    // Provider Assignment
    private String selectedProviderId;
    private String providerBusinessName;
    private String providerPhone;

    // Dispatch Metrics
    private Double distanceKm;
    private Integer estimatedEtaMinutes;
    private String etaRange;
    private Double serviceFee;

    // State machine
    @Builder.Default
    private RequestStatus status = RequestStatus.REQUESTED;

    @Builder.Default
    private List<StatusHistoryItem> statusHistory = new ArrayList<>();

    // Feedback
    private Integer rating;
    private String review;

    @CreatedDate
    private Instant createdAt;

    private Instant acceptedAt;
    private Instant completedAt;

    @LastModifiedDate
    private Instant updatedAt;
}
