import api from '@/api'

export function page(pageParam) {
  return api({
    url: '/mall4cloud_product/admin/spu/platform_page',
    method: 'get',
    params: pageParam,
  })
}

export function get(spuId) {
  return api({
    url: '/mall4cloud_product/admin/spu',
    method: 'get',
    params: { spuId },
  })
}

// 删除
export function deleteById(spuId) {
  return api({
    url: '/mall4cloud_product/admin/spu',
    method: 'delete',
    params: { spuId },
  })
}

export function updateProdStatus(data) {
  return api({
    url: '/mall4cloud_product/m/spu/prod_status',
    method: 'put',
    data,
  })
}

export function updatePartProdStatus(data) {
  return api({
    url: '/mall4cloud_product/m/spu/update_spu_data',
    method: 'put',
    data,
  })
}

// 下线活动
export function onOrOffTheShelf(data) {
  return api({
    url: '/mall4cloud_product/admin/product_offline_handle_event/offline',
    method: 'POST',
    data,
  })
}

// 获取下线活动最新详情
export function getOfflineDetailByProdId(prodId) {
  return api({
    url: `/mall4cloud_product/admin/product_offline_handle_event/get_offline_handle_event_by_prodId/${prodId}`,
    method: 'GET',
  })
}

// 审核
export function examineProdOnShelfApply(data) {
  return api({
    url: '/mall4cloud_product/admin/product_offline_handle_event/spu_audit',
    method: 'POST',
    data,
  })
}
