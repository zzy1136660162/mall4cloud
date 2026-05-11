import http from '@/utils/http.js'

const API_PRODUCT = '/mall4cloud_product/ua'
const API_PLATFORM = '/mall4cloud_platform'
const API_MULTISHOP = '/mall4cloud_multishop/ua'

export default {
  /**
   * 获取选品轮播图
   * @param {Number} shopId 店铺ID
   */
  getSelectionBanners (shopId = 324) {
    return http.request({
      url: `${API_MULTISHOP}/index_img/list`,
      method: 'GET',
      data: {
        shopId
      }
    })
  },

  /**
   * 获取商品分类列表（使用现有接口）
   * @param {Number} parentId 父分类ID（0获取一级分类）
   * @param {Number} shopId 店铺ID（0表示平台分类）
   */
  getCategories(parentId = 0, shopId = 0) {
    return http.request({
      url: `${API_PRODUCT}/category/category_list`,
      method: 'GET',
      data: { parentId, shopId }
    })
  },

  /**
   * 获取选品商品列表
   * @param {Object} params 查询参数
   */
  getSelectionProducts(params = {}) {
    return http.request({
      url: `${API_PRODUCT}/spu/page`,
      method: 'GET',
      data: {
        isSelection: 1,
        ...params
      }
    })
  },

  /**
   * 获取选品商品详情
   * @param {String|Number} spuId 商品ID
   */
  getSelectionDetail(spuId) {
    return http.request({
      url: `${API_PRODUCT}/spu/detail/${spuId}`,
      method: 'GET'
    })
  },

  /**
   * 获取商品详情（包含佣金率）
   * @param {String|Number} spuId 商品ID
   */
  getProductDetail(spuId) {
    return http.request({
      url: `${API_PRODUCT}/spu/detail/${spuId}`,
      method: 'GET'
    })
  },

  /**
   * 提交选品申请
   * @param {Object} data 申请数据
   */
  submitSelectionApply(data) {
    return http.request({
      url: `${API_PLATFORM}/app/selection/apply`,
      method: 'POST',
      data
    })
  },

  /**
   * 获取我的选品申请列表
   * @param {Object} params 分页参数
   */
  getMySelectionApplies(params = {}) {
    return http.request({
      url: `${API_PLATFORM}/app/selection/my-applies`,
      method: 'GET',
      data: params
    })
  },

  /**
   * 获取申请详情
   * @param {String|Number} applyId 申请ID
   */
  getApplyDetail(applyId) {
    return http.request({
      url: `${API_PLATFORM}/app/selection/detail/${applyId}`,
      method: 'GET'
    })
  }
}
