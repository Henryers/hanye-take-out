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

// /** 性别 */
// export type Gender = '女' | '男'

// /** 个人信息 修改请求体参数 */
// export type ProfileParams = Pick<ProfileDetail, 'nickname' | 'gender' | 'birthday' | 'profession'> & {
//   /** 省份编码 */
//   provinceCode?: string
//   /** 城市编码 */
//   cityCode?: string
//   /** 区/县编码 */
//   countyCode?: string
// }
