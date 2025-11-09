# Backend - Platform Kuis Edukatif

Backend API untuk platform kuis edukatif menggunakan FastAPI.

## Instalasi

1. Buat virtual environment:
```bash
python -m venv venv
```

2. Aktifkan virtual environment:
- Windows PowerShell: `venv\Scripts\Activate.ps1`
- Windows Command Prompt: `venv\Scripts\activate.bat`
- Linux/Mac: `source venv/bin/activate`

3. Install dependencies (PENTING: pastikan venv aktif sebelum install):
```bash
pip install -r requirements.txt
```

**Catatan:** Pastikan virtual environment sudah aktif sebelum menginstall dependencies. Anda akan melihat `(venv)` di prompt terminal ketika venv aktif.

## Menjalankan Server

**Penting:** Pastikan Anda berada di direktori `backend` dan virtual environment sudah diaktifkan.

### Metode 1: Menggunakan Python module (Direkomendasikan)
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Metode 2: Menggunakan uvicorn langsung
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Metode 3: Menggunakan script (Windows)
```bash
# PowerShell
.\run_server.ps1

# atau Command Prompt
run_server.bat
```

Server akan berjalan di `http://localhost:8000`

**Catatan:** Jika Anda mendapatkan error "Could not import module 'main'", pastikan:
1. Anda berada di direktori `backend` (dimana file `main.py` berada)
2. Virtual environment sudah diaktifkan
3. Gunakan `python -m uvicorn` instead of hanya `uvicorn`

## API Documentation

Setelah server berjalan, dokumentasi API dapat diakses di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login dan mendapatkan token JWT

### Questions (Admin only)
- `GET /api/questions/` - Dapatkan semua pertanyaan
- `GET /api/questions/{id}` - Dapatkan pertanyaan spesifik
- `POST /api/questions/` - Buat pertanyaan baru
- `PUT /api/questions/{id}` - Update pertanyaan
- `DELETE /api/questions/{id}` - Hapus pertanyaan

### Quizzes (Students)
- `GET /api/quizzes/subjects` - Dapatkan semua mata pelajaran
- `GET /api/quizzes/subjects/{id}/questions` - Dapatkan pertanyaan per mata pelajaran
- `POST /api/quizzes/submit` - Submit jawaban
- `GET /api/quizzes/submissions` - Dapatkan semua submission saya

### Admin
- `GET /api/admin/students` - Dapatkan semua siswa
- `GET /api/admin/scores` - Dapatkan semua skor siswa
- `GET /api/admin/subjects` - Dapatkan semua mata pelajaran
- `GET /api/admin/subjects/{id}` - Dapatkan mata pelajaran spesifik
- `POST /api/admin/subjects` - Buat mata pelajaran baru
- `PUT /api/admin/subjects/{id}` - Update mata pelajaran
- `DELETE /api/admin/subjects/{id}` - Hapus mata pelajaran
- `POST /api/admin/feedback` - Berikan feedback ke siswa

### Students
- `GET /api/students/progress` - Dapatkan progress belajar
- `GET /api/students/feedback` - Dapatkan feedback dari admin

