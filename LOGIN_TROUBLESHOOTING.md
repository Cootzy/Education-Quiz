# Troubleshooting Login Issues

## Masalah Umum dan Solusi

### 1. Error: "Tidak dapat terhubung ke server"

**Penyebab:** Backend server tidak berjalan atau tidak dapat diakses.

**Solusi:**
1. Pastikan backend server berjalan:
   ```bash
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
2. Verifikasi server berjalan di `http://localhost:8000/api/health`
3. Pastikan frontend proxy dikonfigurasi dengan benar di `vite.config.js`

### 2. Error: "Username atau password salah"

**Penyebab:**
- Username atau password tidak sesuai
- User tidak ada di database
- Password hash tidak match

**Solusi:**
1. Gunakan akun default:
   - Admin: `admin` / `admin123`
   - Siswa: `siswa1` / `siswa123`
2. Atau daftar akun baru melalui halaman register
3. Jika perlu reset database:
   ```bash
   cd backend
   rm quiz_platform.db  # Hapus database lama
   python init_db.py    # Buat database baru
   ```

### 3. Error: CORS Policy

**Penyebab:** Frontend dan backend berjalan di port berbeda dan CORS tidak dikonfigurasi.

**Solusi:**
1. Pastikan backend CORS middleware mengizinkan origin frontend:
   ```python
   # backend/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],  # Port frontend
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
2. Pastikan frontend menggunakan proxy di `vite.config.js`:
   ```javascript
   proxy: {
     '/api': {
       target: 'http://localhost:8000',
       changeOrigin: true,
     }
   }
   ```

### 4. Error: Network Error atau Timeout

**Penyebab:** 
- Backend server tidak merespons
- Firewall memblokir koneksi
- Port 8000 digunakan oleh aplikasi lain

**Solusi:**
1. Cek apakah port 8000 tersedia:
   ```bash
   # Windows
   netstat -ano | findstr :8000
   
   # Linux/Mac
   lsof -i :8000
   ```
2. Jika port digunakan, kill proses atau gunakan port lain
3. Pastikan firewall tidak memblokir koneksi

### 5. Error: "Invalid token" setelah login

**Penyebab:** Token JWT tidak valid atau expired.

**Solusi:**
1. Clear localStorage:
   ```javascript
   localStorage.clear()
   ```
2. Login lagi
3. Pastikan token expiration time cukup (default: 30 menit)

### 6. Error: Database locked atau SQLite error

**Penyebab:** Database SQLite sedang digunakan oleh proses lain.

**Solusi:**
1. Pastikan hanya satu instance backend server yang berjalan
2. Restart backend server
3. Jika masalah berlanjut, hapus database dan buat ulang:
   ```bash
   rm quiz_platform.db
   python init_db.py
   ```

## Verifikasi Setup

### Checklist Backend:
- [ ] Backend server berjalan di port 8000
- [ ] Database diinisialisasi (`quiz_platform.db` ada)
- [ ] Akun admin dan siswa default tersedia
- [ ] CORS middleware dikonfigurasi dengan benar
- [ ] Dependencies terinstall di virtual environment

### Checklist Frontend:
- [ ] Frontend server berjalan di port 3000
- [ ] Proxy dikonfigurasi di `vite.config.js`
- [ ] Axios dikonfigurasi dengan benar
- [ ] Browser console tidak menampilkan error CORS

## Testing Login

### Test dengan curl:
```bash
# Test login endpoint
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

### Test dengan browser:
1. Buka `http://localhost:8000/docs`
2. Gunakan Swagger UI untuk test endpoint `/api/auth/login`
3. Masukkan username dan password
4. Lihat response

## Log dan Debugging

### Backend Logs:
Jalankan server dengan verbose logging:
```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 --log-level debug
```

### Frontend Console:
Buka browser developer tools (F12) dan cek:
- Console tab untuk error JavaScript
- Network tab untuk melihat request/response
- Application tab untuk melihat localStorage

### Common Error Messages:

1. **"Username atau password salah"**
   - Check username dan password
   - Verify user exists in database
   - Check password hash

2. **"Tidak dapat terhubung ke server"**
   - Backend server tidak berjalan
   - Wrong port atau URL
   - Network issue

3. **"CORS policy"**
   - CORS middleware tidak dikonfigurasi
   - Wrong origin in CORS settings

4. **"Internal server error"**
   - Check backend logs
   - Database issue
   - Code error

## Masih Bermasalah?

Jika masalah masih terjadi:
1. Cek backend logs untuk error detail
2. Cek browser console untuk error frontend
3. Verifikasi semua checklist di atas
4. Coba restart kedua server (backend dan frontend)
5. Clear browser cache dan localStorage

