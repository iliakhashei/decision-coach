import json
import re
from pathlib import Path
from typing import Any

from openai import OpenAI

from app.core.config import settings


class LLMService:
    def __init__(self) -> None:
        self.model = settings.ollama_model
        self.client = OpenAI(
            base_url=settings.ollama_base_url,
            api_key="ollama",
        )

    def _load_prompt(self, filename: str) -> str:
        prompt_path = Path(__file__).resolve().parent.parent / "prompts" / filename
        return prompt_path.read_text(encoding="utf-8")

    def _extract_json(self, content: str) -> dict[str, Any]:
        content = content.strip()

        if content.startswith("```"):
            lines = content.splitlines()
            if len(lines) >= 3:
                content = "\n".join(lines[1:-1]).strip()

        start = content.find("{")
        if start == -1:
            raise ValueError(f"Could not find JSON start in model response: {content}")

        json_text = content[start:].strip()

        try:
            return json.loads(json_text)
        except json.JSONDecodeError:
            pass

        if json_text.count("{") > json_text.count("}"):
            json_text += "}"

        while json_text.count("[") > json_text.count("]"):
            json_text += "]"

        while json_text.count("{") > json_text.count("}"):
            json_text += "}"

        try:
            return json.loads(json_text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Could not parse JSON from model response: {content}") from e

    def _extract_questions_fallback(self, content: str) -> dict[str, Any]:
        matches = re.findall(r'"([^"\n]+)"', content)
        questions = [m for m in matches if "questions" not in m.lower()]

        if not questions:
            raise ValueError(f"Could not extract questions from model response: {content}")

        return {"questions": questions[:3]}

    def _extract_patterns_fallback(self, content: str) -> dict[str, Any]:
        quoted = re.findall(r'"([^"\n]+)"', content)
        useful = [q for q in quoted if q.lower() not in {"patterns", "pattern_type", "description", "confidence", "evidence"}]

        if not useful:
            raise ValueError(f"Could not extract patterns from model response: {content}")

        return {
            "patterns": [
                {
                    "pattern_type": "emerging_pattern",
                    "description": useful[0],
                    "confidence": "low",
                    "evidence": useful[1:4] if len(useful) > 1 else ["Limited parsed evidence from local model output"],
                }
            ]
        }

    def generate_questions_from_raw(self, raw_input_text: str) -> dict[str, Any]:
        system_prompt = self._load_prompt("clarifying_questions.txt")

        response = self.client.chat.completions.create(
            model=self.model,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt + "\n\nReturn only valid JSON. No markdown fences. No explanation."
                },
                {
                    "role": "user",
                    "content": f"User decision:\n\n{raw_input_text}",
                },
            ],
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("LLM returned empty content.")

        try:
            return self._extract_json(content)
        except ValueError:
            return self._extract_questions_fallback(content)

    def generate_recommendation_from_raw(
        self,
        raw_input_text: str,
        answers: list[str],
    ) -> dict[str, Any]:
        system_prompt = self._load_prompt("recommendation.txt")

        payload = {
            "decision": raw_input_text,
            "answers": answers,
        }

        response = self.client.chat.completions.create(
            model=self.model,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt + "\n\nReturn only valid JSON. No markdown fences. No explanation."
                },
                {
                    "role": "user",
                    "content": json.dumps(payload, indent=2),
                },
            ],
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("LLM returned empty content.")

        return self._extract_json(content)

    def generate_patterns(self, outcomes: list[dict[str, Any]]) -> dict[str, Any]:
        system_prompt = self._load_prompt("patterns.txt")

        payload = {
            "outcomes": outcomes,
        }

        response = self.client.chat.completions.create(
            model=self.model,
            temperature=0,
            messages=[
                {
                    "role": "system",
                    "content": system_prompt + "\n\nReturn only valid JSON. No markdown fences. No explanation."
                },
                {
                    "role": "user",
                    "content": json.dumps(payload, indent=2),
                },
            ],
        )

        content = response.choices[0].message.content
        if not content:
            raise ValueError("LLM returned empty content.")

        try:
            return self._extract_json(content)
        except ValueError:
            return self._extract_patterns_fallback(content)