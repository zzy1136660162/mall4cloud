const Layout = () => import('@/layouts/index.vue')

export default [
  {
    path: '/demand',
    component: Layout,
    name: 'demand',
    meta: {
      title: '需求管理',
      icon: 'i-ant-design:file-text-outlined',
    },
    children: [
      {
        path: 'list',
        name: 'demandList',
        component: () => import('@/views/demand/list/index.vue'),
        meta: {
          title: '需求列表',
        },
      },
    ],
  },
] as const
