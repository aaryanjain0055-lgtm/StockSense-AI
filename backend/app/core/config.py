from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    APP_NAME: str = "StockSense AI"
    APP_VERSION: str = "1.0.0"

    DEBUG: bool = True

    HOST: str = "127.0.0.1"
    PORT: int = 8000

    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()