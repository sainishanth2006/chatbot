import os
import tempfile
from typing import List
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from fastapi import UploadFile

class DocumentLoader:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size, 
            chunk_overlap=chunk_overlap
        )
    async def process_upload(self, file: UploadFile, session_id:str) -> List[str]:
        ext = os.path.splitext(file.filename)[1].lower()
        with tempfile.NamedTemporaryFile(delete = False) as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_file_path = temp_file.name
        try:
            if ext == ".pdf":
                loader = PyPDFLoader(temp_file_path)
            elif ext == ".txt":
                loader = TextLoader(temp_file_path)
            else:
                raise ValueError("Unsupported file type. Only PDF and TXT are supported.")
            docs = loader.load()
            for doc in docs:
                doc.metadata["source"] = file.filename
                doc.metadata['session_id'] = session_id
            chunks = self.splitter.split_documents(docs)
            return chunks
        finally:
            if os.path.exists(temp_file_path):
                os.remove(temp_file_path)
            

            
