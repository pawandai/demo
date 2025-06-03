/* eslint-disable no-unused-vars */
import { motion } from "framer-motion"
import { AlertCircle, RefreshCw } from "lucide-react"

const ErrorMessage = ({ message, onRetry, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card text-center max-w-md mx-auto ${className}`}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 bg-error/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-error" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text mb-2">Something went wrong</h3>
          <p className="text-text-secondary">{message}</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default ErrorMessage
