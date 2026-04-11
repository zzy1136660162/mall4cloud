const Layout = () => import('@/layouts/index.vue')

export default [
  {
    path: '/order',
    component: Layout,
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'i-ant-design:order-twotone',
    },
    children: [
      {
        path: 'list',
        name: 'orderList',
        component: () => import('@/views/order/list/index.vue'),
        meta: {
          title: '订单列表',
        },
      },
      {
        path: 'detail/:id',
        name: 'orderDetail',
        component: () => import('@/views/order/detail/index.vue'),
        meta: {
          title: '订单详情',
        },
      },
    ],
  },
] as const
