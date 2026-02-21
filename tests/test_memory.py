import pytest
import os
import shutil
from magnetar.memory.chroma import ChromaMemoryStore

@pytest.fixture
def memory_store(tmp_path):
    store = ChromaMemoryStore(collection_name="test_memory", persist_directory=str(tmp_path))
    yield store
    # Cleanup
    store.close()
    if os.path.exists(str(tmp_path)):
        try:
            shutil.rmtree(str(tmp_path))
        except OSError:
            pass  # tmp_path is handled by pytest anyway

def test_add_query_memory(memory_store):
    # Add memory
    content = "The user's favorite color is blue."
    result = memory_store.add_memory(content, metadata={"topic": "preference"})
    assert result.success is True
    assert "id" in result.data
    mem_id = result.data["id"]

    # Query memory
    query = "What is the favorite color?"
    query_result = memory_store.query_memory(query)
    assert query_result.success is True
    assert len(query_result.data) > 0
    assert "blue" in query_result.data[0]["content"]

    # Delete memory
    del_result = memory_store.delete_memory(mem_id)
    assert del_result.success is True

    # Query again
    query_result_after = memory_store.query_memory(query)
    assert query_result_after.success is True
    # Should be empty or different if persistent
    assert len(query_result_after.data) == 0
