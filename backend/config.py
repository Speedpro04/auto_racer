from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    SUPABASE_ANON_KEY: str
    BASE_DOMAIN: str = "solaraauto.com.br"
    JWT_SECRET: str
    ENVIRONMENT: str = "development"
    PAGBANK_TOKEN: str = ""
    PAGBANK_API_URL: str = "https://sandbox.api.pagseguro.com"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
