import api from '@/api'

export interface CategoryVO {
  categoryId: number
  parentId?: number
  name: string
  seq?: number
  status: number
  level?: number
  children?: CategoryVO[]
}

export interface AttrVO {
  attrId: number
  name: string
  attrValues?: AttrValueVO[]
  searchType?: number
  attrType?: number
}

export interface AttrValueVO {
  attrValueId: number
  value: string
}

export interface SpuPageParam {
  pageNum?: number
  pageSize?: number
  name?: string
  categoryId?: number
  shopCategoryId?: number
  status?: number
  isSelection?: number
  tagType?: number
}

export interface SpuVO {
  spuId: number
  name: string
  categoryId: number
  shopCategoryId: number
  mainImgUrl: string
  imgUrls: string
  priceFee: number
  marketPriceFee: number
  seq: number
  status: number
  isSelection?: number
  commissionRate?: number
  isHot?: number
  isNew?: number
  isRecommend?: number
  isSelectionBest?: number
  rating?: number
  totalSales?: number
  monthSales?: number
}

export interface ProdInfoVO extends SpuVO {
  spuId: string | number
  sellingPoint: string
  brandId: number
  brand?: {
    brandId: number
    name: string
    imgUrl: string
  }
  isCompose: number
  hasSkuImg: number
  scoreFee: number
  spuAttrValues: SpuAttrValue[]
  detail: string
  skuList: SkuVO[]
  skus: SkuVO[]
  totalStock: number
  isSelection: number
  commissionRate: number
  isHot: number
  isNew: number
  isRecommend: number
  isSelectionBest: number
  rating: number
  totalSales: number
  monthSales: number
}

export interface SpuAttrValue {
  attrId: number
  attrName: string
  attrValueId?: number
  attrValueName?: string
  spuAttrValueId?: number
}

export interface SkuVO {
  skuId?: number
  spuId?: number
  skuName?: string
  priceFee: number
  marketPriceFee: number
  stock: number
  imgUrl?: string
  spuSkuAttrValues?: SpuSkuAttrValue[]
  attrs?: string
}

export interface SpuSkuAttrValue {
  attrId: number
  attrName: string
  attrValueId: number
  attrValueName: string
}

export interface AttrParam {
  categoryId: number
  attrType: number
}

export const productApi = {
  spu: {
    page: (params: SpuPageParam) =>
      api.request({
        url: '/mall4cloud_product/admin/spu/page',
        method: 'get',
        params,
      }),

    get: (spuId: number) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'get',
        params: { spuId },
      }),

    save: (data: ProdInfoVO) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'post',
        data,
      }),

    update: (data: ProdInfoVO) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'put',
        data,
      }),

    delete: (spuId: number) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'delete',
        params: { spuId },
      }),
  },

  prodInfo: {
    get: (spuId: number | string) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'get',
        params: { spuId },
      }),

    save: (data: ProdInfoVO) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'post',
        data,
      }),

    update: (data: ProdInfoVO) =>
      api.request({
        url: '/mall4cloud_product/admin/spu',
        method: 'put',
        data,
      }),

    getAttrsByCategoryId: (params: AttrParam) =>
      api.request({
        url: '/mall4cloud_product/admin/attr/get_attrs_by_category_id',
        method: 'get',
        params,
      }),
  },

  category: {
    shopCategories: () =>
      api.request({
        url: '/mall4cloud_product/admin/category/shop_categories',
        method: 'get',
      }),

    platformCategories: () =>
      api.request({
        url: '/mall4cloud_product/admin/category/platform_categories',
        method: 'get',
      }),

    get: (categoryId: number) =>
      api.request({
        url: '/mall4cloud_product/admin/category',
        method: 'get',
        params: { categoryId },
      }),

    save: (data: CategoryVO) =>
      api.request({
        url: '/mall4cloud_product/admin/category',
        method: 'post',
        data,
      }),

    update: (data: CategoryVO) =>
      api.request({
        url: '/mall4cloud_product/admin/category',
        method: 'put',
        data,
      }),

    delete: (categoryId: number) =>
      api.request({
        url: '/mall4cloud_product/admin/category',
        method: 'delete',
        params: { categoryId },
      }),

    enableOrDisable: (data: { categoryId: number; status: number }) =>
      api.request({
        url: '/mall4cloud_product/admin/category/category_enable_or_disable',
        method: 'put',
        data,
      }),
  },

  attr: {
    page: (params: { pageNum?: number; pageSize?: number; name?: string }) =>
      api.request({
        url: '/mall4cloud_product/admin/attr/page',
        method: 'get',
        params,
      }),

    get: (attrId: number) =>
      api.request({
        url: '/mall4cloud_product/admin/attr',
        method: 'get',
        params: { attrId },
      }),

    save: (data: AttrVO) =>
      api.request({
        url: '/mall4cloud_product/admin/attr',
        method: 'post',
        data,
      }),

    update: (data: AttrVO) =>
      api.request({
        url: '/mall4cloud_product/admin/attr',
        method: 'put',
        data,
      }),

    delete: (attrId: number) =>
      api.request({
        url: '/mall4cloud_product/admin/attr',
        method: 'delete',
        params: { attrId },
      }),

    getShopAttrs: () =>
      api.request({
        url: '/mall4cloud_product/admin/attr/get_shop_attrs',
        method: 'get',
      }),
  },

  brand: {
    page: (params: { pageNum?: number; pageSize?: number; name?: string }) =>
      api.request({
        url: '/mall4cloud_product/platform/brand/page',
        method: 'get',
        params,
      }),

    getByCategoryId: (params: { categoryId: number; name?: string }) =>
      api.request({
        url: '/mall4cloud_product/admin/brand/get_brand_by_category_id',
        method: 'get',
        params,
      }),
  },
}

export default productApi
