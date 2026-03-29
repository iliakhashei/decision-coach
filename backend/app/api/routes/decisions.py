from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.decision import Decision
from app.models.user import User
from app.schemas.decision import DecisionCreate, DecisionResponse

router = APIRouter(prefix="/decisions", tags=["decisions"])


@router.post("", response_model=DecisionResponse)
def create_decision(
    payload: DecisionCreate,
    user_id: int,
    db: Session = Depends(get_db),
) -> Decision:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decision = Decision(
        user_id=user_id,
        title=payload.title,
        raw_input_text=payload.raw_input_text,
        category=payload.category,
        status="draft",
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)
    return decision


@router.get("", response_model=list[DecisionResponse])
def list_decisions(user_id: int, db: Session = Depends(get_db)) -> list[Decision]:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decisions = (
        db.query(Decision)
        .filter(Decision.user_id == user_id)
        .order_by(Decision.created_at.desc())
        .all()
    )
    return decisions


@router.get("/{decision_id}", response_model=DecisionResponse)
def get_decision(decision_id: int, user_id: int, db: Session = Depends(get_db)) -> Decision:
    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id, Decision.user_id == user_id)
        .first()
    )
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")
    return decision