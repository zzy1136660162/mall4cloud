import api from '@/api'

export function page(pageParam) {
  return api({
    url: '/mall4cloud_rbac/role/page',
    method: 'get',
    params: pageParam,
  })
}

export function list() {
  return api({
    url: '/mall4cloud_rbac/role/list',
    method: 'get',
  })
}

export function get(roleId) {
  return api({
    url: '/mall4cloud_rbac/role',
    method: 'get',
    params: { roleId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_rbac/role',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_rbac/role',
    method: 'put',
    data,
  })
}

export function deleteById(roleId) {
  return api({
    url: '/mall4cloud_rbac/role',
    method: 'delete',
    params: { roleId },
  })
}
