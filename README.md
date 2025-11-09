# Platform Kuis Edukatif

Platform interaktif berbasis kuis gamifikasi untuk meningkatkan motivasi belajar siswa. Dibangun dengan React (frontend) dan FastAPI (backend).

## 🎯 Fitur Utama

### Untuk Siswa:
- ✅ Registrasi dan login
- ✅ Pilih mata pelajaran
- ✅ Bermain kuis dengan berbagai tipe pertanyaan:
  - Pilihan Ganda (Multiple Choice)
  - Drag & Drop
  - Isian (Fill in the Blank)
- ✅ Melihat skor dan progress belajar
- ✅ Review jawaban yang benar
- ✅ Menerima feedback dari guru

### Untuk Guru (Admin):
- ✅ Login sebagai admin
- ✅ Kelola pertanyaan (buat, edit, hapus)
- ✅ Lihat semua skor siswa
- ✅ Berikan feedback kepada siswa
- ✅ Kelola mata pelajaran

## 🛠️ Teknologi yang Digunakan

### Backend:
- FastAPI (Python)
- SQLite (Database)
- JWT (Authentication)
- SQLAlchemy (ORM)

### Frontend:
- React 18
- Vite
- TailwindCSS
- Framer Motion (Animations)
- React Router

## 📦 Instalasi

### Prerequisites:
- Python 3.8+
- Node.js 16+
- npm atau yarn

### Backend Setup:

1. Masuk ke folder backend:
```bash
cd backend
```

2. Buat virtual environment:
```bash
python -m venv venv
```

3. Aktifkan virtual environment:
- Windows: `venv\Scripts\activate`
- Linux/Mac: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Inisialisasi database dengan data awal:
```bash
python init_db.py
```

6. Jalankan server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server akan berjalan di `http://localhost:8000`

### Frontend Setup:

1. Masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 🔐 Akun Default

Setelah menjalankan `init_db.py`, akun default yang tersedia:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Siswa:**
- Username: `siswa1`
- Password: `siswa123`

## 📚 API Documentation

Setelah backend berjalan, dokumentasi API dapat diakses di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🎮 Cara Menggunakan

### Sebagai Siswa:
1. Daftar akun baru atau login dengan akun siswa
2. Pilih mata pelajaran yang ingin dipelajari
3. Jawab pertanyaan kuis
4. Lihat skor dan progress di halaman Progress

### Sebagai Admin:
1. Login dengan akun admin
2. Kelola pertanyaan di halaman "Kelola Pertanyaan"
3. Lihat skor semua siswa di halaman "Lihat Skor"
4. Berikan feedback kepada siswa

## 📁 Struktur Proyek

```
.
├── backend/
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── models.py     # Database models
│   │   ├── schemas.py    # Pydantic schemas
│   │   ├── auth.py       # Authentication logic
│   │   └── database.py   # Database configuration
│   ├── main.py           # FastAPI app
│   ├── requirements.txt  # Python dependencies
│   └── init_db.py        # Database initialization script
│
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   ├── pages/        # Page components
    │   ├── contexts/     # React contexts
    │   ├── services/     # API services
    │   └── App.jsx      # Main app component
    ├── package.json      # Node dependencies
    └── vite.config.js    # Vite configuration
```

## 🌐 Bahasa

Semua teks UI, pesan, dan label ditampilkan dalam Bahasa Indonesia sesuai dengan target pengguna (siswa dan guru Indonesia).

## 🚀 Production Deployment

### Backend:
1. Gunakan PostgreSQL sebagai database (bukan SQLite)
2. Set environment variables untuk SECRET_KEY
3. Gunakan gunicorn atau uvicorn dengan workers
4. Setup reverse proxy (nginx)

### Frontend:
1. Build production:
```bash
npm run build
```
2. Deploy folder `dist` ke static hosting atau CDN

## 📝 License

MIT License

## 👥 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

