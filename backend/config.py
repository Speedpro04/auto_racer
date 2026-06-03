from pydantic import Field, AliasChoices
from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    SUPABASE_URL: str
    # Aceita tanto os nomes internos quanto os nomes oficiais do painel Supabase.
    SUPABASE_SERVICE_KEY: str = Field(
        validation_alias=AliasChoices("SUPABASE_SERVICE_KEY", "SUPABASE_SERVICE_ROLE")
    )
    SUPABASE_ANON_KEY: str = Field(
        validation_alias=AliasChoices("SUPABASE_ANON_KEY", "SUPABASE_ANON_PUBLIC")
    )
    JWT_SECRET: str = Field(
        validation_alias=AliasChoices("JWT_SECRET", "SUPABASE_JWT_SECRET")
    )
    BASE_DOMAIN: str = "autoracer.shop"
    ENVIRONMENT: str = "development"
    PAGBANK_TOKEN: str = ""
    PAGBANK_API_URL: str = "https://sandbox.api.pagseguro.com"
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    # E-mails autorizados como super admin (separados por vírgula)
    SUPERADMIN_EMAILS: str = ""

    class Config:
        env_file = str(Path(__file__).resolve().parent / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
