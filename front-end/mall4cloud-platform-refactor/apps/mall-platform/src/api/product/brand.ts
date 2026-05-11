import api from '@/api'

export function page(pageParam) {
  return api({
    url: '/mall4cloud_product/platform/brand/page',
    method: 'get',
    params: pageParam,
  })
}

export function get(brandId) {
  return api({
    url: '/mall4cloud_product/platform/brand',
    method: 'get',
    params: { brandId },
  })
}

export function save(data) {
  return api({
    url: '/mall4cloud_product/platform/brand',
    method: 'post',
    data,
  })
}

export function update(data) {
  return api({
    url: '/mall4cloud_product/platform/brand',
    method: 'put',
    data,
  })
}

export function deleteById(brandId) {
  return api({
    url: '/mall4cloud_product/platform/brand',
    method: 'delete',
    params: { brandId },
  })
}

// 根据分类获取品牌列表（发布商品请求品牌）
export function getBrandByCategoryId(pageParam) {
  return api({
    url: '/mall4cloud_product/admin/brand/get_brand_by_category_id',
    method: 'get',
    params: pageParam,
  })
}

// 更新品牌状态（启用或禁用）
export function enableOrDisable(data) {
  return api({
    url: '/mall4cloud_product/platform/brand/update_brand_status',
    method: 'put',
    data,
  })
}
