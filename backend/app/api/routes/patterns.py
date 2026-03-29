from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.outcome import Outcome
from app.models.user import User
from app.schemas.pattern import PatternsResponse
from app.services.llm_service import LLMService

router = APIRouter(tags=["patterns"])


@router.get("/patterns", response_model=PatternsResponse)
def get_patterns(user_id: int, db: Session = Depends(get_db)) -> PatternsResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    outcomes = (
        db.query(Outcome)
        .filter(Outcome.user_id == user_id)
        .order_by(Outcome.created_at.asc())
        .all()
    )

    if not outcomes:
        raise HTTPException(status_code=404, detail="No outcomes found")

    outcome_payload = [
        {
            "user_id": outcome.user_id,
            "decision_id": outcome.decision_id,
            "action_taken": outcome.action_taken,
            "result_rating": outcome.result_rating,
            "outcome_text": outcome.outcome_text,
            "lessons_learned": outcome.lessons_learned,
            "would_repeat": outcome.would_repeat,
            "created_at": outcome.created_at.isoformat(),
        }
        for outcome in outcomes
    ]

    llm_service = LLMService()
    patterns = llm_service.generate_patterns(outcome_payload)

    normalized_patterns = []
    for pattern in patterns.get("patterns", []):
        evidence = [str(item) for item in pattern.get("evidence", []) if str(item).strip()]

        if not evidence:
            evidence = ["Limited explicit evidence was returned by the model for this pattern."]

        normalized_patterns.append(
            {
                "pattern_type": str(pattern.get("pattern_type", "unknown_pattern")),
                "description": str(pattern.get("description", "")),
                "confidence": str(pattern.get("confidence", "low")),
                "evidence": evidence,
            }
        )

    return PatternsResponse(patterns=normalized_patterns)