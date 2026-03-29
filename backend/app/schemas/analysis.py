from pydantic import BaseModel


class StructuredDecisionResponse(BaseModel):
    decision_summary: str
    category: str
    objective: str
    options: list[str]
    constraints: list[str]
    assumptions: list[str]
    missing_information: list[str]
    urgency_level: str
    emotional_state: str