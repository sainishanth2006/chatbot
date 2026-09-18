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
        self.prompt = ChatPromptTemplate.from_template(
            """You are a precise corporate assistant. Answer the user question strictly using the provided context.
If the answer is not contained in the context, respond with "I cannot find this information in the uploaded documents."

Context:
{context}

Question: {question}"""
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








