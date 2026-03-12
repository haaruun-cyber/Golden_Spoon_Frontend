import React, { useState } from 'react';
import { 
  FaHome,
  FaUsers,
  FaUtensils,
  FaCalendarAlt,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaPlus,
  FaBox,
  FaClock
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import Users from './Users';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import MenuItems from './MenuItems';
import Reservations from './Reservations';
import Contacts from './Contacts';
import Dashboards from './Dashboards';
import OrdersPage from './OrdersPage';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [User, setUser] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    gettoken();
  },[]);

  // Navigation links
  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: <FaHome /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
    { id: 'menu-items', label: 'Menu Items', icon: <FaUtensils /> },
    { id: 'Orders', label: 'Orders', icon: <FaCalendarAlt /> },
    { id: 'reservations', label: 'All Reservations', icon: <FaCalendarAlt /> },
    { id: 'contacts', label: 'Contact Messages', icon: <FaEnvelope /> },
  ];

    const gettoken = () => {
    try {
      const token = localStorage.getItem('token');
      if(token){
      const decode = jwtDecode(token);
      setUser(decode);
    //   console.log(decode);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
  };

  // Render the active page content
  const renderPageContent = () => {
    switch(activePage) {
      case 'dashboard':
        return <Dashboards />;
      
      case 'users':
        return <Users />;
      
      case 'menu-items':
        return <MenuItems />;

      case 'Orders':
        return <OrdersPage />;
      
      case 'reservations':
        return <Reservations />;
      
      case 'contacts':
        return <Contacts />;
      
      default:
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
            <p className="text-gray-600">Welcome to the admin dashboard.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-linear-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 relative overflow-y-auto`}>
        {/* Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-10 bg-gold-500 text-white p-1.5 rounded-full hover:bg-gold-600 transition-colors z-10"
        >
          <FaBars />
        </button>

        {/* Logo */}
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center gap-2">
            <div className="bg-gold-500 p-2 rounded-lg">
              <MdDashboard className="text-white text-xl" />
            </div>
            {sidebarOpen && (
              <span className="text-xl font-bold">Admin Panel</span>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 pb-20">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => setActivePage(link.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    activePage === link.id 
                      ? 'bg-gold-500 text-white' 
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                  title={!sidebarOpen ? link.label : ''}
                >
                  <span className="text-xl">{link.icon}</span>
                  {sidebarOpen && <span className="text-sm">{link.label}</span>}
                </button>
              </li>
            ))}

            {/* Logout */}
            <li className="pt-4 mt-4 border-t border-gray-700">
              <button
                className="w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-red-600 text-gray-300 hover:text-white"
                title={!sidebarOpen ? 'Logout' : ''}
                onClick={logout}
              >
                <FaSignOutAlt className="text-xl" />
                {sidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area - Where pages will appear */}
      <div className="flex-1 overflow-auto">
        {/* Top Header */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              {navLinks.find(link => link.id === activePage)?.label || 'Dashboard'}
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Admin Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">Welcome Admin: {User.fullname}</p>
                  <p className="text-xs text-gray-500">{User.email}</p>
                </div>
                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-white font-bold">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Different page appears here based on activePage */}
        <div className="bg-gray-50 min-h-[calc(100vh-73px)]">
          {renderPageContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;