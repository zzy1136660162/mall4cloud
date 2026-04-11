import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layouts/index.vue')

export default [
  {
    path: '/shop',
    component: Layout,
    name: 'shop',
    meta: {
      title: '店铺管理',
      icon: 'i-ant-design:shop-twotone',
    },
    children: [
      {
        path: 'hot-search',
        name: 'shopHotSearch',
        component: () => import('@/views/shop/hot-search/index.vue'),
        meta: {
          title: '热门搜索',
        },
      },
      {
        path: 'index-img',
        name: 'shopIndexImg',
        component: () => import('@/views/shop/index-img/index.vue'),
        meta: {
          title: '首页图片',
        },
      },
    ],
  },
] as const
