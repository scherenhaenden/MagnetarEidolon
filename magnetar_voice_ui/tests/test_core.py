import unittest
from unittest.mock import MagicMock, patch
import os
import sys

# Add parent directory to path to import core
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from core import transcribe_audio
import speech_recognition as sr

class TestTranscribeAudio(unittest.TestCase):

    @patch('core.sr.Recognizer')
    @patch('core.sr.AudioFile')
    @patch('os.path.exists')
    def test_transcribe_success(self, mock_exists, mock_audio_file, mock_recognizer_class):
        # Setup
        mock_exists.return_value = True

        mock_recognizer_instance = mock_recognizer_class.return_value
        mock_recognizer_instance.recognize_google.return_value = "Hello World"

        # AudioFile context manager
        mock_audio_source = MagicMock()
        mock_audio_file.return_value.__enter__.return_value = mock_audio_source

        # Execute
        result = transcribe_audio("dummy.wav")

        # Verify
        self.assertEqual(result, "Hello World")
        mock_recognizer_instance.record.assert_called_with(mock_audio_source)
        mock_recognizer_instance.recognize_google.assert_called()

    def test_no_audio_path(self):
        result = transcribe_audio(None)
        self.assertEqual(result, "Error: No audio file provided.")

    @patch('os.path.exists')
    def test_file_not_found(self, mock_exists):
        """Test handling of a nonexistent audio file."""
        mock_exists.return_value = False
        result = transcribe_audio("nonexistent.wav")
        self.assertIn("Error: Audio file not found", result)

if __name__ == '__main__':
    unittest.main()
