from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    user_id: int
    answers: list[str]


class RecommendationResponse(BaseModel):
    summary: str
    recommendation: str
    key_risks: list[str]
    confidence: str
    reasoning: list[str]