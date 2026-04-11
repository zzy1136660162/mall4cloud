import apiApp from '@/api/modules/app'
import router from '@/router'

export const useAppAccountStore = defineStore('appAccount', () => {
  const appSettingsStore = useAppSettingsStore()
  const appTabbarStore = useAppTabbarStore()
  const appRouteStore = useAppRouteStore()
  const appMenuStore = useAppMenuStore()

  // Token（storage proxy 已自动加前缀，直接用短key）
  const token = ref(localStorage.getItem('token') ?? '')
  // 用户信息
  const account = ref(localStorage.getItem('account') ?? '')
  const nickName = ref(localStorage.getItem('nickName') ?? '')
  const avatar = ref(localStorage.getItem('avatar') ?? '')
  const userId = ref(localStorage.getItem('userId') ?? '')
  const isAdmin = ref(localStorage.getItem('isAdmin') === 'true')
  // 权限
  const permissions = ref<string[]>([])
  // 菜单ID（非管理员路由过滤用）
  const menuIds = ref<number[]>([])

  const isLogin = computed(() => !!token.value)

  // 登录
  async function login(data: { account: string; password: string; captchaVerification?: string }) {
    const res = await apiApp.login({
      principal: data.account,
      credentials: data.password,
      captchaVerification: data.captchaVerification ?? '',
      sysType: 2,
    })
    // 旧后端返回 { accessToken, expiresIn, refreshToken }，拦截器 return res.data 后拿到整个对象
    const loginData = res as any
    token.value = loginData.accessToken
    localStorage.setItem('token', token.value)
    await fetchUserInfo()
  }

  // 获取用户信息
  async function fetchUserInfo() {
    const info = await apiApp.getUserInfo() as any
    nickName.value = info.nickName ?? ''
    avatar.value = info.avatar ?? ''
    isAdmin.value = !!info.isAdmin
    userId.value = String(info.userId ?? '')
    account.value = info.nickName ?? ''
    localStorage.setItem('nickName', nickName.value)
    localStorage.setItem('avatar', avatar.value)
    localStorage.setItem('isAdmin', String(isAdmin.value))
    localStorage.setItem('userId', userId.value)
    localStorage.setItem('account', account.value)
  }

  // 获取权限
  async function getPermissions() {
    const perms = await apiApp.getPermissions()
    permissions.value = perms as unknown as string[]
  }

  // 获取菜单ID
  async function getMenuIds(): Promise<number[]> {
    const ids = await apiApp.getMenuIds()
    menuIds.value = ids as unknown as number[]
    return menuIds.value
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

  // 防止 requestLogout 重复调用（连续 401 时避免路由循环）
  let isLoggingOut = false

  // 请求登出（401 触发）
  function requestLogout() {
    if (isLoggingOut) return
    isLoggingOut = true
    setTimeout(() => { isLoggingOut = false }, 3000)
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
    ;['account', 'avatar', 'nickName', 'userId', 'isAdmin', 'token'].forEach(k => localStorage.removeItem(k))
    account.value = ''
    avatar.value = ''
    nickName.value = ''
    userId.value = ''
    isAdmin.value = false
    permissions.value = []
    menuIds.value = []
    appSettingsStore.updateSettings({}, true)
    appTabbarStore.clean()
    appRouteStore.removeRoutes()
    appMenuStore.setActived(0)
  }

  function lock() { localStorage.removeItem('token') }
  function unlock() { localStorage.setItem('token', token.value) }

  return {
    token,
    account,
    nickName,
    avatar,
    userId,
    isAdmin,
    permissions,
    menuIds,
    isLogin,
    login,
    logout,
    requestLogout,
    logoutCleanStatus,
    fetchUserInfo,
    getPermissions,
    getMenuIds,
    editPassword: (data: { password: string; newPassword: string }) => apiApp.passwordEdit(data),
    lock,
    unlock,
  }
})
