import uuid
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.api.client import SharedSystemClient
from magnetar.memory.store import MemoryStore, MemoryResult

class ChromaMemoryStore(MemoryStore):
    """Memory store implementation using ChromaDB."""

    def __init__(self, collection_name: str = "magnetar_memory", persist_directory: str = "./chroma_db"):
        self.client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.client.get_or_create_collection(name=collection_name)

    def add_memory(self, content: str, metadata: Dict[str, Any] = None) -> MemoryResult:
        try:
            mem_id = str(uuid.uuid4())
            if metadata is None:
                metadata = {}

            # ChromaDB requires documents, metadatas, ids.
            # Note: Chroma uses a default embedding function if none provided.
            self.collection.add(
                documents=[content],
                metadatas=[metadata],
                ids=[mem_id]
            )
            return MemoryResult(success=True, data={"id": mem_id})
        except Exception as e:
            return MemoryResult(success=False, error=str(e))

    def query_memory(self, query: str, n_results: int = 5) -> MemoryResult:
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results
            )

            # Chroma returns dict with lists. We want to structure it.
            # results['documents'][0] is the list of documents for the first query.
            # results['ids'][0] is the list of ids.
            # results['metadatas'][0] is the list of metadatas.

            formatted_results = []
            if results['ids'] and results['ids'][0]:
                for i in range(len(results['ids'][0])):
                    formatted_results.append({
                        "id": results['ids'][0][i],
                        "content": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i],
                        "distance": results['distances'][0][i] if 'distances' in results and results['distances'] else None
                    })

            return MemoryResult(success=True, data=formatted_results)
        except Exception as e:
            return MemoryResult(success=False, error=str(e))

    def delete_memory(self, memory_id: str) -> MemoryResult:
        try:
            self.collection.delete(ids=[memory_id])
            return MemoryResult(success=True)
        except Exception as e:
            return MemoryResult(success=False, error=str(e))

    def close(self) -> None:
        """Release resources held by the Chroma client/system cache."""
        try:
            SharedSystemClient.clear_system_cache()
        except Exception:
            pass

        self.client = None
        self.collection = None
