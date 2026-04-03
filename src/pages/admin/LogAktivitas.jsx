import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../api/axios';

const LogAktivitas = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const { data } = await api.get('/logs');
      setLogs(data.data.data || data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Log Aktivitas Petugas</h2>
      </div>

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600 bg-gray-50">
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Petugas</th>
                <th className="py-3 px-4">Aktivitas</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item.id_log} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-500">{new Date(item.waktu_aktivitas).toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 font-medium">{item.user?.nama_lengkap || '-'}</td>
                  <td className="py-3 px-4">{item.aktivitas || '-'}</td>
                  <td className="py-3 px-4 capitalize">{item.user?.role || '-'}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">Tidak ada log aktivitas.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default LogAktivitas;
