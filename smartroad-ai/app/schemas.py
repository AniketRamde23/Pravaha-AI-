from pydantic import BaseModel, Field
from typing import List, Optional

class BreakdownClassifyRequest(BaseModel):
    selected_problem: Optional[str] = None
    symptoms: Optional[str] = None
    has_image: bool = False
    image_metadata: Optional[str] = None

class BreakdownClassifyResponse(BaseModel):
    prediction: str
    confidence: float
    recommended_service: str
    explanation: str

class ProviderCandidate(BaseModel):
    provider_id: str
    business_name: str
    distance_km: float
    rating: float = Field(ge=0.0, le=5.0)
    available: bool = True
    services: List[str] = []
    base_fee: float = 0.0

class ProviderRecommendationRequest(BaseModel):
    breakdown_type: str
    providers: List[ProviderCandidate]

class ProviderRecommendationResponse(BaseModel):
    recommended_provider_id: Optional[str]
    ranked_providers: List[dict]
    model_version: str = "v1.0-weighted-multi-criteria"

class ETAPredictRequest(BaseModel):
    distance_km: float
    service_type: Optional[str] = "TOWING"
    time_of_day_hour: Optional[int] = 12
    traffic_factor: Optional[float] = 1.0

class ETAPredictResponse(BaseModel):
    estimated_minutes: int
    range_text: str
    average_speed_kmh: float
    confidence_interval: str
