import axios from 'axios';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaUser,
  FaComment,
  FaPaperPlane,
  FaCheckCircle,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYelp,
  FaUtensils,
  FaParking,
  FaWheelchair,
  FaWifi,
  FaMusic
} from 'react-icons/fa';
import { MdRestaurant, MdLocalParking, MdAccessibility } from 'react-icons/md';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const locations = [
    {
      city: 'Downtown',
      address: '123 Gourmet Street, Culinary District, NY 10001',
      phone: '(555) 123-4567',
      email: 'downtown@goldenplate.com',
      hours: 'Mon-Sun: 11am - 11pm',
      manager: 'Sarah Johnson'
    },
    {
      city: 'Uptown',
      address: '456 Elegant Avenue, Luxury Heights, NY 10023',
      phone: '(555) 765-4321',
      email: 'uptown@goldenplate.com',
      hours: 'Mon-Sun: 11am - 10pm',
      manager: 'Michael Chen'
    }
  ];

  const amenities = [
    { icon: <FaParking />, name: 'Valet Parking' },
    { icon: <FaWheelchair />, name: 'Wheelchair Access' },
    { icon: <FaWifi />, name: 'Free WiFi' },
    { icon: <FaMusic />, name: 'Live Music' }
  ];

  const faqs = [
    {
      question: 'Do you accept reservations?',
      answer: 'Yes, we recommend making reservations, especially for weekends and special occasions.'
    },
    {
      question: 'Do you accommodate dietary restrictions?',
      answer: 'Absolutely! Please inform us of any allergies or dietary requirements when booking.'
    },
    {
      question: 'Is there a dress code?',
      answer: 'We maintain a smart casual dress code. No sportswear or flip-flops, please.'
    },
    {
      question: 'Do you offer private dining?',
      answer: 'Yes, we have private rooms for events and special occasions. Contact us for details.'
    }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const newErrors = validateForm();
      if (Object.keys(newErrors).length !== 0) {
        setErrors(newErrors);
        return;
      }

      try {
        const url = import.meta.env.VITE_API_URL + "/api/contact/create";
        const { data } = await axios.post(url, formData);

        if (data.status == false) {
          toast.error(data.message);
          return;
        }

        toast.success(data.message);
        setSubmitted(true);

        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: ""
          });
        }, 5000);

      } catch (error) {
        toast.error(
          error?.message || "Something went wrong"
        );
      }
    };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100">
      <Toaster />
      {/* Hero Section */}
      <div className="relative bg-linear-to-r from-gray-900 to-gray-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-4 border-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-gold-500 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gold-500 p-4 rounded-full">
              <FaEnvelope className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Get in <span className="text-gold-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>
      </div>

      {/* Quick Contact Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Phone Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaPhone className="text-gold-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-1">(555) 123-4567</p>
            <p className="text-gray-500 text-sm">24/7 Customer Service</p>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-gold-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-1">info@goldenplate.com</p>
            <p className="text-gray-500 text-sm">We reply within 24h</p>
          </div>

          {/* Location Card */}
          <div className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:-translate-y-2 transition-all duration-300">
            <div className="bg-gold-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-gold-600 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-1">123 Gourmet Street</p>
            <p className="text-gray-500 text-sm">New York, NY 10001</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Send us a <span className="text-gold-500">Message</span>
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheckCircle className="text-green-500 text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Message Sent!</h3>
                <p className="text-gray-600 mb-4">
                  Thank you for reaching out, {formData.name}! We'll get back to you soon.
                </p>
                <div className="bg-gold-50 p-4 rounded-xl">
                  <p className="text-gold-700">
                    A confirmation has been sent to {formData.email}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Phone (Optional) */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="reservation">Reservation</option>
                    <option value="feedback">Feedback</option>
                    <option value="catering">Catering</option>
                    <option value="private">Private Event</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Your Message *
                  </label>
                  <div className="relative">
                    <FaComment className="absolute left-4 top-4 text-gray-400" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="Tell us how we can help..."
                    ></textarea>
                  </div>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-linear-to-r from-gold-500 to-gold-600 font-bold py-4 px-6 rounded-lg hover:from-gold-600 hover:to-gold-700 transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-gold-500/30 flex items-center justify-center gap-2 group"
                >
                  <FaPaperPlane className="group-hover:translate-x-1 transition-transform" />
                  Send Message
                </button>

                <p className="text-xs text-center text-gray-500">
                  * Required fields. We'll never share your information.
                </p>
              </form>
            )}
          </div>

          {/* Location Information */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden h-64">
              <iframe
                title="Restaurant Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.119763973046!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564628954!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>

            {/* Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map((location, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MdRestaurant className="text-gold-500 text-2xl" />
                    <h3 className="text-xl font-bold text-gray-800">{location.city}</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <FaMapMarkerAlt className="text-gold-500 mt-1 flex-shrink-0" />
                      <p className="text-gray-600">{location.address}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaPhone className="text-gold-500 flex-shrink-0" />
                      <p className="text-gray-600">{location.phone}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaEnvelope className="text-gold-500 flex-shrink-0" />
                      <p className="text-gray-600">{location.email}</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <FaClock className="text-gold-500 flex-shrink-0" />
                      <p className="text-gray-600">{location.hours}</p>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-gray-500">
                        <span className="font-semibold">Manager:</span> {location.manager}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Amenities</h3>
              <div className="grid grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-600">
                    <span className="text-gold-500 text-xl">{amenity.icon}</span>
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaClock className="text-gold-500" />
                Business Hours
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Monday - Thursday</span>
                  <span className="font-semibold">11:00 AM - 10:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Friday - Saturday</span>
                  <span className="font-semibold">11:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold">10:00 AM - 9:00 PM</span>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gold-600">*Kitchen closes 30 minutes before closing</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked <span className="text-gold-500">Questions</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our restaurant
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-gradient-to-r from-gold-500 to-gold-600 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Connect With Us</h3>
          <div className="flex justify-center gap-4">
            <a href="#" className="bg-blue-700 hover:bg-white hover:text-blue-700 text-white hover:text-gold-600 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110">
              <FaFacebookF />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-white hover:text-blue-700 text-white hover:text-gold-600 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110">
              <FaInstagram />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-white hover:text-blue-700 text-white hover:text-gold-600 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110">
              <FaTwitter />
            </a>
            <a href="#" className="bg-blue-700 hover:bg-white hover:text-blue-700 text-white hover:text-gold-600 w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-110">
              <FaYelp />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;