package com.smartroad.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreakdownDiagnoseResponse {
    private String prediction;
    private Double confidence;
    private String recommendedService;
    private String explanation;
}
