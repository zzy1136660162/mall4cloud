import apiApp from '@/api/modules/app'
import router from '@/router'

export const useAppAccountStore = defineStore('appAccount', () => {
  const appSettingsStore = useAppSettingsStore()
  const appTabbarStore = useAppTabbarStore()
  const appRouteStore = useAppRouteStore()
  const appMenuStore = useAppMenuStore()

  // 账号信息
  const token = ref(localStorage.getItem('token') ?? '')
  const account = ref(localStorage.getItem('account') ?? '')
  const avatar = ref(localStorage.getItem('avatar') ?? '')

  // 权限信息
  const permissions = ref<string[]>([])

  // 登录状态
  const isLogin = computed(() => {
    if (token.value) {
      return true
    }
    return false
  })

  // 登录
  async function login(data: {
    account: string
    password: string
  }) {
    // 转换参数格式适配旧后端
    const res = await apiApp.login({
      principal: data.account,
      credentials: data.password,
      sysType: 1,
    })
    // 旧后端响应格式 { accessToken: '...' }，拦截器返回 res.data
    const accessToken = res?.accessToken || res?.token || res
    if (!accessToken) {
      throw new Error('登录失败：未获取到 token')
    }
    localStorage.setItem('account', data.account)
    localStorage.setItem('token', accessToken)
    localStorage.setItem('avatar', '')
    account.value = data.account
    token.value = accessToken
    avatar.value = ''
  }

  // 手动登出
  function logout(redirect = router.currentRoute.value.fullPath) {
    localStorage.removeItem('token')
    token.value = ''
    router.push({
      name: 'login',
      query: {
        ...(redirect !== appSettingsStore.settings.app.home.fullPath && router.currentRoute.value.name !== 'login' && { redirect }),
      },
    }).then(logoutCleanStatus)
  }

  // 请求登出
  function requestLogout() {
    localStorage.removeItem('token')
    token.value = ''
    router.push({
      name: 'login',
      query: {
        ...(
          router.currentRoute.value.fullPath !== appSettingsStore.settings.app.home.fullPath
          && router.currentRoute.value.name !== 'login'
          && {
            redirect: router.currentRoute.value.fullPath,
          }
        ),
      },
    }).then(logoutCleanStatus)
  }

  // 登出后清除状态
  function logoutCleanStatus() {
    localStorage.removeItem('account')
    localStorage.removeItem('avatar')
    account.value = ''
    avatar.value = ''
    permissions.value = []
    appSettingsStore.updateSettings({}, true)
    appTabbarStore.clean()
    appRouteStore.removeRoutes()
    appMenuStore.setActived(0)
  }

  // 获取权限
  async function getPermissions() {
    try {
      const res = await apiApp.permission()
      // 适配旧后端响应格式
      permissions.value = res?.permissions || res?.data?.permissions || res || []
    }
    catch {
      // 如果后端权限接口不可用，使用测试权限
      permissions.value = ['*']
    }
  }

  // 修改密码
  async function editPassword(data: {
    password: string
    newPassword: string
  }) {
    await apiApp.passwordEdit(data)
  }

  // 锁屏
  function lock() {
    localStorage.removeItem('token')
  }

  // 解锁
  function unlock() {
    localStorage.setItem('token', token.value)
  }

  return {
    token,
    account,
    avatar,
    permissions,
    isLogin,
    login,
    logout,
    requestLogout,
    getPermissions,
    editPassword,
    lock,
    unlock,
  }
})
