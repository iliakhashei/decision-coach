import json
from pathlib import Path

from openai import OpenAI

from app.core.config import settings


class LLMService:
    def __init__(self) -> None:
        if not settings.openai_api_key:
            raise ValueError("OPENAI_API_KEY is not set in environment variables.")
        self.client = OpenAI(api_key=settings.openai_api_key)

    def _load_prompt(self, filename: str) -> str:
        prompt_path = Path(__file__).resolve().parent.parent / "prompts" / filename
        return prompt_path.read_text(encoding="utf-8")

    def structure_decision(self, raw_input_text: str) -> dict:
        system_prompt = self._load_prompt("structure_decision.txt")

        response = self.client.chat.completions.create(
            model="gpt-4.1-mini",
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user",
                    "content": f"User decision:\n\n{raw_input_text}",
                },
            ],
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("LLM returned empty content.")

        return json.loads(content)