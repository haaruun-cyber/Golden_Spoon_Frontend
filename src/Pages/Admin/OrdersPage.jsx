import React, { useState, useEffect } from "react";
import {
  FaUtensils,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaEye,
  FaUser,
  FaTrash,
  FaEdit,
  FaExclamationTriangle,
} from "react-icons/fa";
import { MdPayment, MdRestaurantMenu, MdAdminPanelSettings } from "react-icons/md";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const getAuthToken = () => localStorage.getItem("token");

  // Fetch Orders
  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();

      const res = await axios.get(
        import.meta.env.VITE_API_URL + "/api/order/getall",
        {
          headers: {
            "Content-Type": "application/json",
            token,
          },
        }
      );

      if (res.data.status) {
        setOrders(res.data.data || []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Get User Name
  const getUserName = (user) => {
    if (!user) return "Unknown User";
    if (typeof user === "object") return user.fullname || user.name || "User";
    return String(user).slice(-6);
  };

  // Get Menu Item
  const getMenuItem = (item) => {
    if (!item) return { name: "Unknown Item", price: 0 };

    if (typeof item === "object") {
      return {
        name: item.name,
        price: item.price,
        image: item.image,
      };
    }

    return { name: "Unknown Item", price: 0 };
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price || 0);

  const getStatusInfo = (status) => {
    switch (status) {
      case "paid":
        return {
          color: "bg-green-100 text-green-700",
          icon: <FaCheckCircle />,
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: <FaClock />,
        };
      case "failed":
        return {
          color: "bg-red-100 text-red-700",
          icon: <FaTimesCircle />,
        };
      default:
        return {
          color: "bg-gray-100 text-gray-600",
          icon: <FaExclamationTriangle />,
        };
    }
  };

  // Filter Orders
  const filteredOrders = orders.filter((order) => {
    const menuItem = getMenuItem(order.MenuItemId);
    const userName = getUserName(order.UserId);

    const id = String(order._id);

    const matchSearch =
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      menuItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchSearch && matchStatus;
  });

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const stats = {
    total: orders.length,
    paid: orders.filter((o) => o.status === "paid").length,
    pending: orders.filter((o) => o.status === "pending").length,
    failed: orders.filter((o) => o.status === "failed").length,
    revenue: orders
      .filter((o) => o.status === "paid")
      .reduce((a, b) => a + (b.TotalAmount || 0), 0),
  };

  return (
    <div className="p-6">
      <Toaster />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <MdAdminPanelSettings className="text-yellow-500" />
          Orders Management
        </h1>
        <p className="text-gray-500">View and manage all orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Stat label="Total" value={stats.total} />
        <Stat label="Paid" value={stats.paid} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Failed" value={stats.failed} />
        <Stat label="Revenue" value={formatPrice(stats.revenue)} />
      </div>

      {/* Search */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex gap-3">
        <div className="relative flex-1">
          <FaSearch className="absolute top-3 left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search order, user, item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border rounded-lg"
          />
        </div>

        <select
          className="border rounded-lg px-3"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <button
          onClick={fetchAllOrders}
          className="bg-yellow-500 px-4 py-2 rounded-lg"
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {sortedOrders.map((order) => {
              const menuItem = getMenuItem(order.MenuItemId);
              const status = getStatusInfo(order.status);

              return (
                <tr key={order._id} className="border-t">
                  <td className="p-3 font-mono text-xs">
                    {String(order._id).slice(-6)}
                  </td>

                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-400" />
                      {getUserName(order.UserId)}
                    </div>
                  </td>

                  <td className="p-3 flex items-center gap-2">
                    <FaUtensils className="text-gray-400" />
                    {menuItem.name}
                  </td>

                  <td className="p-3">{order.Qty}</td>

                  <td className="p-3 font-bold text-yellow-600">
                    {formatPrice(order.TotalAmount)}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded flex items-center gap-1 w-fit ${status.color}`}
                    >
                      {status.icon}
                      {order.status}
                    </span>
                  </td>

                  <td className="p-3 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowViewModal(true);
                      }}
                      className="p-2 bg-blue-100 rounded"
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!sortedOrders.length && (
          <div className="text-center p-10 text-gray-500">
            <FaUtensils className="mx-auto text-4xl mb-3 text-gray-300" />
            No orders found
          </div>
        )}
      </div>

      {/* View Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-125">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            <p><b>Customer:</b> {getUserName(selectedOrder.UserId)}</p>
            <p><b>Item:</b> {getMenuItem(selectedOrder.MenuItemId).name}</p>
            <p><b>Qty:</b> {selectedOrder.Qty}</p>
            <p><b>Total:</b> {formatPrice(selectedOrder.TotalAmount)}</p>
            <p><b>Status:</b> {selectedOrder.status}</p>
            <p><b>Date:</b> {formatDate(selectedOrder.createdAt)}</p>

            <button
              onClick={() => setShowViewModal(false)}
              className="mt-4 bg-gray-200 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default OrdersPage;