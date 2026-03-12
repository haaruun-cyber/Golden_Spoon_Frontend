import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUtensils, 
  FaHome, 
  FaInfoCircle, 
  FaImages, 
  FaEnvelope,
  FaPhone,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaShoppingCart,
  FaCalendarAlt,
  FaSearch,
  FaUtensilSpoon
} from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import { jwtDecode } from 'jwt-decode';
import { FiLogOut } from "react-icons/fi";
import { MdHistory } from "react-icons/md";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [User, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(3); // Example cart count
  const location = useLocation();

  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    gettoken();
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowDropdown(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Menu', path: '/menu', icon: <MdMenuBook /> },
    { 
      name: 'Pages', 
      path: '#',
      icon: <FaInfoCircle />,
      dropdown: [
        { name: 'About Us', path: '/about' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Reservation', path: '/reservation' },
        { name: 'Reservation History', path: '/reservationHistory', icon: <MdHistory /> },
        { name: 'Contact', path: '/contact' }
      ]
    },
    { name: 'Gallery', path: '/gallery', icon: <FaImages /> },
    { name: 'My Orders', path: '/myorders', icon: <MdOutlineRestaurantMenu /> },
  ];

  const gettoken = () => {
    try {
      const token = localStorage.getItem('token');
      if(token){
      const decode = jwtDecode(token);
      setUser(decode);
      // console.log(decode);
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      {/* Top Bar - Contact Info (Hidden on mobile) */}
      <div className={`hidden lg:block bg-gray-900 text-white py-2 transition-all duration-300 ${
        scrolled ? 'opacity-0 h-0 overflow-hidden py-0' : 'opacity-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <FaPhone className="text-gold-500 text-sm" />
              <span className="text-sm">(252) 619-122684</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-gold-500 text-sm" />
              <span className="text-sm">haaruunhassan4737@gmail.com</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Mon-Sun: 11am - 10pm</span>
            <Link 
              to="/reservation" 
              className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-1 rounded-full text-sm font-semibold transition-all"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
          : 'bg-white shadow-md py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gold-500 p-2 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
                <FaUtensilSpoon className="text-amber-500 text-2xl" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-800 block leading-tight">Golden</span>
                <span className="text-sm font-semibold text-gold-600 block leading-tight">Spoon</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => link.dropdown && setShowDropdown(true)}
                  onMouseLeave={() => link.dropdown && setShowDropdown(false)}
                >
                  {link.dropdown ? (
                    <>
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          location.pathname.startsWith('/about') || 
                          location.pathname.startsWith('/gallery') ||
                          location.pathname.startsWith('/reservation') ||
                          location.pathname.startsWith('/contact')
                            ? 'text-gold-600 bg-gold-50'
                            : 'text-gray-700 hover:text-gold-600 hover:bg-gold-50'
                        }`}
                      >
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.name}</span>
                        <FaChevronDown className={`text-xs transition-transform duration-300 group-hover:rotate-180 ${
                          showDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>

                      {/* Dropdown Menu */}
                      {showDropdown && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fadeIn">
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              className={`block px-4 py-2 text-sm hover:bg-gold-50 hover:text-gold-600 transition-colors ${
                                location.pathname === item.path
                                  ? 'text-gold-600 bg-gold-50 font-medium'
                                  : 'text-gray-700'
                              }`}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        location.pathname === link.path
                          ? 'text-gold-600 bg-gold-50'
                          : 'text-gray-700 hover:text-gold-600 hover:bg-gold-50'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gold-50 text-gray-600 hover:text-gold-600 transition-all">
                <FaSearch />
              </button>

              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative hidden lg:flex items-center justify-center w-10 h-10 rounded-full hover:bg-gold-50 text-gray-600 hover:text-gold-600 transition-all"
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {
                  User ? (
                    <div className="hidden md:flex items-center gap-4 px-4">

                      {/* Avatar */}
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gold-500 bg-blue-600 capitalize text-white font-semibold">
                        {User.fullname?.charAt(0)}
                      </div>

                      {/* User Info */}
                      <div className="leading-tight">
                        <p className="text-sm font-semibold text-gray-800">
                          {User.fullname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {User.email}
                        </p>
                      </div>

                      {/* Logout */}
                      <button
                        onClick={logout}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors cursor-pointer"
                      >
                        <FiLogOut className="text-lg" />
                        Logout
                      </button>

                    </div>
                  ) : (
                    <div className="hidden lg:flex items-center gap-3 ml-2">
                      <Link
                        to="/login"
                        className="px-4 py-2 text-gray-700 hover:text-gold-600 font-medium transition-colors"
                      >
                        Login
                      </Link>

                      <Link
                        to="/signup"
                        className="bg-gold-500 hover:bg-gold-600 text-black px-4 py-2 rounded-lg font-medium transition-all hover:shadow-md"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )
                }
              

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gold-500 text-black hover:bg-gold-600 transition-all"
              >
                {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
              isOpen ? 'max-h-150 opacity-100 mt-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {/* Mobile Menu Links */}
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.dropdown ? (
                    <>
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-700 hover:bg-gold-50 hover:text-gold-600 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{link.icon}</span>
                          <span className="font-medium">{link.name}</span>
                        </div>
                        <FaChevronDown className={`transition-transform duration-300 ${
                          showDropdown ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {/* Mobile Dropdown */}
                      <div className={`pl-12 space-y-2 overflow-hidden transition-all duration-300 ${
                        showDropdown ? 'max-h-48 mt-2' : 'max-h-0'
                      }`}>
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.name}
                            to={item.path}
                            className={`block px-4 py-2 rounded-lg text-sm ${
                              location.pathname === item.path
                                ? 'text-gold-600 bg-gold-100 font-medium'
                                : 'text-gray-600 hover:text-gold-600 hover:bg-gold-50'
                            }`}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        location.pathname === link.path
                          ? 'text-gold-600 bg-gold-100 font-medium'
                          : 'text-gray-700 hover:text-gold-600 hover:bg-gold-50'
                      }`}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium">{link.name}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Search */}
              <div className="relative px-4 py-2">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
{
  User ? (
    <div className="md:hidden flex items-center gap-4 px-4">

      {/* Avatar */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 capitalize text-white font-semibold">
        {User?.fullname?.charAt(0) || "U"}
      </div>

      {/* User Info */}
      <div className="leading-tight">
        <p className="text-sm font-semibold text-gray-800">
          {User.fullname}
        </p>
        <p className="text-xs text-gray-500">
          {User.email}
        </p>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-medium transition-colors cursor-pointer"
      >
        <FiLogOut className="text-lg" />
        Logout
      </button>

    </div>
  ) : (

    <div className="md:hidden flex flex-col gap-2 pt-2 border-t border-gray-200">
      <Link
        to="/login"
        className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gold-50 hover:text-gold-600 transition-all"
      >
        <FaUser /> Login
      </Link>

      <Link
        to="/signup"
        className="flex items-center justify-center gap-2 px-4 py-3 bg-gold-500 text-black rounded-lg font-medium hover:bg-gold-600 transition-all"
      >
        Sign Up
      </Link>
    </div>

  )
}

              {/* Mobile Contact Info */}
              <div className="pt-2 text-sm text-gray-500">
                <div className="flex items-center gap-2 px-4 py-2">
                  <FaPhone className="text-gold-500" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2">
                  <FaEnvelope className="text-gold-500" />
                  <span>info@goldenplate.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;