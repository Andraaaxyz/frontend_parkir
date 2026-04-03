import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Download, FileText } from 'lucide-react';
import api from '../../api/axios';

const Laporan = () => {
  const [filter, setFilter] = useState('harian');
  const [laporan, setLaporan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({ total_pendapatan: 0, total_kendaraan: 0 });

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const today = new Date();
      let queryParams = "";
      if (filter === "harian") {
        const todayStr = today.toISOString().split('T')[0];
        queryParams = `?tanggal_dari=${todayStr}&tanggal_sampai=${todayStr}`;
      } else if (filter === "bulanan") {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
        queryParams = `?tanggal_dari=${firstDay}&tanggal_sampai=${lastDay}`;
      }
      
      const { data } = await api.get(`/laporan/detail${queryParams}`);
      const ringkasan = await api.get(`/laporan/ringkasan${queryParams}`);
      
      const transactions = data.data?.data || data.data || [];
      setLaporan(transactions);
      
      setSummary({ 
        total_pendapatan: ringkasan.data.data?.total_pendapatan_raw || 0, 
        total_kendaraan: ringkasan.data.data?.jumlah_kendaraan || 0 
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [filter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-2xl font-bold text-gray-800">Laporan Pendapatan</h2>
        <div className="flex space-x-4 items-center">
          <select 
            value={filter} 
            onChange={e => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="harian">Harian</option>
            <option value="bulanan">Bulanan</option>
          </select>
          <button onClick={handlePrint} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" /> Cetak / PDF
          </button>
        </div>
      </div>

      <div className="hidden print:block text-center mb-8">
        <h1 className="text-3xl font-bold">LAPORAN MANAJEMEN PARKIR</h1>
        <p className="text-lg text-gray-600">Periode: {filter.toUpperCase()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center space-x-4 border-l-4 border-l-blue-500 bg-white">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-lg">
            <DollarSignIcon className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Total Pendapatan</p>
            <h3 className="text-2xl font-bold">Rp {summary.total_pendapatan.toLocaleString('id-ID')}</h3>
          </div>
        </Card>
        
        <Card className="flex items-center space-x-4 border-l-4 border-l-green-500 bg-white">
          <div className="p-4 bg-green-50 text-green-600 rounded-lg">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-semibold uppercase">Jumlah Transaksi Kendaraan</p>
            <h3 className="text-2xl font-bold">{summary.total_kendaraan}</h3>
          </div>
        </Card>
      </div>

      <Card className="overflow-x-auto shadow-sm">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat laporan...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600 bg-gray-50">
                <th className="py-4 px-4 font-semibold">TANGGAL</th>
                <th className="py-4 px-4 font-semibold">PLAT NOMOR</th>
                <th className="py-4 px-4 font-semibold">JENIS KENDARAAN</th>
                <th className="py-4 px-4 font-semibold">WAKTU MASUK</th>
                <th className="py-4 px-4 font-semibold">WAKTU KELUAR</th>
                <th className="py-4 px-4 font-semibold">DURASI</th>
                <th className="py-4 px-4 font-semibold text-right">BIAYA</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((item) => (
                <tr key={item.id_parkir} className="border-b hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-sm">{new Date(item.waktu_masuk).toLocaleDateString('id-ID')}</td>
                  <td className="py-3 px-4 font-bold uppercase">{item.kendaraan?.plat_nomor}</td>
                  <td className="py-3 px-4 capitalize">{item.kendaraan?.jenis_kendaraan || item.tarif?.jenis_kendaraan}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{new Date(item.waktu_masuk).toLocaleTimeString('id-ID')}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{new Date(item.waktu_keluar).toLocaleTimeString('id-ID')}</td>
                  <td className="py-3 px-4 text-sm font-medium">{item.durasi} Jam</td>
                  <td className="py-3 px-4 text-right font-bold text-gray-800">Rp {parseInt(item.biaya_total).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              {laporan.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-500">Tidak ada transaksi pada periode ini.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

// Helper SVG Component for missing import
function DollarSignIcon(props) {
  return (
    <svg 
      {...props} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

export default Laporan;
