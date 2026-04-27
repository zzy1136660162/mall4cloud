import type { RouteRecordRaw } from 'vue-router'

function Layout() {
  return import('@/layouts/index.vue')
}

const talentRoutes: RouteRecordRaw[] = [
  {
    path: '/talent',
    name: 'Talent',
    component: Layout,
    meta: { title: '达人管理', icon: 'i-ant-design:usergroup-add-twotone' },
    children: [
      {
        path: 'talent',
        name: 'TalentApply',
        component: () => import('@/views/talent/index.vue'),
        meta: { title: '达人申请' },
      },
    ],
  },
]

export default talentRoutes
