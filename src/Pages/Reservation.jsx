import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaCalendarAlt, 
  FaClock, 
  FaUsers,
  FaUtensils,
  FaChair,
  FaComment,
  FaCheckCircle,
  FaWineGlassAlt,
  FaCreditCard,
  FaBell,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaShare,
  FaPrint,
  FaDownload
} from 'react-icons/fa';
import { MdDateRange, MdAccessTime, MdRestaurant, MdCelebration } from 'react-icons/md';
import { GiPartyHat, GiWineGlass, GiCakeSlice } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

const Reservation = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    occasion: 'none',
    specialRequests: '',
    seating: 'any',
    diningPreference: 'indoor'
  });
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [notifications, setNotifications] = useState({
    emailReminder: true,
    smsReminder: false
  });

  const navigate = useNavigate();

  // Generate available times based on selected date
  useEffect(() => {
    isUserLoggedIn();

    if (formData.date) {
      // Simulate fetching available times from API
      const allTimes = [
        '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
        '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM'
      ];
      
      // Randomly mark some times as unavailable
      const available = allTimes.filter(() => Math.random() > 0.3);
      setAvailableTimes(available.sort());
      
      // Set date info
      const date = new Date(formData.date);
      setSelectedDateInfo({
        day: date.toLocaleDateString('en-US', { weekday: 'long' }),
        month: date.toLocaleDateString('en-US', { month: 'long' }),
        dayNumber: date.getDate(),
        year: date.getFullYear()
      });
    }
  }, [formData.date]);



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};
    
    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    }
    
    if (stepNumber === 2) {
      if (!formData.date) newErrors.date = 'Please select a date';
      if (!formData.time) newErrors.time = 'Please select a time';
      if (!formData.guests) newErrors.guests = 'Please select number of guests';
    }
    
    return newErrors;
  };

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length === 0) {
      setStep(step + 1);
    } else {
      setErrors(stepErrors);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   const finalErrors = validateStep(2);
    
  //   if (Object.keys(finalErrors).length === 0) {
  //     console.log('Reservation submitted:', { ...formData, notifications });
  //     setSubmitted(true);
      
  //     // Reset form after 5 seconds
  //     setTimeout(() => {
  //       setSubmitted(false);
  //       setStep(1);
  //       setFormData({
  //         name: '',
  //         email: '',
  //         phone: '',
  //         date: '',
  //         time: '',
  //         guests: '2',
  //         occasion: 'none',
  //         specialRequests: '',
  //         seating: 'any',
  //         diningPreference: 'indoor'
  //       });
  //       setNotifications({
  //         emailReminder: true,
  //         smsReminder: false
  //       });
  //     }, 5000);
  //   } else {
  //     setErrors(finalErrors);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalErrors = validateStep(2);

    if (Object.keys(finalErrors).length !== 0) {
      setErrors(finalErrors);
      toast.error("Please fix the form errors.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const url = import.meta.env.VITE_API_URL + '/api/reservation/createreservation';
      const { data } = await axios.post(url,{
          ...formData,
          guests: Number(formData.guests),
          notifications
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token
          }
        }
      );
      console.log(data);

      if (data.status == false) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);

      setSubmitted(true);

    } catch (error) {
      toast.error(
        error?.data?.message || "Something went wrong."
      );
    }
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Get max date (60 days from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Check if date is weekend
  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  //check if user is logged in to make reservation
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if(!token) {
      navigate('/login');
    }
  }
  

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster />
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-gold-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative mb-12 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-linear-to-r from-gold-500 to-gold-600 p-4 rounded-full shadow-lg animate-bounce-slow">
            <FaUtensils className="text-white text-3xl" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Make a <span className="text-gold-500">Reservation</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Book your table now and experience culinary excellence at Golden Plate
        </p>

        {/* Progress Steps */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex-1 text-center relative">
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold z-10 relative transition-all duration-300 ${
                  step >= num 
                    ? 'bg-gold-500 text-white scale-110 shadow-lg' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > num ? <FaCheckCircle /> : num}
                </div>
                <div className="text-xs mt-2 font-medium text-gray-600">
                  {num === 1 ? 'Details' : num === 2 ? 'Date & Time' : 'Confirm'}
                </div>
                {num < 3 && (
                  <div className={`absolute top-5 left-[60%] w-[80%] h-0.5 transition-all duration-500 ${
                    step > num ? 'bg-gold-500' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Enhanced Restaurant Info */}
            <div className="lg:w-1/3 bg-linear-to-b from-gold-500 to-gold-700 p-8 text-white relative overflow-hidden">
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-60 h-60 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
                  <MdRestaurant className="text-3xl" />
                  Golden Plate
                </h2>
                
                {/* Current Date/Time Display */}
                {selectedDateInfo && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 animate-slideDown">
                    <p className="text-sm opacity-90">Selected Date</p>
                    <p className="text-xl font-bold text-black">
                      {selectedDateInfo.day}, {selectedDateInfo.month} {selectedDateInfo.dayNumber}
                    </p>
                    {formData.time && (
                      <p className="text-lg mt-1">at {formData.time}</p>
                    )}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Opening Hours with Status */}
                  <div className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-xl transition-all">
                    <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <FaClock className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-black">Opening Hours</h3>
                      <p className="text-black/80 text-sm">Mon-Thu: 11am - 10pm</p>
                      <p className="text-black/80 text-sm">Fri-Sat: 11am - 11pm</p>
                      <p className="text-black/80 text-sm">Sun: 10am - 9pm</p>
                      <span className="inline-block mt-2 bg-green-400 text-xs px-2 py-1 rounded-full">
                        Open Now
                      </span>
                    </div>
                  </div>

                  {/* Party Size with Visual */}
                  <div className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-xl transition-all">
                    <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <FaUsers className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-black">Party Size</h3>
                      <p className="text-black/80 text-sm">Tables for 2-12 people</p>
                      <div className="flex gap-1 mt-2 text-black">
                        {[1,2,3,4].map(num => (
                          <div key={num} className={`w-6 h-6 rounded-full border-2 border-white/50 flex items-center justify-center text-xs ${
                            parseInt(formData.guests) >= num * 3 ? 'bg-white/30' : ''
                          }`}>
                            {num * 3}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Special Arrangements with Icons */}
                  <div className="flex items-start gap-4 group hover:bg-white/5 p-3 rounded-xl transition-all">
                    <div className="bg-white/20 p-3 rounded-lg group-hover:scale-110 transition-transform">
                      <GiPartyHat className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1 text-black">Special Occasions</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="bg-white/10 px-2 py-1 rounded-full text-xs text-black">🎂 Birthday</span>
                        <span className="bg-white/10 px-2 py-1 rounded-full text-xs text-black">💍 Anniversary</span>
                        <span className="bg-white/10 px-2 py-1 rounded-full text-xs text-black">💼 Business</span>
                      </div>
                    </div>
                  </div>

                  {/* Benefits with Animation */}
                  <div className="border-t border-white/20 pt-6">
                    <h3 className="font-semibold mb-3 text-black">Why book with us?</h3>
                    <div className="space-y-2 text-black">
                      {[
                        'Confirmed reservation instantly',
                        'Best table selection',
                        'Special occasion accommodation',
                        'Free cancellation up to 2 hours',
                        'Earn loyalty points'
                      ].map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-black/80 group hover:text-white transition-colors">
                          <FaCheckCircle className="text-gold-200 group-hover:scale-110 transition-transform" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Availability Indicator */}
                <div className="mt-8 bg-white/10 p-4 rounded-xl animate-pulse-slow">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    <span className="text-sm font-semibold text-black">Live Availability</span>
                  </div>
                  <p className="text-sm text-black/80">
                    {availableTimes.length} time slots available today
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - Enhanced Reservation Form */}
            <div className="lg:w-2/3 p-8">
              {submitted ? (
                <div className="h-full flex items-center justify-center animate-fadeIn">
                  <div className="text-center max-w-md">
                    <div className="relative mb-8">
                      <div className="bg-green-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
                        <FaCheckCircle className="text-green-500 text-6xl" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-40 h-40 border-4 border-green-500 rounded-full animate-ping opacity-20"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">Reservation Confirmed! 🎉</h3>
                    <p className="text-gray-600 mb-6">
                      Thank you, {formData.name}! We've sent a confirmation to {formData.email}
                    </p>
                    
                    <div className="bg-linear-to-r from-gold-50 to-gold-100 p-6 rounded-xl mb-6">
                      <div className="grid grid-cols-2 gap-4 text-left">
                        <div>
                          <p className="text-xs text-gray-500">Date</p>
                          <p className="font-semibold">{formData.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Time</p>
                          <p className="font-semibold">{formData.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="font-semibold">{formData.guests} people</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Table</p>
                          <p className="font-semibold">Table 7 (Window)</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3">
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaShare className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaPrint className="text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <FaDownload className="text-gray-600" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-400 mt-6">
                      Add to calendar: 
                      <button className="text-gold-600 hover:text-gold-700 ml-2">Google</button> • 
                      <button className="text-gold-600 hover:text-gold-700 ml-2">Apple</button> • 
                      <button className="text-gold-600 hover:text-gold-700 ml-2">Outlook</button>
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Details */}
                  {step === 1 && (
                    <div className="animate-slideIn">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Details</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Full Name *
                          </label>
                          <div className="relative group">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                                errors.name ? 'border-red-500' : 'border-gray-200'
                              }`}
                              placeholder="John Doe"
                            />
                            {errors.name && (
                              <p className="absolute text-xs text-red-500 mt-1">{errors.name}</p>
                            )}
                          </div>
                        </div>

                        {/* Email */}
                        <div className="col-span-2 md:col-span-1">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Email Address *
                          </label>
                          <div className="relative group">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                                errors.email ? 'border-red-500' : 'border-gray-200'
                              }`}
                              placeholder="john@example.com"
                            />
                            {errors.email && (
                              <p className="absolute text-xs text-red-500 mt-1">{errors.email}</p>
                            )}
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="col-span-2">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Phone Number *
                          </label>
                          <div className="relative group">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                                errors.phone ? 'border-red-500' : 'border-gray-200'
                              }`}
                              placeholder="(555) 123-4567"
                            />
                            {errors.phone && (
                              <p className="absolute text-xs text-red-500 mt-1">{errors.phone}</p>
                            )}
                          </div>
                        </div>

                        {/* Dining Preference */}
                        <div className="col-span-2">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Dining Preference
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="diningPreference"
                                value="indoor"
                                checked={formData.diningPreference === 'indoor'}
                                onChange={handleChange}
                                className="text-gold-500"
                              />
                              <span>Indoor</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name="diningPreference"
                                value="outdoor"
                                checked={formData.diningPreference === 'outdoor'}
                                onChange={handleChange}
                                className="text-gold-500"
                              />
                              <span>Outdoor (Weather permitting)</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <FaBell className="text-gold-500" />
                          Reminders
                        </h3>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={notifications.emailReminder}
                              onChange={() => handleNotificationChange('emailReminder')}
                              className="text-gold-500 rounded"
                            />
                            <span className="text-sm text-gray-600">Email reminder 24h before</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={notifications.smsReminder}
                              onChange={() => handleNotificationChange('smsReminder')}
                              className="text-gold-500 rounded"
                            />
                            <span className="text-sm text-gray-600">SMS reminder 2h before</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Date, Time & Preferences */}
                  {step === 2 && (
                    <div className="animate-slideIn">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Date & Preferences</h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Reservation Date *
                          </label>
                          <div className="relative group">
                            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                            <input
                              type="date"
                              name="date"
                              value={formData.date}
                              onChange={handleChange}
                              min={today}
                              max={maxDateString}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                                errors.date ? 'border-red-500' : 'border-gray-200'
                              }`}
                            />
                          </div>
                          {formData.date && isWeekend(formData.date) && (
                            <p className="text-xs text-gold-600 mt-1">
                              ⚡ Weekend rates may apply
                            </p>
                          )}
                          {errors.date && (
                            <p className="text-xs text-red-500 mt-1">{errors.date}</p>
                          )}
                        </div>

                        {/* Time */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Reservation Time *
                          </label>
                          <div className="relative">
                            <MdAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                              name="time"
                              value={formData.time}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none bg-white ${
                                errors.time ? 'border-red-500' : 'border-gray-200'
                              }`}
                            >
                              <option value="">Select a time</option>
                              {availableTimes.map(time => (
                                <option key={time} value={time}>{time}</option>
                              ))}
                            </select>
                          </div>
                          {errors.time && (
                            <p className="text-xs text-red-500 mt-1">{errors.time}</p>
                          )}
                        </div>

                        {/* Guests */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Number of Guests *
                          </label>
                          <div className="relative">
                            <FaUsers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                              name="guests"
                              value={formData.guests}
                              onChange={handleChange}
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none bg-white ${
                                errors.guests ? 'border-red-500' : 'border-gray-200'
                              }`}
                            >
                              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Occasion */}
                        <div>
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Occasion
                          </label>
                          <div className="relative">
                            <GiPartyHat className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                              name="occasion"
                              value={formData.occasion}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none bg-white"
                            >
                              <option value="none">None</option>
                              <option value="birthday">🎂 Birthday</option>
                              <option value="anniversary">💍 Anniversary</option>
                              <option value="date">❤️ Date Night</option>
                              <option value="business">💼 Business Dinner</option>
                              <option value="family">👨‍👩‍👧‍👦 Family Gathering</option>
                              <option value="other">✨ Other</option>
                            </select>
                          </div>
                        </div>

                        {/* Seating Preference */}
                        <div className="col-span-2">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Seating Preference
                          </label>
                          <div className="relative">
                            <FaChair className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                              name="seating"
                              value={formData.seating}
                              onChange={handleChange}
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all appearance-none bg-white"
                            >
                              <option value="any">No preference</option>
                              <option value="window">Window view</option>
                              <option value="quiet">Quiet area</option>
                              <option value="private">Private booth</option>
                              <option value="bar">Bar seating</option>
                            </select>
                          </div>
                        </div>

                        {/* Special Requests */}
                        <div className="col-span-2">
                          <label className="block text-gray-700 text-sm font-semibold mb-2">
                            Special Requests
                          </label>
                          <div className="relative">
                            <FaComment className="absolute left-3 top-3 text-gray-400" />
                            <textarea
                              name="specialRequests"
                              value={formData.specialRequests}
                              onChange={handleChange}
                              rows="3"
                              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all"
                              placeholder="Dietary restrictions, allergies, special occasions..."
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {step === 3 && (
                    <div className="animate-slideIn">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Reservation</h2>
                      
                      <div className="bg-gold-50 rounded-xl p-6 mb-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Summary</h3>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-semibold">{formData.name}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-semibold">{formData.email}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Phone:</span>
                            <span className="font-semibold">{formData.phone}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Date:</span>
                            <span className="font-semibold">{formData.date}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Time:</span>
                            <span className="font-semibold">{formData.time}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Guests:</span>
                            <span className="font-semibold">{formData.guests} people</span>
                          </div>
                          {formData.occasion !== 'none' && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Occasion:</span>
                              <span className="font-semibold capitalize">{formData.occasion}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Dining:</span>
                            <span className="font-semibold capitalize">{formData.diningPreference}</span>
                          </div>
                        </div>
                      </div>

                      {/* Terms and Conditions */}
                      <div className="mb-6">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="text-gold-500 rounded" required />
                          <span className="text-sm text-gray-600">
                            I agree to the <a href="#" className="text-gold-600 hover:underline">cancellation policy</a> and <a href="#" className="text-gold-600 hover:underline">terms of service</a>
                          </span>
                        </label>
                      </div>

                      {/* Additional Info */}
                      <div className="bg-blue-50 p-4 rounded-lg mb-6">
                        <p className="text-sm text-blue-800 flex items-start gap-2">
                          <FaBell className="mt-0.5 shrink-0" />
                          <span>
                            A confirmation email will be sent to {formData.email}. 
                            {notifications.smsReminder && ' You\'ll also receive SMS reminders.'}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between">
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                      >
                        Back
                      </button>
                    )}
                    
                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="ml-auto px-6 py-3 bg-gold-500 text-black rounded-lg hover:bg-gold-600 transition-all font-semibold shadow-lg shadow-gold-500/30"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="ml-auto px-6 py-3 bg-linear-to-r from-gold-500 to-gold-600 text-black rounded-lg hover:from-gold-600 hover:to-gold-700 transition-all font-semibold shadow-lg shadow-gold-500/30 transform hover:scale-105"
                      >
                        Confirm Reservation
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gold-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaPhone className="text-gold-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
            <p className="text-gray-600">(555) 123-4567</p>
            <p className="text-xs text-gray-400 mt-2">24/7 Support</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gold-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaEnvelope className="text-gold-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Email Us</h3>
            <p className="text-gray-600">reservations@</p>
            <p className="text-gray-600">goldenplate.com</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gold-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaMapMarkerAlt className="text-gold-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Visit Us</h3>
            <p className="text-gray-600">123 Gourmet St</p>
            <p className="text-gray-600">New York, NY</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="bg-gold-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCreditCard className="text-gold-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Gift Cards</h3>
            <p className="text-gray-600">Available online</p>
            <p className="text-xs text-gold-600 mt-2">Buy Now →</p>
          </div>
        </div>

        {/* Loyalty Program Banner */}
        <div className="mt-8 bg-linear-to-r from-gold-500 to-gold-600 rounded-xl p-6 text-black">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <FaStar className="text-4xl" />
              <div>
                <h3 className="text-xl font-bold">Join Our Loyalty Program</h3>
                <p className="text-black/90">Earn points with every reservation and get exclusive offers</p>
              </div>
            </div>
            <button className="bg-white text-gold-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Reservation;