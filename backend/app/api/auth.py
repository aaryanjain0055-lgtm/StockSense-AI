from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
)
from app.services.auth_service import AuthService
from app.core.security import decode_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# ============================================================
# BEARER TOKEN SECURITY
# ============================================================

security = HTTPBearer(
    auto_error=False,
)


# ============================================================
# CURRENT AUTHENTICATED USER
# ============================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:

    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )

    token = credentials.credentials

    try:
        payload = decode_access_token(token)

    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    user_id = payload.get("sub")


    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    try:
        user_id_int = int(user_id)

    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user identifier in token.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    user = (
        db.query(User)
        .filter(
            User.id == user_id_int,
        )
        .first()
    )


    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive.",
        )


    return user


# ============================================================
# REGISTER
# ============================================================

@router.post(
    "/register",
    status_code=status.HTTP_201_CREATED,
)
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
            "user": {
                "id": created.id,
                "full_name": created.full_name,
                "email": created.email,
                "role": created.role,
                "is_active": created.is_active,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


# ============================================================
# LOGIN
# ============================================================

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db),
):

    try:
        token = AuthService.login(
            db=db,
            email=user.email,
            password=user.password,
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


# ============================================================
# CURRENT USER PROFILE
# ============================================================

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user),
):

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active,
        "created_at": current_user.created_at,
        "updated_at": current_user.updated_at,
    }