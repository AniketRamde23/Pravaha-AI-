package com.smartroad.dto;

import lombok.Data;

@Data
public class BreakdownDiagnoseRequest {
    private String selectedProblem;
    private String symptoms;
    private boolean hasImage;
    private String imageMetadata;
}
