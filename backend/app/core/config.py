from typing import Optional

from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
   model_config = SettingsConfigDict(env_file=".env", extra="ignore")

   PROJECT_NAME: str = "RAG Q&A Chatbot"
   GOOGLE_API_KEY: Optional[str] = None
   CHROMA_PERSIS_DIR: str = "./chroma_persist"
   EMBEDDING_MODEL_NAME: str = "models/gemini-embedding-001"
   LLM_MODEL_NAME: str = "gemini-2.5-flash"
   allowed_origins: list[str] = ["https://localhost:3000"]

settings = Settings()