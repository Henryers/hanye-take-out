import request from '@/utils/request' // 引入自定义的axios函数

/**
 * 添加分类
 * @param params 添加分类的DTO对象
 * @returns
 */
export const addCategoryAPI = (params: any) => {
  return request({
    url: '/category',
    method: 'post',
    data: { ...params }
  })
}

/**
 * 获取分类分页列表
 * @param params page,pageSize,type
 * @returns
 */
export const getCategoryPageListAPI = (params: any) => {
  console.log('type呢！！！', params)
  return request({
    url: '/category/page',
    method: 'get',
    params
  })
}

/**
 * 根据id获取分类信息，用于回显
 * @param id 分类id
 * @returns
 */
export const getCategoryByIdAPI = (id: number) => {
  return request({
    url: `/category/${id}`,
    method: 'get'
  })
}

/**
 * 修改分类信息
 * @param params 更新分类信息的DTO对象
 * @returns
 */
export const updateCategoryAPI = (params: any) => {
  return request({
    url: '/category',
    method: 'put',
    data: { ...params }
  })
}

/**
 * 修改分类状态
 * @param params 分类id
 * @returns
 */
export const updateCategoryStatusAPI = (id: number) => {
  console.log('发请求啊！', id)
  return request({
    url: `/category/status/${id}`,
    method: 'put'
  })
}

/**
 * 根据id删除分类
 * @param id 分类id
 * @returns
 */
export const deleteCategoryAPI = (id: number) => {
  return request({
    url: `/category/${id}`,
    method: 'delete'
  })
}
