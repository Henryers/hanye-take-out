import { defineStore } from 'pinia'
import type { UserInfo } from '@/types/employee'
import { ref } from 'vue'

// Pinia 会自动将 Composition API 这些相关函数自动识别为状态管理的相关内容
// ref -> state,  computed -> getters,  methods -> actions    无 mutation 概念
// 等函数转换为响应式数据

export const useUserInfoStore = defineStore('userInfo', {
  state: () => {
    const userInfo = ref<UserInfo | null>(null)
    return { userInfo }
  },
  persist: true // 持久化存储
})