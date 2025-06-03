/* eslint-disable no-unused-vars */
import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Mail, Lock, User, Eye, EyeOff, Building } from "lucide-react"
import { useAuthStore } from "../stores/authStore"
import { useLanguage } from "../contexts/Language/hooks"
import LoadingSpinner from "../components/LoadingSpinner"
import { toast } from "react-toastify"

const Register = () => {
  const { language, t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    language: language, // Add language preference to registration
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, isLoading, isAuthenticated, error } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error(language === "sv" ? "Lösenorden matchar inte" : "Passwords do not match")
      return
    }

    try {
      // Update language when submitting
      const { confirmPassword, ...registerData } = {
        ...formData,
        language: language
      }
      
      const result = await register(registerData)
      
      if (result?.error) {
        const errorMessage = result.error?.response?.data?.message || 
          (language === "sv" ? "Registrering misslyckades" : "Registration failed")
        toast.error(errorMessage)
      }
    } catch (err) {
      console.error("Registration error:", err)
      toast.error(language === "sv" ? 
        "Ett fel uppstod vid registrering. Försök igen." : 
        "An error occurred during registration. Please try again."
      )
    }
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
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "var(--text)", marginBottom: "0.5rem" }}>
              {language === "sv" ? "Skapa Konto" : "Create Account"}
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              {language === "sv" ? "Börja din 14-dagars gratis provperiod idag" : "Start your 14-day free trial today"}
            </p>
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
                <label htmlFor="name" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "var(--text)", marginBottom: "0.5rem" }}>
                  {language === "sv" ? "Fullständigt Namn" : "Full Name"}
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                    <User size={20} />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
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
                    placeholder={language === "sv" ? "Ange ditt fullständiga namn" : "Enter your full name"}
                  />
                </div>
              </div>

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
                <label htmlFor="company" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "var(--text)", marginBottom: "0.5rem" }}>
                  Company Name (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                    <Building size={20} />
                  </div>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
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
                    placeholder="Enter your company name"
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
                    placeholder="Create a password"
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

              <div>
                <label htmlFor="confirmPassword" style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", color: "var(--text)", marginBottom: "0.5rem" }}>
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-secondary)" }}>
                    <Lock size={20} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
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
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  required
                  style={{ 
                    width: "1rem", 
                    height: "1rem", 
                    marginTop: "0.25rem",
                    borderRadius: "0.25rem",
                    borderColor: "var(--border)",
                    color: "var(--primary)"
                  }}
                />
                <span style={{ marginLeft: "0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  {language === "sv" ? "Jag godkänner " : "I agree to the "}
                  <Link to={`/terms/${language}`} style={{ color: "var(--primary)", textDecoration: "none" }}>
                    {language === "sv" ? "Villkor och Bestämmelser" : "Terms and Conditions"}
                  </Link>
                </span>
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
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : language === "sv" ? (
                  "Skapa Konto"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)" }}>
                {language === "sv" ? "Har du redan ett konto? " : "Already have an account? "}
                <Link to="/login" style={{ color: "var(--primary)", fontWeight: "500", textDecoration: "none" }}>
                  {language === "sv" ? "Logga in" : "Sign in"}
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Register
