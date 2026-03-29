# Decision Coach

Decision Coach is an AI-powered decision support system that helps users think through complex choices, receive structured recommendations, log outcomes, and identify behavioral patterns over time.

## Features

- Create and store decisions
- Generate clarifying questions with an LLM
- Produce structured recommendations
- Save answers and recommendations for later review
- Log real outcomes
- Detect recurring behavioral patterns
- Browse decision history and details
- Basic user authentication

## Stack

- **Frontend:** Next.js, React, TypeScript
- **Backend:** FastAPI, SQLAlchemy, Pydantic
- **Database:** SQLite
- **LLM runtime:** Ollama / local model setup

## How it works

1. User registers and logs in
2. User submits a decision
3. The app generates clarifying questions
4. The user answers them
5. The system produces a recommendation
6. The user logs the outcome later
7. The app analyzes past outcomes to infer patterns

## Notes

This is an MVP focused on the full decision-support loop:
decision → clarification → recommendation → outcome → pattern analysis.