import { http } from '@/utils/http'
import type { ProfileDetail } from '@/types/user'

// 根据id查询用户信息
export const getUserInfoAPI = (id: number) => {
  return http<ProfileDetail>({
    url: `/user/user/${id}`,
    method: 'GET',
  })
}

// 更新用户信息
export const updateUserAPI = (params: any) => {
  return http({
    url: '/user/user',
    method: 'PUT',
    data: params,
  })
}
