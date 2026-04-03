import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Users, Car, Map, DollarSign } from 'lucide-react';
import api from '../../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    kendaraan: 0,
    area: 0,
    pendapatan: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const [usersRes, aktifRes, areaRes, laporanRes] = await Promise.all([
        api.get('/users'),
        api.get('/laporan/kendaraan-aktif'),
        api.get('/area'),
        api.get(`/laporan/ringkasan?tanggal_dari=${today}&tanggal_sampai=${today}`)
      ]);

      const usersCount = Array.isArray(usersRes.data.data) ? usersRes.data.data.length : 0;
      const aktifCount = aktifRes.data.jumlah_aktif || 0;
      const areaCount = Array.isArray(areaRes.data.data) ? areaRes.data.data.length : (Array.isArray(areaRes.data) ? areaRes.data.length : 0);
      const pendapatan = laporanRes.data.data?.total_pendapatan_raw || 0;

      setStats({
        users: usersCount,
        kendaraan: aktifCount,
        area: areaCount,
        pendapatan: pendapatan
      });
    } catch (error) {
      console.error('Failed to fetch stats', error);
      setStats({ users: 0, kendaraan: 0, area: 0, pendapatan: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">{stats.users}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Kendaraan Parkir</p>
            <h3 className="text-2xl font-bold">{stats.kendaraan}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Map className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Area Parkir</p>
            <h3 className="text-2xl font-bold">{stats.area}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Pendapatan Hari Ini</p>
            <h3 className="text-2xl font-bold">Rp {stats.pendapatan.toLocaleString()}</h3>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
