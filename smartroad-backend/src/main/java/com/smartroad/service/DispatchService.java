package com.smartroad.service;

import com.smartroad.dto.*;
import com.smartroad.exception.BadRequestException;
import com.smartroad.exception.ResourceNotFoundException;
import com.smartroad.model.*;
import com.smartroad.repository.BreakdownRequestRepository;
import com.smartroad.repository.DriverProfileRepository;
import com.smartroad.repository.ServiceProviderProfileRepository;
import com.smartroad.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.*;

@Service
public class DispatchService {

    private final BreakdownRequestRepository requestRepository;
    private final ServiceProviderProfileRepository providerProfileRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final UserRepository userRepository;
    private final WebClient aiWebClient;

    private static final double EARTH_RADIUS_KM = 6371.0;

    @Autowired
    public DispatchService(
            BreakdownRequestRepository requestRepository,
            ServiceProviderProfileRepository providerProfileRepository,
            DriverProfileRepository driverProfileRepository,
            UserRepository userRepository,
            WebClient aiWebClient) {
        this.requestRepository = requestRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.userRepository = userRepository;
        this.aiWebClient = aiWebClient;
    }

    /**
     * Haversine formula calculating great-circle distance between two GPS coordinates in kilometers.
     */
    public double calculateHaversineDistance(double lat1, double lon1, double lat2, double lon2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round((EARTH_RADIUS_KM * c) * 10.0) / 10.0;
    }

    /**
     * AI Breakdown Diagnosis via Python FastAPI Microservice
     */
    public BreakdownDiagnoseResponse diagnoseBreakdown(BreakdownDiagnoseRequest request) {
        try {
            Map<String, Object> reqBody = new HashMap<>();
            reqBody.put("selected_problem", request.getSelectedProblem());
            reqBody.put("symptoms", request.getSymptoms());
            reqBody.put("has_image", request.isHasImage());

            @SuppressWarnings("unchecked")
            Map<String, Object> aiResult = aiWebClient.post()
                    .uri("/ai/breakdown/classify")
                    .bodyValue(reqBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (aiResult != null) {
                return BreakdownDiagnoseResponse.builder()
                        .prediction((String) aiResult.getOrDefault("prediction", "ENGINE_PROBLEM"))
                        .confidence(aiResult.get("confidence") instanceof Number
                                ? ((Number) aiResult.get("confidence")).doubleValue() : 0.85)
                        .recommendedService((String) aiResult.getOrDefault("recommended_service", "VEHICLE_DIAGNOSTICS"))
                        .explanation((String) aiResult.getOrDefault("explanation", "AI analyzed vehicle symptoms."))
                        .build();
            }
        } catch (Exception ex) {
            // Graceful fallback if AI microservice is briefly unreachable
        }

        // Heuristic Fallback
        String prob = request.getSelectedProblem() != null ? request.getSelectedProblem().toUpperCase().replace(" ", "_") : "ENGINE_PROBLEM";
        return BreakdownDiagnoseResponse.builder()
                .prediction(prob)
                .confidence(0.85)
                .recommendedService(mapProblemToService(prob))
                .explanation("Classified by Rule Diagnostic Engine.")
                .build();
    }

    private String mapProblemToService(String problem) {
        if (problem.contains("TIRE") || problem.contains("PUNCTURE")) return "TYRE_ASSISTANCE";
        if (problem.contains("BATTERY")) return "BATTERY_JUMPSTART";
        if (problem.contains("FUEL")) return "FUEL_DELIVERY";
        if (problem.contains("LOCK")) return "LOCKOUT_ASSISTANCE";
        if (problem.contains("TOW") || problem.contains("ACCIDENT")) return "TOWING";
        return "VEHICLE_DIAGNOSTICS";
    }

    /**
     * Find nearby available providers using Haversine distance & Python AI Recommendation
     */
    public List<NearbyProviderResponse> findNearbyProviders(NearbyProvidersQuery query) {
        List<ServiceProviderProfile> allProviders = providerProfileRepository.findAll();
        List<NearbyProviderResponse> results = new ArrayList<>();

        double driverLat = query.getLatitude() != null ? query.getLatitude() : 17.4486;
        double driverLon = query.getLongitude() != null ? query.getLongitude() : 78.3908;
        double maxRadius = query.getRadiusKm() != null ? query.getRadiusKm() : 35.0;

        for (ServiceProviderProfile p : allProviders) {
            if (!p.isAvailable()) continue;

            double pLat = p.getLatitude() != null ? p.getLatitude() : 17.4486;
            double pLon = p.getLongitude() != null ? p.getLongitude() : 78.3908;

            double distance = calculateHaversineDistance(driverLat, driverLon, pLat, pLon);
            if (distance <= maxRadius) {
                // Approximate ETA
                int etaMins = (int) Math.ceil((distance / 35.0) * 60.0) + 4;
                String etaRange = Math.max(2, etaMins - 2) + "–" + (etaMins + 3) + " mins";

                // Multi-criteria Suitability Score (Distance + Rating + Availability)
                double distScore = Math.max(0, 100.0 - (distance * 4.0));
                double ratingScore = (p.getRating() / 5.0) * 100.0;
                double score = Math.round(((distScore * 0.45) + (ratingScore * 0.45) + 10.0) * 10.0) / 10.0;

                results.add(NearbyProviderResponse.builder()
                        .providerId(p.getId())
                        .businessName(p.getBusinessName())
                        .phone(p.getContactPhone())
                        .address(p.getAddress())
                        .latitude(pLat)
                        .longitude(pLon)
                        .distanceKm(distance)
                        .rating(p.getRating())
                        .totalRatings(p.getTotalRatings())
                        .baseFee(p.getBaseFee())
                        .servicesOffered(p.getServicesOffered())
                        .etaMinutes(etaMins)
                        .etaRange(etaRange)
                        .suitabilityScore(score)
                        .isRecommended(false)
                        .open24x7(p.getOpen24x7())
                        .distanceFromMRUKm(p.getDistanceFromMRUKm())
                        .build());
            }
        }

        // Sort by Suitability Score descending
        results.sort((a, b) -> Double.compare(b.getSuitabilityScore(), a.getSuitabilityScore()));
        if (!results.isEmpty()) {
            results.get(0).setRecommended(true);
        }

        return results;
    }

    /**
     * Create real Assistance Request in MongoDB
     */
    public BreakdownRequest createRequest(String driverUserId, CreateBreakdownRequestDto dto) {
        User driver = userRepository.findById(driverUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        DriverProfile profile = driverProfileRepository.findByUserId(driverUserId).orElse(null);
        Vehicle vehicle = null;
        if (profile != null && !profile.getVehicles().isEmpty()) {
            int idx = dto.getVehicleIndex() != null ? dto.getVehicleIndex() : 0;
            if (idx >= 0 && idx < profile.getVehicles().size()) {
                vehicle = profile.getVehicles().get(idx);
            }
        }

        ServiceProviderProfile provider = providerProfileRepository.findById(dto.getSelectedProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Service provider not found with id: " + dto.getSelectedProviderId()));

        double driverLat = dto.getLatitude() != null ? dto.getLatitude() : 17.4486;
        double driverLon = dto.getLongitude() != null ? dto.getLongitude() : 78.3908;
        double provLat = provider.getLatitude() != null ? provider.getLatitude() : 17.4486;
        double provLon = provider.getLongitude() != null ? provider.getLongitude() : 78.3908;

        double distance = calculateHaversineDistance(driverLat, driverLon, provLat, provLon);
        int eta = (int) Math.ceil((distance / 35.0) * 60.0) + 4;
        String etaRange = Math.max(2, eta - 2) + "–" + (eta + 3) + " mins";

        Instant now = Instant.now();

        // Auto-cancel previous open requests for this driver to avoid multiple active requests
        List<RequestStatus> terminal = List.of(RequestStatus.COMPLETED, RequestStatus.CANCELLED, RequestStatus.REJECTED);
        List<BreakdownRequest> previousRequests = requestRepository.findByDriverIdOrderByCreatedAtDesc(driverUserId);
        for (BreakdownRequest prev : previousRequests) {
            if (!terminal.contains(prev.getStatus())) {
                prev.setStatus(RequestStatus.CANCELLED);
                prev.setUpdatedAt(now);
                requestRepository.save(prev);
            }
        }

        List<StatusHistoryItem> history = new ArrayList<>();
        history.add(StatusHistoryItem.builder()
                .status(RequestStatus.REQUESTED)
                .timestamp(now)
                .note("Assistance requested by " + driver.getFullName())
                .build());

        BreakdownRequest request = BreakdownRequest.builder()
                .driverId(driver.getId())
                .driverName(driver.getFullName())
                .driverPhone(driver.getPhone())
                .vehicle(vehicle)
                .breakdownType(dto.getBreakdownType())
                .symptoms(dto.getSymptoms())
                .imageUrl(dto.getImageUrl())
                .aiPrediction(dto.getAiPrediction())
                .aiConfidence(dto.getAiConfidence())
                .recommendedService(dto.getRecommendedService())
                .driverLocation(GeoLocation.builder()
                        .latitude(driverLat)
                        .longitude(driverLon)
                        .address(dto.getAddress() != null ? dto.getAddress() : "Live Highway Location")
                        .build())
                .providerLocation(GeoLocation.builder()
                        .latitude(provLat)
                        .longitude(provLon)
                        .address(provider.getAddress())
                        .build())
                .selectedProviderId(provider.getId())
                .providerBusinessName(provider.getBusinessName())
                .providerPhone(provider.getContactPhone())
                .distanceKm(distance)
                .estimatedEtaMinutes(eta)
                .etaRange(etaRange)
                .serviceFee(provider.getBaseFee())
                .status(RequestStatus.REQUESTED)
                .statusHistory(history)
                .createdAt(now)
                .updatedAt(now)
                .build();

        return requestRepository.save(request);
    }

    public Optional<BreakdownRequest> getActiveDriverRequest(String driverUserId) {
        List<RequestStatus> terminal = List.of(RequestStatus.COMPLETED, RequestStatus.CANCELLED, RequestStatus.REJECTED);
        return requestRepository.findFirstByDriverIdAndStatusNotInOrderByCreatedAtDesc(driverUserId, terminal);
    }

    public List<BreakdownRequest> getDriverHistory(String driverUserId) {
        return requestRepository.findByDriverIdOrderByCreatedAtDesc(driverUserId);
    }

    public BreakdownRequest updateStatus(String requestId, RequestStatus newStatus, String note) {
        BreakdownRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        req.setStatus(newStatus);
        req.setUpdatedAt(Instant.now());

        if (newStatus == RequestStatus.ACCEPTED) {
            req.setAcceptedAt(Instant.now());
        } else if (newStatus == RequestStatus.COMPLETED || newStatus == RequestStatus.SERVICE_COMPLETED) {
            req.setCompletedAt(Instant.now());
        } else if (newStatus == RequestStatus.CANCELLED && req.getDriverId() != null) {
            List<BreakdownRequest> allDriverReqs = requestRepository.findByDriverIdOrderByCreatedAtDesc(req.getDriverId());
            for (BreakdownRequest other : allDriverReqs) {
                if (!other.getId().equals(requestId) && (other.getStatus() == RequestStatus.REQUESTED || other.getStatus() == RequestStatus.ACCEPTED)) {
                    other.setStatus(RequestStatus.CANCELLED);
                    other.setUpdatedAt(Instant.now());
                    requestRepository.save(other);
                }
            }
        }

        if (req.getStatusHistory() == null) {
            req.setStatusHistory(new ArrayList<>());
        }

        req.getStatusHistory().add(StatusHistoryItem.builder()
                .status(newStatus)
                .timestamp(Instant.now())
                .note(note != null ? note : "Status transitioned to " + newStatus)
                .build());

        return requestRepository.save(req);
    }

    public BreakdownRequest rateRequest(String requestId, Integer rating, String review) {
        BreakdownRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        req.setRating(rating);
        req.setReview(review);
        req.setUpdatedAt(Instant.now());
        return requestRepository.save(req);
    }
}
