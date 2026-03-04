import { authApi } from '@/endpoints/authEndpoints'
import type { ChangePassword, LoginRequest, User } from '@/types/auth'
import axios from 'axios'
import { defineStore } from 'pinia'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialized: boolean
}
export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    isAuthenticated: false,
    isInitialized: false,
  }),
  actions: {
    async login(request: LoginRequest) {
      try {
        const response = await authApi.login(request)
        if (response.statusCode == 200) {
          this.user = response.data
          this.isAuthenticated = true
          console.log('user från authStore', this.user)
          return response
        } else {
          console.log(response.message)
          this.user = null
          this.isAuthenticated = false
          return response
        }
      } catch (error) {
        console.error('Login failed:', error)
        this.user = null
        this.isAuthenticated = false
        this.isInitialized = false
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data
        }
      }
    },
    async logout() {
      try {
        const response = await authApi.logout()
        if (response.statusCode == 200) {
          this.user = null
          this.isAuthenticated = false
          
          console.log('user is logedout')
          return response
        } else {
          return response
        }
      } catch (error) {
        console.error('Logout failed:', error)
        if (axios.isAxiosError(error) && error.response) {
          return error.response.data
        }
        return {
          data: false,
          success: false,
          message: 'Logout failed',
          statusCode: 500,
        }
      }
    },
    async checkAuth() {
      try {
        const response = await authApi.me()
        if (response.statusCode === 200 && response.data) {
          this.user = response.data
          this.isAuthenticated = true
        } else {
          this.user = null
          this.isAuthenticated = false
        }
      } catch (error) {
        this.user = null
        this.isAuthenticated = false
        console.log('User not authenticated', error)
      } finally {
        this.isInitialized = true
      }
    },
    async changePassword(changePasswordRequest: ChangePassword) {
      try {
        const response = await authApi.changePassword(changePasswordRequest)
        return response
      } catch (error) {
        console.log('Password updated', error)
      }
    },
  },
})
