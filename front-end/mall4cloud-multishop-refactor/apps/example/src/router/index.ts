import { loadingFadeOut } from 'virtual:app-loading'
import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import pinia from '@/store'
import { useAppSettingsStore } from '@/store/modules/app/settings'
import setupExtensions from './extensions'
import setupGuards from './guards'
// 路由相关数据
import { constantRoutes } from './routes'

const router = createRouter({
  history: useAppSettingsStore(pinia).settings.app.routeMode === 'hash' ? createWebHashHistory() : createWebHistory(),
  routes: constantRoutes,
  strict: true,
})

setupGuards(router)
setupExtensions(router)

router.isReady().then(() => {
  loadingFadeOut()
})

export default router
