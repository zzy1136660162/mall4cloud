import type { RouteRecordMainRaw } from '@fantastic-admin/types'
import type { RouteRecordRaw, RouterMatcher } from 'vue-router'
import { cloneDeep } from 'es-toolkit'
import { createRouterMatcher } from 'vue-router'
import apiApp from '@/api/modules/app'
import { systemRoutes as systemRoutesRaw } from '@/router/routes'

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
          if (item.children && item.children.length > 0) {
            const clonedItem = cloneDeep(item)
            clonedItem.children = clonedItem.children.map((v: RouteRecordRaw) => {
              if (!v.meta) {
                v.meta = {}
              }
              v.meta.auth = item.meta?.auth ?? v.meta?.auth
              return v
            })
            returnRoutes.push(clonedItem)
          }
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
    // 格式化后端路由数据（处理扁平化数据）
    function formatBackRoutes(routes: any, views = import.meta.glob('../../../views/**/*.vue')): RouteRecordMainRaw[] {
      if (!routes || !Array.isArray(routes)) {
        console.warn('[DEBUG formatBackRoutes] routes is not array:', routes)
        return []
      }
      console.log('[DEBUG formatBackRoutes] available views:', Object.keys(views))
      console.log('[DEBUG formatBackRoutes] sample view keys:', Object.keys(views).slice(0, 5))
      const routeMap = new Map()
      routes.forEach((route: any) => {
        if (!route.children) {
          route.children = []
        }
        routeMap.set(route.id, route)
      })
      const rootRoutes: any[] = []
      routes.forEach((route: any) => {
        if (route.parentId === 0 || route.parentId === null || route.parentId === undefined) {
          rootRoutes.push(route)
        }
        else {
          const parent = routeMap.get(route.parentId)
          if (parent) {
            if (!parent.children) {
              parent.children = []
            }
            parent.children.push(route)
          }
          else {
            console.warn('[DEBUG formatBackRoutes] parent not found for route:', route.path, 'parentId:', route.parentId)
            rootRoutes.push(route)
          }
        }
      })
      const formatRoute = (route: any, parentPath = ''): any => {
        if (route.path && !route.path.startsWith('/')) {
          route.path = parentPath ? route.path : `/${route.path}`
        }
        // 确保 meta 对象存在
        if (!route.meta) {
          route.meta = {}
        }
        // 将顶层的 title、icon 等信息移到 meta 中
        if (route.title && !route.meta.title) {
          route.meta.title = route.title
        }
        if (route.icon && !route.meta.icon) {
          route.meta.icon = route.icon
        }
        if (route.breadcrumb !== undefined && route.meta.breadcrumb === undefined) {
          route.meta.breadcrumb = route.breadcrumb
        }
        switch (route.component) {
          case 'Layout':
            route.component = () => import('@/layouts/index.vue')
            break
          default:
            if (route.component) {
              const componentPath = `../../../views/${route.component}/index.vue`
              route.component = views[componentPath]
              if (!route.component) {
                console.warn('[DEBUG formatRoute] component not found for path:', componentPath)
              }
            }
            else {
              delete route.component
            }
        }
        if (route.children && route.children.length > 0) {
          route.children = route.children.map((child: any) => formatRoute(child, route.path))
        }
        return route
      }
      return rootRoutes.map((route) => formatRoute(route))
    }
    // 生成路由（后端获取）
    async function generateRoutesAtBack() {
      console.log('[DEBUG generateRoutesAtBack] ********** STARTING **********')
      console.log('[DEBUG generateRoutesAtBack] calling apiApp.routeList()')
      console.log('[DEBUG generateRoutesAtBack] apiApp.routeList is:', apiApp.routeList)
      console.log('[DEBUG generateRoutesAtBack] calling apiApp.routeList() now...')
      try {
        const res = await apiApp.routeList()
        console.log('[DEBUG generateRoutesAtBack] response received:', res)
        console.log('[DEBUG generateRoutesAtBack] res is array?:', Array.isArray(res))
        routesRaw.value = sortAsyncRoutes(formatBackRoutes(res) as any)
        console.log('[DEBUG generateRoutesAtBack] formatted routesRaw:', routesRaw.value)
        // 创建路由匹配器
        const routes: RouteRecordRaw[] = []
        const routesToRegister: RouteRecordRaw[] = []
        console.log('[DEBUG generateRoutesAtBack] routesRaw.value structure:')
        routesRaw.value.forEach((route) => {
          console.log('[DEBUG generateRoutesAtBack]   route.path:', route.path, 'component:', route.component?.toString?.(), 'children count:', route.children?.length)
          if (route.path === '/') {
            console.warn('[DEBUG generateRoutesAtBack] WARNING: backend route has path "/", which will override system home route')
          }
          routes.push(route)
          routesToRegister.push(route)
          if (route.children) {
            route.children.forEach((child: any) => {
              console.log('[DEBUG generateRoutesAtBack]     child.path:', child.path, 'component:', child.component?.toString?.())
              const absoluteChild = { ...child, path: route.path + '/' + child.path }
              routes.push(absoluteChild)
            })
          }
        })
        routesMatcher.value = createRouterMatcher(routes, {})
        isGenerate.value = true
      } catch (err) {
        console.error('[DEBUG generateRoutesAtBack] error:', err)
      }
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
