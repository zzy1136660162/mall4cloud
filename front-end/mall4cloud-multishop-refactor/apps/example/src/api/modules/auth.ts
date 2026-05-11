import api from '@/api'

export interface LoginParams {
  password: string
  username: string
}

export interface LoginVO {
  token: string
  expireTime?: number
  userId?: number
  username?: string
}

export const authApi = {
  login: (data: LoginParams) =>
    api.request<LoginVO>({
      url: '/mall4cloud_auth/ua/login',
      method: 'post',
      data,
    }),

  logout: () =>
    api.request({
      url: '/mall4cloud_auth/login_out',
      method: 'post',
    }),
}

export default authApi
