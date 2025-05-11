<template>
  <view class="uni-textarea">
    <textarea
      class="remark_text"
      placeholder-class="textarea-placeholder"
      v-model="remark"
      :maxlength="50"
      placeholder="请输入您需要备注的信息"
    />
    <view class="fifty">{{ remark.length }} / 50</view>
  </view>
  <view class="add_address">
    <button class="add_btn" :plain="true" @click="returnToSubmit()">完成</button>
  </view>
</template>

<script lang="ts" setup>
import {ref} from 'vue'

const remark = ref('')

// 返回提交页面，把备注信息传递给store
const returnToSubmit = () => {
  console.log('remark', remark.value)
  uni.redirectTo({
    url: '/pages/submit/submit?remark=' + remark.value,
  })
}
</script>

<style lang="less" scoped>
// 添加的备注
.uni-textarea {
  margin: 30rpx;
  padding-left: 30rpx;
  box-sizing: border-box;
  width: 690rpx;
  height: 300rpx;
  opacity: 1;
  background: #eee;
  border-radius: 12rpx;
  padding-top: 20rpx;
  font-size: 26rpx;
  .remark_text {
    line-height: 60rpx;
    height: 200rpx;
  }
  .fifty {
    color: #bbbbbb;
  }
}

.add_address {
  position: fixed;
  bottom: 0rpx;
  left: 0;
  margin: 0 auto;
  background: #ffffff;
  height: 136rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 750rpx;

  .add_btn {
    width: 668rpx;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 72rpx;
    background: #ffc200;
    border: 1px solid #ffc200;
    opacity: 1;
    font-size: 30rpx;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 500;
    text-align: center;
    color: #333333;
    letter-spacing: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
