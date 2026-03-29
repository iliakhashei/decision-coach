from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.decision import Decision
from app.models.outcome import Outcome
from app.models.user import User
from app.schemas.outcome import OutcomeCreate, OutcomeResponse

router = APIRouter(tags=["outcomes"])


@router.post("/decisions/{decision_id}/outcome", response_model=OutcomeResponse)
def create_outcome(
    decision_id: int,
    payload: OutcomeCreate,
    user_id: int,
    db: Session = Depends(get_db),
) -> OutcomeResponse:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id, Decision.user_id == user_id)
        .first()
    )
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")

    outcome = Outcome(
        user_id=user_id,
        decision_id=decision_id,
        action_taken=payload.action_taken,
        result_rating=payload.result_rating,
        outcome_text=payload.outcome_text,
        lessons_learned=payload.lessons_learned,
        would_repeat=payload.would_repeat,
    )

    db.add(outcome)
    db.commit()
    db.refresh(outcome)

    return OutcomeResponse.model_validate(outcome)


@router.get("/decisions/{decision_id}/outcomes", response_model=list[OutcomeResponse])
def list_outcomes(
    decision_id: int,
    user_id: int,
    db: Session = Depends(get_db),
) -> list[OutcomeResponse]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id, Decision.user_id == user_id)
        .first()
    )
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")

    outcomes = (
        db.query(Outcome)
        .filter(Outcome.decision_id == decision_id, Outcome.user_id == user_id)
        .order_by(Outcome.created_at.desc())
        .all()
    )

    return [OutcomeResponse.model_validate(outcome) for outcome in outcomes]