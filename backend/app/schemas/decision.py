from datetime import datetime

from pydantic import BaseModel


class DecisionCreate(BaseModel):
    title: str
    raw_input_text: str
    category: str | None = None


class DecisionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    raw_input_text: str
    category: str | None
    status: str
    answers_json: str | None
    recommendation_json: str | None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}