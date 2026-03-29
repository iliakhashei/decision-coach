import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.decision import Decision
from app.models.user import User
from app.schemas.question import QuestionsResponse
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.llm_service import LLMService

router = APIRouter(tags=["analyses"])


@router.post("/decisions/{decision_id}/questions", response_model=QuestionsResponse)
def generate_questions(
    decision_id: int,
    user_id: int,
    db: Session = Depends(get_db),
) -> QuestionsResponse:
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

    llm_service = LLMService()
    questions = llm_service.generate_questions_from_raw(decision.raw_input_text)

    return QuestionsResponse(**questions)


@router.post("/decisions/{decision_id}/recommendation", response_model=RecommendationResponse)
def generate_recommendation(
    decision_id: int,
    payload: RecommendationRequest,
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    user = db.query(User).filter(User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decision = (
        db.query(Decision)
        .filter(Decision.id == decision_id, Decision.user_id == payload.user_id)
        .first()
    )
    if not decision:
        raise HTTPException(status_code=404, detail="Decision not found")

    llm_service = LLMService()
    recommendation = llm_service.generate_recommendation_from_raw(
        raw_input_text=decision.raw_input_text,
        answers=payload.answers,
    )

    decision.answers_json = json.dumps(payload.answers)
    decision.recommendation_json = json.dumps(recommendation)
    decision.status = "recommended"

    db.add(decision)
    db.commit()
    db.refresh(decision)

    return RecommendationResponse(**recommendation)