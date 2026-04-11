import api from '@/api'

export interface HotSearchVO {
  hotSearchId?: number
  content: string
  seq: number
  status: number
  createTime?: string
}

export interface IndexImgVO {
  imgId?: number
  imgUrl: string
  imgType: number
  seq: number
  status: number
  createTime?: string
}

export interface NoticeVO {
  noticeId?: number
  title: string
  content: string
  status: number
  createTime?: string
}

export interface ShopUserVO {
  shopUserId?: number
  shopId: number
  userId: number
  isAdmin: number
  status: number
  createTime?: string
}

export interface ShopUserAccountVO {
  accountId?: number
  shopId: number
  userId: number
  accountNum: string
  status: number
  createTime?: string
}

export interface HotSearchPageParam {
  pageNum?: number
  pageSize?: number
  content?: string
  status?: number
}

export interface IndexImgPageParam {
  pageNum?: number
  pageSize?: number
  imgType?: number
  status?: number
}

export const shopApi = {
  hotSearch: {
    page: (params: HotSearchPageParam) =>
      api.request({
        url: '/mall4cloud_multishop/admin/hot_search/page',
        method: 'get',
        params,
      }),

    get: (hotSearchId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/hot_search',
        method: 'get',
        params: { hotSearchId },
      }),

    save: (data: HotSearchVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/hot_search',
        method: 'post',
        data,
      }),

    update: (data: HotSearchVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/hot_search',
        method: 'put',
        data,
      }),

    delete: (hotSearchId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/hot_search',
        method: 'delete',
        params: { hotSearchId },
      }),
  },

  indexImg: {
    page: (params: IndexImgPageParam) =>
      api.request({
        url: '/mall4cloud_multishop/admin/index_img/page',
        method: 'get',
        params,
      }),

    get: (imgId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/index_img',
        method: 'get',
        params: { imgId },
      }),

    save: (data: IndexImgVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/index_img',
        method: 'post',
        data,
      }),

    update: (data: IndexImgVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/index_img',
        method: 'put',
        data,
      }),

    delete: (imgId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/index_img',
        method: 'delete',
        params: { imgId },
      }),
  },

  notice: {
    page: (params: { pageNum?: number, pageSize?: number, title?: string, status?: number }) => {
      return api.request({
        url: '/mall4cloud_multishop/admin/notice/page',
        method: 'get',
        params,
      })
    },

    get: (noticeId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/notice',
        method: 'get',
        params: { noticeId },
      }),

    save: (data: NoticeVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/notice',
        method: 'post',
        data,
      }),

    update: (data: NoticeVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/notice',
        method: 'put',
        data,
      }),

    delete: (noticeId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/notice',
        method: 'delete',
        params: { noticeId },
      }),
  },

  shopUser: {
    page: (params: { pageNum?: number, pageSize?: number, shopId?: number, status?: number }) => {
      return api.request({
        url: '/mall4cloud_multishop/m/shop_user/page',
        method: 'get',
        params,
      })
    },

    get: (shopUserId: number) =>
      api.request({
        url: '/mall4cloud_multishop/m/shop_user',
        method: 'get',
        params: { shopUserId },
      }),

    save: (data: ShopUserVO) =>
      api.request({
        url: '/mall4cloud_multishop/m/shop_user',
        method: 'post',
        data,
      }),

    update: (data: ShopUserVO) =>
      api.request({
        url: '/mall4cloud_multishop/m/shop_user',
        method: 'put',
        data,
      }),

    delete: (shopUserId: number) =>
      api.request({
        url: '/mall4cloud_multishop/m/shop_user',
        method: 'delete',
        params: { shopUserId },
      }),
  },

  shopUserAccount: {
    page: (params: { pageNum?: number, pageSize?: number, shopId?: number, status?: number }) => {
      return api.request({
        url: '/mall4cloud_multishop/admin/shop_user_account/page',
        method: 'get',
        params,
      })
    },

    get: (accountId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/shop_user_account',
        method: 'get',
        params: { accountId },
      }),

    save: (data: ShopUserAccountVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/shop_user_account',
        method: 'post',
        data,
      }),

    update: (data: ShopUserAccountVO) =>
      api.request({
        url: '/mall4cloud_multishop/admin/shop_user_account',
        method: 'put',
        data,
      }),

    delete: (accountId: number) =>
      api.request({
        url: '/mall4cloud_multishop/admin/shop_user_account',
        method: 'delete',
        params: { accountId },
      }),
  },
}

export default shopApi
