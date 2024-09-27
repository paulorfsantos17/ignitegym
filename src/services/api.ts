/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-async-promise-executor */
import {
  storageAuthTokenGet,
  storageAuthTokenSave,
} from '@storage/storageAuthToken'
import { AppError } from '@utils/AppError'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from 'axios'

type SignOut = () => void

interface APIInstanceProps extends AxiosInstance {
  registerInterceptTokenManager: (signOut: SignOut) => () => void
}

interface PromiseType {
  onSuccess: (token: string) => void
  onError: (error: AxiosError) => void
}
interface ErrorResponse {
  message: string
}

const api = axios.create({
  baseURL: 'http://192.168.1.100:3333',
  timeout: 5000,
}) as APIInstanceProps

let failedQueue: Array<PromiseType> = []
let isRefreshing = false

api.registerInterceptTokenManager = (signOut) => {
  const handleResponseError = async (requestError: AxiosError) => {
    const { response } = requestError
    const { status, data } = response || {}
    const errorData = data as ErrorResponse

    const { message } = errorData || {}

    if (status === 401) {
      if (['token.expired', 'token.invalid'].includes(message)) {
        return await handleTokenRefresh(requestError, signOut)
      }
      signOut()
      return Promise.reject(requestError)
    }

    if (message) {
      return Promise.reject(new AppError(message))
    }

    return Promise.reject(requestError)
  }

  const handleTokenRefresh = async (
    requestError: AxiosError,
    signOut: SignOut,
  ) => {
    const { refreshToken } = (await storageAuthTokenGet()) || {}

    if (!refreshToken) {
      signOut()
      return Promise.reject(requestError)
    }

    const originalRequestConfig = requestError.config
    if (!originalRequestConfig) {
      signOut()
      return Promise.reject(
        new AppError('Original request config is undefined'),
      )
    }

    if (isRefreshing) {
      return await enqueueRequest(originalRequestConfig)
    }

    isRefreshing = true

    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await api.post('/sessions/refresh-token', {
          refresh_token: refreshToken,
        })

        await storageAuthTokenSave({
          refreshToken: data.refresh_token,
          token: data.token,
        })

        setAuthorizationHeader(originalRequestConfig, data.token)
        api.defaults.headers.common.Authorization = `Bearer ${data.token}`
        resolve(api(originalRequestConfig))

        failedQueue.forEach((request) => request.onSuccess(data.token))
      } catch (error: any) {
        failedQueue.forEach((request) => request.onError(error))
        signOut()
        reject(error)
      } finally {
        isRefreshing = false
        failedQueue = []
      }
    })
  }

  const enqueueRequest = (originalRequestConfig: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        onSuccess: (token: string) => {
          originalRequestConfig.headers = originalRequestConfig.headers || {}
          originalRequestConfig.headers.Authorization = `Bearer ${token}`
          resolve(api(originalRequestConfig))
        },
        onError: (error) => {
          reject(error)
        },
      })
    })
  }

  const setAuthorizationHeader = (
    config: AxiosRequestConfig,
    token: string,
  ): void => {
    config.headers = config.headers || {}
    if (config.data) {
      config.data = JSON.stringify(config.data)
    }
    config.headers.Authorization = `Bearer ${token}`
  }

  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    handleResponseError,
  )

  return () => api.interceptors.response.eject(interceptTokenManager)
}

export { api }
