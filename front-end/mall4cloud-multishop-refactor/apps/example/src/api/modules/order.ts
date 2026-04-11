import api from '@/api'

export interface OrderPageParam {
  pageNum?: number
  pageSize?: number
  orderId?: string
  status?: number
  consignee?: string
  mobile?: string
  startTime?: string
  endTime?: string
}

export interface OrderItem {
  orderItemId: number
  spuId: number
  spuName: string
  skuName: string
  pic: string
  price: number
  count: number
  returnMoneySts?: number
  status?: number
}

export interface OrderVO {
  orderId: number
  createTime: string
  consignee: string
  mobile: string
  total: number
  allCount: number
  status: number
  isPayed: boolean
  deliveryType?: number
  preSaleTime?: string
  orderItems: OrderItem[]
  remarks?: string
}

export interface DeliveryParam {
  orderId: number
  deliveryCompanyId: number
  deliveryNo: string
}

export const orderApi = {
  page: (params: OrderPageParam) =>
    api.request({
      url: '/mall4cloud_order/m/order/page',
      method: 'get',
      params,
    }),

  orderInfo: (orderId: number) =>
    api.request({
      url: '/mall4cloud_order/m/order/order_info/' + orderId,
      method: 'get',
    }),

  getOrderItemAndAddress: (orderId: number) =>
    api.request({
      url: '/mall4cloud_order/m/order/order_item_and_address/' + orderId,
      method: 'get',
    }),

  changeAmount: (data: { orderId: number; orderAmount: number }) =>
    api.request({
      url: '/mall4cloud_order/m/order/change_amount',
      method: 'put',
      data,
    }),

  delivery: (data: DeliveryParam) =>
    api.request({
      url: '/mall4cloud_order/m/order/delivery',
      method: 'post',
      data,
    }),

  refundPage: (params: OrderPageParam) =>
    api.request({
      url: '/mall4cloud_order/m/order/refund/page',
      method: 'get',
      params,
    }),
}

export default orderApi
