export function useAppAuth() {
  function hasPermission(permission: string) {
    const appSettingsStore = useAppSettingsStore()
    const appAccountStore = useAppAccountStore()
    if (appSettingsStore.settings.app.account.auth) {
      // 通配符权限
      if (appAccountStore.permissions.includes('*')) {
        return true
      }
      return appAccountStore.permissions.includes(permission)
    }
    else {
      return true
    }
  }

  function auth(value: string | string[]) {
    // 空值或通配符权限直接通过
    if (!value || value === '*') {
      return true
    }
    let auth
    if (typeof value === 'string') {
      auth = value !== '' ? hasPermission(value) : true
    }
    else {
      auth = value.length > 0 ? value.some(item => hasPermission(item)) : true
    }
    return auth
  }

  function authAll(value: string[]) {
    return value.length > 0 ? value.every(item => hasPermission(item)) : true
  }

  return {
    auth,
    authAll,
  }
}
