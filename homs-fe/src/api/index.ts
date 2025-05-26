import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/states/auth'
import type { 
    SignInDto,
    SignInResponseDto
} from '@/domain/user'

const apiClient: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
    withCredentials: true,
});

// 요청 인터셉터: /signin, /refresh 일 땐 건너뛰기
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const url = config.url ?? ''

    // ① 로그인·리프레시 요청은 헤더 추가하지 않는다
    if (
      url.endsWith('/v1/auth/signin') ||
      url.endsWith('/v1/auth/refresh')
    ) {
      return config
    }

    // ② 그 외 요청만 토큰 헤더 붙이기
    const authStore = useAuthStore()
    if (authStore.accessToken) {
      config.headers!['Authorization'] = `Bearer ${authStore.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 3) 자동 리프레시 로직을 위한 상태
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (error: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

// 5) 응답 인터셉터: 401 처리
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any
    // 401 에러, _retry 플래그 없고 리프레시 토큰이 있을 때만 동작
    const authStore = useAuthStore()
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      authStore.refreshToken
    ) {
      originalRequest._retry = true
      if (isRefreshing) {
        // 리프레시 중이면 큐에 쌓았다가 토큰 획득 후 재실행
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers!['Authorization'] = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true
      try {
        // 1) 리프레시 토큰으로 새로운 accessToken 요청
        const { data } = await apiClient.post<SignInResponseDto>(
          '/v1/auth/refresh',
          { refreshToken: authStore.refreshToken }
        )
        // 2) 스토어에 토큰 업데이트
        authStore.setTokens(data.data.accessToken, data.data.refreshToken)
        // 3) 대기 중인 요청들 재실행 신호
        processQueue(null, data.data.accessToken)
        // 4) 원래 요청도 새로운 헤더로 재실행
        originalRequest.headers!['Authorization'] = `Bearer ${data.data.accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // 리프레시 실패 시 스토어 초기화 후 로그인 페이지로
        processQueue(refreshError, null)
        authStore.clearAuth()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // 401 외의 에러는 그대로 거절
    return Promise.reject(error)
  }
)

export default apiClient;