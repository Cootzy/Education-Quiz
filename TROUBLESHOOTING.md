# Troubleshooting Guide

## Error: "Could not import module 'main'"

### Penyebab:
Uvicorn tidak dapat menemukan module `main.py` karena:
1. Tidak berada di direktori yang benar
2. Virtual environment tidak aktif
3. Python path tidak dikonfigurasi dengan benar

### Solusi:

#### 1. Pastikan Anda berada di direktori backend
```bash
cd backend
```

#### 2. Aktifkan virtual environment
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows Command Prompt
venv\Scripts\activate.bat

# Linux/Mac
source venv/bin/activate
```

#### 3. Gunakan `python -m uvicorn` (Direkomendasikan)
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Ini lebih reliable karena Python akan mencari module dari current directory.

#### 4. Atau gunakan script yang sudah disediakan
```bash
# Windows PowerShell
.\run_server.ps1

# Windows Command Prompt
run_server.bat
```

## Error: "ModuleNotFoundError: No module named 'email_validator'"

### Solusi:
```bash
pip install email-validator
```

Atau install semua dependencies:
```bash
pip install -r requirements.txt
```

## Error: Database initialization error

### Solusi:
1. Hapus file database yang ada:
```bash
rm quiz_platform.db  # Linux/Mac
del quiz_platform.db  # Windows
```

2. Jalankan init script lagi:
```bash
python init_db.py
```

## Error: Port already in use

### Solusi:
1. Cari proses yang menggunakan port 8000:
```bash
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -i :8000
```

2. Kill proses tersebut atau gunakan port lain:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

## Error: CORS issues di frontend

### Solusi:
Pastikan backend berjalan di port 8000 dan frontend di port 3000. 
Jika menggunakan port berbeda, update CORS settings di `backend/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update port jika berbeda
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Masalah lainnya

### Pastikan semua dependencies terinstall:
```bash
pip install -r requirements.txt
```

### Pastikan Python version:
```bash
python --version
```
Minimal Python 3.8+, direkomendasikan Python 3.11 atau 3.12.

### Clear Python cache:
```bash
# Hapus __pycache__ folders
find . -type d -name __pycache__ -exec rm -r {} +  # Linux/Mac
Get-ChildItem -Path . -Include __pycache__ -Recurse -Force | Remove-Item -Recurse -Force  # Windows PowerShell
```

