import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaLock, 
  FaUtensils,
  FaGoogle,
  FaFacebookF,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaHeart,
  FaStar
} from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    isUserLoggedIn();
  },[])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = import.meta.env.VITE_API_URL + '/api/user/login';
      const { data } = await axios.post(url, formData);
      console.log(data)
      if (data.status === true) {
        localStorage.setItem('token', data.token);
        localStorage.setItem("role", data.data.role);
        toast.success(data.message);
        if(data.data.role === "admin"){
          setTimeout(() => {
            navigate('/admin/dashboard');
            // window.location.reload();
          }, 3000);
          // console.log("admin way")
        }else{
          setTimeout(() => {
            navigate('/');
            // window.location.reload();
          }, 3000);
          // console.log("user way")
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

    //check if user is logged in to make reservation
  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if(token) {
      navigate('/');
    }
  }

  // ✅ GOOGLE LOGIN FUNCTION
  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const url = import.meta.env.VITE_API_URL + '/api/user/GoogleLogin';

      const { data } = await axios.post(url, {
        token: credentialResponse.credential,
      });
      console.log(data)

      if (data.status === true) {
        localStorage.setItem('token', data.token);
        toast.success("Google login successful!");
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 3000);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <Toaster />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gold-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating Food Icons */}
        <div className="absolute top-20 left-20 text-gold-500/20 animate-bounce">
          <FaUtensils className="text-6xl" />
        </div>
        <div className="absolute bottom-20 right-20 text-gold-500/20 animate-bounce delay-700">
          <FaHeart className="text-6xl" />
        </div>
        <div className="absolute top-40 right-40 text-gold-500/20 animate-ping">
          <FaStar className="text-4xl" />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border border-gold-500/20 transform hover:scale-[1.02] transition-all duration-500">
        <div className="flex flex-col lg:flex-row">
          
          {/* Left Side - Welcome Back Section with Golden Theme */}
          <div className="lg:w-1/2 bg-linear-to-br from-gold-500 to-gold-700 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden group">
            {/* Animated Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 right-0 w-60 h-60 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3 group-hover:scale-150 transition-transform duration-1000 delay-300"></div>
              <div className="absolute top-1/2 left-1/2 w-80 h-80 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-1000 delay-700"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-white p-3 rounded-2xl transform group-hover:rotate-12 transition-transform duration-300">
                  <FaUtensils className="text-gold-600 text-3xl" />
                </div>
                <h1 className="text-3xl font-bold text-white">Golden Plate</h1>
              </div>

              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Welcome<br />Back to<br />Flavor!
              </h2>

              <p className="text-white/90 text-lg mb-12">
                Log in to continue your culinary journey with us. We've missed you!
              </p>

              {/* Today's Special Counter */}
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm border border-white/20">
                <h3 className="text-white font-semibold mb-3">Today's Special Offers</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">50%</div>
                    <div className="text-white/70 text-xs">Off on Starters</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">2x1</div>
                    <div className="text-white/70 text-xs">Main Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">Free</div>
                    <div className="text-white/70 text-xs">Dessert</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="relative z-10 mt-8 flex justify-between text-white">
              <div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-white/70 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold">50+</div>
                <div className="text-white/70 text-sm">Dish Varieties</div>
              </div>
              <div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-white/70 text-sm">Google Rating</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="lg:w-1/2 p-8 lg:p-12 bg-white">
            <div className="max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">Member Login</h3>
                <p className="text-gray-600">Access your account and manage your reservations</p>
              </div>

              {/* Social Login */}
              {/* <div className="mb-8">
                <button className="flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl py-3 px-4 transition-all duration-300 hover:shadow-lg hover:border-gold-300 group w-full">
                  <FaGoogle className="text-red-500 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 text-sm font-medium">Google</span>
                </button>
              </div> */}

              {/* ✅ GOOGLE BUTTON */}
                <div className="mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => toast.error("Google Login Failed")}
                  />
                </div>

              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all group-focus-within:shadow-lg"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gold-600 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <Link 
                    to="/ForgotPasswordPage" 
                    className="text-sm text-gold-600 hover:text-gold-700 font-semibold hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-gold-500 to-gold-600 text-black font-bold py-3 px-4 rounded-xl hover:from-gold-600 hover:to-gold-700 transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300 shadow-lg shadow-gold-500/30 flex items-center justify-center gap-2 group"
                >
                  <span>Login</span>
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>

              {/* Additional Links */}
              <div className="mt-8 space-y-4">
                <p className="text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-gold-600 hover:text-gold-700 font-semibold hover:underline">
                    Create Account
                  </Link>
                </p>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white text-sm text-gray-500">Quick links</span>
                  </div>
                </div>

                <div className="flex justify-center gap-4 text-sm">
                  <Link to="/menu" className="text-gray-600 hover:text-gold-600 transition-colors">
                    View Menu
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/reservation" className="text-gray-600 hover:text-gold-600 transition-colors">
                    Make Reservation
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/contact" className="text-gray-600 hover:text-gold-600 transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                <FaLock className="text-gold-500" />
                <span>Secure login with 256-bit encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;