from pydantic import BaseModel


class QuestionsResponse(BaseModel):
    questions: list[str]