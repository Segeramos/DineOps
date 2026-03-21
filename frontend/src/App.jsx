// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";

// Public pages
import Home from "./pages/public/Home";
import Menu from "./pages/public/Menu";
import About from "./pages/public/About";
import Gallery from "./pages/public/Gallery";
import Contact from "./pages/public/Contact";
import Reservations from "./pages/public/Reservations";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Customer pages
import CustomerDashboard from "./pages/customer/Dashboard";
import OrderHistory from "./pages/customer/OrderHistory";
import OrderTracking from "./pages/customer/OrderTracking";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import CustomerProfile from "./pages/customer/Profile";
import MakeReservation from "./pages/customer/MakeReservation";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/Orders";
import AdminReservations from "./pages/admin/Reservations";
import MenuManager from "./pages/admin/MenuManager";
import AdminCustomers from "./pages/admin/Customers";
import AdminReports from "./pages/admin/Reports";

// Super Admin pages
import SuperDashboard from "./pages/superadmin/Dashboard";
import Employees from "./pages/superadmin/Employees";
import SuperCustomers from "./pages/superadmin/Customers";
import Accounting from "./pages/superadmin/Accounting";
import SuperReports from "./pages/superadmin/Reports";
import SystemSettings from "./pages/superadmin/SystemSettings";

export default function App() {
  return (
    <AuthProvider>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/reservations" element={<Reservations />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Customer */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute role="customer">
                <OrderHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute role="customer">
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute role="customer">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute role="customer">
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute role="customer">
                <CustomerProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/make-reservation"
            element={
              <ProtectedRoute role="customer">
                <MakeReservation />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="admin">
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute role="admin">
                <AdminReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/menu"
            element={
              <ProtectedRoute role="admin">
                <MenuManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute role="admin">
                <AdminCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="admin">
                <AdminReports />
              </ProtectedRoute>
            }
          />

          {/* Super Admin */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute role="superadmin">
                <SuperDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/employees"
            element={
              <ProtectedRoute role="superadmin">
                <Employees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/customers"
            element={
              <ProtectedRoute role="superadmin">
                <SuperCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/accounting"
            element={
              <ProtectedRoute role="superadmin">
                <Accounting />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/reports"
            element={
              <ProtectedRoute role="superadmin">
                <SuperReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin/settings"
            element={
              <ProtectedRoute role="superadmin">
                <SystemSettings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}