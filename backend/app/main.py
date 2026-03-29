from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.analyses import router as analyses_router
from app.api.routes.auth import router as auth_router
from app.api.routes.decisions import router as decisions_router
from app.api.routes.outcomes import router as outcomes_router
from app.api.routes.patterns import router as patterns_router
from app.core.config import settings
from app.core.database import Base, engine
import app.models  # noqa: F401


Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(decisions_router)
app.include_router(analyses_router)
app.include_router(outcomes_router)
app.include_router(patterns_router)


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "Decision Coach API is running"}