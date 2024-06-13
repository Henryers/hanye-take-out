<!-- 测试用的，本项目并未使用该部分代码！ -->
<template>
  <view class="simple-address">
    <!-- 只有微信小程序端内置了省市区数据 -->
    <!-- #ifdef MP-WEIXIN -->
    <view class="form-item">
      <text class="label">城市</text>
      <picker @change="pickerChange" mode="region" class="picker" :value="stringValue?.split(' ')">
        <view v-if="stringValue">{{ stringValue }}</view>
        <view class="placeholder" v-else>请选择城市</view>
      </picker>
    </view>
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
import {ref} from 'vue'

const stringValue = ref('')

// 自己实现的省市区选择器
let fullLocationCode: [string, string, string] = ['', '', '']
const pickerChange: UniHelper.RegionPickerOnChange = (ev) => {
  // 修改前端界面
  stringValue.value = ev.detail.value.join(' ')
  // 提交后端更新
  fullLocationCode = ev.detail.code!
}
</script>

<style lang="less" scoped></style>
