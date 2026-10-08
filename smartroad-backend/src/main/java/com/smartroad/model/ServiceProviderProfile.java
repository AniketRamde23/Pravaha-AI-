package com.smartroad.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "service_provider_profiles")
public class ServiceProviderProfile {

    @Id
    private String id;

    @Indexed(unique = true)
    private String userId;

    private String businessName;

    private String contactPhone;

    private String address;

    private Double latitude;

    private Double longitude;

    @Builder.Default
    private boolean available = true;

    @Builder.Default
    private List<String> servicesOffered = new ArrayList<>();

    @Builder.Default
    private Double rating = 4.8;

    @Builder.Default
    private int totalRatings = 15;

    @Builder.Default
    private int totalJobsCompleted = 0;

    @Builder.Default
    private Double baseFee = 500.0;

    @Builder.Default
    private Boolean open24x7 = false;

    private Double distanceFromMRUKm;
}
