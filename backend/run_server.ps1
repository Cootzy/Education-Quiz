# PowerShell script to run the server
# Ensure we're in the backend directory
Set-Location $PSScriptRoot

# Activate virtual environment
& ".\venv\Scripts\Activate.ps1"

# Run uvicorn server using Python from venv
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

