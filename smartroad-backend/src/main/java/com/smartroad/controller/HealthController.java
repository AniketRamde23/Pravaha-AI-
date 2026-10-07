package com.smartroad.controller;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private final MongoTemplate mongoTemplate;
    private final WebClient aiWebClient;

    @Autowired
    public HealthController(MongoTemplate mongoTemplate, WebClient aiWebClient) {
        this.mongoTemplate = mongoTemplate;
        this.aiWebClient = aiWebClient;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("application", "SmartRoad AI - Main Backend");
        response.put("status", "UP");
        response.put("timestamp", Instant.now().toString());

        // Check MongoDB connectivity
        Map<String, Object> mongoStatus = new HashMap<>();
        try {
            Document pingResult = mongoTemplate.executeCommand("{ ping: 1 }");
            mongoStatus.put("status", "UP");
            mongoStatus.put("database", mongoTemplate.getDb().getName());
            mongoStatus.put("details", pingResult);
        } catch (Exception ex) {
            mongoStatus.put("status", "DOWN");
            mongoStatus.put("error", ex.getMessage());
        }
        response.put("mongodb", mongoStatus);

        // Check Python FastAPI AI microservice connectivity
        Map<String, Object> aiStatus = new HashMap<>();
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> aiResponse = aiWebClient.get()
                    .uri("/health")
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();
            aiStatus.put("status", "UP");
            aiStatus.put("details", aiResponse);
        } catch (Exception ex) {
            aiStatus.put("status", "UNREACHABLE_OR_OFFLINE");
            aiStatus.put("message", "Python AI microservice not reachable yet: " + ex.getMessage());
        }
        response.put("ai_microservice", aiStatus);

        return ResponseEntity.ok(response);
    }
}
