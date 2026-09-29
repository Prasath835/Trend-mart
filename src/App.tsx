import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { ThemeProvider, useTheme } from './context/ThemeContext.tsx';

// Layout
import { Navbar } from './components/layout/Navbar.tsx';
import { AdminNavbar } from './components/layout/AdminNavbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.tsx';

// Storefront Pages
import { Home } from './pages/Home.tsx';
import { Products } from './pages/Products.tsx';
import { ProductDetail } from './pages/ProductDetail.tsx';
import { Cart } from './pages/Cart.tsx';
import { Checkout } from './pages/Checkout.tsx';
import { OrderConfirmation } from './pages/OrderConfirmation.tsx';
import { MyOrders } from './pages/MyOrders.tsx';
import { Account } from './pages/Account.tsx';
import { Login } from './pages/Login.tsx';
import { Register } from './pages/Register.tsx';
import { Help, Contact } from './pages/Help.tsx';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin.tsx';
import { AdminDashboard } from './pages/admin/AdminDashboard.tsx';
import { AdminProducts } from './pages/admin/AdminProducts.tsx';
import { AdminAddProduct } from './pages/admin/AdminAddProduct.tsx';
import { AdminCustomers } from './pages/admin/AdminCustomers.tsx';
import { AdminOrders } from './pages/admin/AdminOrders.tsx';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { themeConfig } = useTheme();
  const isAdminRoute = location.pathname.startsWith('/admin') && location.pathname !== '/admin/login';

  return (
    <div className={`min-h-screen flex flex-col ${themeConfig.bgClass} ${themeConfig.textPrimary} transition-colors duration-300`}>
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <AppLayout>
              <Routes>
              {/* Storefront Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/help" element={<Help />} />
              <Route path="/contact" element={<Contact />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products/add"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAddProduct />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/customers"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCustomers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminOrders />
                  </ProtectedRoute>
                }
              />

              {/* Catch all / 404 fallback */}
              <Route path="*" element={<Home />} />
            </Routes>
          </AppLayout>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </BrowserRouter>
  );
}
