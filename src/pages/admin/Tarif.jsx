import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const Tarif = () => {
  const [tarifs, setTarifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ jenis_kendaraan: '', tarif_per_jam: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchTarifs = async () => {
    try {
      const { data } = await api.get('/tarif');
      setTarifs(Array.isArray(data.data) ? data.data : data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTarifs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/tarif/${editId}`, formData);
        setMessage('Tarif updated successfully');
      } else {
        await api.post('/tarif', formData);
        setMessage('Tarif created successfully');
      }
      setShowModal(false);
      fetchTarifs();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/tarif/${id}`);
      setMessage('Tarif deleted successfully');
      fetchTarifs();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (item) => {
    setFormData({ jenis_kendaraan: item.jenis_kendaraan, tarif_per_jam: item.tarif_per_jam });
    setEditId(item.id_tarif);
    setIsEdit(true);
    setShowModal(true);
  };

  const openCreate = () => {
    setFormData({ jenis_kendaraan: '', tarif_per_jam: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Tarif</h2>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Tarif
        </button>
      </div>

      {message && <div className="p-4 bg-green-50 text-green-700 rounded-lg">{message}</div>}

      <Card className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-4">Loading data...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-3 px-4">Jenis Kendaraan</th>
                <th className="py-3 px-4">Tarif per Jam</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tarifs.map((item) => (
                <tr key={item.id_tarif} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 capitalize">{item.jenis_kendaraan}</td>
                  <td className="py-3 px-4">Rp {parseInt(item.tarif_per_jam).toLocaleString()}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button onClick={() => openEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id_tarif)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {tarifs.length === 0 && (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-500">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit Tarif' : 'Tambah Tarif'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Jenis Kendaraan</label>
                <select required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.jenis_kendaraan} onChange={e => setFormData({...formData, jenis_kendaraan: e.target.value})}>
                  <option value="" disabled>Pilih Jenis</option>
                  <option value="motor">Motor</option>
                  <option value="mobil">Mobil</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tarif per Jam</label>
                <input required type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.tarif_per_jam} onChange={e => setFormData({...formData, tarif_per_jam: e.target.value})} />
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-gray-600">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">Simpan</button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Tarif;
