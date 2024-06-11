import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAddressStore = defineStore('address', () => {
  // 记录点击地址后要返回的页面url
  const addressBackUrl = ref('')
  // 记录备注
  // const remark = ref('')
  // 记录默认餐具选择
  const defaultCook = ref('请依据实际情况填写，避免浪费')
  function updateAddressBackUrl(provider: string) {
    addressBackUrl.value = provider
  }
  return {
    addressBackUrl,
    // remark,
    defaultCook,
    updateAddressBackUrl,
  }
})
