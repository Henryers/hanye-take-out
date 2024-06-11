import type { SetmealItem, SetmealVOItem } from '@/types/setmeal'
import { http } from '@/utils/http'

/**
 * 根据套餐分类id获取套餐列表
 */
export const getSetmealListAPI = (id: number) => {
  return http<SetmealItem[]>({
    method: 'GET',
    url: `/user/setmeal/list/${id}`,
  })
}

/**
 * 获取套餐详情
 */
export const getSetmealAPI = (id: number) => {
  return http<SetmealVOItem>({
    method: 'GET',
    url: `/user/setmeal/${id}`,
  })
}

/**
 * 根据套餐分类id获取套餐列表
 */
// export const getSetmealDishAPI = (id: number) => {
//   return http<SetmealDishItem[]>({
//     method: 'GET',
//     url: `/user/setmeal/dish/${id}`,
//   })
// }
