import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../api/axios';

const KendaraanMasuk = () => {
  const [formData, setFormData] = useState({ plat_nomor: '', jenis_kendaraan: '', area_id: '' });
  const [areas, setAreas] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [resArea, resTarif] = await Promise.all([
          api.get('/area'),
          api.get('/tarif')
        ]);
        setAreas(Array.isArray(resArea.data.data) ? resArea.data.data : resArea.data);
        setTarifs(Array.isArray(resTarif.data.data) ? resTarif.data.data : resTarif.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/parkir/masuk', formData);
      setMessage({ type: 'success', text: 'Kendaraan berhasil dicatat masuk.' });
      setFormData({ plat_nomor: '', jenis_kendaraan: '', area_id: '' });
      
      // Refresh areas to get updated capacity
      const resArea = await api.get('/area');
      setAreas(Array.isArray(resArea.data.data) ? resArea.data.data : resArea.data);
    } catch (error) {
      if (error.response?.status === 404 && error.response?.data?.message?.includes('terdaftar')) {
        const user = JSON.parse(localStorage.getItem('user'));
        try {
          await api.post('/kendaraan', {
            plat_nomor: formData.plat_nomor,
            jenis_kendaraan: formData.jenis_kendaraan,
            warna: '-', pemilik: 'Guest', id_user: user?.id_user || user?.id || 1
          });
          await api.post('/parkir/masuk', formData);
          setMessage({ type: 'success', text: 'Kendaraan didaftarkan otomatis & berhasil dicatat masuk.' });
          setFormData({ plat_nomor: '', jenis_kendaraan: '', area_id: '' });
          const resArea = await api.get('/area');
          setAreas(Array.isArray(resArea.data.data) ? resArea.data.data : resArea.data);
        } catch(err) {
          setMessage({ type: 'error', text: err.response?.data?.message || 'Gagal registrasi kendaraan otomatis.' });
        }
      } else {
        setMessage({ type: 'error', text: error.response?.data?.message || 'Gagal menyimpan data kendaraan.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Input Kendaraan Masuk</h2>

      <Card>
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plat Nomor</label>
            <input 
              required 
              type="text" 
              className="w-full border border-gray-300 rounded-lg p-3 uppercase focus:ring-blue-500 focus:border-blue-500"
              placeholder="Contoh: B 1234 CD"
              value={formData.plat_nomor} 
              onChange={e => setFormData({...formData, plat_nomor: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kendaraan</label>
            <select 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              value={formData.jenis_kendaraan} 
              onChange={e => setFormData({...formData, jenis_kendaraan: e.target.value})}
            >
              <option value="" disabled>Pilih Jenis Kendaraan</option>
              {tarifs.map(t => (
                <option key={t.id} value={t.jenis_kendaraan}>{t.jenis_kendaraan.toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area Parkir</label>
            <select 
              required 
              className="w-full border border-gray-300 rounded-lg p-3 bg-white"
              value={formData.area_id} 
              onChange={e => setFormData({...formData, area_id: e.target.value})}
            >
              <option value="" disabled>Pilih Area Parkir</option>
              {areas.map(a => {
                const available = a.kapasitas - (a.terisi || 0);
                return (
                  <option key={a.id} value={a.id} disabled={available <= 0}>
                    {a.nama_area} (Sisa: {available} dari {a.kapasitas})
                  </option>
                );
              })}
            </select>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-3 px-4 flex justify-center text-white font-medium rounded-lg ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Menyimpan...' : 'Simpan Kendaraan Masuk'}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default KendaraanMasuk;
