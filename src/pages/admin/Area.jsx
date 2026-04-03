import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../api/axios';

const Area = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_area: '', kapasitas: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchAreas = async () => {
    try {
      const { data } = await api.get('/area');
      setAreas(Array.isArray(data.data) ? data.data : data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/area/${editId}`, formData);
        setMessage('Area updated successfully');
      } else {
        await api.post('/area', formData);
        setMessage('Area created successfully');
      }
      setShowModal(false);
      fetchAreas();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/area/${id}`);
      setMessage('Area deleted successfully');
      fetchAreas();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (item) => {
    setFormData({ nama_area: item.nama_area, kapasitas: item.kapasitas });
    setEditId(item.id_area);
    setIsEdit(true);
    setShowModal(true);
  };

  const openCreate = () => {
    setFormData({ nama_area: '', kapasitas: '' });
    setIsEdit(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Area Parkir</h2>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah Area
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
                <th className="py-3 px-4">Nama Area</th>
                <th className="py-3 px-4">Kapasitas</th>
                <th className="py-3 px-4">Terisi</th>
                <th className="py-3 px-4">Tersedia</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((item) => (
                <tr key={item.id_area} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{item.nama_area}</td>
                  <td className="py-3 px-4">{item.kapasitas}</td>
                  <td className="py-3 px-4 text-orange-600 font-semibold">{item.terisi || 0}</td>
                  <td className="py-3 px-4 text-green-600 font-semibold">{item.kapasitas - (item.terisi || 0)}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button onClick={() => openEdit(item)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id_area)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {areas.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit Area' : 'Tambah Area'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Area</label>
                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.nama_area} onChange={e => setFormData({...formData, nama_area: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kapasitas</label>
                <input required type="number" min="1" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.kapasitas} onChange={e => setFormData({...formData, kapasitas: e.target.value})} />
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

export default Area;
