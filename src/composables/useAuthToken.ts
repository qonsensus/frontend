export function useAuthToken() {
  function getToken() {
    return localStorage.getItem('authToken')
  }

  function setToken(token: string) {
    localStorage.setItem('authToken', token)
  }

  function clearToken() {
    localStorage.removeItem('authToken')
  }

  function isAuthenticated() {
    console.log(getToken())
    return !!getToken()
  }

  return {
    getToken,
    setToken,
    clearToken,
    isAuthenticated,
  }
}
