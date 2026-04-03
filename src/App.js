import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AppLayout from './layouts/AppLayout';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Users from './pages/admin/Users';
import Tarif from './pages/admin/Tarif';
import Area from './pages/admin/Area';
import Kendaraan from './pages/admin/Kendaraan';
import LogAktivitas from './pages/admin/LogAktivitas';

// Petugas Pages
import PetugasDashboard from './pages/petugas/Dashboard';
import KendaraanMasuk from './pages/petugas/KendaraanMasuk';
import KendaraanKeluar from './pages/petugas/KendaraanKeluar';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import Laporan from './pages/owner/Laporan';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route element={<AppLayout allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/tarif" element={<Tarif />} />
          <Route path="/admin/area" element={<Area />} />
          <Route path="/admin/kendaraan" element={<Kendaraan />} />
          <Route path="/admin/log" element={<LogAktivitas />} />
        </Route>

        {/* Petugas Routes */}
        <Route element={<AppLayout allowedRoles={['petugas']} />}>
          <Route path="/petugas/dashboard" element={<PetugasDashboard />} />
          <Route path="/petugas/masuk" element={<KendaraanMasuk />} />
          <Route path="/petugas/keluar" element={<KendaraanKeluar />} />
        </Route>

        {/* Owner Routes */}
        <Route element={<AppLayout allowedRoles={['owner']} />}>
          <Route path="/owner/dashboard" element={<OwnerDashboard />} />
          <Route path="/owner/laporan" element={<Laporan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
