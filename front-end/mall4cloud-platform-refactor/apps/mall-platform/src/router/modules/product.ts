function Layout() {
  return import('@/layouts/index.vue')
}

const routes = {
  path: '/product',
  component: Layout,
  name: 'product',
  meta: { title: '商品管理', icon: 'i-ant-design:shopping-outlined' },
  children: [
    {
      path: 'category',
      name: 'productCategory',
      component: () => import('@/views/modules/product/category/index.vue'),
      meta: { title: '分类管理', icon: 'i-ant-design:appstore-outlined' },
    },
    {
      path: 'brand',
      name: 'productBrand',
      component: () => import('@/views/modules/product/brand/index.vue'),
      meta: { title: '品牌管理', icon: 'i-ant-design:branches-outlined' },
    },
    {
      path: 'attr',
      name: 'productAttr',
      component: () => import('@/views/modules/product/attr/index.vue'),
      meta: { title: '属性管理', icon: 'i-ant-design:filter-outlined' },
    },
    {
      path: 'list',
      name: 'productList',
      component: () => import('@/views/modules/product/list/index.vue'),
      meta: { title: '商品列表', icon: 'i-ant-design:file-text-outlined' },
    },
  ],
}

export default routes
