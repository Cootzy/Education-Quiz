# Setup Guide - Platform Kuis Edukatif Backend

## Langkah-langkah Setup

### 1. Buat Virtual Environment
```bash
python -m venv venv
```

### 2. Aktifkan Virtual Environment

**Windows PowerShell:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows Command Prompt:**
```cmd
venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

**Verifikasi:** Setelah mengaktifkan venv, Anda akan melihat `(venv)` di awal prompt terminal.

### 3. Install Dependencies

**PENTING:** Pastikan virtual environment aktif sebelum menjalankan perintah ini!

```bash
pip install -r requirements.txt
```

Atau jika venv tidak aktif, gunakan:
```bash
venv\Scripts\python.exe -m pip install -r requirements.txt
```

### 4. Inisialisasi Database

```bash
python init_db.py
```

Atau jika venv tidak aktif:
```bash
venv\Scripts\python.exe init_db.py
```

Ini akan membuat:
- Database SQLite (`quiz_platform.db`)
- Akun admin default (username: `admin`, password: `admin123`)
- Akun siswa contoh (username: `siswa1`, password: `siswa123`)
- Beberapa mata pelajaran dan pertanyaan contoh

### 5. Jalankan Server

**Metode 1: Menggunakan Python module (Direkomendasikan)**
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Metode 2: Menggunakan script**
```bash
# PowerShell
.\run_server.ps1

# Command Prompt
run_server.bat
```

**Metode 3: Langsung dengan uvicorn**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Verifikasi Server Berjalan

Buka browser dan kunjungi:
- API Health Check: `http://localhost:8000/api/health`
- API Documentation: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Troubleshooting

### Error: "No module named uvicorn"

**Penyebab:** Dependencies tidak terinstall di virtual environment.

**Solusi:**
1. Pastikan virtual environment aktif
2. Install dependencies lagi:
   ```bash
   pip install -r requirements.txt
   ```

### Error: "Could not import module 'main'"

**Penyebab:** Tidak berada di direktori yang benar atau venv tidak aktif.

**Solusi:**
1. Pastikan Anda berada di direktori `backend`
2. Pastikan virtual environment aktif
3. Gunakan `python -m uvicorn` instead of hanya `uvicorn`

### Virtual Environment Tidak Aktif

**Tanda-tanda:**
- Tidak ada `(venv)` di prompt
- Package terinstall di global Python, bukan di venv

**Solusi:**
1. Aktifkan venv lagi:
   ```bash
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```
2. Install dependencies lagi setelah venv aktif

## Checklist Setup

- [ ] Virtual environment dibuat
- [ ] Virtual environment aktif (lihat `(venv)` di prompt)
- [ ] Dependencies terinstall (`pip list` harus menampilkan fastapi, uvicorn, dll)
- [ ] Database diinisialisasi (`quiz_platform.db` file ada)
- [ ] Server bisa dijalankan tanpa error
- [ ] API health check berhasil di `http://localhost:8000/api/health`

## Akun Default

Setelah menjalankan `init_db.py`:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Siswa:**
- Username: `siswa1`
- Password: `siswa123`

## Next Steps

Setelah backend berjalan, lanjutkan dengan setup frontend:
1. Buka terminal baru
2. Masuk ke folder `frontend`
3. Jalankan `npm install`
4. Jalankan `npm run dev`

Frontend akan berjalan di `http://localhost:3000`

