from pydantic import BaseModel


class PatternItem(BaseModel):
    pattern_type: str
    description: str
    confidence: str
    evidence: list[str]


class PatternsResponse(BaseModel):
    patterns: list[PatternItem]