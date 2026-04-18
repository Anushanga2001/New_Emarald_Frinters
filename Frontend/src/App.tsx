import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { HomePage } from './pages/Home'
import { ServicesPage } from './pages/Services'
import { QuotePage } from './pages/Quote'
import { QuotesListPage } from './pages/QuotesList'
import { AboutPage } from './pages/About'
import { ContactPage } from './pages/Contact'
import { FAQPage } from './pages/FAQ'
import { LoginPage } from './pages/auth/Login'
import { RegisterPage } from './pages/auth/Register'
import { ForgotPasswordPage } from './pages/auth/ForgotPassword'
import { ResetPasswordPage } from './pages/auth/ResetPassword'
import { CustomerDashboard } from './pages/customer/Dashboard'
import { ProfilePage } from './pages/customer/Profile'
import { AdminDashboard } from './pages/admin/Dashboard'
import { UserManagementPage } from './pages/admin/UserManagement'
import { ContactMessagePage } from './pages/admin/ContactMessage'

function App() {
  return (
    <>
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      draggable
      theme="light"
    />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Auth-required routes (any signed-in user) */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/quotes" element={<QuotesListPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

        {/* Protected customer routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRole="Customer">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="Admin">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="contact-messages/:id" element={<ContactMessagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
