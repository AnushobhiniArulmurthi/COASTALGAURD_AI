import logging
from datetime import datetime, timezone
from typing import Optional
from google import genai
from google.genai import types
from google.genai.errors import APIError, ClientError, ServerError
from app.core.config import settings
from app.schemas.chat import ChatResponse

logger = logging.getLogger("coastalguard.gemini")

# System prompt defining marine safety assistant behavior
SYSTEM_INSTRUCTION_EN = """You are the CoastalGuard AI Marine Safety Information Assistant.
Your core mission is to explain marine terminology, navigational weather concepts, and official warnings in clear, accessible language for artisanal fishermen, trawler operators, and coastal communities.

STRICT OPERATIONAL GUIDELINES:
1. LANGUAGE:
   - Respond in clear, accessible, and concise English.
2. EXPLAINER ROLE:
   - You are strictly an informational explainer. You do NOT issue official government warnings or navigation clearances.
   - Explain complex meteorological and maritime terms (such as wave swell, knots, squalls, barometric pressure, gale warnings) in simple, practical language.
3. VERIFIED DATA PRINCIPLE:
   - Never claim to know current live weather, sea conditions, official warnings, or boat locations unless those details are explicitly provided in the prompt context.
   - Do NOT invent forecasts, wave heights, port statuses, or emergency announcements.
4. SEA SAFETY DETERMINATION:
   - If the user asks whether it is safe to go to sea, set sail, or venture out, and verified real-time official bulletins are not provided, you MUST explicitly state that you cannot determine real-time sea safety.
   - Instruct the user to consult local harbour masters, port signal flags, Fisheries Department officials, and official radio broadcasts on VHF Channel 16.
5. RESPECT OFFICIAL ADVISORIES:
   - Never override official marine advisories or present your answers as legal or official navigation clearance.
   - Always prioritize human life and vessel safety. Keep responses concise, practical, and calm."""

SYSTEM_INSTRUCTION_TA = """நீங்கள் CoastalGuard AI கடல்சார் பாதுகாப்பு தகவல் உதவியாளர்.
கடல் வானிலை கலைச்சொற்கள், அதிகாரப்பூர்வ எச்சரிக்கைகள் மற்றும் பாதுகாப்பு வழிகாட்டுதல்களை எளிய, நேரடியான மற்றும் மரியாதையான தமிழில் மீனவ நண்பர்களுக்கு விளக்குவதே உங்கள் பணி.

கண்டிப்பான வழிகாட்டுதல்கள்:
1. மொழி:
   - உங்கள் பதிலை இயல்பான, பிழையற்ற, எளிய மற்றும் மரியாதையான தமிழில் மட்டுமே வழங்கவும்.
2. விளக்கமளிப்பாளர் பொறுப்பு:
   - நீங்கள் தகவல்களை விளக்குபவர் மட்டுமே. அதிகாரப்பூர்வ அரசு எச்சரிக்கைகளையோ அல்லது கடல் பயண அனுமதியையோ நீங்கள் வழங்க முடியாது.
   - அலை வீச்சு (swell), காற்றின் வேகம் (knots), காற்றழுத்தம், சூறைக்காற்று போன்ற கடினமான வானிலைச் சொற்களை எளிய தமிழில் புரிய வைக்கவும்.
3. உண்மைத் தகவல் கொள்கை:
   - பயனரின் கேள்வியிலோ அல்லது கொடுக்கப்பட்ட குறிப்பிலோ அதிகாரப்பூர்வ தகவல் இல்லாதபோது, தற்போதைய நேரடி வானிலை அல்லது படகுகளின் இருப்பிடத்தை தாங்களாகவே கற்பனை செய்து கூறக்கூடாது.
   - கற்பனையான எச்சரிக்கைகளையோ, துறைமுக நிலவரங்களையோ உருவாக்காதீர்கள்.
4. கடலுக்குச் செல்வது குறித்த பாதுகாப்பு:
   - கடலுக்குச் செல்லலாமா என்று பயனர் கேட்டால், நேரடி அதிகாரப்பூர்வ தகவல் இல்லாத பட்சத்தில், "தற்போதைய உடனடி கடல் பாதுகாப்பை என்னால் உறுதியாகக் கூற இயலாது" என்பதை தெளிவாகத் தெரிவிக்கவும்.
   - உள்ளூர் மீன்பிடித் துறைமுக அதிகாரிகள், துறைமுக எச்சரிக்கைக் கொடிகள் மற்றும் VHF அலைவரிசை 16-ல் ஒலிபரப்பப்படும் அதிகாரப்பூர்வ வானிலை அறிவிப்புகளைப் பின்பற்றுமாறு வழிகாட்டவும்.
5. அதிகாரப்பூர்வ வழிகாட்டுதலுக்கு முன்னுரிமை:
   - அதிகாரப்பூர்வ கடல் எச்சரிக்கைகளை எப்போதும் மதிக்கவும். மீனவர்களின் உயிர் மற்றும் படகுகளின் பாதுகாப்பிற்கே முதலிடம்.
   - பதில்கள் சுருக்கமாகவும், பயனுள்ளதாகவும், எளிதில் புரியும் வகையிலும் இருக்க வேண்டும்."""


class GeminiConfigurationError(Exception):
    """Raised when Gemini API key is missing, empty, or unconfigured."""
    pass


class GeminiAuthenticationError(Exception):
    """Raised when Gemini API key is invalid or unauthorized."""
    pass


class GeminiRateLimitError(Exception):
    """Raised when Gemini API quota or rate limit is reached."""
    pass


class GeminiModelNotFoundError(Exception):
    """Raised when the specified Gemini model is not found or unsupported."""
    pass


class GeminiAPIError(Exception):
    """Raised when Gemini API returns an upstream error."""
    pass


class GeminiService:
    """Service wrapper for Google Gemini API integration using the official google-genai SDK."""

    def __init__(self):
        self._client: Optional[genai.Client] = None

    def _get_client(self) -> genai.Client:
        """Initialize or return the Google Gen AI client with validated credentials."""
        api_key = settings.GEMINI_API_KEY.strip() if settings.GEMINI_API_KEY else ""

        if not api_key or api_key == "your-gemini-api-key-placeholder":
            raise GeminiConfigurationError(
                "Gemini API key is not configured. Please add your GEMINI_API_KEY to the backend/.env file "
                "to enable live AI responses."
            )

        # Instantiate client with explicit key
        try:
            return genai.Client(api_key=api_key)
        except Exception as e:
            logger.error("Failed to initialize Google GenAI Client: %s", str(e))
            raise GeminiConfigurationError("Failed to initialize Google GenAI client with provided key.")

    def generate_safety_response(
        self,
        message: str,
        language: str = "en",
        context_bulletin: Optional[str] = None,
    ) -> ChatResponse:
        """
        Generate a marine safety response from Google Gemini model.
        """
        client = self._get_client()
        model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"

        # Select system instruction based on language
        system_instruction = SYSTEM_INSTRUCTION_TA if language == "ta" else SYSTEM_INSTRUCTION_EN

        # Construct prompt content with optional bulletin context
        prompt_parts = []
        if context_bulletin:
            if language == "ta":
                prompt_parts.append(f"[பயனர் கவனிக்கும் அதிகாரப்பூர்வ அறிவிப்பு குறிப்பு]:\n{context_bulletin}\n")
            else:
                prompt_parts.append(f"[Context - Official Bulletin Under Inspection]:\n{context_bulletin}\n")

        prompt_parts.append(f"User Query: {message}")
        full_content = "\n".join(prompt_parts)

        try:
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.3,
                max_output_tokens=1000,
            )

            response = client.models.generate_content(
                model=model_name,
                contents=full_content,
                config=config,
            )

            reply_text = response.text or ""
            if not reply_text:
                reply_text = (
                    "தகவலை தற்போது பெற முடியவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
                    if language == "ta"
                    else "Unable to generate a safety explanation at this time. Please verify with local harbour authorities."
                )

            return ChatResponse(
                status="success",
                reply=reply_text.strip(),
                language=language,
                model=model_name,
                timestamp=datetime.now(timezone.utc).isoformat(),
                is_live_ai=True,
            )

        except APIError as e:
            logger.error("Gemini API Error (%s): %s", getattr(e, "code", "Unknown"), str(e))
            code = getattr(e, "code", 500)
            msg = str(e).lower()

            if code == 401 or "api_key_invalid" in msg or "invalid api key" in msg or "unauthorized" in msg:
                raise GeminiAuthenticationError(
                    "The configured Gemini API key is invalid or expired. "
                    "Please check your GEMINI_API_KEY in backend/.env."
                )
            elif code == 429 or "resource_exhausted" in msg or "quota" in msg:
                raise GeminiRateLimitError(
                    "Gemini API rate limit or quota exceeded. Please wait a few moments before trying again, "
                    "or review your free-tier quota at Google AI Studio."
                )
            elif code == 404 or "not found" in msg or "models/" in msg:
                raise GeminiModelNotFoundError(
                    f"The configured model '{model_name}' was not found or is unavailable for this key. "
                    f"You can change GEMINI_MODEL in backend/.env to another available model (e.g. gemini-2.5-flash)."
                )
            else:
                raise GeminiAPIError(
                    f"Google Gemini service responded with an error (HTTP {code}). Please try again shortly."
                )

        except (ClientError, ServerError) as e:
            logger.error("GenAI Client/Server Error: %s", str(e))
            raise GeminiAPIError("Communication error with Google AI services. Please try again.")

        except Exception as e:
            logger.error("Unexpected error in Gemini service: %s", str(e))
            raise GeminiAPIError("An unexpected error occurred while communicating with the AI service.")


gemini_service = GeminiService()
