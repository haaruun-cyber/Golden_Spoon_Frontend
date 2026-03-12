import React, { useState, useEffect } from 'react';
import { 
  FaUtensils, 
  FaDollarSign, 
  FaEdit, 
  FaTrash, 
  FaPlus,
  FaSearch,
  FaTimes,
  FaExclamationTriangle,
  FaSpinner,
  FaImage,
  FaClock,
  FaFire,
  FaPepperHot,
  FaLeaf,
  FaStar,
  FaCalendarAlt
} from 'react-icons/fa';
import { MdCategory, MdRestaurantMenu } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const MenuItems = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    calories: '',
    prepTime: '',
    spicy: false,
    vegetarian: false,
    popular: false,
    image: '',
    category: 'starters'
  });

  // Fetch all menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch all menu items
  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(import.meta.env.VITE_API_URL + '/api/menu/getallmenu', {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
    //   console.log(response.data);
      setMenuItems(response.data.message || response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Add new menu item
  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.post(import.meta.env.VITE_API_URL + '/api/menu/createmenu', formData, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      
      if (response.data.status === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message || 'Menu item added successfully');
      }
      
      setShowAddModal(false);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    } finally {
      setLoading(false);
    }
  };

  // Get single menu item by ID
  const fetchMenuItemById = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(import.meta.env.VITE_API_URL + `/api/menu/getmenubyid/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch menu item details');
      return null;
    }
  };

  // Open edit modal with menu item data
  const openEditModal = async (item) => {
    setSelectedItem(item);
    const itemData = await fetchMenuItemById(item._id.$oid || item._id);
    if (itemData) {
      setFormData({
        name: itemData.name || '',
        description: itemData.description || '',
        price: itemData.price || '',
        calories: itemData.calories || '',
        prepTime: itemData.prepTime || '',
        spicy: itemData.spicy || false,
        vegetarian: itemData.vegetarian || false,
        popular: itemData.popular || false,
        image: itemData.image || '',
        category: itemData.category || 'starters'
      });
      setShowEditModal(true);
    }
  };

  // Update menu item
  const handleUpdateItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.put(import.meta.env.VITE_API_URL + `/api/menu/updatemenu/${selectedItem._id.$oid || selectedItem._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });

    //   console.log(response.data);
      if (response.data.status === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message || 'Menu item updated successfully');
      }
      
      setShowEditModal(false);
      resetForm();
      fetchMenuItems();
    } catch (error) {
      console.error('Error updating menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteItem = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.delete(import.meta.env.VITE_API_URL + `/api/menu/deletemenu/${selectedItem._id.$oid || selectedItem._id}`, {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
      
    //   console.log(response.data);
      if (response.data.status === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message || 'Menu item deleted successfully');
      }
      
      setShowDeleteModal(false);
      setSelectedItem(null);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      calories: '',
      prepTime: '',
      spicy: false,
      vegetarian: false,
      popular: false,
      image: '',
      category: 'starters'
    });
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter menu items based on search
  const filteredItems = menuItems.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get category badge color
  const getCategoryColor = (category) => {
    const colors = {
      starters: 'bg-blue-100 text-blue-800',
      'main course': 'bg-green-100 text-green-800',
      seafood: 'bg-teal-100 text-teal-800',
      salads: 'bg-lime-100 text-lime-800',
      desserts: 'bg-pink-100 text-pink-800',
      beverages: 'bg-purple-100 text-purple-800'
    };
    return colors[category?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Menu Items Management</h2>
          <p className="text-gray-600 mt-1">Manage all menu items in the system</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={loading}
          className="mt-4 md:mt-0 bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-all flex items-center gap-2 self-start disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaPlus /> Add New Menu Item
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search menu items by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && !menuItems.length ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading menu items...</p>
        </div>
      ) : (
        /* Menu Items Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item._id?.$oid || item._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all">
                {/* Image */}
                <div className="h-48 overflow-hidden bg-gray-100 relative">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaImage className="text-4xl text-gray-300" />
                    </div>
                  )}
                  
                  {/* Popular Badge */}
                  {item.popular && (
                    <div className="absolute top-4 left-4 bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <FaStar className="text-xs" /> Popular
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                    <span className="text-xl font-bold text-gold-600">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {item.description || 'No description available'}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.category)}`}>
                      <MdCategory className="inline mr-1" />
                      {item.category}
                    </span>
                    
                    {item.spicy && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaPepperHot /> Spicy
                      </span>
                    )}
                    
                    {item.vegetarian && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <FaLeaf /> Vegetarian
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {item.calories && (
                      <span className="flex items-center gap-1">
                        <FaFire className="text-orange-500" /> {item.calories} cal
                      </span>
                    )}
                    {item.prepTime && (
                      <span className="flex items-center gap-1">
                        <FaClock className="text-blue-500" /> {item.prepTime}
                      </span>
                    )}
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-400 space-y-1 mb-4">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      Created: {formatDate(item.createdAt?.$date || item.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-xs" />
                      Updated: {formatDate(item.updatedAt?.$date || item.updatedAt)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => openEditModal(item)}
                      disabled={loading}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 disabled:opacity-50"
                      title="Edit Item"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setShowDeleteModal(true);
                      }}
                      disabled={loading}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600 disabled:opacity-50"
                      title="Delete Item"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {/* Item ID (small text) */}
                  <div className="mt-2 text-xs text-gray-400">
                    ID: {(item._id?.$oid || item._id)?.slice(-8)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
              <FaUtensils className="text-4xl mx-auto mb-3 text-gray-300" />
              <p className="text-gray-600">No menu items found</p>
            </div>
          )}
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add New Menu Item</h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleAddItem}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name *
                    </label>
                    <div className="relative">
                      <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="Truffle Arancini"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      placeholder="Crispy risotto balls with mozzarella, served with truffle aioli"
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="14"
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <MdCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none bg-white"
                      >
                        <option value="starters">Starters</option>
                        <option value="main course">Main Course</option>
                        <option value="seafood">Seafood</option>
                        <option value="salads">Salads</option>
                        <option value="desserts">Desserts</option>
                        <option value="beverages">Beverages</option>
                      </select>
                    </div>
                  </div>

                  {/* Calories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories
                    </label>
                    <div className="relative">
                      <FaFire className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="320"
                      />
                    </div>
                  </div>

                  {/* Prep Time */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prep Time
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="prepTime"
                        value={formData.prepTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="15 min"
                      />
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <div className="relative">
                      <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                        placeholder="https://images.unsplash.com/..."
                      />
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="spicy"
                          checked={formData.spicy}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FaPepperHot className="text-red-500" /> Spicy
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="vegetarian"
                          checked={formData.vegetarian}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FaLeaf className="text-green-500" /> Vegetarian
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="popular"
                          checked={formData.popular}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FaStar className="text-gold-500" /> Popular
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gold-500 text-black py-2 rounded-lg hover:bg-gold-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <FaSpinner className="animate-spin" />}
                    Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Item Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Edit Menu Item</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleUpdateItem}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Same form fields as Add Modal */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name *
                    </label>
                    <div className="relative">
                      <FaUtensils className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <MdCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 appearance-none bg-white"
                      >
                        <option value="starters">Starters</option>
                        <option value="main course">Main Course</option>
                        <option value="seafood">Seafood</option>
                        <option value="salads">Salads</option>
                        <option value="desserts">Desserts</option>
                        <option value="beverages">Beverages</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Calories
                    </label>
                    <div className="relative">
                      <FaFire className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        name="calories"
                        value={formData.calories}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prep Time
                    </label>
                    <div className="relative">
                      <FaClock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="prepTime"
                        value={formData.prepTime}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL
                    </label>
                    <div className="relative">
                      <FaImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="spicy"
                          checked={formData.spicy}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FaPepperHot className="text-red-500" /> Spicy
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="vegetarian"
                          checked={formData.vegetarian}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FaLeaf className="text-green-500" /> Vegetarian
                        </span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="popular"
                          checked={formData.popular}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gold-500 rounded focus:ring-gold-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          <FaStar className="text-gold-500" /> Popular
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gold-500 text-black py-2 rounded-lg hover:bg-gold-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <FaSpinner className="animate-spin" />}
                    Update Item
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Menu Item</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete <span className="font-semibold">{selectedItem.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteItem}
                  disabled={loading}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading && <FaSpinner className="animate-spin" />}
                  Delete
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItems;