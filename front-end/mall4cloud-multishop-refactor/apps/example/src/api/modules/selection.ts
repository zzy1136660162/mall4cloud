import api from '@/api'

// ============ 类型定义 ============

export interface SelectionApplyVO {
  applyId: number
  userId?: number
  userName?: string
  contactPhone: string
  deliveryAddress: string
  spuId: number
  spuName: string
  mainImgUrl: string
  priceFee: number
  shopId: number
  shopName: string
  applyRemark?: string
  applyTime: string
  auditStatus: number
  auditStatusText: string
  auditTime?: string
  auditRemark?: string
  expressCompany?: string
  expressNo?: string
  shipTime?: string
}

export interface SelectionApplyPageParam {
  pageNum?: number
  pageSize?: number
  userId?: number
  spuId?: number
  shopId?: number
  auditStatus?: number
  startTime?: string
  endTime?: string
}

export interface SelectionAuditParam {
  auditStatus: number
  auditRemark?: string
}

export interface SelectionStatisticsVO {
  totalApplies: number
  pendingApplies: number
  approvedApplies: number
  rejectedApplies: number
  todayApplies: number
}

// ============ API定义 ============

export const selectionApi = {
  // 获取申请列表
  page: (params: SelectionApplyPageParam) =>
    api.request({
      url: '/mall4cloud_platform/admin/selection/applies',
      method: 'get',
      params,
    }),

  // 审核申请
  audit: (applyId: number, data: SelectionAuditParam) =>
    api.request({
      url: `/mall4cloud_platform/admin/selection/audit/${applyId}`,
      method: 'put',
      data,
    }),

  // 填写物流信息
  ship: (applyId: number, expressCompany: string, expressNo: string) =>
    api.request({
      url: `/mall4cloud_platform/admin/selection/ship/${applyId}`,
      method: 'put',
      params: { expressCompany, expressNo },
    }),

  // 获取统计数据
  statistics: () =>
    api.request({
      url: '/mall4cloud_platform/admin/selection/statistics',
      method: 'get',
    }),

  // 获取申请详情
  get: (applyId: number) =>
    api.request({
      url: `/mall4cloud_platform/admin/selection/detail/${applyId}`,
      method: 'get',
    }),
}

export default selectionApi
