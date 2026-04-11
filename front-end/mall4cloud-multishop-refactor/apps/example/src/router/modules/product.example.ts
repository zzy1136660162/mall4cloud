const Layout = () => import('@/layouts/index.vue')

export default [
  {
    path: '/product',
    component: Layout,
    name: 'product',
    meta: {
      title: '商品管理',
      icon: 'i-ant-design:product-twotone',
    },
    children: [
      {
        path: 'category',
        name: 'productCategory',
        component: () => import('@/views/product/category/index.vue'),
        meta: {
          title: '商品分类',
        },
      },
      {
        path: 'attr',
        name: 'productAttr',
        component: () => import('@/views/product/attr/index.vue'),
        meta: {
          title: '商品属性',
        },
      },
      {
        path: 'list',
        name: 'productList',
        component: () => import('@/views/product/list/index.vue'),
        meta: {
          title: '商品列表',
        },
      },
      {
        path: 'prod-info',
        name: 'productProdInfo',
        component: () => import('@/views/product/prod-info/index.vue'),
        meta: {
          title: '商品发布',
        },
      },
    ],
  },
] as const
