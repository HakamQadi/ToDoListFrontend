const TOKEN_KEY = "token"
const USER_KEY = "user"

export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const getStoredUser = () => {
  const token = getStoredToken()
  const userStr = localStorage.getItem(USER_KEY)

  if (!token || !userStr) return null

  try {
    const user = JSON.parse(userStr)
    return { ...user, token }
  } catch {
    return null
  }
}

export const storeUser = (userData) => {
  const { token, ...user } = userData
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearStoredUser = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}
