import type { LoginResult } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

// 定义 Store
export const useUserStore = defineStore(
  'member',
  () => {
    // 用户信息
    const profile = ref<LoginResult>()
    // 保存用户信息，登录时使用
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }
    // 清理用户信息，退出时使用
    const clearProfile = () => {
      profile.value = undefined
    }
    // 记得 return
    return {
      profile,
      setProfile,
      clearProfile,
    }
  },
  // 持久化
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem: (key: string) => uni.getStorageSync(key),
        setItem: (key: string, value: any) => uni.setStorageSync(key, value),
      },
    },
  },
)
