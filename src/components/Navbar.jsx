"use client"
import { LogOut } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import Button from "./Button"

const Navbar = () => {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-900">TodoList App</h1>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Hello, {user?.fullName}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-transparent"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
