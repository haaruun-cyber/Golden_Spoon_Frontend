import React, { useState, useEffect } from 'react';
import { 
  FaUtensils, 
  FaSearch,
  FaFilter,
  FaTimes,
  FaHeart,
  FaComment,
  FaShare,
  FaStar,
  FaDownload,
  FaExpand,
  FaChevronLeft,
  FaChevronRight,
  FaInstagram,
  FaCamera,
  FaVideo,
  FaImage,
  FaClock
} from 'react-icons/fa';
import { MdRestaurantMenu, MdLocalDining, MdWineBar } from 'react-icons/md';
import { GiMeal, GiWineGlass, GiFoodTruck } from 'react-icons/gi';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [likedImages, setLikedImages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Categories
  const categories = [
    { id: 'all', name: 'All Photos', icon: <FaImage />, count: 24 },
    { id: 'food', name: 'Food', icon: <GiMeal />, count: 12 },
    { id: 'interior', name: 'Interior', icon: <MdLocalDining />, count: 6 },
    { id: 'chefs', name: 'Chefs', icon: <GiFoodTruck />, count: 3 },
    { id: 'events', name: 'Events', icon: <FaVideo />, count: 3 }
  ];

  // Gallery Data
  const galleryImages = [
    // Food Category
    {
      id: 1,
      title: 'Grilled Salmon with Vegetables',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Fresh Atlantic salmon with seasonal vegetables',
      date: '2024-02-15',
      likes: 234,
      comments: 12,
      featured: true
    },
    {
      id: 2,
      title: 'Wagyu Beef Steak',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Premium wagyu beef cooked to perfection',
      date: '2024-02-10',
      likes: 456,
      comments: 23,
      featured: true
    },
    {
      id: 3,
      title: 'Truffle Pasta',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Homemade pasta with black truffle',
      date: '2024-02-05',
      likes: 345,
      comments: 18,
      featured: false
    },
    {
      id: 4,
      title: 'Decadent Chocolate Dessert',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Rich chocolate mousse with gold leaf',
      date: '2024-01-28',
      likes: 567,
      comments: 31,
      featured: true
    },
    {
      id: 5,
      title: 'Fresh Oysters',
      category: 'food',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Freshly shucked oysters with mignonette',
      date: '2024-01-20',
      likes: 189,
      comments: 8,
      featured: false
    },

    // Interior Category
    {
      id: 6,
      title: 'Elegant Dining Room',
      category: 'interior',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Main dining area with elegant decor',
      date: '2024-02-12',
      likes: 278,
      comments: 14,
      featured: true
    },
    {
      id: 7,
      title: 'Private Dining Room',
      category: 'interior',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Intimate private dining for special occasions',
      date: '2024-02-08',
      likes: 167,
      comments: 7,
      featured: false
    },
    {
      id: 8,
      title: 'Wine Cellar',
      category: 'interior',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Extensive wine collection from around the world',
      date: '2024-02-01',
      likes: 345,
      comments: 21,
      featured: true
    },
    {
      id: 9,
      title: 'Outdoor Patio',
      category: 'interior',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
      description: 'Beautiful outdoor seating area',
      date: '2024-01-25',
      likes: 234,
      comments: 12,
      featured: false
    },

    // Chefs Category
    {
      id: 10,
      title: 'Executive Chef Marco',
      category: 'chefs',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Chef Marco preparing our signature dish',
      date: '2024-02-14',
      likes: 456,
      comments: 28,
      featured: true
    },
    {
      id: 11,
      title: 'Pastry Chef Sophie',
      category: 'chefs',
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
      description: 'Sophie creating beautiful desserts',
      date: '2024-02-09',
      likes: 389,
      comments: 19,
      featured: false
    },
    {
      id: 12,
      title: 'Kitchen Team',
      category: 'chefs',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Our talented kitchen team at work',
      date: '2024-01-30',
      likes: 267,
      comments: 15,
      featured: true
    },

    // Events Category
    {
      id: 13,
      title: 'Valentine\'s Day Dinner',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Special Valentine\'s Day celebration',
      date: '2024-02-14',
      likes: 678,
      comments: 45,
      featured: true
    },
    {
      id: 14,
      title: 'Wine Tasting Event',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Monthly wine tasting with sommelier',
      date: '2024-02-03',
      likes: 345,
      comments: 23,
      featured: false
    },
    {
      id: 15,
      title: 'New Year\'s Eve Gala',
      category: 'events',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: 'Ring in the new year with us',
      date: '2024-01-01',
      likes: 890,
      comments: 67,
      featured: true
    }
  ];

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Filter images
  const filteredImages = galleryImages.filter(img => {
    if (activeFilter !== 'all' && img.category !== activeFilter) return false;
    if (searchTerm && !img.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  // Get featured images
  const featuredImages = galleryImages.filter(img => img.featured);

  const handleLike = (id) => {
    setLikedImages(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    setSelectedImage(filteredImages[newIndex]);
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <FaCamera className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl text-gold-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Loading Gallery</h2>
          <p className="text-gold-400">Preparing beautiful moments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 border-4 border-gold-500 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 border-4 border-gold-500 rounded-full translate-x-1/3 translate-y-1/3"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gold-500 p-4 rounded-full">
              <FaCamera className="text-white text-4xl" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Our <span className="text-gold-400">Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A visual journey through our culinary creations and restaurant ambiance
          </p>
        </div>
      </div>

      {/* Featured Section */}
      {featuredImages.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <FaStar className="text-gold-500" />
            Featured Moments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredImages.slice(0, 3).map(image => (
              <div
                key={image.id}
                onClick={() => openLightbox(image)}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg h-64"
              >
                <img
                  src={image.image}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="font-semibold">{image.title}</h3>
                    <p className="text-sm text-gray-300">{image.description}</p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="sticky top-20 z-40 bg-white shadow-md py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
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
              Categories
            </button>
          </div>

          {/* Categories */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg animate-fadeIn">
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeFilter === category.id
                        ? 'bg-gold-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gold-100 border border-gray-200'
                    }`}
                  >
                    {category.icon}
                    {category.name}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      activeFilter === category.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📸</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No images found</h3>
            <p className="text-gray-600">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map(image => (
              <div
                key={image.id}
                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                onClick={() => openLightbox(image)}
              >
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                    <p className="text-xs text-gray-300 mb-2">{image.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <FaHeart className={`cursor-pointer ${likedImages[image.id] ? 'text-red-500' : 'text-white'}`} />
                          {image.likes + (likedImages[image.id] ? 1 : 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaComment /> {image.comments}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <FaClock /> {new Date(image.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-gold-500 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                  {image.category}
                </div>

                {/* Expand Button */}
                <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaExpand className="text-sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instagram Feed Section */}
      <div className="bg-gray-900 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <FaInstagram className="text-5xl text-gold-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">Follow Us on Instagram</h2>
            <p className="text-gray-400">@goldenplate.restaurant</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(0, 4).map(image => (
              <a
                key={image.id}
                href="#"
                className="relative group overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gold-500/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FaInstagram className="text-white text-3xl" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gold-400 z-10"
          >
            <FaTimes className="text-3xl" />
          </button>

          {/* Navigation */}
          <button
            onClick={() => navigateLightbox('prev')}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-400 z-10"
          >
            <FaChevronLeft className="text-4xl" />
          </button>
          
          <button
            onClick={() => navigateLightbox('next')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gold-400 z-10"
          >
            <FaChevronRight className="text-4xl" />
          </button>

          {/* Image */}
          <div className="max-w-5xl max-h-[90vh]">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300 mb-3">{selectedImage.description}</p>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleLike(selectedImage.id)}
                  className="flex items-center gap-2 hover:text-gold-400"
                >
                  <FaHeart className={likedImages[selectedImage.id] ? 'text-red-500' : ''} />
                  <span>{selectedImage.likes + (likedImages[selectedImage.id] ? 1 : 0)} likes</span>
                </button>
                <span className="flex items-center gap-2">
                  <FaComment /> {selectedImage.comments} comments
                </span>
                <span className="flex items-center gap-2">
                  <FaClock /> {new Date(selectedImage.date).toLocaleDateString()}
                </span>
                <button className="flex items-center gap-2 hover:text-gold-400">
                  <FaShare /> Share
                </button>
                <button className="flex items-center gap-2 hover:text-gold-400">
                  <FaDownload /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Gallery;