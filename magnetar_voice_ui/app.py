import gradio as gr
import os
import sys

# Ensure current directory is in path so we can import core
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)

from core import transcribe_audio

def process_audio(audio_path):
    """Processes the audio file for transcription."""
    if audio_path is None:
        return "Please provide audio."
    return transcribe_audio(audio_path)

if __name__ == "__main__":
    demo = gr.Interface(
        fn=process_audio,
        inputs=gr.Audio(sources=["microphone", "upload"], type="filepath", label="Input Audio"),
        outputs=gr.Textbox(label="Transcription"),
        title="Magnetar Voice UI",
        description="Speak or upload an audio file to transcribe it using Google Speech Recognition.",
        flagging_mode="never"
    )
    # Launch with share=False for local sandbox, or could be True if internet allowed but safer False.
    # We just need it to run.
    print("Launching Magnetar Voice UI...")
    demo.launch(server_name="0.0.0.0", server_port=7860)
