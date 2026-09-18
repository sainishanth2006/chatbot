import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from app.core.config import settings

class VectorStoreManager:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(
            google_api_key=settings.GOOGLE_API_KEY,
            model=settings.EMBEDDING_MODEL_NAME
        )
        self.persist_directory = settings.CHROMA_PERSIS_DIR
        self.vector_store = None

    def get_vector_store(self):
        if self.vector_store is None:
            self.vector_store = Chroma(
                embedding_function=self.embeddings,
                persist_directory=self.persist_directory
            )
        return self.vector_store
    def add_documents(self, chunks):
        vector_store = self.get_vector_store()
        vector_store.add_documents(chunks)
vector_store_manager = VectorStoreManager()

