"""Application configuration from environment variables."""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://localhost:5432/lacityscape"
    socrata_app_token: str = ""
    cors_origins: list[str] = [
        "http://localhost:3000",
        "https://lacityscape.com",
        "https://www.lacityscape.com",
    ]
    api_page_size: int = 50
    api_max_page_size: int = 500

    class Config:
        env_file = ".env"


settings = Settings()
