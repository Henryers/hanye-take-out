// 通用的用户信息
type BaseProfile = {
  id: number
  openid: string
}

// 小程序登录 登录用户信息
export type LoginResult = BaseProfile & {
  token: string // 登录凭证
}

// 个人信息 用户详情信息
export type ProfileDetail = BaseProfile & {
  name?: string // 昵称
  phone?: string // 手机号
  gender?: number // 性别
  pic?: string // 头像
}
