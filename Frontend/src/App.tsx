import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { HomePage } from './pages/Home'
import { ServicesPage } from './pages/Services'
import { TrackingPage } from './pages/Tracking'
import { QuotePage } from './pages/Quote'
import { AboutPage } from './pages/About'
import { ContactPage } from './pages/Contact'
import { FAQPage } from './pages/FAQ'
import { LoginPage } from './pages/auth/Login'
import { RegisterPage } from './pages/auth/Register'
import { CustomerDashboard } from './pages/customer/Dashboard'

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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>

        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

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
        </Route>

        {/* Protected admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="Admin">
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin routes will be added here */}
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
