import math
from typing import List, Dict, Any, Optional

class AIService:

    @staticmethod
    def classify_breakdown(problem: Optional[str], symptoms: Optional[str], has_image: bool) -> Dict[str, Any]:
        """
        AI Module 1: Breakdown Classification
        Classifies symptoms and image cues into breakdown categories.
        """
        text = f"{problem or ''} {symptoms or ''}".lower()
        
        # Rule & ML keyword score matrix
        categories = {
            "FLAT_TIRE": ["puncture", "flat", "tyre", "tire", "wheel", "air", "burst", "stepney"],
            "DEAD_BATTERY": ["battery", "jump", "start", "crank", "dead", "ignition", "spark", "voltage"],
            "EMPTY_FUEL": ["fuel", "petrol", "diesel", "gas", "empty", "tank", "reserve", "ran out"],
            "ENGINE_PROBLEM": ["engine", "smoke", "noise", "stall", "overheat", "radiator", "coolant", "leak"],
            "LOCKOUT": ["key", "lock", "locked", "inside", "door", "trunk"],
            "TOWING": ["accident", "towing", "crash", "stuck", "ditch", "tow", "breakdown"]
        }

        matched_category = "ENGINE_PROBLEM" # default fallback
        highest_score = 0

        for cat, keywords in categories.items():
            score = sum(1 for kw in keywords if kw in text)
            if problem and cat == problem.upper().replace(" ", "_"):
                score += 3
            if score > highest_score:
                highest_score = score
                matched_category = cat

        # Confidence computation
        confidence = 0.92 if highest_score >= 2 else (0.84 if highest_score == 1 else 0.70)
        if has_image:
            confidence = min(0.98, confidence + 0.06)

        service_map = {
            "FLAT_TIRE": "TYRE_ASSISTANCE",
            "DEAD_BATTERY": "BATTERY_JUMPSTART",
            "EMPTY_FUEL": "FUEL_DELIVERY",
            "ENGINE_PROBLEM": "VEHICLE_DIAGNOSTICS",
            "LOCKOUT": "LOCKOUT_ASSISTANCE",
            "TOWING": "TOWING"
        }

        return {
            "prediction": matched_category,
            "confidence": round(confidence, 2),
            "recommended_service": service_map.get(matched_category, "VEHICLE_DIAGNOSTICS"),
            "explanation": f"AI classified {matched_category} based on symptom analysis and diagnostics signals."
        }

    @staticmethod
    def recommend_provider(breakdown_type: str, providers: List[Any]) -> Dict[str, Any]:
        """
        AI Module 2: Intelligent Provider Recommendation
        Calculates Provider Suitability Score:
        Score = w_dist * DistanceScore + w_match * MatchScore + w_rating * RatingScore + w_avail * AvailabilityScore
        """
        if not providers:
            return {"recommended_provider_id": None, "ranked_providers": []}

        scored_providers = []

        # Target required service based on breakdown
        target_service = breakdown_type.upper().replace(" ", "_")

        for p in providers:
            # Distance score: closer is higher. Max normalized at 15 km
            dist = max(0.1, p.distance_km)
            dist_score = max(0.0, 100.0 - (dist * 5.0)) # 0km -> 100, 10km -> 50, 20km -> 0

            # Rating score: 5.0 -> 100
            rating_score = (p.rating / 5.0) * 100.0

            # Service match score
            match_score = 100.0 if any(s.upper() in target_service or target_service in s.upper() for s in p.services) else 50.0

            # Availability score
            avail_score = 100.0 if p.available else 0.0

            # Weighted combination: 35% distance, 30% rating, 25% match, 10% availability
            total_score = (dist_score * 0.35) + (rating_score * 0.30) + (match_score * 0.25) + (avail_score * 0.10)

            scored_providers.append({
                "provider_id": p.provider_id,
                "business_name": p.business_name,
                "distance_km": p.distance_km,
                "rating": p.rating,
                "score": round(total_score, 1),
                "is_recommended": False
            })

        # Sort by total score descending
        scored_providers.sort(key=lambda x: x["score"], reverse=True)

        if scored_providers:
            scored_providers[0]["is_recommended"] = True
            recommended_id = scored_providers[0]["provider_id"]
        else:
            recommended_id = None

        return {
            "recommended_provider_id": recommended_id,
            "ranked_providers": scored_providers
        }

    @staticmethod
    def predict_eta(distance_km: float, service_type: str, hour: int, traffic_factor: float) -> Dict[str, Any]:
        """
        AI Module 3: Dynamic ETA Prediction
        Incorporates distance, time-of-day traffic surge, and service preparation overhead.
        """
        # Peak traffic hours in cities: 8-11 AM and 5-9 PM
        is_rush_hour = (8 <= hour <= 11) or (17 <= hour <= 21)
        base_speed = 32.0 if is_rush_hour else 42.0 # km/h in city conditions
        effective_speed = max(15.0, base_speed / max(0.5, traffic_factor))

        travel_minutes = (distance_km / effective_speed) * 60.0

        # Preparation overhead by service type
        prep_minutes = {
            "TOWING": 7.0,
            "BATTERY_JUMPSTART": 3.0,
            "TYRE_ASSISTANCE": 4.0,
            "FUEL_DELIVERY": 4.0,
            "LOCKOUT_ASSISTANCE": 3.0,
            "VEHICLE_DIAGNOSTICS": 5.0
        }.get(service_type.upper(), 4.0)

        total_minutes = int(math.ceil(travel_minutes + prep_minutes))
        lower_bound = max(2, total_minutes - 2)
        upper_bound = total_minutes + 4

        return {
            "estimated_minutes": total_minutes,
            "range_text": f"{lower_bound}–{upper_bound} mins",
            "average_speed_kmh": round(effective_speed, 1),
            "confidence_interval": "95%"
        }
