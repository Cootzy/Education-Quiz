# Quick Start Guide

Panduan cepat untuk menjalankan Platform Kuis Edukatif.

## 🚀 Langkah Cepat

### 1. Setup Backend

```bash
# Masuk ke folder backend
cd backend

# Buat virtual environment
python -m venv venv

# Aktifkan virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Inisialisasi database dengan data awal
python init_db.py

# Jalankan server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend akan berjalan di: `http://localhost:8000`

### 2. Setup Frontend

Buka terminal baru:

```bash
# Masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di: `http://localhost:3000`

## 🔑 Akun Default

Setelah menjalankan `init_db.py`, gunakan akun berikut:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Siswa:**
- Username: `siswa1`
- Password: `siswa123`

## 📝 Cara Menggunakan

### Sebagai Siswa:
1. Buka `http://localhost:3000`
2. Login dengan akun siswa atau daftar akun baru
3. Pilih mata pelajaran
4. Jawab pertanyaan kuis
5. Lihat progress di halaman "Progress"

### Sebagai Admin:
1. Login dengan akun admin
2. Klik "Kelola Pertanyaan" untuk menambah/edit/hapus pertanyaan
3. Klik "Lihat Skor" untuk melihat skor semua siswa
4. Berikan feedback kepada siswa

## 🎯 Fitur Kuis

Platform mendukung 3 jenis pertanyaan:

1. **Pilihan Ganda**: Pilih satu jawaban dari beberapa opsi
2. **Drag & Drop**: Urutkan item dengan drag and drop
3. **Isian**: Isi bagian yang kosong dalam kalimat

## 🐛 Troubleshooting

### Backend tidak bisa dijalankan:
- Pastikan Python 3.8+ terinstall
- Pastikan virtual environment sudah diaktifkan
- Cek apakah port 8000 sudah digunakan

### Frontend tidak bisa dijalankan:
- Pastikan Node.js 16+ terinstall
- Pastikan `npm install` sudah dijalankan
- Cek apakah port 3000 sudah digunakan

### Database error:
- Hapus file `quiz_platform.db` dan jalankan `init_db.py` lagi

## 📚 Dokumentasi API

Setelah backend berjalan, akses dokumentasi API di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 💡 Tips

- Gunakan browser modern (Chrome, Firefox, Edge)
- Pastikan backend berjalan sebelum membuka frontend
- Semua teks UI dalam Bahasa Indonesia

