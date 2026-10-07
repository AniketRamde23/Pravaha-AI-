package com.smartroad.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    private String make;
    private String model;
    private String licensePlate;
    private String vehicleType; // 2-Wheeler, 4-Wheeler Sedan, 4-Wheeler SUV, Commercial
    private int year;
    private String color;
}
