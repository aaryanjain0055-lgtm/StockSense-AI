from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def test_connection():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
        return True

from typing import Generator


def get_db() -> Generator:
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()    