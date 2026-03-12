import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt, 
  FaClock, 
  FaUsers,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaChair,
  FaUtensils,
  FaBell,
  FaEye,
  FaCheckCircle,
  FaClock as FaPending
} from 'react-icons/fa';
// import { MdOutdoorGrill, MdIndoor } from 'react-icons/md';
import { MdOutdoorGrill, MdMeetingRoom } from "react-icons/md";
import { GiPartyPopper } from 'react-icons/gi';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Reservations = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch all reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch all reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(import.meta.env.VITE_API_URL + '/api/reservation/GetMyReservationsForAdmin', {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
    //   console.log(response.data);
      setReservations(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status based on date
  const getReservationStatus = (date) => {
    const today = new Date();
    const reservationDate = new Date(date);
    
    if (reservationDate < today) {
      return { status: 'past', color: 'bg-gray-100 text-gray-800', icon: <FaCheckCircle className="text-gray-500" /> };
    } else if (reservationDate.toDateString() === today.toDateString()) {
      return { status: 'today', color: 'bg-green-100 text-green-800', icon: <FaCheckCircle className="text-green-500" /> };
    } else {
      return { status: 'upcoming', color: 'bg-blue-100 text-blue-800', icon: <FaPending className="text-blue-500" /> };
    }
  };

  // Get occasion icon
  const getOccasionIcon = (occasion) => {
    switch(occasion) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💍';
      case 'date': return '❤️';
      case 'business': return '💼';
      case 'family': return '👨‍👩‍👧‍👦';
      default: return '✨';
    }
  };

  // Get dining preference icon
  const getDiningIcon = (preference) => {
    return preference === 'outdoor' ? <MdOutdoorGrill className="text-green-500" /> : <MdIndoor className="text-blue-500" />;
  };

  // Filter reservations based on search and status
  const filteredReservations = reservations.filter(res => {
    const matchesSearch = 
      res.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.phone?.includes(searchTerm) ||
      res.occasion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const status = getReservationStatus(res.date).status;
    return matchesSearch && status === filterStatus;
  });

  // Sort reservations by date (most recent first)
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="p-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reservations</h2>
          <p className="text-gray-600 mt-1">View all customer reservations</p>
        </div>
        <button
          onClick={fetchReservations}
          disabled={loading}
          className="mt-4 md:mt-0 bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-all flex items-center gap-2 self-start disabled:opacity-50"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or occasion..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
            >
              <option value="all">All Reservations</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && !reservations.length ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading reservations...</p>
        </div>
      ) : (
        /* Reservations Table */
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedReservations.length > 0 ? (
                  sortedReservations.map((res) => {
                    const status = getReservationStatus(res.date);
                    return (
                      <tr key={res._id?.$oid || res._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                              <FaUser className="text-gold-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{res.name}</div>
                              <div className="text-xs text-gray-500">ID: {(res._id?.$oid || res._id)?.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{res.email}</div>
                          <div className="text-sm text-gray-500">{res.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <FaCalendarAlt className="text-gold-500" /> {formatDate(res.date)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            <FaClock className="text-gold-500" /> {res.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900">
                            <FaUsers className="text-gold-500" /> {res.guests} guests
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                            {getDiningIcon(res.diningPreference)}
                            <span className="capitalize">{res.diningPreference}</span>
                            {res.seating !== 'any' && (
                              <span className="ml-1 text-xs">({res.seating})</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${status.color}`}>
                            {status.icon}
                            {status.status}
                          </span>
                          {res.occasion !== 'none' && (
                            <span className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              {getOccasionIcon(res.occasion)} {res.occasion}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={() => {
                              setSelectedReservation(res);
                              setShowViewModal(true);
                            }}
                            className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <FaCalendarAlt className="text-4xl mx-auto mb-3 text-gray-300" />
                      <p>No reservations found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Reservation Modal */}
      {showViewModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Reservation Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedReservation(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Reservation ID */}
                <div className="bg-gold-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Reservation ID</p>
                  <p className="font-mono text-sm break-all">{selectedReservation._id?.$oid || selectedReservation._id}</p>
                </div>

                {/* Customer Information */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-gold-500" /> Customer Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{selectedReservation.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{selectedReservation.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selectedReservation.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">User ID</p>
                      <p className="font-mono text-xs">{(selectedReservation.userId?.$oid || selectedReservation.userId)?.slice(-8)}</p>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaCalendarAlt className="text-gold-500" /> Reservation Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(selectedReservation.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-medium">{selectedReservation.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="font-medium">{selectedReservation.guests} people</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dining Preference</p>
                      <p className="font-medium capitalize">{selectedReservation.diningPreference}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seating</p>
                      <p className="font-medium capitalize">{selectedReservation.seating}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Occasion</p>
                      <p className="font-medium capitalize flex items-center gap-1">
                        {getOccasionIcon(selectedReservation.occasion)} {selectedReservation.occasion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedReservation.specialRequests && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Special Requests</h4>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {selectedReservation.specialRequests}
                    </p>
                  </div>
                )}

                {/* Notifications */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaBell className="text-gold-500" /> Notifications
                  </h4>
                  <div className="flex gap-4">
                    {selectedReservation.notifications?.emailReminder && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        📧 Email Reminder
                      </span>
                    )}
                    {selectedReservation.notifications?.smsReminder && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        📱 SMS Reminder
                      </span>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="text-xs text-gray-400 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Created: {formatDateTime(selectedReservation.createdAt?.$date || selectedReservation.createdAt)}</span>
                    <span>Updated: {formatDateTime(selectedReservation.updatedAt?.$date || selectedReservation.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reservations;