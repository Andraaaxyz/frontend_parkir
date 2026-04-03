import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Car, LogIn, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const PetugasDashboard = () => {
  const [stats, setStats] = useState({ masuk: 0, keluar: 0, total_parkir: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const [masukRes, parkirRes, keluarRes] = await Promise.all([
        api.get(`/transaksi?tanggal_dari=${today}&tanggal_sampai=${today}`),
        api.get('/transaksi?status=masuk'),
        api.get(`/transaksi?status=keluar&tanggal_dari=${today}&tanggal_sampai=${today}`)
      ]);
      
      const totalMasukHariIni = masukRes.data.data?.total || masukRes.data.data?.data?.length || 0;
      const totalParkir = parkirRes.data.data?.total || parkirRes.data.data?.data?.length || 0;
      const totalKeluarHariIni = keluarRes.data.data?.total || keluarRes.data.data?.data?.length || 0;
      
      setStats({ masuk: totalMasukHariIni, keluar: totalKeluarHariIni, total_parkir: totalParkir });
    } catch (error) {
      console.error(error);
      setStats({ masuk: 0, keluar: 0, total_parkir: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Petugas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Masih Parkir</p>
            <h3 className="text-2xl font-bold">{stats.total_parkir}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <LogIn className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Kendaraan Masuk (Hari Ini)</p>
            <h3 className="text-2xl font-bold">{stats.masuk}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg">
            <LogOut className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Kendaraan Keluar (Hari Ini)</p>
            <h3 className="text-2xl font-bold">{stats.keluar}</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Link to="/petugas/masuk" className="block p-8 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md hover:shadow-lg transition">
          <LogIn className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Kendaraan Masuk</h3>
          <p className="text-blue-100">Catat kendaraan yang masuk ke area parkir</p>
        </Link>
        <Link to="/petugas/keluar" className="block p-8 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition">
          <LogOut className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Kendaraan Keluar</h3>
          <p className="text-emerald-100">Proses keluar kendaraan dan cetak struk pembayaran</p>
        </Link>
      </div>
    </div>
  );
};

export default PetugasDashboard;
