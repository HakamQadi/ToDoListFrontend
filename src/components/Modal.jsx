"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import Button from "./Button"

const Modal = ({ isOpen, onClose, title, children, className = "" }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose} />

        <div
          className={`inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl ${className}`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <Button variant="outline" size="sm" onClick={onClose} className="p-2 bg-transparent">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
