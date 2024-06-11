import request from '@/utils/request'

// 查询列表页接口
export const getOrderDetailPageAPI = (params: any) => {
  return request({
    url: '/order/conditionSearch',
    method: 'get',
    params
  })
}

// 查看接口
export const queryOrderDetailByIdAPI = (params: any) => {
  return request({
    url: `/order/details/${params.orderId}`,
    method: 'get'
  })
}

// 派送接口
export const deliveryOrderAPI = (params: any) => {
  return request({
    url: `/order/delivery/${params.id}`,
    method: 'put'
  })
}

// 完成接口
export const completeOrderAPI = (params: any) => {
  return request({
    url: `/order/complete/${params.id}`,
    method: 'put'
  })
}

// 订单取消
export const orderCancelAPI = (params: any) => {
  return request({
    url: '/order/cancel',
    method: 'put',
    data: { ...params }
  })
}

// 接单
export const orderAcceptAPI = (params: any) => {
  console.log('接单params', params)
  return request({
    url: '/order/confirm',
    method: 'put',
    data: { ...params }
  })
}

// 拒单
export const orderRejectAPI = (params: any) => {
  return request({
    url: '/order/reject',
    method: 'put',
    data: { ...params }
  })
}

// 获取待处理，待派送，派送中数量
export const getOrderListByAPI = () => {
  return request({
    url: '/order/statistics',
    method: 'get'
  })
}
