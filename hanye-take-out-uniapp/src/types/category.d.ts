import type { DishItem } from './dish'

// 分类列表
export type CategoryItem = {
  children: DishItem[]
  id: number
  name: string
  sort: number
  type: number
}
