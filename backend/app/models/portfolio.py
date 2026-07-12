from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.base import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        default="My Portfolio",
    )

    description: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    holdings: Mapped[list["PortfolioHolding"]] = relationship(
        "PortfolioHolding",
        back_populates="portfolio",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class PortfolioHolding(Base):
    __tablename__ = "portfolio_holdings"

    __table_args__ = (
        UniqueConstraint(
            "portfolio_id",
            "symbol",
            name="uq_portfolio_symbol",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    portfolio_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey(
            "portfolios.id",
            ondelete="CASCADE",
        ),
        nullable=False,
        index=True,
    )

    symbol: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        index=True,
    )

    company_name: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    quantity: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    average_buy_price: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    purchase_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True,
    )

    notes: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    portfolio: Mapped["Portfolio"] = relationship(
        "Portfolio",
        back_populates="holdings",
    )