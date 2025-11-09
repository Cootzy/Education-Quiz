@echo off
REM Change to backend directory
cd /d %~dp0

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Run uvicorn server using Python from venv
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

