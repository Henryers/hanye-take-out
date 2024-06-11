import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCountdownStore = defineStore('countdown', () => {
  // 分秒
  const showM = ref(-1)
  const showS = ref(-1)
  // 定时器
  const timer = ref<number | undefined>(0)
  return {
    showM,
    showS,
    timer,
  }
})
