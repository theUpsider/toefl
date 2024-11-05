import axios, { AxiosInstance } from 'axios'

export type HttpClientConfig = {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
}

// Use closure to maintain instance state
const createHttpClient = () => {
  const instance = axios.create()

  return {
    getInstance: (): AxiosInstance => instance,
    configure: (config: HttpClientConfig): AxiosInstance => {
      return axios.create({
        baseURL: config.baseURL,
        timeout: config.timeout ?? 5000,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers
        }
      })
    }
  }
}

const httpClient = createHttpClient()

export const getHttpClient = (): AxiosInstance => httpClient.getInstance()
export const setHttpClient = (config: HttpClientConfig): void => {
  const newInstance = httpClient.configure(config)
  Object.assign(httpClient.getInstance(), newInstance)
}
