import apiClient from "./apiClient"
import { storeUser } from "../utils/storage"

export const authService = {
  async register(userData) {
    const response = await apiClient.post("/api/users/register", userData)
    const { data } = response
    storeUser(data)
    return data
  },

  async login(credentials) {
    const response = await apiClient.post("/api/users/login", credentials)
    const { data } = response
    storeUser(data)
    return data
  },
}
