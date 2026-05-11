import type { RouteRecordMainRaw } from '@fantastic-admin/types'
import type { RouteRecordRaw, RouterMatcher } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { createRouterMatcher } from 'vue-router'
import apiApp from '@/api/modules/app'
import { systemRoutes as systemRoutesRaw } from '@/router/routes'
import { treeDataTranslate } from '@/utils'

export const useAppRouteStore = defineStore(
  'appRoute',
  () => {
    const isGenerate = ref(false)
    // 原始路由
    const routesRaw = ref<RouteRecordMainRaw[]>([])
    // 已注册的路由，用于登出时删除路由
    const currentRemoveRoutes = ref<(() => void)[]>([])

    // 实际路由
    const routes = computed(() => {
      const returnRoutes: RouteRecordRaw[] = []
      if (routesRaw.value) {
        routesRaw.value.forEach((item) => {
          const tmpRoutes = cloneDeep(item.children) as RouteRecordRaw[]
          tmpRoutes.map((v) => {
            if (!v.meta) {
              v.meta = {}
            }
            v.meta.auth = item.meta?.auth ?? v.meta?.auth
            return v
          })
          returnRoutes.push(...tmpRoutes)
        })
        returnRoutes.forEach((item) => {
          if (item.children) {
            item.children = deleteMiddleRouteComponent(item.children)
          }
          return item
        })
      }
      return returnRoutes
    })
    // 系统路由
    const systemRoutes = computed(() => {
      const routes = [...systemRoutesRaw]
      routes.forEach((item) => {
        if (item.children) {
          item.children = deleteMiddleRouteComponent(item.children)
        }
      })
      return routes
    })
    // 删除路由中间层级对应的组件
    function deleteMiddleRouteComponent(routes: RouteRecordRaw[]) {
      const res: RouteRecordRaw[] = []
      routes.forEach((route) => {
        if (route.children?.length) {
          delete route.component
          route.children = deleteMiddleRouteComponent(route.children)
        }
        else {
          delete route.children
        }
        res.push(route)
      })
      return res
    }

    // 路由匹配器
    const routesMatcher = ref<RouterMatcher>()
    // 根据路径获取匹配的路由
    function getRouteMatchedByPath(path: string) {
      return routesMatcher.value?.resolve({ path }, undefined!)?.matched ?? []
    }

    // 路由排序，sort 越大越靠前
    function sortAsyncRoutes<T extends RouteRecordMainRaw[] | RouteRecordRaw[]>(routes: T): T {
      routes.sort((a, b) => (b.meta?.sort ?? 0) - (a.meta?.sort ?? 0))
      routes.forEach((route) => {
        if (route.children) {
          route.children = sortAsyncRoutes(route.children)
        }
      })
      return routes
    }

    // 生成路由（前端生成）
    function generateRoutesAtFront(asyncRoutes: RouteRecordMainRaw[]) {
      // 设置 routes 数据
      routesRaw.value = sortAsyncRoutes(cloneDeep(asyncRoutes) as any)
      // 创建路由匹配器
      const routes: RouteRecordRaw[] = []
      routesRaw.value.forEach((route) => {
        if (route.children) {
          routes.push(...route.children)
        }
      })
      routesMatcher.value = createRouterMatcher(routes, {})
      isGenerate.value = true
    }
    // 格式化后端路由数据
    // 后端 RouteVO: { id, parentId, path, component, redirect, alwaysShow, hidden, name, seq, meta: { title, icon, noCache, breadcrumb, affix, activeMenu, roles } }
    function formatBackRoutes(routes: any): RouteRecordMainRaw[] {
      return routes.map((route: any) => {
        // 0. Vue Router 4 要求所有路径必须以 / 开头
        if (route.path && route.path[0] !== '/') {
          route.path = `/${route.path}`
        }

        // 1. 把 meta 嵌套字段展平到 route.meta（供 convertRouteToMenu 和 auth 使用）
        if (route.meta) {
          if (route.meta.title) {
            route.title = route.meta.title
          }
          if (route.meta.icon) {
            route.icon = route.meta.icon
          }
          if (route.meta.roles && route.meta.roles.length > 0) {
            route.meta.auth = route.meta.roles[0]
          }
          if (route.meta.noCache) {
            route.meta.keepAlive = !route.meta.noCache
          }
          if (route.meta.breadcrumb !== undefined) {
            route.meta.breadcrumb = !!route.meta.breadcrumb
          }
          if (route.meta.activeMenu) {
            route.meta.activeMenu = route.meta.activeMenu
          }
        }

        // 2. 把 top-level 字段复制到 meta
        if (!route.meta) {
          route.meta = {}
        }
        if (route.hidden !== undefined) {
          route.meta.hidden = !!route.hidden
        }
        if (route.alwaysShow !== undefined) {
          route.meta.alwaysShow = !!route.alwaysShow
        }
        if (route.redirect) {
          route.meta.redirect = route.redirect
        }
        if (route.seq !== undefined) {
          route.meta.sort = route.seq
        }
        if (route.name) {
          route.name = route.name
        }

        // 3. 处理组件
        // 后端返回的 component 路径如 'platform/shop-manage'、'product/category'、'rbac/sys-user'
        // 使用 switch-case 预判所有路径，避开 Vite 变量动态导入限制
        const componentMap: Record<string, () => Promise<any>> = {
          'platform/hot-search': () => import('@/views/modules/platform/hot-search/index.vue'),
          'platform/index-img': () => import('@/views/modules/platform/index-img/index.vue'),
          'platform/shop-manage': () => import('@/views/modules/platform/shop-manage/index.vue'),
          'product/attr': () => import('@/views/modules/product/attr/index.vue'),
          'product/brand': () => import('@/views/modules/product/brand/index.vue'),
          'product/category': () => import('@/views/modules/product/category/index.vue'),
          'product/list': () => import('@/views/modules/product/list/index.vue'),
          'product/prod-info': () => import('@/views/modules/product/prod-info/index.vue'),
          'rbac/menu': () => import('@/views/modules/rbac/menu/index.vue'),
          'rbac/menu-permission': () => import('@/views/modules/rbac/menu-permission/index.vue'),
          'rbac/role': () => import('@/views/modules/rbac/role/index.vue'),
          'rbac/shop-menu': () => import('@/views/modules/rbac/shop-menu/index.vue'),
          'rbac/sys-user': () => import('@/views/modules/rbac/sys-user/index.vue'),
        }
        switch (route.component) {
          case 'Layout':
            route.component = () => import('@/layouts/index.vue')
            break
          case 'MainRouterLayout':
            route.component = () => import('@/layouts/index.vue')
            break
          default:
            if (route.component && componentMap[route.component]) {
              route.component = componentMap[route.component]
            }
            else {
              delete route.component
            }
        }

        if (route.children) {
          route.children = formatBackRoutes(route.children)
        }
        return route
      })
    }

    // 根据菜单ID过滤路由（非管理员）
    function filterRoutesByMenuIds(routes: any[], menuIds: number[]): any[] {
      return routes.filter(route => {
        if (route.id && !menuIds.includes(route.id)) return false
        if (route.children) {
          route.children = filterRoutesByMenuIds(route.children, menuIds)
        }
        return true
      })
    }

    // 生成路由（后端获取）
    async function generateRoutesAtBack() {
      const appAccountStore = useAppAccountStore()
      // 拦截器 return res.data，所以这里 res 已经是 data 数组
      const res = await apiApp.routeList()
      // 后端返回扁平数组，需要 treeDataTranslate 转成树结构
      let routes = treeDataTranslate(res)

      // 非管理员根据菜单ID过滤路由
      if (!appAccountStore.isAdmin) {
        const ids = await appAccountStore.getMenuIds()
        routes = filterRoutesByMenuIds(routes, ids)
      }

      // 设置 routes 数据
      routesRaw.value = sortAsyncRoutes(formatBackRoutes(routes) as any)
      // 创建路由匹配器（用于 path → route 解析）
      const routesList: RouteRecordRaw[] = []
      routesRaw.value.forEach((route) => {
        if (route.children) {
          routesList.push(...route.children)
        }
      })
      routesMatcher.value = createRouterMatcher(routesList, {})
      isGenerate.value = true
    }
    function setCurrentRemoveRoutes(routes: (() => void)[]) {
      currentRemoveRoutes.value = routes
    }
    // 清空动态路由
    function removeRoutes() {
      isGenerate.value = false
      routesRaw.value = []
      currentRemoveRoutes.value.forEach((removeRoute) => {
        removeRoute()
      })
      currentRemoveRoutes.value = []
    }

    return {
      isGenerate,
      routesRaw,
      currentRemoveRoutes,
      routes,
      systemRoutes,
      getRouteMatchedByPath,
      generateRoutesAtFront,
      generateRoutesAtBack,
      setCurrentRemoveRoutes,
      removeRoutes,
    }
  },
)
