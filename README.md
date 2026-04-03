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
