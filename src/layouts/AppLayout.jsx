import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { LogOut, Home, Users, DollarSign, Map, Car, FileText, Menu, X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import api from '../api/axios';
import logo from '../assets/logo.png';

const AppLayout = ({ allowedRoles }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
        navigate(`/${parsedUser.role}/dashboard`);
        return;
      }
      setUser(parsedUser);
      setLoading(false);
    } catch (e) {
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate, allowedRoles]);

  const handleLogout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  const menuItems = {
    admin: [
      { path: '/admin/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
      { path: '/admin/users', icon: <Users className="w-5 h-5" />, label: 'Users' },
      { path: '/admin/tarif', icon: <DollarSign className="w-5 h-5" />, label: 'Tarif' },
      { path: '/admin/area', icon: <Map className="w-5 h-5" />, label: 'Area Parkir' },
      { path: '/admin/kendaraan', icon: <Car className="w-5 h-5" />, label: 'Kendaraan' },
      { path: '/admin/log', icon: <FileText className="w-5 h-5" />, label: 'Log Aktivitas' },
    ],
    petugas: [
      { path: '/petugas/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
      { path: '/petugas/masuk', icon: <ArrowDownRight className="w-5 h-5" />, label: 'Kendaraan Masuk' },
      { path: '/petugas/keluar', icon: <ArrowUpRight className="w-5 h-5" />, label: 'Kendaraan Keluar' },
    ],
    owner: [
      { path: '/owner/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
      { path: '/owner/laporan', icon: <FileText className="w-5 h-5" />, label: 'Laporan' },
    ]
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const roleMenus = menuItems[user.role] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-600 text-white">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-8 h-8 brightness-0 invert" />
            <span className="text-xl font-bold tracking-wider">ParkirinAzzZ</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="py-4">
          <div className="px-6 mb-4">
            <p className="text-sm font-semibold text-gray-500 uppercase">{user.role}</p>
            <p className="text-lg font-bold text-gray-800">{user.name || user.username}</p>
          </div>
          <nav className="space-y-1 px-4">
            {roleMenus.map((menu) => (
              <Link
                key={menu.path}
                to={menu.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  location.pathname === menu.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {menu.icon}
                <span className="ml-3">{menu.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8 z-10">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden mr-4 text-gray-600">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 md:hidden">
               <img src={logo} alt="Logo" className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {roleMenus.find(m => m.path === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
    </div>
  );
};

export default AppLayout;
