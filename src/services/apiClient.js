import axios from "axios"
import { getStoredToken, clearStoredUser } from "../utils/storage"

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getStoredToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      clearStoredUser()
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export default apiClient
