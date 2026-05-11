function Layout() {
  return import('@/layouts/index.vue')
}

const routes = {
  path: '/rbac',
  component: Layout,
  name: 'rbac',
  meta: { title: '权限管理', icon: 'i-ant-design:safety-outlined' },
  children: [
    {
      path: 'sys-user',
      name: 'rbacSysUser',
      component: () => import('@/views/modules/rbac/sys-user/index.vue'),
      meta: { title: '用户管理', icon: 'i-ant-design:user-outlined' },
    },
    {
      path: 'role',
      name: 'rbacRole',
      component: () => import('@/views/modules/rbac/role/index.vue'),
      meta: { title: '角色管理', icon: 'i-ant-design:team-outlined' },
    },
    {
      path: 'menu',
      name: 'rbacMenu',
      component: () => import('@/views/modules/rbac/menu/index.vue'),
      meta: { title: '菜单管理', icon: 'i-ant-design:menu-outlined' },
    },
    {
      path: 'menu-permission',
      name: 'rbacMenuPermission',
      component: () => import('@/views/modules/rbac/menu-permission/index.vue'),
      meta: { title: '菜单权限', icon: 'i-ant-design:key-outlined' },
    },
    {
      path: 'shop-menu',
      name: 'rbacShopMenu',
      component: () => import('@/views/modules/rbac/shop-menu/index.vue'),
      meta: { title: '店铺菜单', icon: 'i-ant-design:shop-outlined' },
    },
  ],
}

export default routes
