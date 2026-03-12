import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaUtensils, 
  FaCalendarAlt, 
  FaEnvelope,
  FaUserPlus,
  FaEye,
  FaSpinner,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaPhone,
  FaEnvelope as FaEnvelopeIcon
} from 'react-icons/fa';
import { MdRestaurantMenu, MdMessage, MdDashboard } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Dashboards = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: { total: 0, new: 0, change: 0 },
    menu: { total: 0, popular: 0, change: 0 },
    reservations: { total: 0, today: 0, upcoming: 0, pending: 0 },
    contacts: { total: 0, unread: 0, recent: 0 }
  });

  const [recentData, setRecentData] = useState({
    users: [],
    reservations: [],
    contacts: []
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch all dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      
      // Fetch all data in parallel
      const [usersRes, menuRes, reservationsRes, contactsRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + '/api/user/getallusers', {
          headers: { 'Content-Type': 'application/json', 'token': token }
        }),
        axios.get(import.meta.env.VITE_API_URL + '/api/menu/getallmenu', {
          headers: { 'Content-Type': 'application/json', 'token': token }
        }),
        axios.get(import.meta.env.VITE_API_URL + '/api/reservation/GetMyReservationsForAdmin', {
          headers: { 'Content-Type': 'application/json', 'token': token }
        }),
        axios.get(import.meta.env.VITE_API_URL + '/api/contact/getall', {
          headers: { 'Content-Type': 'application/json', 'token': token }
        })
      ]);

      const users = usersRes.data.message || [];
      const menu = menuRes.data.message || [];
      const reservations = reservationsRes.data.data || [];
      const contacts = contactsRes.data.data || [];

      // Calculate statistics
      const today = new Date().toISOString().split('T')[0];
      const todayReservations = reservations.filter(r => r.date === today);
      const upcomingReservations = reservations.filter(r => new Date(r.date) > new Date());
      const pendingCount = reservations.filter(r => new Date(r.date) > new Date() && new Date(r.date) <= new Date(Date.now() + 7*24*60*60*1000)).length;
      
      // Popular menu items (with popular flag)
      const popularItems = menu.filter(item => item.popular === true);

      // Recent users (last 5)
      const recentUsers = [...users]
        .sort((a, b) => new Date(b.createdAt?.$date || b.createdAt) - new Date(a.createdAt?.$date || a.createdAt))
        .slice(0, 5);

      // Recent reservations (last 5)
      const recentReservations = [...reservations]
        .sort((a, b) => new Date(b.createdAt?.$date || b.createdAt) - new Date(a.createdAt?.$date || a.createdAt))
        .slice(0, 5);

      // Recent contacts (last 5)
      const recentContacts = [...contacts]
        .sort((a, b) => new Date(b.createdAt?.$date || b.createdAt) - new Date(a.createdAt?.$date || a.createdAt))
        .slice(0, 5);

      setStats({
        users: {
          total: users.length,
          new: users.filter(u => {
            const created = new Date(u.createdAt?.$date || u.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return created > weekAgo;
          }).length,
          change: 12 // This would come from comparison with previous period
        },
        menu: {
          total: menu.length,
          popular: popularItems.length,
          change: 5
        },
        reservations: {
          total: reservations.length,
          today: todayReservations.length,
          upcoming: upcomingReservations.length,
          pending: pendingCount
        },
        contacts: {
          total: contacts.length,
          unread: contacts.length, // You might have a read status field
          recent: recentContacts.length
        }
      });

      setRecentData({
        users: recentUsers,
        reservations: recentReservations,
        contacts: recentContacts
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color for reservations
  const getReservationStatus = (date) => {
    const today = new Date();
    const reservationDate = new Date(date);
    
    if (reservationDate < today) return 'past';
    if (reservationDate.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'today': return 'text-green-600 bg-green-100';
      case 'upcoming': return 'text-blue-600 bg-blue-100';
      case 'past': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <MdDashboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-gold-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Dashboard</h2>
          <p className="text-gold-500">Fetching your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Toaster />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your restaurant.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <Link to="/admin/users" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaUsers className="text-blue-600 text-2xl" />
            </div>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
              <FaArrowUp /> {stats.users.new} new
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.users.total}</h3>
          <p className="text-gray-500 text-sm">Total Users</p>
          <div className="mt-4 text-xs text-gray-400">
            {stats.users.new} joined this week
          </div>
        </Link>

        {/* Menu Items Card */}
        <Link to="/admin/menu-items" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaUtensils className="text-green-600 text-2xl" />
            </div>
            <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
              <FaStar /> {stats.menu.popular} popular
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.menu.total}</h3>
          <p className="text-gray-500 text-sm">Menu Items</p>
          <div className="mt-4 text-xs text-gray-400">
            {stats.menu.popular} items marked as popular
          </div>
        </Link>

        {/* Reservations Card */}
        <Link to="/admin/reservations" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gold-100 p-3 rounded-lg">
              <FaCalendarAlt className="text-gold-600 text-2xl" />
            </div>
            <span className="text-orange-500 text-sm font-semibold">
              {stats.reservations.today} today
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.reservations.total}</h3>
          <p className="text-gray-500 text-sm">Total Reservations</p>
          <div className="mt-4 flex gap-2 text-xs">
            <span className="text-green-600">{stats.reservations.upcoming} upcoming</span>
            <span className="text-orange-600">{stats.reservations.pending} pending</span>
          </div>
        </Link>

        {/* Contacts Card */}
        <Link to="/admin/contacts" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaEnvelope className="text-purple-600 text-2xl" />
            </div>
            <span className="text-red-500 text-sm font-semibold">
              {stats.contacts.unread} unread
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-800">{stats.contacts.total}</h3>
          <p className="text-gray-500 text-sm">Contact Messages</p>
          <div className="mt-4 text-xs text-gray-400">
            {stats.contacts.recent} new messages
          </div>
        </Link>
      </div>

      {/* Charts and Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-blue-500" /> Recent Users
            </h3>
            <Link to="/admin/users" className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1">
              View All <FaEye className="text-xs" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentData.users.length > 0 ? (
              recentData.users.map((user, index) => (
                <div key={user._id?.$oid || user._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      user.role === 'admin' ? 'bg-gold-500' : 'bg-blue-100'
                    }`}>
                      <FaUsers className={user.role === 'admin' ? 'text-white' : 'text-blue-600'} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{user.fullname || user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{formatDate(user.createdAt?.$date || user.createdAt)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'admin' ? 'bg-gold-100 text-gold-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role || 'user'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent users</p>
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaCalendarAlt className="text-gold-500" /> Recent Reservations
            </h3>
            <Link to="/admin/reservations" className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1">
              View All <FaEye className="text-xs" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentData.reservations.length > 0 ? (
              recentData.reservations.map((res, index) => {
                const status = getReservationStatus(res.date);
                return (
                  <div key={res._id?.$oid || res._id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                        <FaUsers className="text-gold-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{res.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{res.guests} guests</span>
                          <span>•</span>
                          <span>{res.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(res.createdAt?.$date || res.createdAt)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                        {status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">No recent reservations</p>
            )}
          </div>
        </div>

        {/* Recent Contacts */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaEnvelope className="text-purple-500" /> Recent Contact Messages
            </h3>
            <Link to="/admin/contacts" className="text-sm text-gold-600 hover:text-gold-700 flex items-center gap-1">
              View All <FaEye className="text-xs" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {recentData.contacts.length > 0 ? (
              recentData.contacts.map((contact, index) => (
                <div key={contact._id?.$oid || contact._id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <FaEnvelopeIcon className="text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium text-gray-800">{contact.name}</p>
                        <span className="text-xs text-gray-500">{contact.email}</span>
                        <span className="text-xs text-gray-500">{contact.phone}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Subject:</span> {contact.subject}
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-1">{contact.message}</p>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-400">{formatDate(contact.createdAt?.$date || contact.createdAt)}</p>
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                      {contact.subject}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent messages</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboards;