import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaUtensils, 
  FaDollarSign, 
  FaSpinner,
  FaCreditCard,
  FaLock,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaArrowLeft,
  FaShoppingCart
} from 'react-icons/fa';
import { MdRestaurantMenu, MdPayment } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { IoCloseCircle } from "react-icons/io5";

const CheckOut = () => {
  const { id } = useParams(); // Get menu item ID from URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [menuItem, setMenuItem] = useState(null);
  const [formData, setFormData] = useState({
    MenuItemId: '',
    Qty: 1,
    Amount: 0,
    Price: 0,
    AccountNo: '',
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  // Fetch menu item by ID on component mount
  useEffect(() => {
    if (id) {
      fetchMenuItem();
    }
  }, [id]);

  // Update amount when quantity or price changes
  useEffect(() => {
    isUserLoggedIn();

    if (menuItem) {
      setFormData(prev => ({
        ...prev,
        MenuItemId: id,
        Amount: menuItem.price * prev.Qty
      }));
    }
  }, [menuItem, formData.Qty, id]);

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

  // Get current user from localStorage
  const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  // Fetch menu item by ID
  const fetchMenuItem = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(import.meta.env.VITE_API_URL + `/api/menu/getmenubyid/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      
      // console.log('Menu item fetched:', response.data);
      const item = response.data.message || response.data;
      setMenuItem(item);
      
      // Pre-fill user data if available
      const user = getCurrentUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.fullname || user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        }));
      }
      
    } catch (error) {
      console.error('Error fetching menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch menu item');
      navigate('/menu'); // Redirect to menu if item not found
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name === 'Qty') {
      const qty = parseInt(value) || 1;
      setFormData(prev => ({
        ...prev,
        Qty: qty < 1 ? 1 : qty
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    try {
      // Validate form data
      if (!formData.AccountNo) {
        toast.error('Please enter account number');
        setProcessing(false);
        return;
      }
      
      if (formData.AccountNo.length < 10) {
        toast.error('Please enter a valid account number');
        setProcessing(false);
        return;
      }

      formData.Price = menuItem.price;
      
      // Simulate API call - Replace with your actual payment/order endpoint
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/order/create', formData, {
        headers: {
          'Content-Type': 'application/json',
          'token': getAuthToken()
        }
      });
      console.log('Processing order:', data);

      // Simulate successful order
      setTimeout(() => {
        const mockOrderResponse = {
          orderId: data.data._id,
          ...formData,
          status: data.data.status,
          status2: data.status,
          message: data.message,
          Payment_Method: data.data.Payment_Method,
        };
        
        setOrderDetails(mockOrderResponse);
        setOrderComplete(true);
        if(data.status == true){
          toast.success(data.message);
          setProcessing(false);
        }else{
          toast.error(data.message);
          setProcessing(false);
        }
        // toast.success('Order placed successfully!');
        // setProcessing(false);
      }, 2000);
      // setProcessing(false);
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.response?.data?.message || 'Failed to process order');
      setProcessing(false);
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading menu item...</p>
        </div>
      </div>
    );
  }

  if (orderComplete && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <Toaster />
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">

            {
              orderDetails?.status2 ? (
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <IoCloseCircle className="text-red-500 text-4xl" />
                </div>
              )
            }

            <h2 className="text-3xl font-bold text-gray-800 mb-3">{orderDetails.message}</h2>
            <p className="text-gray-600 mb-6">Thank you for your order</p>
            
            <div className="bg-gold-50 rounded-xl p-6 mb-6 text-left">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gold-200">
                <span className="font-semibold text-gray-700">Order ID:</span>
                <span className="font-mono text-gold-700">{orderDetails.orderId}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Item:</span>
                  <span className="font-medium text-gray-800">{menuItem?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium text-gray-800">{orderDetails.Qty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-bold text-gold-600">{formatPrice(orderDetails.Amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-800">{orderDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Message:</span>
                  <span className="font-medium text-gray-800">{orderDetails.message}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment_Method:</span>
                  <span className="font-medium text-gray-800">{orderDetails.Payment_Method}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/menu')}
                className="flex-1 bg-gold-500 text-black py-3 rounded-lg hover:bg-gold-600 transition-all font-semibold"
              >
                Back to Menu
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <Toaster />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gold-600 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Menu Item Details */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="h-64 overflow-hidden">
              <img 
                src={menuItem?.image || 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'} 
                alt={menuItem?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{menuItem?.name}</h2>
                  <p className="text-gray-500 text-sm mt-1">ID: {id?.slice(-8)}</p>
                </div>
                <span className="text-2xl font-bold text-gold-600">
                  {formatPrice(menuItem?.price || 0)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">
                {menuItem?.description || 'No description available'}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                {menuItem?.category && (
                  <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm">
                    {menuItem.category}
                  </span>
                )}
                {menuItem?.spicy && (
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    🌶️ Spicy
                  </span>
                )}
                {menuItem?.vegetarian && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    🌱 Vegetarian
                  </span>
                )}
                {menuItem?.popular && (
                  <span className="px-3 py-1 bg-gold-100 text-gold-700 rounded-full text-sm">
                    ⭐ Popular
                  </span>
                )}
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {menuItem?.calories && (
                    <span>🔥 {menuItem.calories} cal</span>
                  )}
                  {menuItem?.prepTime && (
                    <span>⏱️ {menuItem.prepTime}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Checkout Form */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MdPayment className="text-gold-500" /> Payment Details
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Menu Item ID (hidden) */}
              <input type="hidden" name="MenuItemId" value={id} />
              
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, Qty: Math.max(1, prev.Qty - 1) }))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="Qty"
                    value={formData.Qty}
                    onChange={handleInputChange}
                    min="1"
                    className="w-20 text-center px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, Qty: prev.Qty + 1 }))}
                    className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-700">Payment Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number *
                  </label>
                  <div className="relative">
                    <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="AccountNo"
                      value={formData.AccountNo}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Enter your account number"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    For demo purposes, enter any 10+ digit number
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gold-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-700 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Item Price:</span>
                    <span className="font-medium">{formatPrice(menuItem?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-medium">{formData.Qty}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-gold-200">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-gold-600">{formatPrice(formData.Amount)}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-linear-to-r from-gold-500 to-gold-600 text-black py-4 rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all font-bold text-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock /> Pay {formatPrice(formData.Amount)}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                <FaLock className="text-xs" /> Your payment information is secure
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;