package com.smartroad.controller;

import com.smartroad.model.BreakdownRequest;
import com.smartroad.model.RequestStatus;
import com.smartroad.model.ServiceProviderProfile;
import com.smartroad.repository.BreakdownRequestRepository;
import com.smartroad.repository.ServiceProviderProfileRepository;
import com.smartroad.security.UserPrincipal;
import com.smartroad.service.DispatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
public class ProviderController {

    private final DispatchService dispatchService;
    private final BreakdownRequestRepository requestRepository;
    private final ServiceProviderProfileRepository providerProfileRepository;

    @Autowired
    public ProviderController(
            DispatchService dispatchService,
            BreakdownRequestRepository requestRepository,
            ServiceProviderProfileRepository providerProfileRepository) {
        this.dispatchService = dispatchService;
        this.requestRepository = requestRepository;
        this.providerProfileRepository = providerProfileRepository;
    }

    @GetMapping("/requests/incoming")
    public ResponseEntity<List<BreakdownRequest>> getIncomingRequests(@AuthenticationPrincipal UserPrincipal principal) {
        ServiceProviderProfile profile = providerProfileRepository.findByUserId(principal.getUser().getId())
                .orElse(null);
        if (profile == null) return ResponseEntity.ok(List.of());

        List<BreakdownRequest> all = requestRepository.findBySelectedProviderIdOrderByCreatedAtDesc(profile.getId());
        List<BreakdownRequest> incoming = all.stream()
                .filter(r -> r.getStatus() == RequestStatus.REQUESTED)
                .toList();
        return ResponseEntity.ok(incoming);
    }

    @GetMapping("/requests/active")
    public ResponseEntity<BreakdownRequest> getActiveJob(@AuthenticationPrincipal UserPrincipal principal) {
        ServiceProviderProfile profile = providerProfileRepository.findByUserId(principal.getUser().getId())
                .orElse(null);
        if (profile == null) return ResponseEntity.noContent().build();

        List<RequestStatus> terminal = List.of(RequestStatus.COMPLETED, RequestStatus.CANCELLED, RequestStatus.REJECTED);
        return requestRepository.findFirstBySelectedProviderIdAndStatusNotInOrderByCreatedAtDesc(profile.getId(), terminal)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }

    @PatchMapping("/requests/{id}/status")
    public ResponseEntity<BreakdownRequest> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        String note = body.get("note");
        RequestStatus newStatus;
        if (statusStr != null) {
            String upper = statusStr.trim().toUpperCase();
            if ("EN_ROUTE".equals(upper) || "PROVIDER_EN_ROUTE".equals(upper)) {
                newStatus = RequestStatus.EN_ROUTE;
            } else if ("ON_SCENE".equals(upper) || "ARRIVED".equals(upper)) {
                newStatus = RequestStatus.ON_SCENE;
            } else {
                try {
                    newStatus = RequestStatus.valueOf(upper);
                } catch (IllegalArgumentException e) {
                    newStatus = RequestStatus.ACCEPTED;
                }
            }
        } else {
            newStatus = RequestStatus.ACCEPTED;
        }
        BreakdownRequest updated = dispatchService.updateStatus(id, newStatus, note);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/availability")
    public ResponseEntity<ServiceProviderProfile> toggleAvailability(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Boolean> body) {
        ServiceProviderProfile profile = providerProfileRepository.findByUserId(principal.getUser().getId())
                .orElseThrow(() -> new RuntimeException("Provider profile not found"));
        Boolean available = body.get("available");
        if (available != null) {
            profile.setAvailable(available);
            profile = providerProfileRepository.save(profile);
        }
        return ResponseEntity.ok(profile);
    }
}
