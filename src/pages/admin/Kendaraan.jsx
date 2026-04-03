import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../api/axios';

const Kendaraan = () => {
  const [kendaraan, setKendaraan] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchKendaraan = async () => {
    try {
      const { data } = await api.get('/transaksi');
      setKendaraan(data.data.data || data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKendaraan();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Kendaraan</h2>
      </div>

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600 bg-gray-50">
                <th className="py-3 px-4">Plat Nomor</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Area</th>
                <th className="py-3 px-4">Waktu Masuk</th>
                <th className="py-3 px-4">Waktu Keluar</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {kendaraan.map((item) => (
                <tr key={item.id_parkir} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-bold uppercase">{item.kendaraan?.plat_nomor}</td>
                  <td className="py-3 px-4 capitalize">{item.kendaraan?.jenis_kendaraan || item.tarif?.jenis_kendaraan}</td>
                  <td className="py-3 px-4">{item.area?.nama_area || '-'}</td>
                  <td className="py-3 px-4">{new Date(item.waktu_masuk).toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4">{item.waktu_keluar ? new Date(item.waktu_keluar).toLocaleString('id-ID') : '-'}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${
                      item.status === 'masuk' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {kendaraan.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-center text-gray-500">Tidak ada data kendaraan.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default Kendaraan;
