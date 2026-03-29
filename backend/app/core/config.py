from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Decision Coach API"
    database_url: str = "sqlite:///./decision_coach.db"
    ollama_model: str = "qwen3:8b"
    ollama_base_url: str = "http://localhost:11434/v1"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()