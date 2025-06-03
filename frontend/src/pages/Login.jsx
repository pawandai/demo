import { useState } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuthStore } from "../stores/authStore"
import LoadingSpinner from "../components/LoadingSpinner"

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, isAuthenticated } = useAuthStore()
  const location = useLocation()

  const from = location.state?.from?.pathname || "/dashboard"

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #eff6ff, #e0e7ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 0"
      }}
    >
      <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
        <div style={{ maxWidth: "28rem", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ textAlign: "center", marginBottom: "2rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: "2.5rem", height: "2.5rem", backgroundColor: "var(--primary)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "white", fontWeight: "bold" }}>123</span>
              </div>
              <span style={{ fontWeight: "bold", fontSize: "1.5rem", color: "var(--text)" }}>Fakturera</span>
            </div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem" }}>Welcome Back</h1>
            <p style={{ color: "var(--text-secondary)" }}>Sign in to your account to continue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ 
              backgroundColor: "var(--surface)", 
              borderRadius: "0.75rem", 
              border: "1px solid var(--border)", 
              padding: "1.5rem",
              boxShadow: "var(--shadow)"
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label htmlFor="email" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "var(--text)", marginBottom: "0.5rem" }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                    <Mail size={20} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem 1rem 0.75rem 2.5rem", 
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      backgroundColor: "var(--background)",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      lineHeight: "1.5"
                    }}
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "var(--text)", marginBottom: "0.5rem" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                    <Lock size={20} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required 
                    style={{ 
                      width: "100%", 
                      padding: "0.75rem 2.5rem 0.75rem 2.5rem", 
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius)",
                      backgroundColor: "var(--background)",
                      color: "var(--text)",
                      fontSize: "0.875rem",
                      lineHeight: "1.5"
                    }}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ 
                      position: "absolute", 
                      right: "0.75rem", 
                      top: "50%", 
                      transform: "translateY(-50%)", 
                      color: "var(--text-secondary)",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      padding: "0.25rem"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--text)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input 
                    type="checkbox" 
                    style={{ 
                      borderRadius: "0.25rem", 
                      border: "1px solid var(--border)", 
                      color: "var(--primary)" 
                    }}
                  />
                  <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  style={{ 
                    fontSize: "0.875rem", 
                    color: "var(--primary)", 
                    textDecoration: "none" 
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--primary-dark)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--primary)"}
                >
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isLoading} 
                style={{ 
                  width: "100%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "var(--radius)",
                  fontWeight: "500",
                  fontSize: "0.875rem",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? "0.6" : "1"
                }}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : "Sign In"}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)" }}>
                Don't have an account?{" "}
                <Link 
                  to="/register" 
                  style={{ 
                    color: "var(--primary)", 
                    fontWeight: "500",
                    textDecoration: "none" 
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--primary-dark)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--primary)"}
                >
                  Sign up
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Login
