from datetime import datetime

from pydantic import BaseModel


class OutcomeCreate(BaseModel):
    action_taken: str
    result_rating: int
    outcome_text: str
    lessons_learned: str
    would_repeat: bool


class OutcomeResponse(BaseModel):
    id: int
    user_id: int
    decision_id: int
    action_taken: str
    result_rating: int
    outcome_text: str
    lessons_learned: str
    would_repeat: bool
    created_at: datetime

    model_config = {"from_attributes": True}