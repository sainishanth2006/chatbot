from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from typing import List

from app.schemas.rag import ChatRequest, ChatResponse, UploadResponse
from app.services.rag_chain import rag_service
from app.services.document_loader import DocumentLoader
from app.services.vector_store import vector_store_manager

router = APIRouter()

@router.post("/upload", response_model=UploadResponse)
async def upload_file(files: List[UploadFile] = File(...)):
    all_chunks = []
    for file in files:
        if not file.filename.lower().endswith(".pdf") :
            raise HTTPException(status_code=400, detail="Unsupported file type. Only PDF and TXT are supported.")
        chunks = await DocumentLoader().process_upload(file)
        all_chunks.extend(chunks)

    if not all_chunks:
        raise HTTPException(status_code=400, detail="No valid documents were uploaded.")

    vector_store_manager.add_documents(all_chunks)

    return UploadResponse(message="Files uploaded and processed successfully.", 
                          status="success", 
                      chunks_created=len(all_chunks)
                    )
@router.post("/chat", response_model = ChatResponse)
async def chat(request: ChatRequest):
    vector_store = vector_store_manager.get_vector_store()
    output = rag_service.answer_question(question=request.question, vector_store=vector_store)
    return ChatResponse(answer = output["answer"],sources = output["sources"])

@router.get("/health")
async def health_check():
    return {"status": "ok"}