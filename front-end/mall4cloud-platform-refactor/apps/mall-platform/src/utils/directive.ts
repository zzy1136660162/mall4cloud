import type { App, DirectiveBinding } from 'vue'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

export default function directive(app: App) {
  // v-auth 指令：基于权限字符串控制显示
  app.directive('auth', (el: HTMLElement, binding: DirectiveBinding) => {
    const appAuth = useAppAuth()
    watch(() => binding.modifiers.all
      ? appAuth.authAll(binding.value)
      : appAuth.auth(binding.value), (val) => {
      el.style.display = val ? '' : 'none'
    }, {
      immediate: true,
    })
  })
  // v-permission 指令：基于权限字符串列表控制显示
  app.directive('permission', (el: HTMLElement, binding: DirectiveBinding) => {
    const store = useAppAccountStore()
    const { permissions } = storeToRefs(store)
    const values = Array.isArray(binding.value) ? binding.value : [binding.value]
    const hasPermission = values.some(v => permissions.value.includes(v))
    el.style.display = hasPermission ? '' : 'none'
  })
}
