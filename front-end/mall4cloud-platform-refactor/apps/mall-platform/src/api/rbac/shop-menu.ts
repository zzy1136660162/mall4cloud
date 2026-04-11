import api from '@/api'

export function page(pageParam) {
  return api({
    url: '/mall4cloud_rbac/menu/page',
    method: 'get',
    params: pageParam,
  })
}

export function get(menuId) {
  return api({
    url: '/mall4cloud_rbac/menu',
    method: 'get',
    params: { menuId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_rbac/menu',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_rbac/menu',
    method: 'put',
    data,
  })
}

export function deleteByIdAndSysType(menuId, sysType) {
  return api({
    url: '/mall4cloud_rbac/menu',
    method: 'delete',
    params: { menuId, sysType },
  })
}

export function menuList(searchParam) {
  return api({
    url: '/mall4cloud_rbac/menu/route',
    method: 'get',
    params: searchParam,
  })
}

export function listWithPermissions() {
  return api({
    url: '/mall4cloud_rbac/menu/list_with_permissions',
    method: 'get',
  })
}

export function listMenuIds() {
  return api({
    url: '/mall4cloud_rbac/menu/list_menu_ids',
    method: 'get',
  })
}
