from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import get_db
from app.models.user import User

from app.schemas.portfolio import (
    PortfolioCreate,
    PortfolioHoldingCreate,
    PortfolioHoldingUpdate,
    PortfolioUpdate,
)

from app.services.portfolio_service import (
    PortfolioService,
)


router = APIRouter(
    prefix="/portfolio",
    tags=["Portfolio"],
)


# ============================================================
# CREATE PORTFOLIO
# ============================================================

@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_portfolio(
    payload: PortfolioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        portfolio = (
            PortfolioService.create_portfolio(
                db=db,
                user_id=current_user.id,
                payload=payload,
            )
        )

        return portfolio

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


# ============================================================
# LIST LOGGED-IN USER PORTFOLIOS
# ============================================================

@router.get("")
def list_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    return PortfolioService.list_portfolios(
        db=db,
        user_id=current_user.id,
    )


# ============================================================
# GET SINGLE PORTFOLIO
# ============================================================

@router.get("/{portfolio_id}")
def get_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return PortfolioService.get_portfolio(
            db=db,
            user_id=current_user.id,
            portfolio_id=portfolio_id,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


# ============================================================
# UPDATE PORTFOLIO
# ============================================================

@router.patch("/{portfolio_id}")
def update_portfolio(
    portfolio_id: int,
    payload: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return PortfolioService.update_portfolio(
            db=db,
            user_id=current_user.id,
            portfolio_id=portfolio_id,
            payload=payload,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


# ============================================================
# DELETE PORTFOLIO
# ============================================================

@router.delete(
    "/{portfolio_id}",
    status_code=status.HTTP_200_OK,
)
def delete_portfolio(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        PortfolioService.delete_portfolio(
            db=db,
            user_id=current_user.id,
            portfolio_id=portfolio_id,
        )

        return {
            "message":
                "Portfolio deleted successfully"
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


# ============================================================
# ADD HOLDING
# ============================================================

@router.post(
    "/{portfolio_id}/holdings",
    status_code=status.HTTP_201_CREATED,
)
def add_holding(
    portfolio_id: int,
    payload: PortfolioHoldingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return PortfolioService.add_holding(
            db=db,
            user_id=current_user.id,
            portfolio_id=portfolio_id,
            payload=payload,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc


# ============================================================
# UPDATE HOLDING
# ============================================================

@router.patch(
    "/{portfolio_id}/holdings/{holding_id}"
)
def update_holding(
    portfolio_id: int,
    holding_id: int,
    payload: PortfolioHoldingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return PortfolioService.update_holding(
            db=db,
            user_id=current_user.id,
            portfolio_id=portfolio_id,
            holding_id=holding_id,
            payload=payload,
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


# ============================================================
# DELETE HOLDING
# ============================================================

@router.delete(
    "/{portfolio_id}/holdings/{holding_id}"
)
def delete_holding(
    portfolio_id: int,
    holding_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        PortfolioService.delete_holding(
            db=db,
            user_id=current_user.id,
            portfolio_id=portfolio_id,
            holding_id=holding_id,
        )

        return {
            "message":
                "Holding deleted successfully"
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc


# ============================================================
# PORTFOLIO LIVE ANALYTICS
# ============================================================

@router.get(
    "/{portfolio_id}/analytics/live"
)
def get_portfolio_analytics(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        get_current_user
    ),
):
    try:
        return (
            PortfolioService
            .get_portfolio_analytics(
                db=db,
                user_id=current_user.id,
                portfolio_id=portfolio_id,
            )
        )

    except ValueError as exc:
        raise HTTPException(
            status_code=404,
            detail=str(exc),
        ) from exc