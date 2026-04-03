import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import api from '../../api/axios';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nama_lengkap: '', username: '', password: '', role: 'petugas' });
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/users');
      setUsers(data.data || data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/users/${editId}`, formData);
        setMessage('User updated successfully');
      } else {
        await api.post('/users', formData);
        setMessage('User created successfully');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setMessage('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const openEdit = (user) => {
    setFormData({ nama_lengkap: user.nama_lengkap, username: user.username, password: '', role: user.role });
    setEditId(user.id_user);
    setIsEdit(true);
    setShowModal(true);
  };

  const openCreate = () => {
    setFormData({ nama_lengkap: '', username: '', password: '', role: 'petugas' });
    setIsEdit(false);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen User</h2>
        <button onClick={openCreate} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" /> Tambah User
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
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id_user} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{user.nama_lengkap}</td>
                  <td className="py-3 px-4">{user.username}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 flex space-x-2">
                    <button onClick={() => openEdit(user)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id_user)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">Tidak ada data user.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{isEdit ? 'Edit User' : 'Tambah User'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.nama_lengkap} onChange={e => setFormData({...formData, nama_lengkap: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input required type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password {isEdit && <span className="text-xs text-gray-500">(Kosongkan jika tidak ingin mengubah)</span>}
                </label>
                <input type="password" required={!isEdit} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="petugas">Petugas</option>
                  <option value="owner">Owner</option>
                </select>
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

export default Users;
