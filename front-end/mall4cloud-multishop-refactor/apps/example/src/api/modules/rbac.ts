import api from '@/api'

export interface RoleVO {
  roleId?: number
  roleName: string
  remark?: string
  createTime?: string
  menuIds?: number[]
}

export interface MenuVO {
  menuId: number
  parentId: number
  name: string
  path: string
  perms: string
  menuType: number
  icon?: string
  orderNum: number
  status: number
  children?: MenuVO[]
}

export interface RolePageParam {
  pageNum?: number
  pageSize?: number
  roleName?: string
  status?: number
}

export const rbacApi = {
  role: {
    page: (params: RolePageParam) =>
      api.request({
        url: '/mall4cloud_rbac/role/page',
        method: 'get',
        params,
      }),

    list: () =>
      api.request({
        url: '/mall4cloud_rbac/role/list',
        method: 'get',
      }),

    get: (roleId: number) =>
      api.request({
        url: '/mall4cloud_rbac/role',
        method: 'get',
        params: { roleId },
      }),

    save: (data: RoleVO) =>
      api.request({
        url: '/mall4cloud_rbac/role',
        method: 'post',
        data,
      }),

    update: (data: RoleVO) =>
      api.request({
        url: '/mall4cloud_rbac/role',
        method: 'put',
        data,
      }),

    delete: (roleId: number) =>
      api.request({
        url: '/mall4cloud_rbac/role',
        method: 'delete',
        params: { roleId },
      }),
  },

  menu: {
    list: () =>
      api.request({
        url: '/mall4cloud_rbac/menu/list',
        method: 'get',
      }),

    get: (menuId: number) =>
      api.request({
        url: '/mall4cloud_rbac/menu',
        method: 'get',
        params: { menuId },
      }),

    save: (data: MenuVO) =>
      api.request({
        url: '/mall4cloud_rbac/menu',
        method: 'post',
        data,
      }),

    update: (data: MenuVO) =>
      api.request({
        url: '/mall4cloud_rbac/menu',
        method: 'put',
        data,
      }),

    delete: (menuId: number) =>
      api.request({
        url: '/mall4cloud_rbac/menu',
        method: 'delete',
        params: { menuId },
      }),
  },

  menuPermission: {
    getByRoleId: (roleId: number) =>
      api.request({
        url: '/mall4cloud_rbac/menu_perm/get_by_role_id',
        method: 'get',
        params: { roleId },
      }),

    save: (data: { roleId: number; menuIds: number[] }) =>
      api.request({
        url: '/mall4cloud_rbac/menu_perm',
        method: 'post',
        data,
      }),
  },
}

export default rbacApi
