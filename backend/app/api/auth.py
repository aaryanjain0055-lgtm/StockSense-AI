from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserCreate, UserLogin
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        created = AuthService.register(
            db=db,
            full_name=user.full_name,
            email=user.email,
            password=user.password,
        )

        return {
            "message": "User registered successfully",
            "user_id": created.id,
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):

    try:

        token = AuthService.login(
            db,
            user.email,
            user.password,
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    except ValueError as e:

        raise HTTPException(
            status_code=401,
            detail=str(e),
        )