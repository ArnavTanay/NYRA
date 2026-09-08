import pytest
from unittest.mock import MagicMock, patch

# import your actual function
from backend.services.sentiment_service import classify_emotion  # adjust path if needed

# Test 1: valid emotion is returned correctly
@patch("backend.services.sentiment_service.client.chat.completions.create")
def test_returns_valid_emotion(mock_create):
    mock_create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="Joy"))]
    )
    result = classify_emotion("I'm so happy today!")
    assert result == "joy"

# Test 2: response is always lowercased
@patch("backend.services.sentiment_service.client.chat.completions.create")
def test_response_is_lowercased(mock_create):
    mock_create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="SADNESS"))]
    )
    result = classify_emotion("I feel terrible")
    assert result == "sadness"

# Test 3: whitespace is stripped
@patch("backend.services.sentiment_service.client.chat.completions.create")
def test_whitespace_stripped(mock_create):
    mock_create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="  Fear  "))]
    )
    result = classify_emotion("I'm scared")
    assert result == "fear"

# Test 4: result is always one of the valid emotions
@patch("backend.services.sentiment_service.client.chat.completions.create")
def test_result_in_valid_set(mock_create):
    mock_create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="Anger"))]
    )
    valid_emotions = {"joy", "sadness", "fear", "anger", "loneliness", "numbness"}
    result = classify_emotion("This is infuriating")
    assert result in valid_emotions