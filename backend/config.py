from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_ANON_KEY: str
    BASE_DOMAIN: str = "solaraauto.com.br"
    JWT_SECRET: str
    ENVIRONMENT: str = "development"
    PAGBANK_TOKEN: str = ""
    PAGBANK_API_URL: str = "https://sandbox.api.pagseguro.com"
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    class Config:
        env_file = str(Path(__file__).resolve().parent / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
