export type Address = {
  id?: number
  userId?: number // 用户id
  consignee?: string // 收货人
  phone?: string // 手机号
  gender?: number // 性别 0 女 1 男
  provinceCode?: string // 省级区划编号
  provinceName?: string // 省级名称
  cityCode?: string // 市级区划编号
  cityName?: string // 市级名称
  districtCode?: string // 区级区划编号
  districtName?: string // 区级名称
  detail?: string // 详细地址
  label?: string // 标签
  isDefault?: number // 是否默认 0否 1是
}

// picker中具体省市区类型
export type SimpleAddress = {
  label?: string // 标签
  value?: string // 对应编号
}
