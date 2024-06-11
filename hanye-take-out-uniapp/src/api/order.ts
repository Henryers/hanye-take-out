import { http } from '@/utils/http'
import type { OrderPageDTO, OrderSubmitVO, OrderVO, PageVO, OrderPaymentDTO } from '@/types/order'

// 用户下单
export const submitOrderAPI = (params: any) => {
  return http<OrderSubmitVO>({
    url: '/user/order/submit',
    method: 'POST',
    data: params,
  })
}

// 支付订单
export const payOrderAPI = (params: OrderPaymentDTO) => {
  return http({
    url: '/user/order/payment',
    method: 'PUT',
    data: params,
  })
}

// 未支付订单数量
export const getUnPayOrderAPI = () => {
  return http<number>({
    url: '/user/order/unPayOrderCount',
    method: 'GET',
  })
}

// 根据订单id获取订单详情
export const getOrderAPI = (id: number) => {
  console.log('byd !!! id', id)
  return http<OrderVO>({
    url: `/user/order/orderDetail/${id}`,
    method: 'GET',
  })
}

// 查询历史订单
export const getOrderPageAPI = (params: OrderPageDTO) => {
  console.log('params', params)
  return http<PageVO<OrderVO>>({
    url: '/user/order/historyOrders',
    method: 'GET',
    data: params,
  })
}

// 取消订单
export const cancelOrderAPI = (id: number) => {
  return http({
    url: `/user/order/cancel/${id}`,
    method: 'PUT',
  })
}

// 再来一单，要批量加入菜品到购物车，所以是POST请求
export const reOrderAPI = (id: number) => {
  return http({
    url: `/user/order/reOrder/${id}`,
    method: 'POST',
  })
}

// 催单
export const urgeOrderAPI = (id: number) => {
  return http({
    url: `/user/order/reminder/${id}`,
    method: 'GET',
  })
}
