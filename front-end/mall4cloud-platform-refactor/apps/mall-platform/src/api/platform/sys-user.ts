import api from '@/api'

export function shopUserInfo() {
  return api({
    url: '/mall4cloud_platform/sys_user/info',
    method: 'get',
  })
}

export function page(pageParam) {
  return api({
    url: '/mall4cloud_platform/sys_user/page',
    method: 'get',
    params: pageParam,
  })
}

export function get(sysUserId) {
  return api({
    url: '/mall4cloud_platform/sys_user',
    method: 'get',
    params: { sysUserId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_platform/sys_user',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_platform/sys_user',
    method: 'put',
    data,
  })
}

export function deleteById(sysUserId) {
  return api({
    url: '/mall4cloud_platform/sys_user',
    method: 'delete',
    params: { sysUserId },
  })
}
