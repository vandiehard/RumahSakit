# Klinik Sehat - Hospital Management System

Klinik Sehat adalah aplikasi manajemen rumah sakit berbasis web yang modern dan responsif. Aplikasi ini dirancang untuk memudahkan administrasi rumah sakit, pendaftaran pasien, penugasan tenaga medis, serta pencatatan rekam medis dan pembayaran.

## ✨ Fitur Utama

- **Landing Page Interaktif**: Pasien dapat melihat jadwal hari ini dan mendaftarkan diri secara mandiri.
- **Role-Based Access Control**:
  - **Admin**: Mengelola pendaftaran, menugaskan dokter/perawat ke pasien, mengelola stok obat, ruangan, penyakit, tindakan, dan pembayaran.
  - **Dokter**: Melihat daftar pasien yang ditugaskan dan mengisi rekam medis serta resep.
  - **Perawat**: Melihat jadwal tugas dan informasi pasien.
- **Manajemen Tugas Real-Time**: Dashboard admin yang interaktif untuk memantau ketersediaan staf medis.
- **Tema Gelap/Terang**: Dukungan dark mode yang nyaman bagi mata.

## 🛠️ Teknologi yang Digunakan

- **Frontend**: React.js, Vite, Tailwind CSS, Lucide React, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MySQL.

---

## 🚀 Panduan Instalasi (Local)

Ikuti langkah-langkah berikut untuk menjalankan project ini di laptop Anda:

### 1. Prasyarat
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Rekomendasi versi LTS)
- [XAMPP](https://www.apachefriends.org/) (Untuk MySQL)
- Git (Opsional, untuk clone)

### 2. Persiapan Database
1. Buka XAMPP Control Panel dan jalankan **Apache** dan **MySQL**.
2. Buka browser dan akses `http://localhost/phpmyadmin`.
3. Buat database baru dengan nama `rumah_sakit`.
4. Pilih database `rumah_sakit` tersebut, lalu pilih tab **Import**.
5. Pilih file `backend/database.sql` yang ada di folder project ini, lalu klik **Go**.

### 3. Instalasi Backend
1. Buka terminal (CMD/PowerShell) di folder `backend`.
2. Jalankan perintah untuk menginstal dependencies:
   ```bash
   npm install
   ```
3. (Opsional) Jika ingin menambah data dummy tambahan, jalankan:
   ```bash
   node insert_dummy.js
   ```
4. Jalankan server backend:
   ```bash
   npm start
   ```
   *Backend akan berjalan di `http://localhost:5000`*

### 4. Instalasi Frontend
1. Buka terminal baru di folder `frontend`.
2. Jalankan perintah untuk menginstal dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di `http://localhost:5173` (atau port lain yang muncul di terminal)*

---

## 🔑 Informasi Login (Default)

Anda dapat masuk ke sistem menggunakan akun berikut:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Dokter** | `dokter_andi` | `dokter123` |
| **Perawat** | `perawat_ani` | `perawat123` |

---

## 📁 Struktur Project

- `backend/`: Berisi server API, konfigurasi database, dan script dummy data.
- `frontend/`: Berisi kode React, komponen UI, dan styling Tailwind.
- `database.sql`: Schema database MySQL lengkap dengan data awal.

---

&copy; 2026 Klinik Sehat. Dikembangkan untuk efisiensi layanan kesehatan.
