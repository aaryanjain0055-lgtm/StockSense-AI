from datetime import (
    datetime,
    timedelta,
    timezone,
)

from jose import (
    JWTError,
    jwt,
)

from passlib.context import CryptContext


# ============================================================
# JWT CONFIGURATION
# ============================================================

SECRET_KEY = "CHANGE_THIS_TO_A_LONG_RANDOM_SECRET_KEY"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60


# ============================================================
# PASSWORD HASHING
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(
    password: str,
) -> str:

    return pwd_context.hash(
        password,
    )


def verify_password(
    password: str,
    hashed_password: str,
) -> bool:

    return pwd_context.verify(
        password,
        hashed_password,
    )


# ============================================================
# CREATE ACCESS TOKEN
# ============================================================

def create_access_token(
    data: dict,
) -> str:

    payload = data.copy()

    expire = (
        datetime.now(timezone.utc)
        + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
        )
    )

    payload.update(
        {
            "exp": expire,
        }
    )

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return token


# ============================================================
# DECODE ACCESS TOKEN
# ============================================================

def decode_access_token(
    token: str,
) -> dict:

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[
                ALGORITHM,
            ],
        )

        return payload

    except JWTError as exc:

        raise ValueError(
            "Invalid or expired access token."
        ) from exc