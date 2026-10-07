from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import (
    BreakdownClassifyRequest,
    BreakdownClassifyResponse,
    ProviderRecommendationRequest,
    ProviderRecommendationResponse,
    ETAPredictRequest,
    ETAPredictResponse,
)
from app.services import AIService

app = FastAPI(
    title="Pravaha AI - Intelligent Dispatch & Diagnostic Microservice",
    description="Python FastAPI service handling vehicle breakdown diagnosis, intelligent provider ranking, and ETA predictions.",
    version="1.0.0"
)

# Enable CORS for Spring Boot backend and React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "service": "Pravaha AI Microservice",
        "tagline": "MOVEMENT • SUPPORT • SAFETY",
        "status": "ONLINE",
        "endpoints": [
            "/health",
            "/ai/breakdown/classify",
            "/ai/provider/recommend",
            "/ai/eta/predict"
        ]
    }

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "service": "pravaha-ai",
        "version": "1.0.0"
    }

@app.post("/ai/breakdown/classify", response_model=BreakdownClassifyResponse)
def classify_breakdown(req: BreakdownClassifyRequest):
    result = AIService.classify_breakdown(
        problem=req.selected_problem,
        symptoms=req.symptoms,
        has_image=req.has_image
    )
    return result

@app.post("/ai/provider/recommend", response_model=ProviderRecommendationResponse)
def recommend_provider(req: ProviderRecommendationRequest):
    result = AIService.recommend_provider(
        breakdown_type=req.breakdown_type,
        providers=req.providers
    )
    return result

@app.post("/ai/eta/predict", response_model=ETAPredictResponse)
def predict_eta(req: ETAPredictRequest):
    result = AIService.predict_eta(
        distance_km=req.distance_km,
        service_type=req.service_type or "TOWING",
        hour=req.time_of_day_hour or 12,
        traffic_factor=req.traffic_factor or 1.0
    )
    return result
