import type { RouteRecordRaw } from 'vue-router'

const selectionRoutes: RouteRecordRaw[] = [
  {
    path: '/selection',
    name: 'Selection',
    component: () => import('@/layouts/index.vue'),
    meta: { title: '选品管理', icon: 'eos-icons:product-selection-outlined' },
    children: [
      {
        path: 'list',
        name: 'SelectionList',
        component: () => import('@/views/selection/index.vue'),
        meta: { title: '选品申请列表' },
      },
      {
        path: 'detail/:applyId',
        name: 'SelectionDetail',
        component: () => import('@/views/selection/detail.vue'),
        meta: { title: '申请详情', activeMenu: '/selection/list' },
      },
    ],
  },
]

export default selectionRoutes
