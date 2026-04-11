import api from '@/api'

export function page(pageParam) {
  return api({
    url: '/mall4cloud_product/admin/attr/page',
    method: 'get',
    params: pageParam,
  })
}

export function get(attrId) {
  return api({
    url: '/mall4cloud_product/admin/attr',
    method: 'get',
    params: { attrId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_product/admin/attr',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_product/admin/attr',
    method: 'put',
    data,
  })
}

export function deleteById(attrId) {
  return api({
    url: '/mall4cloud_product/admin/attr',
    method: 'delete',
    params: { attrId },
  })
}
