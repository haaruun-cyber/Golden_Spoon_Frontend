import React, { useEffect, useState } from 'react';
import { 
  FaUtensils, 
  FaSearch,
  FaFilter,
  FaLeaf,
  FaFire,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaChevronRight,
  FaClock,
  FaPepperHot,
  FaWineGlassAlt,
  FaCookieBite,
  FaFish,
  FaDrumstickBite
} from 'react-icons/fa';
import { GiNoodles, GiSteak,  GiCakeSlice, GiWineGlass } from 'react-icons/gi';
import { MdRestaurantMenu, MdLocalDrink, MdBreakfastDining, MdLunchDining, MdDinnerDining } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    spicy: false,
    popular: false
  });

  useEffect(() => {
    GetAllMenus();
  },[])

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

  // Categories
  const categories = [
    { id: 'all', name: 'All Items', icon: <MdRestaurantMenu /> },
    { id: 'starters', name: 'Starters', icon: <FaLeaf /> },
    { id: 'main', name: 'Main Course', icon: <GiSteak /> },
    { id: 'seafood', name: 'Seafood', icon: <FaFish /> },
    { id: 'salads', name: 'Salads' },
    { id: 'desserts', name: 'Desserts', icon: <GiCakeSlice /> },
    { id: 'beverages', name: 'Beverages', icon: <MdLocalDrink /> }
  ];

  // Menu Items Data
  // const menuItems = [
  //   // Starters
  //   {
  //     id: 1,
  //     name: 'Truffle Arancini',
  //     description: 'Crispy risotto balls with mozzarella, served with truffle aioli',
  //     price: 14,
  //     category: 'starters',
  //     image: 'https://images.unsplash.com/photo-1625937285711-3b37c45c2fc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: false,
  //     spicy: false,
  //     prepTime: '15 min',
  //     calories: '320'
  //   },
  //   {
  //     id: 2,
  //     name: 'Calamari Fritti',
  //     description: 'Lightly fried calamari with spicy marinara and lemon',
  //     price: 16,
  //     category: 'starters',
  //     image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: false,
  //     spicy: true,
  //     prepTime: '12 min',
  //     calories: '450'
  //   },
  //   {
  //     id: 3,
  //     name: 'Bruschetta Classico',
  //     description: 'Toasted bread with fresh tomatoes, garlic, basil, and balsamic glaze',
  //     price: 12,
  //     category: 'starters',
  //     image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: false,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '10 min',
  //     calories: '280'
  //   },

  //   // Main Course
  //   {
  //     id: 4,
  //     name: 'Wagyu Beef Burger',
  //     description: 'Premium wagyu beef, aged cheddar, caramelized onions, truffle fries',
  //     price: 28,
  //     category: 'main',
  //     image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: false,
  //     spicy: false,
  //     prepTime: '25 min',
  //     calories: '850'
  //   },
  //   {
  //     id: 5,
  //     name: 'Grilled Ribeye Steak',
  //     description: '12oz ribeye with herb butter, roasted vegetables, mashed potatoes',
  //     price: 42,
  //     category: 'main',
  //     image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: false,
  //     spicy: false,
  //     prepTime: '30 min',
  //     calories: '980'
  //   },
  //   {
  //     id: 6,
  //     name: 'Mushroom Risotto',
  //     description: 'Creamy arborio rice with wild mushrooms, parmesan, truffle oil',
  //     price: 24,
  //     category: 'main',
  //     image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: false,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '25 min',
  //     calories: '620'
  //   },

  //   // Seafood
  //   {
  //     id: 7,
  //     name: 'Pan-Seared Salmon',
  //     description: 'Atlantic salmon with lemon butter sauce, asparagus, quinoa',
  //     price: 32,
  //     category: 'seafood',
  //     image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: false,
  //     spicy: false,
  //     prepTime: '20 min',
  //     calories: '580'
  //   },
  //   {
  //     id: 8,
  //     name: 'Lobster Mac & Cheese',
  //     description: 'Lobster meat, truffle oil, four-cheese blend, breadcrumb topping',
  //     price: 36,
  //     category: 'seafood',
  //     image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: false,
  //     spicy: false,
  //     prepTime: '22 min',
  //     calories: '890'
  //   },

  //   // Salads
  //   {
  //     id: 9,
  //     name: 'Caesar Salad',
  //     description: 'Romaine lettuce, parmesan, croutons, house-made Caesar dressing',
  //     price: 16,
  //     category: 'salads',
  //     image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '10 min',
  //     calories: '380'
  //   },
  //   {
  //     id: 10,
  //     name: 'Greek Salad',
  //     description: 'Feta cheese, olives, cucumber, tomato, red onion, oregano',
  //     price: 15,
  //     category: 'salads',
  //     image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: false,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '10 min',
  //     calories: '340'
  //   },

  //   // Desserts
  //   {
  //     id: 11,
  //     name: 'Molten Chocolate Cake',
  //     description: 'Warm chocolate cake with liquid center, vanilla ice cream',
  //     price: 14,
  //     category: 'desserts',
  //     image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '15 min',
  //     calories: '520'
  //   },
  //   {
  //     id: 12,
  //     name: 'Tiramisu',
  //     description: 'Classic Italian dessert with mascarpone, coffee, cocoa',
  //     price: 12,
  //     category: 'desserts',
  //     image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '10 min',
  //     calories: '380'
  //   },

  //   // Beverages
  //   {
  //     id: 13,
  //     name: 'Signature Cocktail',
  //     description: 'House specialty with vodka, elderflower, fresh berries',
  //     price: 14,
  //     category: 'beverages',
  //     image: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: true,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '5 min',
  //     calories: '220'
  //   },
  //   {
  //     id: 14,
  //     name: 'Wine Selection',
  //     description: 'Glass of house red or white wine',
  //     price: 12,
  //     category: 'beverages',
  //     image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  //     popular: false,
  //     vegetarian: true,
  //     spicy: false,
  //     prepTime: '3 min',
  //     calories: '150'
  //   }
  // ];

  // Filter and search items
  const filteredItems = menuItems.filter(item => {
    // Category filter
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    
    // Search filter
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    
    // Additional filters
    if (filters.vegetarian && !item.vegetarian) return false;
    if (filters.spicy && !item.spicy) return false;
    if (filters.popular && !item.popular) return false;
    
    return true;
  });

  const addToCart = (item) => {
    setCartItems(prev => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1
    }));
    
    // Show feedback
    const btn = document.getElementById(`item-${item.id}`);
    btn.classList.add('animate-add-to-cart');
    setTimeout(() => {
      btn.classList.remove('animate-add-to-cart');
    }, 500);
  };

  const toggleFilter = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
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
              <MdRestaurantMenu className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Our <span className="text-gold-400">Menu</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our carefully crafted dishes made with the finest ingredients
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-20 z-40 bg-white shadow-md py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-all"
            >
              <FaFilter />
              Filters
              {(filters.vegetarian || filters.spicy || filters.popular) && (
                <span className="bg-white text-gold-600 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                  {Object.values(filters).filter(Boolean).length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
              <h3 className="font-semibold text-gray-700 mb-3">Filter by:</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => toggleFilter('vegetarian')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.vegetarian 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaLeaf /> Vegetarian
                </button>
                <button
                  onClick={() => toggleFilter('spicy')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.spicy 
                      ? 'bg-red-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaPepperHot /> Spicy
                </button>
                <button
                  onClick={() => toggleFilter('popular')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filters.popular 
                      ? 'bg-gold-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <FaStar /> Popular
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex overflow-x-auto pb-4 gap-2 scrollbar-hide">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-gold-500 text-white shadow-lg scale-105 bg-black'
                  : 'bg-white text-gray-700 hover:bg-gold-100 border border-gray-200'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😋</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No dishes found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <div
                key={item._id}
                id={`item-${item._id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                     onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Food+Image";
                    }}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.popular && (
                      <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaStar /> Popular
                      </span>
                    )}
                    {item.vegetarian && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaLeaf /> Veg
                      </span>
                    )}
                    {item.spicy && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                        <FaPepperHot /> Spicy
                      </span>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <span className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs flex items-center gap-1">
                      <FaClock /> {item.prepTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <span className="text-2xl font-bold text-gold-600">${item.price}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  
                  {/* Calories */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                    <FaFire className="text-orange-500" />
                    {item.calories} cal
                  </div>

                  {/* Order Button */}
                  <Link to={`/checkout/${item._id}`} className="w-full bg-linear-to-r from-gold-500 to-gold-600 text-black py-3 rounded-lg font-semibold hover:from-gold-600 hover:to-gold-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 group">
                    <FaShoppingCart className="group-hover:rotate-12 transition-transform" />
                    Add to Order
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Summary (if items in cart) */}
      {Object.keys(cartItems).length > 0 && (
        <div className="sticky bottom-8 max-w-7xl mx-auto px-4 mb-8">
          <div className="bg-linear-to-r from-gold-500 to-gold-600 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 p-3 rounded-full">
                <FaShoppingCart className="text-2xl" />
              </div>
              <div>
                <p className="font-semibold">Your Order</p>
                <p className="text-sm opacity-90">
                  {Object.values(cartItems).reduce((a, b) => a + b, 0)} items
                </p>
              </div>
            </div>
            <button className="bg-white text-gold-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              View Cart
            </button>
          </div>
        </div>
      )}

      {/* Add custom animation */}
      <style>{`
        @keyframes addToCart {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); background-color: #FFB800; color: white; }
          100% { transform: scale(1); }
        }
        
        .animate-add-to-cart {
          animation: addToCart 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Hide scrollbar for categories */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Menu;