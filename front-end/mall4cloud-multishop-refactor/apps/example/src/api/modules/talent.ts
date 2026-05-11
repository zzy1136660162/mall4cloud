import api from '@/api'

export interface TalentVO {
  userId?: number
  talentRealName: string
  talentPhone: string
  talentProvince?: string
  talentCity?: string
  talentArea?: string
  talentApplyReason?: string
  talentIntro?: string
  talentApplyTime?: string
  talentStatus?: number
}

export interface TalentPageParam {
  page?: number
  limit?: number
  talentStatus?: number
}

export const talentApi = {
  page: (params: TalentPageParam) =>
    api.request({
      url: '/mall4cloud_user/a/talent/page',
      method: 'get',
      params,
    }),

  audit: (data: { userId: number; status: number }) =>
    api.request({
      url: '/mall4cloud_user/a/talent/audit',
      method: 'put',
      data,
    }),
}

export default talentApi
