// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Home, ArrowLeft } from "lucide-react"

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-background flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-text mb-4">Page Not Found</h2>
          <p className="text-text-secondary max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to another location.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/" className="btn btn-primary">
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NotFound
