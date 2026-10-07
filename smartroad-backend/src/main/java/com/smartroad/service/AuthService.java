package com.smartroad.service;

import com.smartroad.dto.AuthResponse;
import com.smartroad.dto.DriverRegisterRequest;
import com.smartroad.dto.LoginRequest;
import com.smartroad.dto.ProviderRegisterRequest;
import com.smartroad.exception.BadRequestException;
import com.smartroad.exception.ResourceNotFoundException;
import com.smartroad.model.*;
import com.smartroad.repository.DriverProfileRepository;
import com.smartroad.repository.ServiceProviderProfileRepository;
import com.smartroad.repository.UserRepository;
import com.smartroad.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final ServiceProviderProfileRepository providerProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Autowired
    public AuthService(
            UserRepository userRepository,
            DriverProfileRepository driverProfileRepository,
            ServiceProviderProfileRepository providerProfileRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.driverProfileRepository = driverProfileRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse registerDriver(DriverRegisterRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists");
        }

        Instant now = Instant.now();
        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone().trim())
                .role(Role.DRIVER)
                .active(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        user = userRepository.save(user);

        // Build driver profile with initial vehicle if provided
        List<Vehicle> vehicles = new ArrayList<>();
        if (StringUtils.hasText(req.getVehicleMake()) || StringUtils.hasText(req.getLicensePlate())) {
            vehicles.add(Vehicle.builder()
                    .make(req.getVehicleMake())
                    .model(req.getVehicleModel())
                    .licensePlate(req.getLicensePlate())
                    .vehicleType(StringUtils.hasText(req.getVehicleType()) ? req.getVehicleType() : "4-Wheeler Sedan")
                    .year(req.getVehicleYear() != null ? req.getVehicleYear() : 2022)
                    .color(req.getVehicleColor())
                    .build());
        }

        DriverProfile profile = DriverProfile.builder()
                .userId(user.getId())
                .vehicles(vehicles)
                .build();
        profile = driverProfileRepository.save(profile);

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .profile(profile)
                .build();
    }

    public AuthResponse registerProvider(ProviderRegisterRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("An account with email " + normalizedEmail + " already exists");
        }

        Instant now = Instant.now();
        User user = User.builder()
                .email(normalizedEmail)
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .phone(req.getPhone().trim())
                .role(Role.SERVICE_PROVIDER)
                .active(true)
                .createdAt(now)
                .updatedAt(now)
                .build();

        user = userRepository.save(user);

        List<String> services = req.getServicesOffered();
        if (services == null || services.isEmpty()) {
            services = List.of("TOWING", "BATTERY_JUMPSTART", "TYRE_ASSISTANCE", "FUEL_DELIVERY", "LOCKOUT_ASSISTANCE", "VEHICLE_DIAGNOSTICS");
        }

        ServiceProviderProfile profile = ServiceProviderProfile.builder()
                .userId(user.getId())
                .businessName(req.getBusinessName().trim())
                .contactPhone(req.getPhone().trim())
                .address(req.getAddress() != null ? req.getAddress().trim() : "Local Service Center")
                .latitude(req.getLatitude() != null ? req.getLatitude() : 17.4486)
                .longitude(req.getLongitude() != null ? req.getLongitude() : 78.3908)
                .available(true)
                .servicesOffered(services)
                .rating(4.8)
                .totalRatings(12)
                .totalJobsCompleted(0)
                .baseFee(req.getBaseFee() != null ? req.getBaseFee() : 500.0)
                .build();

        profile = providerProfileRepository.save(profile);

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .profile(profile)
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        String normalizedEmail = req.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        if (!user.isActive()) {
            throw new BadRequestException("User account is inactive. Please contact administrator.");
        }

        Object profile = null;
        if (user.getRole() == Role.DRIVER) {
            profile = driverProfileRepository.findByUserId(user.getId()).orElse(null);
        } else if (user.getRole() == Role.SERVICE_PROVIDER) {
            profile = providerProfileRepository.findByUserId(user.getId()).orElse(null);
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .profile(profile)
                .build();
    }

    public AuthResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Object profile = null;
        if (user.getRole() == Role.DRIVER) {
            profile = driverProfileRepository.findByUserId(user.getId()).orElse(null);
        } else if (user.getRole() == Role.SERVICE_PROVIDER) {
            profile = providerProfileRepository.findByUserId(user.getId()).orElse(null);
        }

        String token = tokenProvider.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .profile(profile)
                .build();
    }
}
