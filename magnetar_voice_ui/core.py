import speech_recognition as sr
import os

def transcribe_audio(audio_path: str) -> str:
    """
    Transcribes the audio file at the given path to text using Google Speech Recognition.

    Args:
        audio_path (str): The file path to the audio file.

    Returns:
        str: The transcribed text or an error message.
    """
    if not audio_path:
        return "Error: No audio file provided."

    if not os.path.exists(audio_path):
        return f"Error: Audio file not found at {audio_path}"

    recognizer = sr.Recognizer()
    try:
        # Load audio file
        with sr.AudioFile(audio_path) as source:
            # Record the audio data
            audio_data = recognizer.record(source)
            # Recognize speech using Google Speech Recognition
            text = recognizer.recognize_google(audio_data)
            return text

    except sr.UnknownValueError:
        return "Error: Google Speech Recognition could not understand audio"
    except sr.RequestError as e:
        return f"Error: Could not request results from Google Speech Recognition service; {e}"
    except ValueError as e:
        return f"Error: Invalid audio file or format: {e}"
    except Exception as e:
        return f"Error: An unexpected error occurred: {e}"
