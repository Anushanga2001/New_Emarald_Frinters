import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { HomePage } from './pages/Home'
import { ServicesPage } from './pages/Services'
import { TrackingPage } from './pages/Tracking'
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

function App() {
  return (
    <>
    <Toaster position="top-center" richColors />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/quotes" element={<QuotesListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
