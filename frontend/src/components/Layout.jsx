/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X, User, LogOut, Users, FileText, Package, Shield } from "lucide-react"
import { useAuthStore } from "../stores/authStore"
import { useLanguage } from "../contexts/Language/hooks"

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()
  const { language, toggleLanguage, getLanguageName, getFlag } = useLanguage()
  const location = useLocation()
  const menuRef = useRef(null)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  // Add click outside handler to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  // Add keyboard handler for accessibility
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  // Apply scroll lock class to body for better mobile experience
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('scroll-lock')
    } else {
      document.body.classList.remove('scroll-lock')
    }
    return () => document.body.classList.remove('scroll-lock')
  }, [isMenuOpen])

  const publicNavigation = [
    { name: language === "sv" ? "Hem" : "Home", href: "/" },
    { name: language === "sv" ? "Villkor" : "Terms", href: "/terms" },
    { name: language === "sv" ? "Prislista" : "Pricelist", href: "/pricelist" },
  ]

  const privateNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: <User className="w-4 h-4" /> },
    { name: "Customers", href: "/customers", icon: <Users className="w-4 h-4" /> },
    { name: "Products", href: "/pricelist", icon: <Package className="w-4 h-4" /> },
    { name: "Invoices", href: "/invoices", icon: <FileText className="w-4 h-4" /> },
  ]

  const adminNavigation = [{ name: "Terms Admin", href: "/admin/terms", icon: <Shield className="w-4 h-4" /> }]

  let navigation = publicNavigation
  if (isAuthenticated) {
    navigation = [...privateNavigation]
    if (user?.role === "admin") {
      navigation = [...navigation, ...adminNavigation]
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header with improved responsive styling */}
      <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
        <div className="header__container">
          <div className="flex items-center gap-0">
            {/* Hamburger with improved visibility */}
<button
  onClick={() => setIsMenuOpen(!isMenuOpen)}
  className="header__menu-toggle"
  aria-label="Toggle menu"
  aria-expanded={isMenuOpen}
>
  {/* Use divs with proper border and padding for better visibility */}
  <div className="w-full h-2 bg-text rounded-full" />
  <div className="w-full h-2 bg-text rounded-full" />
  <div className="w-full h-2 bg-text rounded-full" />
</button>
            
            {/* Logo */}
            <Link to="/" className="header__logo">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">123</span>
              </div>
              <span className="font-bold text-xl text-text hidden xs:block">Fakturera</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="header__nav">
            <ul className="flex items-center gap-1 lg:gap-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`nav-link ${isActive(item.href) ? "nav-link--active" : ""}`}
                  >
                    {item.icon && <span className="hidden lg:inline-flex">{item.icon}</span>}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side Actions - removed theme toggle */}
          <div className="header__actions">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-lg bg-surface-dark hover:bg-surface-darker transition-colors hidden sm:flex items-center gap-2"
            >
              <img src={getFlag()} alt="Language" className="w-4 h-4 rounded-sm" />
              <span className="text-xs hidden md:inline">{getLanguageName()}</span>
            </button>

            {/* Auth Actions */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-dark">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user?.name}</span>
                  {user?.role === "admin" && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Admin</span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-surface-dark hover:bg-surface-darker transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost btn-sm">
                  {language === "sv" ? "Logga in" : "Login"}
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  {language === "sv" ? "Registrera" : "Register"}
                </Link>
              </div>
            )}

            {/* Mobile Auth Quick Access */}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="md:hidden p-2 rounded-lg bg-surface-dark hover:bg-surface-darker transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link 
                to="/login" 
                className="md:hidden p-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
              >
                <User className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with improved accessibility */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="header__overlay"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu Panel with better mobile UX */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={menuRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="header__mobile-nav"
          >
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="header__mobile-nav-header">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">123</span>
                  </div>
                  <span className="font-bold text-xl text-text">Fakturera</span>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-darker transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Section */}
              {isAuthenticated && (
                <div className="p-4 border-b bg-surface-dark/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-text-secondary">{user?.email}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Menu Content with touch-optimized spacing */}
              <div className="header__mobile-nav-content">
                {/* Language Selector */}
                <div className="mobile-nav-section">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-border hover:bg-surface-dark transition-colors"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <img src={getFlag()} alt="Language" className="w-5 h-5 rounded-sm" />
                      <span className="font-medium">{getLanguageName()}</span>
                    </div>
                    <span className="text-xs bg-surface-dark px-2 py-1 rounded">
                      {language === "sv" ? "Byt" : "Change"}
                    </span>
                  </button>
                </div>

                {/* Navigation with improved touch targets */}
                <div className="mobile-nav-section">
                  <h3 className="mobile-nav-section-title">
                    {language === "sv" ? "Meny" : "Menu"}
                  </h3>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`mobile-nav-link ${isActive(item.href) ? "mobile-nav-link--active" : ""}`}
                    >
                      {item.icon ? (
                        <span className="w-5 h-5 flex items-center justify-center">
                          {item.icon}
                        </span>
                      ) : (
                        <span className="w-5 h-5"></span>
                      )}
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Menu Footer - removed theme toggle */}
              <div className="header__mobile-nav-footer">
                {isAuthenticated ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-dark hover:bg-surface-darker transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{language === "sv" ? "Logga ut" : "Logout"}</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-surface-dark hover:bg-surface-darker transition-colors"
                    >
                      <span>{language === "sv" ? "Logga in" : "Login"}</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      <span>{language === "sv" ? "Registrera" : "Register"}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>
    </div>
  )
}

export default Layout
