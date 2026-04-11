import api from '@/api'

// 审核列表
export function page(pageParam) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_auditing/page',
    method: 'GET',
    params: pageParam,
  })
}

// 管理列表
export function managePage(pageParam) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail/page',
    method: 'GET',
    params: pageParam,
  })
}

// 根据店铺id查询详情信息
export function getDetail(shopId) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail/info',
    method: 'GET',
    params: { shopId },
  })
}

// 校验店铺名
export function examineShopName(param) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail/check_shop_name',
    method: 'GET',
    params: param,
  })
}

// 创建店铺
export function creat(data) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail',
    method: 'POST',
    data,
  })
}

// 更新店铺
export function update(data) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail/update_shop',
    method: 'PUT',
    data,
  })
}

// 管理-店铺详情
export function getManageDetail(shopId) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail/info',
    method: 'GET',
    params: { shopId },
  })
}

// 保存账号密码
export function savaAccountAndPassword(data) {
  return api({
    url: '/mall4cloud_multishop/platform/shop_detail/reset_shop_password',
    method: 'PUT',
    data,
  })
}
