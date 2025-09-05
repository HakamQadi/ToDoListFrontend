import { AlertCircle } from "lucide-react"

const ErrorAlert = ({ message, className = "" }) => {
  if (!message) return null

  return (
    <div
      className={`flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 ${className}`}
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  )
}

export default ErrorAlert
