from dataclasses import dataclass

from langchain_core.language_models.chat_models import BaseChatModel

from app.config import Settings


@dataclass(frozen=True)
class GeminiModelConfig:
    model: str
    role: str


def build_gemini_model_configs(settings: Settings) -> list[GeminiModelConfig]:
    models = [GeminiModelConfig(settings.gemini_model, "primary")]
    if settings.gemini_fallback_model and settings.gemini_fallback_model != settings.gemini_model:
        models.append(GeminiModelConfig(settings.gemini_fallback_model, "fallback"))
    return models


def create_chat_models(settings: Settings) -> list[BaseChatModel]:
    if not settings.gemini_api_key:
        return []

    from langchain_google_genai import ChatGoogleGenerativeAI

    return [
        ChatGoogleGenerativeAI(
            model=config.model,
            google_api_key=settings.gemini_api_key,
            temperature=settings.gemini_temperature,
            max_output_tokens=settings.gemini_max_output_tokens,
        )
        for config in build_gemini_model_configs(settings)
    ]


def create_chat_model(settings: Settings) -> BaseChatModel | None:
    models = create_chat_models(settings)
    return models[0] if models else None
