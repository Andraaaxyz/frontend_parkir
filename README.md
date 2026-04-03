# 🚗 Sistem Manajemen Parkir - Frontend

Ini adalah antarmuka pengguna (Frontend) untuk Sistem Manajemen Parkir berbasis web. Aplikasi ini dibangun menggunakan **React.js** dan **Tailwind CSS**. Aplikasi ini terintegrasi dengan backend API (yang dikembangkan dengan Laravel) untuk mengelola data perparkiran secara *real-time*.

## ✨ Fitur Utama

Aplikasi ini menggunakan sistem *Role-Based Access Control* (RBAC) yang membagi fungsionalitas menjadi 3 peran utama (Admin, Petugas, Owner):

*   **🔐 Autentikasi & Otorisasi**
    *   Halaman login dinamis.
    *   Proteksi rute berdasarkan peran pengguna setelah berhasil login (Token Based).

*   **👨‍💻 Panel Admin**
    *   **Dashboard**: Menampilkan ringkasan statistik dan aktivitas terbaru.
    *   **Manajemen Data Master**: Mengelola data Area Parkir, Tarif, dan pengguna (Petugas/Owner).
    *   **Log Aktivitas**: Memantau aktivitas atau log dari sistem.

*   **👮‍♂️ Panel Petugas**
    *   **Dashboard Operasional**: Akses cepat untuk tugas operasional.
    *   **Manajemen Parkir**: Mencatat kendaraan masuk dan menghitung secara otomatis biaya kendaraan keluar.
    *   **Daftar Kendaraan**: Melihat riwayat lengkap kendaraan yang sedang parkir atau yang sudah keluar.

*   **📊 Panel Owner (Pemilik)**
    *   **Dashboard Ringkasan**: Melihat statistik total pendapatan.
    *   **Laporan Pendapatan**: Melihat riwayat transaksi dan detail pendapatan.

## 🛠️ Teknologi yang Digunakan

*   **Framework/Library:** [React.js](https://reactjs.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Data Fetching/HTTP Client:** [Axios](https://axios-http.com/)
*   **Routing / Navigasi:** React State / Components
*   **Ikon / Grafis:** (Disesuaikan dalam project)

## 🚀 Panduan Instalasi & Menjalankan Project secara Lokal

Sebelum memulai, pastikan kamu telah menginstal **Node.js** di sistem yang digunakan.

### 1. Clone Repository
```bash
git clone https://github.com/Andraaaxyz/frontend_parkir.git
cd frontend_parkir
```

### 2. Install Dependensi (Packages)
Jalankan perintah ini untuk mengunduh semua package yang diperlukan oleh React dan Tailwind:
```bash
npm install
```

### 3. Konfigurasi Endpoint Backend
Secara bawaan, aplikasi ini akan mencoba berkomunikasi dengan backend Laravel. Pastikan konfigurasi *Base URL* di folder `src/api` telah mengarah ke server lokal Laravel kamu (Contoh URL bawaan: `http://localhost:8000/api` atau sesuai setup).

### 4. Jalankan Aplikasi di Mode Development
```bash
npm start
```
Browser akan secara otomatis membuka apilkasi di `http://localhost:3000`. Jika kamu melakukan perubahan pada source code, halaman browser akan otomatis dimuat ulang (*hot-reload*).

---

## 📂 Gambaran Struktur Folder

```text
src/
├── api/            # Konfigurasi instance Axios untuk komunikasi HTTP dengan Backend
├── components/     # UI Component Reusable (seperti Card, Modal, Tabel)
├── layouts/        # Layout rangka halaman (Sidebar, Header untuk masing-masing Role)
├── pages/          # Komponen penyusun halaman per-Fitur dan Role
│   ├── admin/      # Kumpulan halaman Panel Admin
│   ├── owner/      # Kumpulan halaman Panel Owner
│   ├── petugas/    # Kumpulan halaman Panel Petugas
│   └── Login.jsx   # Halaman masuk untuk semua Role
├── App.js          # Entry point struktur utama dan logika Role-Routing
└── index.css       # Inject Tailwind CSS (Gaya utama)
```

## 📦 Build untuk Production

Jika project ini sudah selesai dan siap untuk dideploy (misal ke Vercel atau Netlify):
```bash
npm run build
```
Perintah ini akan membuat folder `build` yang berisi file aplikasi yang sudah diminifikasikan dan dioptimasi kinerjanya.
