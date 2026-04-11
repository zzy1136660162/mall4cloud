import type { RouteRecordMainRaw } from '@fantastic-admin/types'
import type { RouteRecordRaw } from 'vue-router'
import pinia from '@/store'
import Platform from './modules/platform'
import Product from './modules/product'
import Rbac from './modules/rbac'

// 固定路由（默认路由）
const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login.vue'),
    meta: {
      title: '登录',
    },
  },
  {
    path: '/:all(.*)*',
    name: 'notFound',
    component: () => import('@/views/[...all].vue'),
    meta: {
      title: '找不到页面',
    },
  },
]

// 系统路由
const systemRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/index.vue'),
    meta: {
      breadcrumb: false,
    },
    children: [
      {
        path: '',
        component: () => import('@/views/index.vue'),
        meta: {
          title: useAppSettingsStore(pinia).settings.app.home.title,
          icon: 'i-ant-design:home-twotone',
          breadcrumb: false,
        },
      },
      {
        path: 'reload',
        name: 'reload',
        component: () => import('@/views/reload.vue'),
        meta: {
          title: '重新加载中...',
          breadcrumb: false,
        },
      },
    ],
  },
]

// 动态路由（异步路由、导航菜单路由）
// 注意：此处的 asyncRoutes 是前端静态路由，实际业务中菜单由后端动态返回
// 所以这里只保留空数组，菜单由后端 /mall4cloud_rbac/menu/route 接口提供
const asyncRoutes: RouteRecordMainRaw[] = [
  { parentId: 0, path: Product.path, component: Product.component, name: Product.name, meta: { title: '商品管理', icon: 'i-ant-design:shopping-outlined' }, children: [Product] },
  { parentId: 0, path: Platform.path, component: Platform.component, name: Platform.name, meta: { title: '平台管理', icon: 'i-ant-design:setting-outlined' }, children: [Platform] },
  { parentId: 0, path: Rbac.path, component: Rbac.component, name: Rbac.name, meta: { title: '权限管理', icon: 'i-ant-design:safety-outlined' }, children: [Rbac] },
]

export {
  asyncRoutes,
  constantRoutes,
  systemRoutes,
}
