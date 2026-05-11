import api from '@/api'

export interface DemandVO {
  id: number
  demandNo: string
  title: string
  functionalAppeal: string
  targetAudience: string
  dosageFormPreference: string
  budgetRange: string
  expectedDeliveryTime: string
  remark: string
  submitterId: string
  submitterName: string
  submitterPhone: string
  status: number
  statusText: string
  adminRemark: string
  handlerName: string
  submitTime: string
  updateTime: string
  createTime: string
}

export interface DemandPageParam {
  pageNum?: number
  pageSize?: number
  title?: string
  status?: number
  submitterId?: string
}

export interface DemandHandleDTO {
  demandId: number
  status: number
  adminRemark?: string
  handlerName?: string
}

export const demandApi = {
  list: () =>
    api.request({
      url: '/mall4cloud_platform/demand/list',
      method: 'get',
    }),

  page: (params: DemandPageParam) =>
    api.request({
      url: '/mall4cloud_platform/demand/page',
      method: 'get',
      params,
    }),

  get: (id: number) =>
    api.request({
      url: '/mall4cloud_platform/demand/detail/' + id,
      method: 'get',
    }),

  handle: (data: DemandHandleDTO) =>
    api.request({
      url: '/mall4cloud_platform/demand/handle',
      method: 'post',
      data,
    }),
}

export default demandApi
