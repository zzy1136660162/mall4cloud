const Layout = () => import('@/layouts/index.vue')

export default [
  {
    path: '/rbac',
    component: Layout,
    name: 'rbac',
    meta: {
      title: '权限管理',
      icon: 'i-ant-design:safety-certificate-twotone',
    },
    children: [
      {
        path: 'role',
        name: 'rbacRole',
        component: () => import('@/views/rbac/role/index.vue'),
        meta: {
          title: '角色管理',
        },
      },
    ],
  },
] as const
