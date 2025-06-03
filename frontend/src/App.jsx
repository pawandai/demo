import { Routes, Route, Navigate } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { LanguageProvider } from "./contexts/Language/provider";
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Terms from "./pages/Terms"
import TermsAdmin from "./pages/TermsAdmin"
import Pricelist from "./pages/PriceList"
import Customers from "./pages/Customers"
import Invoices from "./pages/Invoices"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  return (
    <LanguageProvider>
      <div data-theme="light">
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Redirect from home page to terms page */}
              <Route path="/" element={<Navigate to="/terms" replace />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/terms/:language" element={<Terms />} />
              <Route path="/pricelist" element={<Pricelist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invoices"
                element={
                  <ProtectedRoute>
                    <Invoices />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/terms"
                element={
                  <ProtectedRoute>
                    <TermsAdmin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </div>
    </LanguageProvider>
  )
}

export default App
