import api from '../index'

export default {
  routeList: () => api.get({ url: '/mall4cloud_rbac/menu/route' }),

  login: (params: {
    account: string
    password: string
  }) => api.post('/mall4cloud_auth/ua/login', params),

  permission: () => Promise.resolve({ data: { permissions: [] } }),

  passwordEdit: (data: {
    password: string
    newPassword: string
  }) => api.post('app/account/password/edit', data, {
    fake: true,
  }),

}
