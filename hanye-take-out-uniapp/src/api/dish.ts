import type { DishItem } from '@/types/dish'
import { http } from '@/utils/http'

/**
 * 根据菜品分类id获取菜品列表
 */
export const getDishListAPI = (id: number) => {
  return http<DishItem[]>({
    method: 'GET',
    url: `/user/dish/list/${id}`,
  })
}

/**
 * 分类列表-小程序
 */
export const getDishByIdAPI = (id: number) => {
  return http<DishItem>({
    method: 'GET',
    url: `/user/dish/dish/${id}`,
  })
}
