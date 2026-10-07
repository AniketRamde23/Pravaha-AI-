package com.smartroad.controller;

import com.smartroad.dto.*;
import com.smartroad.model.BreakdownRequest;
import com.smartroad.model.DriverProfile;
import com.smartroad.model.RequestStatus;
import com.smartroad.model.Vehicle;
import com.smartroad.repository.DriverProfileRepository;
import com.smartroad.security.UserPrincipal;
import com.smartroad.service.DispatchService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final DispatchService dispatchService;
    private final DriverProfileRepository driverProfileRepository;

    @Autowired
    public DriverController(DispatchService dispatchService, DriverProfileRepository driverProfileRepository) {
        this.dispatchService = dispatchService;
        this.driverProfileRepository = driverProfileRepository;
    }

    @PostMapping("/breakdown/diagnose")
    public ResponseEntity<BreakdownDiagnoseResponse> diagnoseBreakdown(@RequestBody BreakdownDiagnoseRequest request) {
        BreakdownDiagnoseResponse response = dispatchService.diagnoseBreakdown(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/providers/nearby")
    public ResponseEntity<List<NearbyProviderResponse>> findNearbyProviders(@RequestBody NearbyProvidersQuery query) {
        List<NearbyProviderResponse> providers = dispatchService.findNearbyProviders(query);
        return ResponseEntity.ok(providers);
    }

    @PostMapping("/requests")
    public ResponseEntity<BreakdownRequest> createRequest(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateBreakdownRequestDto dto) {
        BreakdownRequest request = dispatchService.createRequest(principal.getUser().getId(), dto);
        return new ResponseEntity<>(request, HttpStatus.CREATED);
    }

    @GetMapping("/requests/active")
    public ResponseEntity<BreakdownRequest> getActiveRequest(@AuthenticationPrincipal UserPrincipal principal) {
        return dispatchService.getActiveDriverRequest(principal.getUser().getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @GetMapping("/requests/history")
    public ResponseEntity<List<BreakdownRequest>> getHistory(@AuthenticationPrincipal UserPrincipal principal) {
        List<BreakdownRequest> history = dispatchService.getDriverHistory(principal.getUser().getId());
        return ResponseEntity.ok(history);
    }

    @PatchMapping("/requests/{id}/cancel")
    public ResponseEntity<BreakdownRequest> cancelRequest(
            @PathVariable String id,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = body != null ? body.get("reason") : "Cancelled by driver";
        BreakdownRequest updated = dispatchService.updateStatus(id, RequestStatus.CANCELLED, reason);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/requests/{id}/rate")
    public ResponseEntity<BreakdownRequest> rateRequest(
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        Integer rating = body.get("rating") instanceof Number ? ((Number) body.get("rating")).intValue() : 5;
        String review = (String) body.getOrDefault("review", "Great service!");
        BreakdownRequest updated = dispatchService.rateRequest(id, rating, review);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/vehicle")
    public ResponseEntity<DriverProfile> addVehicle(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Vehicle vehicle) {
        DriverProfile profile = driverProfileRepository.findByUserId(principal.getUser().getId())
                .orElseGet(() -> DriverProfile.builder().userId(principal.getUser().getId()).build());
        profile.getVehicles().add(vehicle);
        profile = driverProfileRepository.save(profile);
        return ResponseEntity.ok(profile);
    }
}
