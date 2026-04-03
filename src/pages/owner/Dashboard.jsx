import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { DollarSign, Filter, FileText, PieChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const OwnerDashboard = () => {
  const [stats, setStats] = useState({ total_pendapatan: 0, total_kendaraan: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await api.get(`/laporan/ringkasan?tanggal_dari=${today}&tanggal_sampai=${today}`);
      
      const resData = data.data || {};
      const pendapatan = resData.total_pendapatan_raw || 0;
      const kendaraan = resData.jumlah_kendaraan || 0;

      setStats({
        total_pendapatan: pendapatan,
        total_kendaraan: kendaraan
      });
    } catch (error) {
      console.error(error);
      setStats({ total_pendapatan: 0, total_kendaraan: 0 });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Owner</h2>
        <Link to="/owner/laporan" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Filter className="w-4 h-4 mr-2" /> Filter Detail Laporan
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-yellow-100 text-yellow-600 rounded-lg">
            <DollarSign className="w-10 h-10" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Total Pendapatan (Hari Ini)</p>
            <h3 className="text-3xl font-bold">Rp {stats.total_pendapatan.toLocaleString()}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
            <FileText className="w-10 h-10" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Total Kendaraan (Hari Ini)</p>
            <h3 className="text-3xl font-bold">{stats.total_kendaraan}</h3>
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <Card className="p-8 text-center bg-gray-50">
          <PieChart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Lihat Laporan Lengkap</h3>
          <p className="text-gray-500 mb-6">Filter laporan berdasarkan harian atau bulanan untuk melihat detail transaksi parkir.</p>
          <Link to="/owner/laporan" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">
            Buka Halaman Laporan
          </Link>
        </Card>
      </div>
    </div>
  );
};

export default OwnerDashboard;
