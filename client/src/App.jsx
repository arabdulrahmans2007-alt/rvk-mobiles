import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import AdminLayout from './components/layout/AdminLayout';
import CartDrawer from './components/common/CartDrawer';
import NotificationPopover from './components/common/NotificationPopover';

// Customer Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import DisplayServicePage from './pages/DisplayServicePage';
import DoorstepServicePage from './pages/DoorstepServicePage';
import BookingPage from './pages/BookingPage';
import MembershipPage from './pages/MembershipPage';
import OffersPage from './pages/OffersPage';
import NotificationsPage from './pages/NotificationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import BookingTrackingPage from './pages/BookingTrackingPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminServicesPage from './pages/admin/AdminServicesPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminMembershipPage from './pages/admin/AdminMembershipPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage';
import AdminInvoicesPage from './pages/admin/AdminInvoicesPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function AppContent() {
  const { isAdminAuthenticated } = useAuth();
  
  // Initial route from hash or pathname
  const getInitialRoute = () => {
    const path = window.location.pathname.replace('/', '') || window.location.hash.replace('#', '') || 'home';
    if (path.startsWith('admin')) return 'admin';
    return path || 'home';
  };

  const [currentRoute, setCurrentRouteState] = useState(getInitialRoute);
  const [adminRoute, setAdminRoute] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const setCurrentRoute = (route) => {
    setCurrentRouteState(route);
    window.history.pushState(null, '', route === 'home' ? '/' : `/${route}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      setCurrentRouteState(path.startsWith('admin') ? 'admin' : path);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Admin Portal Render
  if (currentRoute === 'admin') {
    if (!isAdminAuthenticated) {
      return <AdminLoginPage onLoginSuccess={() => setAdminRoute('dashboard')} />;
    }

    return (
      <AdminLayout adminRoute={adminRoute} setAdminRoute={setAdminRoute} setCurrentRoute={setCurrentRoute}>
        {adminRoute === 'dashboard' && <AdminDashboardPage setAdminRoute={setAdminRoute} />}
        {adminRoute === 'orders' && <AdminOrdersPage />}
        {adminRoute === 'customers' && <AdminCustomersPage />}
        {adminRoute === 'products' && <AdminProductsPage />}
        {adminRoute === 'display-services' && <AdminServicesPage />}
        {adminRoute === 'doorstep-bookings' && <AdminBookingsPage />}
        {adminRoute === 'membership' && <AdminMembershipPage />}
        {adminRoute === 'offers' && <AdminOffersPage />}
        {adminRoute === 'notifications' && <AdminNotificationsPage />}
        {adminRoute === 'invoices' && <AdminInvoicesPage />}
        {adminRoute === 'reports' && <AdminReportsPage />}
        {adminRoute === 'settings' && <AdminSettingsPage />}
        {adminRoute === 'admin-users' && <AdminUsersPage />}
      </AdminLayout>
    );
  }

  // Customer Portal Render
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
      <Navbar currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} onSearch={(q) => setSearchQuery(q)} />
      
      <main className="flex-1 pb-16 md:pb-0">
        {currentRoute === 'home' && <HomePage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'products' && <ProductsPage initialSearch={searchQuery} setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'display-service' && <DisplayServicePage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'doorstep-service' && <DoorstepServicePage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'booking' && <BookingPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'membership' && <MembershipPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'offers' && <OffersPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'notifications' && <NotificationsPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'login' && <LoginPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'register' && <RegisterPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'profile' && <ProfilePage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'cart' && <CartPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'checkout' && <CheckoutPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'orders' && <OrdersPage setCurrentRoute={setCurrentRoute} />}
        {currentRoute === 'booking-tracking' && <BookingTrackingPage />}
        {currentRoute === 'contact' && <ContactPage />}
        {currentRoute === 'faq' && <FAQPage />}
        {currentRoute === 'about' && <AboutPage setCurrentRoute={setCurrentRoute} />}
      </main>

      <Footer setCurrentRoute={setCurrentRoute} />
      <MobileNav currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
      <CartDrawer setCurrentRoute={setCurrentRoute} />
      <NotificationPopover setCurrentRoute={setCurrentRoute} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}