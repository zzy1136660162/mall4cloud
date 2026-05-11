function Layout() {
  return import('@/layouts/index.vue')
}

const routes = {
  path: '/platform',
  component: Layout,
  name: 'platform',
  meta: { title: '平台管理', icon: 'i-ant-design:setting-outlined' },
  children: [
    {
      path: 'hot-search',
      name: 'platformHotSearch',
      component: () => import('@/views/modules/platform/hot-search/index.vue'),
      meta: { title: '热门搜索', icon: 'i-ant-design:fire-outlined' },
    },
    {
      path: 'index-img',
      name: 'platformIndexImg',
      component: () => import('@/views/modules/platform/index-img/index.vue'),
      meta: { title: '首页图片管理', icon: 'i-ant-design:picture-outlined' },
    },
    {
      path: 'shop-manage',
      name: 'platformShopManage',
      component: () => import('@/views/modules/platform/shop-manage/index.vue'),
      meta: { title: '店铺管理', icon: 'i-ant-design:shop-outlined' },
    },
  ],
}

export default routes
