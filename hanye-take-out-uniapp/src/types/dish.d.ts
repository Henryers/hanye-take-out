// 菜品列表
export type DishItem = {
  id: number
  name: string
  pic: string
  price: number
  detail: string
  categoryId: number
  flavors: FlavorItem[]
}

// 口味列表
export type FlavorItem = {
  id: number
  name: string
  list: string
  dishId: number
}

// 要添加到购物车的菜品数据，口味为string
export type DishToCartItem = {
  id: number
  name: string
  pic: string
  price: number
  detail: string
  categoryId: number
  flavors?: string
}
