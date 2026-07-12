from app.db.base import Base
from app.db.session import engine

# Import every SQLAlchemy model before create_all().
# These imports register the tables with Base.metadata.
from app.models.user import User
from app.models.portfolio import (
    Portfolio,
    PortfolioHolding,
)


def init_db():
    Base.metadata.create_all(
        bind=engine,
    )