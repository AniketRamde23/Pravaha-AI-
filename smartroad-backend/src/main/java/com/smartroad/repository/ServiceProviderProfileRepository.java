package com.smartroad.repository;

import com.smartroad.model.ServiceProviderProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderProfileRepository extends MongoRepository<ServiceProviderProfile, String> {
    Optional<ServiceProviderProfile> findByUserId(String userId);
    Optional<ServiceProviderProfile> findByBusinessName(String businessName);
    List<ServiceProviderProfile> findByAvailableTrue();
}
