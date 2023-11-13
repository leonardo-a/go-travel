import { getSecureItem } from '@services/secure-storage'
import axios from 'axios'

console.log(process.env.EXPO_PUBLIC_API_URL)

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
})

api.interceptors.request.use(async (config) => {
  const token = await getSecureItem('session')

  config.headers.Authorization = `Bearer ${token}`

  return config
})
