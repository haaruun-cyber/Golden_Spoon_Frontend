import React, { useState, useEffect } from 'react';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaSearch,
  FaTimes,
  FaSpinner,
  FaEye,
  FaCalendarAlt,
  FaTag,
  FaComment
} from 'react-icons/fa';
import { MdMessage, MdSubject } from 'react-icons/md';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Contacts = () => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [filterSubject, setFilterSubject] = useState('all');

  // Fetch all contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  // Fetch all contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      const response = await axios.get(import.meta.env.VITE_API_URL + '/api/contact/getall', {
        headers: {
          'Content-Type': 'application/json',
          'token': token
        }
      });
    //   console.log(response.data);
      setContacts(response.data.data || response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

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

  // Get subject badge color
  const getSubjectColor = (subject) => {
    const colors = {
      reservation: 'bg-blue-100 text-blue-800',
      general: 'bg-gray-100 text-gray-800',
      feedback: 'bg-green-100 text-green-800',
      catering: 'bg-purple-100 text-purple-800',
      private: 'bg-gold-100 text-gold-800'
    };
    return colors[subject?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  // Get subject icon
  const getSubjectIcon = (subject) => {
    switch(subject?.toLowerCase()) {
      case 'reservation': return '📅';
      case 'general': return '📝';
      case 'feedback': return '⭐';
      case 'catering': return '🍽️';
      case 'private': return '🎉';
      default: return '📧';
    }
  };

  // Filter contacts based on search and subject
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.includes(searchTerm) ||
      contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterSubject === 'all') return matchesSearch;
    return matchesSearch && contact.subject === filterSubject;
  });

  // Sort contacts by date (most recent first)
  const sortedContacts = [...filteredContacts].sort((a, b) => {
    return new Date(b.createdAt?.$date || b.createdAt) - new Date(a.createdAt?.$date || a.createdAt);
  });

  // Get unique subjects for filter
  const uniqueSubjects = ['all', ...new Set(contacts.map(c => c.subject))];

  return (
    <div className="p-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Contact Messages</h2>
          <p className="text-gray-600 mt-1">View all customer messages and inquiries</p>
        </div>
        <button
          onClick={fetchContacts}
          disabled={loading}
          className="mt-4 md:mt-0 bg-gold-500 text-black px-4 py-2 rounded-lg hover:bg-gold-600 transition-all flex items-center gap-2 self-start disabled:opacity-50"
        >
          <FaSpinner className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 bg-white"
            >
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject.charAt(0).toUpperCase() + subject.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && !contacts.length ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <FaSpinner className="animate-spin text-4xl text-gold-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading messages...</p>
        </div>
      ) : (
        /* Contacts Table */
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedContacts.length > 0 ? (
                  sortedContacts.map((contact) => (
                    <tr key={contact._id?.$oid || contact._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                            <FaUser className="text-gold-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-xs text-gray-500">ID: {(contact._id?.$oid || contact._id)?.slice(-8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <FaEnvelope className="text-gold-500 text-xs" /> {contact.email}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <FaPhone className="text-gold-500 text-xs" /> {contact.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getSubjectColor(contact.subject)}`}>
                          <span>{getSubjectIcon(contact.subject)}</span>
                          {contact.subject?.charAt(0).toUpperCase() + contact.subject?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-gray-600 truncate">
                          {contact.message || 'No message'}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <FaCalendarAlt className="text-gold-500" />
                          {formatDate(contact.createdAt?.$date || contact.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setSelectedContact(contact);
                            setShowViewModal(true);
                          }}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <FaEnvelope className="text-4xl mx-auto mb-3 text-gray-300" />
                      <p>No messages found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Message Details</h3>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedContact(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Message ID */}
                <div className="bg-gold-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Message ID</p>
                  <p className="font-mono text-sm break-all">{selectedContact._id?.$oid || selectedContact._id}</p>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <FaUser className="text-gold-500" /> Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{selectedContact.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{selectedContact.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Subject</p>
                      <p className="font-medium flex items-center gap-1">
                        <span className={getSubjectColor(selectedContact.subject)}>
                          {getSubjectIcon(selectedContact.subject)} {selectedContact.subject}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaComment className="text-gold-500" /> Message
                  </h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {selectedContact.message || 'No message content'}
                    </p>
                  </div>
                </div>

                {/* Timestamps */}
                <div className="text-xs text-gray-400 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Received: {formatDate(selectedContact.createdAt?.$date || selectedContact.createdAt)}</span>
                    <span>Last Updated: {formatDate(selectedContact.updatedAt?.$date || selectedContact.updatedAt)}</span>
                  </div>
                </div>

                {/* Version Info */}
                <div className="text-xs text-gray-400">
                  Version: {selectedContact.__v || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;