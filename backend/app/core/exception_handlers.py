import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


logger = logging.getLogger("stocksense")


def register_exception_handlers(
    app: FastAPI,
) -> None:

    @app.exception_handler(
        StarletteHTTPException
    )
    async def http_exception_handler(
        request: Request,
        exc: StarletteHTTPException,
    ):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": {
                    "type": "HTTP_ERROR",
                    "message": str(exc.detail),
                    "status_code": exc.status_code,
                    "path": request.url.path,
                },
            },
        )


    @app.exception_handler(
        RequestValidationError
    )
    async def validation_exception_handler(
        request: Request,
        exc: RequestValidationError,
    ):
        return JSONResponse(
            status_code=422,
            content={
                "success": False,
                "error": {
                    "type": "VALIDATION_ERROR",
                    "message": (
                        "Request validation failed."
                    ),
                    "status_code": 422,
                    "path": request.url.path,
                    "details": exc.errors(),
                },
            },
        )


    @app.exception_handler(Exception)
    async def unexpected_exception_handler(
        request: Request,
        exc: Exception,
    ):
        logger.exception(
            "Unhandled exception on %s %s",
            request.method,
            request.url.path,
            exc_info=exc,
        )

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": {
                    "type": "INTERNAL_SERVER_ERROR",
                    "message": (
                        "An unexpected server error occurred."
                    ),
                    "status_code": 500,
                    "path": request.url.path,
                },
            },
        )