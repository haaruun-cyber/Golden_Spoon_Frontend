// App.js
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import SignUp from './Pages/SignUp';
import Navbar from './Components/Navbar';
import Reservation from './Pages/Reservation';
import NotFound from './Pages/NotFound';
import Menu from './Pages/Menu';
import About from './Pages/About ';
import ForgotPasswordPage from './Pages/ForgotPasswordPage';
import ResetPasswordPage from './Pages/ResetPasswordPage';
import Gallery from './Pages/Gallery';
import Contact from './Pages/Contact';
import ReservationHistory from './Pages/reservationHistory';
import Dashboard from './Pages/Admin/Dashboard';
import AdminRoute from "./Components/AdminRoute";
import CheckOut from './Pages/CheckOut';
import MyOrders from './Pages/MyOrders';

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <div className="min-h-screen bg-white">
      {!isAdminPage && <Navbar />}
      {/* <Navbar /> */}
      <main>
        <Routes>
          <Route path="/admin/dashboard" element={<AdminRoute>
                                                    <Dashboard />
                                                  </AdminRoute>} />
          {/* <Route path="/admin/dashboard" element={<Dashboard />} /> */}

          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/checkout/:id" element={<CheckOut />} />
          <Route path="/reservationHistory" element={<ReservationHistory />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/ForgotPasswordPage" element={<ForgotPasswordPage />} />
          <Route path="/ResetPasswordPage/:token" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;