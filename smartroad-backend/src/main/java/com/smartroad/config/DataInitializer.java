package com.smartroad.config;

import com.smartroad.model.Role;
import com.smartroad.model.ServiceProviderProfile;
import com.smartroad.model.User;
import com.smartroad.repository.ServiceProviderProfileRepository;
import com.smartroad.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ServiceProviderProfileRepository providerProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(
            UserRepository userRepository,
            ServiceProviderProfileRepository providerProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Aniket Ramde Administrator & Lead Developer Account
        String aniketEmail = "2311it010159@mallareddyuniversity.ac.in";
        if (userRepository.findByEmail(aniketEmail).isEmpty()) {
            User aniketAdmin = User.builder()
                    .email(aniketEmail)
                    .password(passwordEncoder.encode("Aniket@123"))
                    .fullName("Aniket Ramde")
                    .phone("+91 6304886341")
                    .role(Role.ADMIN)
                    .active(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            userRepository.save(aniketAdmin);
            log.info(">>> Seeded Lead Developer & Admin: {} (Password: Aniket@123)", aniketEmail);
        }

        // 2. Also ensure legacy admin email works
        String adminEmail = "admin@smartroad.ai";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode("Admin@123"))
                    .fullName("SmartRoad Administrator")
                    .phone("+91 6304886341")
                    .role(Role.ADMIN)
                    .active(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            userRepository.save(admin);
        }

        // 3. Seed Default Verified Service Provider
        String providerEmail = "provider@smartroad.ai";
        if (userRepository.findByEmail(providerEmail).isEmpty()) {
            User providerUser = User.builder()
                    .email(providerEmail)
                    .password(passwordEncoder.encode("Provider@123"))
                    .fullName("Ramesh Kumar (Apex Auto)")
                    .phone("+91 9123456780")
                    .role(Role.SERVICE_PROVIDER)
                    .active(true)
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();
            providerUser = userRepository.save(providerUser);

            ServiceProviderProfile profile = ServiceProviderProfile.builder()
                    .userId(providerUser.getId())
                    .businessName("Apex Highway Auto Care & Towing")
                    .contactPhone("+91 9123456780")
                    .address("Plot 42, Hitec City Road, Madhapur, Hyderabad")
                    .latitude(17.4486)
                    .longitude(78.3908)
                    .available(true)
                    .servicesOffered(List.of(
                            "TOWING",
                            "BATTERY_JUMPSTART",
                            "TYRE_ASSISTANCE",
                            "FUEL_DELIVERY",
                            "LOCKOUT_ASSISTANCE",
                            "VEHICLE_DIAGNOSTICS"
                    ))
                    .rating(4.9)
                    .totalRatings(48)
                    .totalJobsCompleted(35)
                    .baseFee(450.0)
                    .build();
            providerProfileRepository.save(profile);
            log.info(">>> Seeded verified SERVICE_PROVIDER: {} (Password: Provider@123)", providerEmail);
        }
    }
}
