import request from '@/utils/request' // 引入自定义的axios函数

/**
 * 获取店铺状态接口
 * @param params 无
 * @returns
 */
export const getStatusAPI = () => {
  return request({
    url: '/shop/status',
    method: 'get'
  })
}

/**
 * 修改店铺状态接口
 * @param params 状态 0打烊 1营业
 * @returns
 */
export const fixStatusAPI = (status: number) => {
  console.log(status)
  return request({
    url: `/shop/${status}`,
    method: 'put'
  })
}
