import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaUtensils,
  FaCheckCircle,
  FaTimesCircle,
  FaClock as FaPending,
  FaStar,
  FaPrint,
  FaDownload,
  FaShare,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaChair,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
  FaLeaf,
  FaWineGlassAlt
} from 'react-icons/fa';
import { MdHistory, MdEvent, MdCancel, MdRestaurant } from 'react-icons/md';
import { GiPartyPopper, GiWineGlass } from 'react-icons/gi';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReservationHistory = () => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 5;

  // Mock data using your exact structure
  const [reservations, setReservations] = useState([]);

  const navigate = useNavigate();

  // Simulate loading
    useEffect(() => {
      setLoading(true);
      GetAllReservations();
    }, []);

  const GetAllReservations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You are not logged in");
        setReservations([]);  // always array
        navigate('/login');
        return;
      }

      const url = import.meta.env.VITE_API_URL + '/api/reservation/getmyreservation';
      const { data } = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

      if (!data.status) {
        toast.error(data.message);
        setReservations([]); // always array
        if (data.message === "You Are Not Authenticated") {
          localStorage.removeItem('token'); // optional
          navigate('/login'); // redirect
        }
      } else {
        setReservations(Array.isArray(data.data) ? data.data : []);
        // toast.success(data.message); // optional
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
      setReservations([]); // safe fallback
    } finally {
      setLoading(false); // stop spinner
    }
  };

  // Filter reservations
  const filteredReservations = reservations.filter(res => {
    if (filter !== 'all' && res.status !== filter) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        res.name?.toLowerCase().includes(searchLower) ||
        res.email?.toLowerCase().includes(searchLower) ||
        res.occasion?.toLowerCase().includes(searchLower) ||
        res.diningPreference?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  // Sort reservations
  const sortedReservations = [...filteredReservations].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(a.date) - new Date(b.date);
    } else if (sortBy === 'guests') {
      comparison = a.guests - b.guests;
    } else if (sortBy === 'bill') {
      comparison = (a.totalBill || 0) - (b.totalBill || 0);
    } else if (sortBy === 'created') {
      comparison = new Date(a.createdAt.$date) - new Date(b.createdAt.$date);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const paginatedReservations = sortedReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <MdHistory className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl text-gold-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading History</h2>
          <p className="text-gold-500">Fetching your reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      {/* Header */}
      <div className="relative mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-linear-to-r from-gold-500 to-gold-600 p-4 rounded-full shadow-lg">
            <MdHistory className="text-black text-4xl" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Reservation <span className="text-gold-500">History</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          View and manage all your past and upcoming reservations
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white rounded-2xl shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, occasion..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Reservations List */}
      <div className="max-w-7xl mx-auto">
        {paginatedReservations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <MdHistory className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No reservations found</h3>
            <p className="text-gray-600">Try adjusting your filters or make a new reservation</p>
            <button className="mt-6 bg-gold-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gold-600 transition-all">
              Make a Reservation
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedReservations.map((reservation) => (
              <div
                key={reservation._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="flex items-center gap-3 mb-2 md:mb-0">
                      <span className="text-sm font-mono text-gray-500">
                        ID: {reservation._id}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedReservation(reservation)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <FaEye className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Print">
                        <FaPrint className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                        <FaDownload className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                        <FaShare className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <p className="font-semibold text-gray-800">{reservation.name}</p>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <FaEnvelope className="text-gold-500" /> {reservation.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaPhone className="text-gold-500" /> {reservation.phone}
                      </span>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                      <FaCalendarAlt className="text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-500">Date</p>
                        <p className="font-semibold">{formatDate(reservation.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaClock className="text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-500">Time</p>
                        <p className="font-semibold">{reservation.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUsers className="text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-500">Guests</p>
                        <p className="font-semibold">{reservation.guests} people</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <FaUtensils className="text-gold-500" />
                      <div>
                        <p className="text-xs text-gray-500">Dining</p>
                        <p className="font-semibold capitalize">{reservation.diningPreference}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap items-center gap-3">
                      {reservation.occasion && (
                        <span className="text-sm bg-gold-50 text-gold-700 px-3 py-1 rounded-full flex items-center gap-1">
                          {getOccasionIcon(reservation.occasion)} {reservation.occasion}
                        </span>
                      )}
                      {reservation.seating && (
                        <span className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full flex items-center gap-1">
                          <FaChair className="text-xs" />
                          {reservation.seating} seating
                        </span>
                      )}
                      {reservation.notifications?.emailReminder && (
                        <span className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex items-center gap-1">
                          <FaBell className="text-xs" />
                          Email reminder
                        </span>
                      )}
                    </div>
                    
                    {reservation.specialRequests && (
                      <p className="text-sm text-gray-600 mt-3 italic">
                        "{reservation.specialRequests}"
                      </p>
                    )}
                  </div>

                  {/* Bill for completed reservations */}
                  {reservation.status === 'completed' && reservation.totalBill && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => (
                            <FaStar
                              key={star}
                              className={star <= reservation.rating ? 'text-gold-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Total Bill</p>
                        <p className="text-xl font-bold text-gold-600">${reservation.totalBill}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white rounded-xl shadow-md px-6 py-4 mt-6">
                <p className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedReservations.length)} of {sortedReservations.length} reservations
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FaChevronLeft />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-gold-500 text-white'
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-colors ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reservation Details Modal */}
      {selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reservation Details</h2>
                <button
                  onClick={() => setSelectedReservation(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Reservation Info */}
              <div className="space-y-6">
                <div className="bg-gold-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-mono text-gray-600">
                      ID: {selectedReservation._id.$oid}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(selectedReservation.status)}`}>
                      {getStatusIcon(selectedReservation.status)}
                      {selectedReservation.status || 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Booked on: {formatDateTime(selectedReservation.createdAt.$date)}
                  </p>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p><span className="text-gray-500">Name:</span> <span className="font-semibold">{selectedReservation.name}</span></p>
                    <p><span className="text-gray-500">Email:</span> {selectedReservation.email}</p>
                    <p><span className="text-gray-500">Phone:</span> {selectedReservation.phone}</p>
                  </div>
                </div>

                {/* Reservation Details */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Reservation Details</h3>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-semibold">{formatDate(selectedReservation.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="font-semibold">{selectedReservation.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Guests</p>
                      <p className="font-semibold">{selectedReservation.guests} people</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Dining Preference</p>
                      <p className="font-semibold capitalize">{selectedReservation.diningPreference}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Seating</p>
                      <p className="font-semibold capitalize">{selectedReservation.seating}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Occasion</p>
                      <p className="font-semibold capitalize">{selectedReservation.occasion}</p>
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                {selectedReservation.specialRequests && (
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Special Requests</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedReservation.specialRequests}
                    </p>
                  </div>
                )}

                {/* Notifications */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Notifications</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      {selectedReservation.notifications?.emailReminder && (
                        <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                          📧 Email Reminder
                        </span>
                      )}
                      {selectedReservation.notifications?.smsReminder && (
                        <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          📱 SMS Reminder
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Info for completed reservations */}
                {selectedReservation.status === 'completed' && selectedReservation.totalBill && (
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Payment Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Total Bill:</span>
                        <span className="font-bold text-gold-600">${selectedReservation.totalBill}</span>
                      </div>
                      {selectedReservation.rating && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-gray-600">Your Rating:</span>
                          <div className="flex gap-1">
                            {[1,2,3,4,5].map(star => (
                              <FaStar
                                key={star}
                                className={star <= selectedReservation.rating ? 'text-gold-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  {selectedReservation.status === 'pending' && (
                    <button className="flex-1 bg-gold-500 text-white py-3 rounded-lg font-semibold hover:bg-gold-600 transition-all">
                      Confirm Now
                    </button>
                  )}
                  {selectedReservation.status === 'confirmed' && (
                    <button className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all">
                      Cancel Reservation
                    </button>
                  )}
                  {selectedReservation.status === 'completed' && (
                    <button className="flex-1 bg-gold-500 text-white py-3 rounded-lg font-semibold hover:bg-gold-600 transition-all">
                      Book Again
                    </button>
                  )}
                  <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all">
                    Add to Calendar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationHistory;