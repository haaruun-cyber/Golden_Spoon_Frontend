import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUtensils, 
  FaClock, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaStar,
  FaChevronRight,
  FaChevronLeft,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaYelp,
  FaLeaf,
  FaWineGlassAlt,
  FaUsers,
  FaAward,
  FaQuoteRight,
  FaPlay,
  FaPause
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import toast from 'react-hot-toast';
import axios from 'axios';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [counts, setCounts] = useState({
    dishes: 0,
    chefs: 0,
    awards: 0,
    customers: 0
  });

  // Hero Slider Images
  const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    title: "Experience Fine Dining",
    subtitle: "Where every meal is a masterpiece"
  },
  {
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    title: "Authentic Flavors",
    subtitle: "Inspired by traditional recipes"
  },
  {
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1950&q=80",
    title: "Fresh Ingredients",
    subtitle: "Quality you can taste in every bite"
  },
  {
    image: "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=1950&q=80",
    title: "Delicious Desserts",
    subtitle: "Sweet moments to remember"
  },
  {
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1950&q=80",
    title: "Cozy Ambience",
    subtitle: "Dine in comfort and elegance"
  },
  {
    image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1950&q=80",
    title: "Chef’s Special",
    subtitle: "Crafted with passion and creativity"
  }
];

  useEffect(() => {
    GetAllMenus();
  },[])


  // Auto-play slider
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, heroSlides.length]);

  // Counter Animation
  useEffect(() => {
    const targetCounts = {
      dishes: 150,
      chefs: 25,
      awards: 18,
      customers: 15000
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = {
      dishes: targetCounts.dishes / steps,
      chefs: targetCounts.chefs / steps,
      awards: targetCounts.awards / steps,
      customers: targetCounts.customers / steps
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < steps) {
        setCounts({
          dishes: Math.min(Math.floor(increment.dishes * currentStep), targetCounts.dishes),
          chefs: Math.min(Math.floor(increment.chefs * currentStep), targetCounts.chefs),
          awards: Math.min(Math.floor(increment.awards * currentStep), targetCounts.awards),
          customers: Math.min(Math.floor(increment.customers * currentStep), targetCounts.customers)
        });
        currentStep++;
      } else {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Featured Dishes
  const featuredDishes = [
    {
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with herb crust",
      price: "$28",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.8
    },
    {
      name: "Beef Wellington",
      description: "Tender beef fillet with mushroom duxelles",
      price: "$45",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.9
    },
    {
      name: "Truffle Pasta",
      description: "Homemade pasta with black truffle",
      price: "$32",
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.7
    },
    {
      name: "Chocolate Soufflé",
      description: "Warm chocolate soufflé with vanilla ice cream",
      price: "$16",
      image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 4.9
    }
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Food Critic",
      image: "https://images.unsplash.com/photo-1494790108777-223d679b22c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "The best dining experience I've had in years. The attention to detail and flavor combinations are simply outstanding.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Regular Customer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "Exceptional service and incredible food. The ambiance is perfect for both romantic dinners and family gatherings.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Food Blogger",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
      text: "Every dish is a work of art. The chefs truly understand how to balance flavors and present food beautifully.",
      rating: 5
    }
  ];

  const GetAllMenus = async () => {
    try {
      const url =  import.meta.env.VITE_API_URL + '/api/menu/getallmenu';
      const { data } = await axios.get(url);
      setMenuItems(data.message);
      // console.log(data)
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  }
  return (
    <div className="min-h-screen bg-white">
      
      {/* ===== HERO SECTION WITH SLIDER ===== */}
      <section className="relative h-screen">
        {/* Slider Images */}
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="absolute inset-0 bg-black/40 z-10"></div>
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-center text-white px-4">
                  <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gold-300">
                    {slide.subtitle}
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link
                      to="/reservation"
                      className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg"
                    >
                      Reserve a Table
                    </Link>
                    <Link
                      to="/menu"
                      className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-full font-semibold transition-all transform hover:scale-105"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-gold-500 text-white p-3 rounded-full z-30 transition-all"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-gold-500 text-white p-3 rounded-full z-30 transition-all"
        >
          <FaChevronRight />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute bottom-8 right-8 bg-black/50 hover:bg-gold-500 text-white p-3 rounded-full z-30 transition-all"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? 'w-8 bg-gold-500'
                  : 'w-2 bg-white/50 hover:bg-white'
              }`}
            ></button>
          ))}
        </div>
      </section>

      {/* ===== WELCOME SECTION ===== */}
      <section className="py-20 px-4 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 font-semibold tracking-wider uppercase">
              Welcome to Golden Plate
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
              Where Culinary Art Meets <span className="text-gold-500">Excellence</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Since 2010, we've been dedicated to creating unforgettable dining experiences 
              with the finest ingredients, expert chefs, and impeccable service.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="bg-gold-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors">
                <FaLeaf className="text-3xl text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Fresh Ingredients</h3>
              <p className="text-gray-600">Sourced daily from local farms</p>
            </div>
            <div className="text-center group">
              <div className="bg-gold-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors">
                <FaWineGlassAlt className="text-3xl text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Chefs</h3>
              <p className="text-gray-600">Michelin-starred culinary team</p>
            </div>
            <div className="text-center group">
              <div className="bg-gold-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors">
                <FaUsers className="text-3xl text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Great Service</h3>
              <p className="text-gray-600">Attentive and professional staff</p>
            </div>
            <div className="text-center group">
              <div className="bg-gold-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500 transition-colors">
                <FaAward className="text-3xl text-gold-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Award Winning</h3>
              <p className="text-gray-600">Multiple culinary excellence awards</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== COUNTER SECTION ===== */}
      <section className="py-20 bg-linear-to-r from-gold-600 to-gold-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-white rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center text-[#101828]">
              <div className="text-5xl font-bold mb-2">{counts.dishes}+</div>
              <div className="text-gold-200">Dish Varieties</div>
            </div>
            <div className="text-center text-[#101828]">
              <div className="text-5xl font-bold mb-2">{counts.chefs}+</div>
              <div className="text-gold-200">Expert Chefs</div>
            </div>
            <div className="text-center text-[#101828]">
              <div className="text-5xl font-bold mb-2">{counts.awards}+</div>
              <div className="text-gold-200">Awards Won</div>
            </div>
            <div className="text-center text-[#101828]">
              <div className="text-5xl font-bold mb-2">{counts.customers.toLocaleString()}+</div>
              <div className="text-gold-200">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED DISHES ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 font-semibold tracking-wider uppercase">
              Signature Dishes
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
              Our Chef's <span className="text-gold-500">Specialties</span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Carefully crafted dishes that showcase the best of our culinary expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {menuItems.slice(0,4).map((dish) => (
    <div
      key={dish._id}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {dish.popular && (
            <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              Popular
            </span>
          )}
          {dish.vegetarian && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              Veg
            </span>
          )}
          {dish.spicy && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Spicy
            </span>
          )}
        </div>

        {/* Prep Time */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {dish.prepTime}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{dish.name}</h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {dish.description}
        </p>

        {/* Calories */}
        <p className="text-xs text-gray-500 mb-4">
          🔥 {dish.calories} calories
        </p>

        {/* Price + Button */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gold-600">
            ${dish.price}
          </span>

          <Link
            to="/menu"
            className="text-gold-600 hover:text-gold-700 font-semibold flex items-center gap-1 group"
          >
            Order Now
            <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  ))}
</div>

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-transparent border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-all"
            >
              View Full Menu <FaChevronRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold-500 font-semibold tracking-wider uppercase">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
              What Our <span className="text-gold-500">Guests Say</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all relative"
              >
                <FaQuoteRight className="absolute top-6 right-6 text-4xl text-gold-200" />
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-gold-500 text-sm" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESERVATION CTA ===== */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Restaurant interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-gray-900/90 to-gray-900/70"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready for a <span className="text-gold-400">Memorable</span> Dining Experience?
          </h2>
          <p className="text-xl mb-8 text-gray-200">
            Book your table now and indulge in culinary excellence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservation"
              className="bg-gold-500 hover:bg-gold-600 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Make a Reservation
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all transform hover:scale-105"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* About */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <FaUtensils className="text-gold-500 text-2xl" />
                <h3 className="text-2xl font-bold text-white">Golden Plate</h3>
              </div>
              <p className="mb-6">
                Experience the finest dining with our exquisite cuisine and exceptional service.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gold-500 transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  <FaTwitter />
                </a>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  <FaYelp />
                </a>
              </div>
            </div>

            {/* Hours */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Hours</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaClock className="text-gold-500" />
                  <div>
                    <p>Monday - Thursday</p>
                    <p className="text-white">11:00 AM - 10:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gold-500" />
                  <div>
                    <p>Friday - Saturday</p>
                    <p className="text-white">11:00 AM - 11:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-gold-500" />
                  <div>
                    <p>Sunday</p>
                    <p className="text-white">10:00 AM - 9:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-gold-500 mt-1" />
                  <p>123 Gourmet Street, Culinary District, NY 10001</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-gold-500" />
                  <p>(555) 123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <MdDeliveryDining className="text-gold-500 text-xl" />
                  <p>Free delivery on orders over $50</p>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Newsletter</h4>
              <p className="mb-4">Subscribe for special offers and updates</p>
              <form className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <button className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-3 rounded-lg font-semibold transition-all">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p>&copy; 2024 Golden Plate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;