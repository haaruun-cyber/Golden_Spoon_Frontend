import React, { useState, useEffect } from 'react';
import { 
  FaUtensils, 
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaDollarSign,
  FaCreditCard,
  FaExclamationTriangle
} from 'react-icons/fa';
import { MdPayment, MdRestaurantMenu } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const navigate = useNavigate();

  useEffect(()=>{
    isUserLoggedIn();
  },[])
  
  //check if user is logged in to make reservation
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/login');
    }
  }

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch my orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(import.meta.env.VITE_API_URL + '/api/order/myorders', {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      
      console.log('Orders fetched:', response.data);
      
      if (response.data.status === true) {
        setOrders(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch(status?.toLowerCase()) {
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <FaCheckCircle className="text-green-500" />,
          label: 'Paid'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <FaClock className="text-yellow-500" />,
          label: 'Pending'
        };
      case 'failed':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <FaTimesCircle className="text-red-500" />,
          label: 'Failed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <FaExclamationTriangle className="text-gray-500" />,
          label: status || 'Unknown'
        };
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.MenuItemId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.AccountNo?.includes(searchTerm) ||
      order.Payment_Method?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && order.status === filterStatus;
  });

  // Sort orders by date (most recent first)
  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Calculate summary stats
  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.status === 'paid').length,
    pending: orders.filter(o => o.status === 'pending').length,
    failed: orders.filter(o => o.status === 'failed').length,
    totalSpent: orders
      .filter(o => o.status === 'paid')
      .reduce((sum, o) => sum + (o.TotalAmount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <Toaster />
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          <p className="text-gray-600 mt-1">View and track all your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-gold-600">{formatPrice(stats.totalSpent)}</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, item name, or account number..."
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
                <option value="all">All Orders</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-4 py-2 bg-gold-500 text-black rounded-lg hover:bg-gold-600 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <FaSpinner className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && !orders.length ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaSpinner className="animate-spin text-4xl text-gold-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        ) : (
          /* Orders Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedOrders.length > 0 ? (
              sortedOrders.map((order) => {
                const status = getStatusInfo(order.status);
                return (
                  <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                    {/* Order Header */}
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-mono text-gray-500">
                          ID: {order._id.slice(-8)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Menu Item Image & Details */}
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Item Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          {order.MenuItemId?.image ? (
                            <img 
                              src={order.MenuItemId.image} 
                              alt={order.MenuItemId?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUtensils className="text-gray-300" />
                            </div>
                          )}
                        </div>

                        {/* Item Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {order.MenuItemId?.name || 'Unknown Item'}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Qty: {order.Qty} × {formatPrice(order.Price)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gold-100 text-gold-700 px-2 py-0.5 rounded">
                              {order.Payment_Method}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Info */}
                      <div className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Total Amount:</span>
                          <span className="font-bold text-gold-600">
                            {formatPrice(order.TotalAmount || order.Amount)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Account No:</span>
                          <span className="font-mono text-sm">
                            {order.AccountNo?.slice(0, 8)}...
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Date:</span>
                          <span className="text-xs text-gray-600">
                            {formatDate(order.createdAt)}
                          </span>
                        </div>
                      </div>

                      {/* Message if any */}
                      {order.Message && order.Message !== "Unable to retrieve Transaction details. Please check the provided parameters and try again" && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded-lg text-xs text-yellow-700">
                          {order.Message}
                        </div>
                      )}

                      {/* View Details Button */}
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowViewModal(true);
                        }}
                        className="mt-4 w-full py-2 border border-gold-500 text-gold-600 rounded-lg hover:bg-gold-50 transition-all flex items-center justify-center gap-2"
                      >
                        <FaEye /> View Details
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
                <FaUtensils className="text-4xl mx-auto mb-3 text-gray-300" />
                <p className="text-gray-600">No orders found</p>
              </div>
            )}
          </div>
        )}

        {/* View Order Modal */}
        {showViewModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Order Details</h3>
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedOrder(null);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Order ID and Status */}
                  <div className="bg-gold-50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-mono text-sm">{selectedOrder._id}</p>
                      </div>
                      {(() => {
                        const status = getStatusInfo(selectedOrder.status);
                        return (
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${status.color}`}>
                            {status.icon}
                            {status.label}
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* User Information */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <FaUser className="text-gold-500" /> Customer Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-medium">{selectedOrder.UserId?.fullname}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{selectedOrder.UserId?.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">User ID</p>
                        <p className="font-mono text-xs">{selectedOrder.UserId?._id?.slice(-8)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MdRestaurantMenu className="text-gold-500" /> Order Details
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex gap-4 mb-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100">
                          {selectedOrder.MenuItemId?.image ? (
                            <img 
                              src={selectedOrder.MenuItemId.image} 
                              alt={selectedOrder.MenuItemId?.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <FaUtensils className="text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{selectedOrder.MenuItemId?.name}</p>
                          <p className="text-sm text-gray-500">Item ID: {selectedOrder.MenuItemId?._id?.slice(-8)}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-medium">{formatPrice(selectedOrder.Price)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Quantity</p>
                          <p className="font-medium">{selectedOrder.Qty}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Total Amount</p>
                          <p className="font-bold text-gold-600">{formatPrice(selectedOrder.TotalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-medium">{formatPrice(selectedOrder.Amount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <MdPayment className="text-gold-500" /> Payment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                      <div>
                        <p className="text-xs text-gray-500">Payment Method</p>
                        <p className="font-medium">{selectedOrder.Payment_Method}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Account Number</p>
                        <p className="font-mono">{selectedOrder.AccountNo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {selectedOrder.Message && (
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700">{selectedOrder.Message}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="text-xs text-gray-400 border-t pt-4">
                    <div className="flex justify-between">
                      <span>Created: {formatDate(selectedOrder.createdAt)}</span>
                      <span>Updated: {formatDate(selectedOrder.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;