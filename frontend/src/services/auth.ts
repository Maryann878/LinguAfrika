import api from './api'

// const API_URL = '/api' // Using api instance from api.ts instead

export interface LoginPayload {
  identifier: string
  password: string
}

export interface SignupPayload {
  username: string
  email: string
  mobile: string
  password: string
  profileComplete: boolean
}

export interface AuthResponse {
  token: string
  profileComplete?: boolean
  user?: any
  message?: string
  success?: boolean
}

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', payload)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

export const signupUser = async (payload: SignupPayload): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/signup', payload)
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed')
  }
}

export const verifyEmail = async (email: string, code: string) => {
  try {
    const response = await api.post('/auth/verify', { email, code })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Verification failed')
  }
}

export const resendVerificationCode = async (email: string) => {
  try {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend code')
  }
}

export const forgotPassword = async (email: string) => {
  try {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to send reset email')
  }
}

export const verifyPasswordResetOTP = async (email: string, code: string) => {
  try {
    const response = await api.post('/auth/verify-password-reset-otp', { email, code })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'OTP verification failed')
  }
}

export const resendPasswordResetOTP = async (email: string) => {
  try {
    const response = await api.post('/auth/resend-password-reset-otp', { email })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to resend OTP')
  }
}

export const resetPassword = async (token: string, password: string, confirmPassword: string) => {
  try {
    const response = await api.post('/auth/reset-password', { token, password, confirmPassword })
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed')
  }
}

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user')
  }
}

