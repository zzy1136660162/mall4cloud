import api from '@/api'

export function page(pageParam) {
  return api({
    url: '/mall4cloud_rbac/menu_permission/page',
    method: 'get',
    params: pageParam,
  })
}

export function get(menuPermissionId) {
  return api({
    url: '/mall4cloud_rbac/menu_permission',
    method: 'get',
    params: { menuPermissionId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_rbac/menu_permission',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_rbac/menu_permission',
    method: 'put',
    data,
  })
}

export function deleteById(menuPermissionId) {
  return api({
    url: '/mall4cloud_rbac/menu_permission',
    method: 'delete',
    params: { menuPermissionId },
  })
}

export function menuPermissionsList() {
  return api({
    url: '/mall4cloud_rbac/menu_permission/list',
    method: 'get',
  })
}
