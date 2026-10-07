package com.smartroad.repository;

import com.smartroad.model.BreakdownRequest;
import com.smartroad.model.RequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BreakdownRequestRepository extends MongoRepository<BreakdownRequest, String> {
    List<BreakdownRequest> findByDriverIdOrderByCreatedAtDesc(String driverId);
    List<BreakdownRequest> findBySelectedProviderIdOrderByCreatedAtDesc(String providerId);
    List<BreakdownRequest> findByStatus(RequestStatus status);

    // Active request for a driver (not completed and not cancelled)
    Optional<BreakdownRequest> findFirstByDriverIdAndStatusNotInOrderByCreatedAtDesc(
            String driverId, List<RequestStatus> terminalStatuses);

    // Active job for a provider
    Optional<BreakdownRequest> findFirstBySelectedProviderIdAndStatusNotInOrderByCreatedAtDesc(
            String providerId, List<RequestStatus> terminalStatuses);
}
