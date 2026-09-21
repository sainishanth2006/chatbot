from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from app.core.config import settings

class RAGService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            google_api_key = settings.GOOGLE_API_KEY,
            model = settings.LLM_MODEL_NAME
        )
        self.prompt = self.prompt = ChatPromptTemplate.from_template(
    """You are a helpful document assistant.

Use the uploaded documents as your primary source of truth.

Guidelines:
- Answer clearly and conversationally.
- For questions answered by the documents, provide a concise answer and mention relevant details.
- Do not invent facts or claim that the documents say something they do not say.
- If the documents only partially answer the question, explain what is known and what is missing.
- If the question is ambiguous, ask a short clarifying question.
- If the question is unrelated to the documents, briefly say that it is outside the uploaded material, then provide general help when appropriate.
- If no relevant information is available, say so naturally instead of repeating a fixed sentence.
- Use bullet points or numbered steps when they improve readability.
- Keep answers concise unless the user asks for more detail.
- When useful, refer to the source document by name.

Uploaded document context:
{context}

User question:
{question}

Answer:"""
)

        self.vector_store = None

    def answer_question(self, question: str, vector_store) -> dict:
        retriever = vector_store.as_retriever(search_kwargs={"k": 3})
        docs = retriever.invoke(question)

        if not docs:
            return {"answer": "I cannot find this information in the uploaded documents.", "sources": []}
        context_str = "\n\n".join(
            f"[Source:{doc.metadata.get('source', 'Unknown')}] \n {doc.page_content}" for doc in docs
        )
        chain = self.prompt | self.llm | StrOutputParser()

        result = chain.invoke({"context": context_str, "question": question})
        sources = list(set([doc.metadata.get("source", "Unknown") for doc in docs]))

        return {"answer": result, "sources": sources}

rag_service = RAGService()








