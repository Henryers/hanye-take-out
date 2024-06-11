import type { Login } from '@/types/login'
import { http } from '@/utils/http'

/**
 * 用户登录
 */
export const loginAPI = (code: string) => {
  return http<Login>({
    method: 'POST',
    url: '/user/user/login',
    data: { code },
  })
}
