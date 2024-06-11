// 通用分页结果类型
export type PageResult<T> = {
  items: T[] // 列表数据，不同页面的数据可能不同
  total: number
  page: number // 当前页码
  pages: number //总页数
  pageSize: number // 每页条数
}

// 通用分页参数类型
export type PageParams = {
  page?: number
  pageSize?: number
}
