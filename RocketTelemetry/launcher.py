import os
import sys
import webbrowser
import threading
from django.core.management import execute_from_command_line

def open_browser():
    webbrowser.open("http://127.0.0.1:8001/")

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "RocketTelemetry.settings")

    threading.Timer(1.5, open_browser).start()

    execute_from_command_line([
        "manage.py",
        "runserver",
        "127.0.0.1:8001",
        "--noreload",
    ])