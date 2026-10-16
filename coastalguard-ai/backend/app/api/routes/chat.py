from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse, ChatErrorResponse
from app.services.gemini_service import (
    gemini_service,
    GeminiConfigurationError,
    GeminiAuthenticationError,
    GeminiRateLimitError,
    GeminiModelNotFoundError,
    GeminiAPIError,
)

router = APIRouter(prefix="/chat", tags=["AI Safety Assistant"])


@router.post(
    "",
    response_model=ChatResponse,
    responses={
        400: {"model": ChatErrorResponse, "description": "Validation error or invalid message"},
        401: {"model": ChatErrorResponse, "description": "Invalid or expired Gemini API key"},
        404: {"model": ChatErrorResponse, "description": "Configured Gemini model not found"},
        429: {"model": ChatErrorResponse, "description": "Gemini API rate limit or quota exceeded"},
        502: {"model": ChatErrorResponse, "description": "Upstream Google Gemini API error"},
        503: {"model": ChatErrorResponse, "description": "Gemini API key is unconfigured on the server"},
    },
    summary="Query Marine Safety AI Assistant",
    description="Sends a maritime safety inquiry to Google Gemini and returns an accessible explanation in English or Tamil.",
)
async def chat_safety_assistant(request: ChatRequest):
    """
    Generate an AI response for marine safety inquiries using Google Gemini.
    Validates input parameters and handles credentials, rate limits, and language selection.
    """
    # Validate non-empty message
    cleaned_message = request.message.strip()
    if not cleaned_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "errorCode": "EMPTY_MESSAGE",
                "message": "Message cannot be empty or contain only whitespace.",
            },
        )

    try:
        response = gemini_service.generate_safety_response(
            message=cleaned_message,
            language=request.language,
            context_bulletin=request.context_bulletin,
        )
        return response

    except GeminiConfigurationError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "errorCode": "GEMINI_NOT_CONFIGURED",
                "message": str(e),
                "suggestedAction": "Add your free-tier GEMINI_API_KEY from https://aistudio.google.com/ to backend/.env",
            },
        )

    except GeminiAuthenticationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "status": "error",
                "errorCode": "INVALID_API_KEY",
                "message": str(e),
                "suggestedAction": "Verify that your GEMINI_API_KEY in backend/.env is correct and active.",
            },
        )

    except GeminiRateLimitError as e:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "status": "error",
                "errorCode": "RATE_LIMIT_EXCEEDED",
                "message": str(e),
                "suggestedAction": "Please wait a few moments before retrying.",
            },
        )

    except GeminiModelNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "status": "error",
                "errorCode": "MODEL_NOT_FOUND",
                "message": str(e),
                "suggestedAction": "Update GEMINI_MODEL in backend/.env to an available model (e.g. gemini-2.5-flash).",
            },
        )

    except GeminiAPIError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail={
                "status": "error",
                "errorCode": "UPSTREAM_API_ERROR",
                "message": str(e),
                "suggestedAction": "Please retry in a moment.",
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "errorCode": "INTERNAL_SERVER_ERROR",
                "message": "An internal error occurred while processing your request.",
                "suggestedAction": "Please check backend logs and try again.",
            },
        )
