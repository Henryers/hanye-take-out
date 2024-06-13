import request from '@/utils/request' // 引入自定义的axios函数

/**
 * 添加套餐
 * @param params 添加套餐的DTO对象
 * @returns
 */
export const addSetmealAPI = (params: any) => {
  return request({
    url: '/setmeal',
    method: 'post',
    data: { ...params }
  })
}

/**
 * 获取套餐分页列表
 * @param params pageData
 * @returns
 */
export const getSetmealPageListAPI = (params: any) => {
  console.log('Setmeal-params', params)
  return request({
    url: '/setmeal/page',
    method: 'get',
    params
  })
}

/**
 * 根据id获取套餐信息，用于回显
 * @param id 套餐id
 * @returns
 */
export const getSetmealByIdAPI = (id: number) => {
  return request({
    url: `/setmeal/${id}`,
    method: 'get'
  })
}

/**
 * 修改套餐信息
 * @param params 更新套餐信息的DTO对象
 * @returns
 */
export const updateSetmealAPI = (params: any) => {
  return request({
    url: '/setmeal',
    method: 'put',
    data: { ...params }
  })
}

/**
 * 修改套餐状态
 * @param params 套餐id
 * @returns
 */
export const updateSetmealStatusAPI = (id: number) => {
  console.log('套餐id', id)
  return request({
    url: `/setmeal/status/${id}`,
    method: 'put'
  })
}

/**
 * 根据ids批量删除套餐
 * @param ids 套餐ids
 * @returns
 */
export const deleteSetmealsAPI = (ids: string) => {
  return request({
    url: '/setmeal',
    method: 'delete',
    params: { ids }
  })
}
