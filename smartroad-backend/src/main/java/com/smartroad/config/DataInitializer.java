package com.smartroad.config;

import com.smartroad.model.Role;
import com.smartroad.model.ServiceProviderProfile;
import com.smartroad.model.User;
import com.smartroad.model.DriverProfile;
import com.smartroad.model.Vehicle;
import com.smartroad.repository.DriverProfileRepository;
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
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ServiceProviderProfileRepository providerProfileRepository;
    private final DriverProfileRepository driverProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(
            UserRepository userRepository,
            ServiceProviderProfileRepository providerProfileRepository,
            DriverProfileRepository driverProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.driverProfileRepository = driverProfileRepository;
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

        // 4. Seed Default Verified Driver Accounts
        String[] driverEmails = {"driver@smartroad.ai", "driver@smartroad.com", "rahul.driver@example.com"};
        for (String driverEmail : driverEmails) {
            if (userRepository.findByEmail(driverEmail).isEmpty()) {
                String rawPassword = "Driver@123";
                if (driverEmail.endsWith(".com")) {
                    rawPassword = driverEmail.startsWith("rahul") ? "Password@123" : "password123";
                }
                User driverUser = User.builder()
                        .email(driverEmail)
                        .password(passwordEncoder.encode(rawPassword))
                        .fullName("Suresh Reddy (Highway Commuter)")
                        .phone("+91 9876543210")
                        .role(Role.DRIVER)
                        .active(true)
                        .createdAt(Instant.now())
                        .updatedAt(Instant.now())
                        .build();
                driverUser = userRepository.save(driverUser);

                DriverProfile driverProfile = DriverProfile.builder()
                        .userId(driverUser.getId())
                        .vehicles(List.of(
                                Vehicle.builder()
                                        .make("Hyundai")
                                        .model("Creta SX")
                                        .licensePlate("TS 09 EA 4521")
                                        .vehicleType("4-Wheeler Sedan")
                                        .year(2024)
                                        .color("Phantom Black")
                                        .build()
                        ))
                        .build();
                driverProfileRepository.save(driverProfile);
                log.info(">>> Seeded verified DRIVER: {}", driverEmail);
            }
        }

        // 5. Seed Real-World Verified Service Providers around Malla Reddy University (MRU)
        seedRealWorldProviders();
    }

    private void seedRealWorldProviders() {
        List<RealProviderSeed> realProviders = List.of(
            new RealProviderSeed(
                "A To Z Car Care",
                "+91 99899 47567",
                "Opp. Petrol Pump, Bahadurpally, Hyderabad 500043",
                17.5596294, 78.436379,
                List.of("VEHICLE_DIAGNOSTICS"),
                4.4, 33, 0, 350.0, false, 0.90
            ),
            new RealProviderSeed(
                "EZ Drive Car Care",
                "+91 91600 00010",
                "1, Apparel Park Rd, Maisammagudem, Gundlapochampally, Medchal 500100",
                17.5578276, 78.4657093,
                List.of("VEHICLE_DIAGNOSTICS"),
                4.9, 413, 0, 400.0, false, 2.33
            ),
            new RealProviderSeed(
                "Kishor Car Care",
                "+91 99089 50056",
                "D Pocham Pally Road, Gandi Maisamma, Hyderabad 500043",
                17.578582, 78.4216905,
                List.of("VEHICLE_DIAGNOSTICS"),
                5.0, 7, 0, 350.0, false, 3.00
            ),
            new RealProviderSeed(
                "NH Car Care",
                "+91 81213 10046",
                "Gandi Maisamma, Domara Pocham Pally 500043",
                17.5820629, 78.4184306,
                List.of("VEHICLE_DIAGNOSTICS"),
                4.7, 37, 0, 400.0, true, 3.51
            ),
            new RealProviderSeed(
                "Sree Ganesh Key Shop",
                "+91 62819 40121",
                "Doolapally, Kompally, Hyderabad 500100",
                17.5447469, 78.4734666,
                List.of("LOCKOUT_ASSISTANCE"),
                4.9, 49, 0, 300.0, false, 3.66
            ),
            new RealProviderSeed(
                "Viva Towing Service",
                "+91 80743 24758",
                "Plot 458, near New WHSC, Kompally, Dundigal 500100",
                17.5517427, 78.4823093,
                List.of("TOWING"),
                4.9, 47, 0, 1500.0, true, 4.20
            ),
            new RealProviderSeed(
                "Sahil Tyres & Puncture Shop",
                "+91 93811 70986",
                "Aparna Palm Grove flyover, Sai Nagar, Kompally 500100",
                17.550306, 78.4934279,
                List.of("TYRE_ASSISTANCE"),
                5.0, 2, 0, 250.0, true, 5.38
            ),
            new RealProviderSeed(
                "Popular Battery & Radiator Works",
                "+91 98498 18011",
                "Bolarum-Kompally Rd, beside HDFC Bank, Sai Nagar, Kompally 500100",
                17.5425802, 78.4927844,
                List.of("BATTERY_JUMPSTART"),
                4.9, 159, 0, 350.0, false, 5.59
            ),
            new RealProviderSeed(
                "Prince Tyre Agency",
                "+91 93910 08166",
                "Kavi Commercial Complex, Sai Nagar, Kompally 500100",
                17.5424318, 78.493104,
                List.of("TYRE_ASSISTANCE"),
                4.8, 48, 0, 300.0, false, 5.63
            ),
            new RealProviderSeed(
                "AJ6 Motors",
                "+91 73865 94076",
                "Main Road, near Zudio, Ruby Block, Kompally 500100",
                17.538233, 78.4909269,
                List.of("VEHICLE_DIAGNOSTICS", "BATTERY_JUMPSTART"),
                4.9, 328, 0, 450.0, false, 5.63
            ),
            new RealProviderSeed(
                "Vinayaka Tyres (Bridgestone Select)",
                "+91 80 3751 3773",
                "Plot 13, NCL North, NH-44, Satyam Enclave, Kompally 500100",
                17.5254421, 78.4837706,
                List.of("TYRE_ASSISTANCE"),
                4.7, 686, 0, 300.0, false, 5.87
            ),
            new RealProviderSeed(
                "H&S Towing Services",
                "+91 90000 95298",
                "Beside Greens Garage, Bachupally, Hyderabad 500118",
                17.5468756, 78.3897989,
                List.of("TOWING"),
                5.0, 32, 0, 1500.0, true, 6.03
            ),
            new RealProviderSeed(
                "SK Battery Zone",
                "+91 73307 74440",
                "Suchitra Rd, opp. Bharat Petrol Pump, Quthbullapur 500055",
                17.506703, 78.4659904,
                List.of("BATTERY_JUMPSTART"),
                4.9, 131, 0, 350.0, true, 6.61
            ),
            new RealProviderSeed(
                "Limra Towing Service",
                "+91 76749 26656",
                "Medchal Checkpost Rd, Medchal 501401",
                17.6163492, 78.4856589,
                List.of("TOWING"),
                4.7, 58, 0, 1500.0, true, 7.43
            ),
            new RealProviderSeed(
                "Ahmed Towing Service",
                "+91 76749 26657",
                "Medchal Checkpost Rd, Medchal 501401",
                17.616293, 78.4862262,
                List.of("TOWING"),
                4.9, 115, 0, 1500.0, true, 7.46
            ),
            new RealProviderSeed(
                "Auto Diagnosis HYD",
                "+91 80741 84246",
                "Kaithalapur Flyover Rd, KPHB Phase 15, Kukatpally 500085",
                17.4636573, 78.3984282,
                List.of("VEHICLE_DIAGNOSTICS"),
                5.0, 82, 0, 500.0, false, 12.01
            ),
            new RealProviderSeed(
                "Anytime Diesel (Door Delivery)",
                "+91 94944 55555",
                "Fortune Residency, Kavuri Hills, Madhapur 500033",
                17.4391592, 78.3947783,
                List.of("FUEL_DELIVERY"),
                4.9, 929, 0, 300.0, true, 14.68
            )
        );

        for (RealProviderSeed p : realProviders) {
            Optional<ServiceProviderProfile> existing = providerProfileRepository.findByBusinessName(p.businessName());
            if (existing.isPresent()) {
                ServiceProviderProfile profile = existing.get();
                profile.setContactPhone(p.phone());
                profile.setAddress(p.address());
                profile.setLatitude(p.lat());
                profile.setLongitude(p.lon());
                profile.setServicesOffered(p.services());
                profile.setRating(p.rating());
                profile.setTotalRatings(p.totalRatings());
                profile.setTotalJobsCompleted(p.totalJobs());
                profile.setBaseFee(p.baseFee());
                profile.setOpen24x7(p.open24x7());
                profile.setDistanceFromMRUKm(p.distMRU());
                profile.setAvailable(true);
                providerProfileRepository.save(profile);
            } else {
                String emailSlug = p.businessName().toLowerCase().replaceAll("[^a-z0-9]", "") + "@smartroad.ai";
                User providerUser = userRepository.findByEmail(emailSlug).orElseGet(() -> {
                    User u = User.builder()
                            .email(emailSlug)
                            .password(passwordEncoder.encode("Provider@123"))
                            .fullName(p.businessName())
                            .phone(p.phone())
                            .role(Role.SERVICE_PROVIDER)
                            .active(true)
                            .createdAt(Instant.now())
                            .updatedAt(Instant.now())
                            .build();
                    return userRepository.save(u);
                });

                ServiceProviderProfile profile = ServiceProviderProfile.builder()
                        .userId(providerUser.getId())
                        .businessName(p.businessName())
                        .contactPhone(p.phone())
                        .address(p.address())
                        .latitude(p.lat())
                        .longitude(p.lon())
                        .available(true)
                        .servicesOffered(p.services())
                        .rating(p.rating())
                        .totalRatings(p.totalRatings())
                        .totalJobsCompleted(p.totalJobs())
                        .baseFee(p.baseFee())
                        .open24x7(p.open24x7())
                        .distanceFromMRUKm(p.distMRU())
                        .build();
                providerProfileRepository.save(profile);
                log.info(">>> Seeded Real-World Provider: {} ({} km from MRU)", p.businessName(), p.distMRU());
            }
        }
    }

    private record RealProviderSeed(
            String businessName,
            String phone,
            String address,
            double lat,
            double lon,
            List<String> services,
            double rating,
            int totalRatings,
            int totalJobs,
            double baseFee,
            boolean open24x7,
            double distMRU
    ) {}
}
