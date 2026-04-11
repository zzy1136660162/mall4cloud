import api from '../index'

export default {
  // 登录
  login: (data: {
    principal: string
    credentials: string
    captchaVerification?: string
    sysType: number
  }) => api.post('/mall4cloud_auth/ua/login', data),

  // 用户信息
  getUserInfo: () => api.get('/mall4cloud_platform/sys_user/info'),

  // 权限列表
  getPermissions: () => api.get('/mall4cloud_rbac/menu_permission/list'),

  // 菜单ID列表（非管理员路由过滤用）
  getMenuIds: () => api.get('/mall4cloud_rbac/menu/list_menu_ids'),

  // 路由数据
  routeList: () => api.get('/mall4cloud_rbac/menu/route'),

  // 修改密码
  passwordEdit: (data: { password: string; newPassword: string }) =>
    api.post('/mall4cloud_platform/sys_user/password', data),
}
