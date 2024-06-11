<template>
  <!-- 催单massageBox -->
  <uni-popup ref="popup" type="center" :is-mask-click="true">
    <view class="pop">
      <view class="title"> 温馨提示 </view>
      <view class="tip-img">
        <image src="../../static/images/success.png"></image>
      </view>
      <view class="tip-info"> 37已成功帮你催单~ </view>
      <view class="sure" @click="confirm"> 确定 </view>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup name="pushMsg">
import {ref} from 'vue'

// const props = defineProps({
//   popup: {
//     type: Object,
//     required: true,
//   },
// })
const popup = ref()

const openPopup = () => {
  if (popup.value) {
    popup.value.open()
  }
}

const closePopup = () => {
  if (popup.value) {
    popup.value.close()
  }
}

const confirm = () => {
  closePopup()
}

// 公开方法给父组件使用
defineExpose({
  openPopup,
  closePopup,
})
</script>

<style>
.pop {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 16rpx;
  height: 576rpx;
  z-index: 99;
  width: 640rpx;
  padding: 30rpx 0;
}
.title {
  text-align: center;
  font-size: 34rpx;
  font-weight: 500;
  margin-top: 38rpx;
}
.tip-img {
  margin: 0 auto;
  width: 200rpx;
  height: 200rpx;
  margin-top: 64rpx;
}
.tip-img image {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}
.tip-info {
  padding: 0 30rpx;
  font-size: 34rpx;
  color: #666;
  margin-top: 32rpx;
  margin-bottom: 64rpx;
  text-align: center;
}
.sure {
  width: 100%;
  border-top: 1rpx solid #d1d1d1;
  height: 112rpx;
  text-align: center;
  line-height: 112rpx;
  color: #22ccff;
  font-size: 34rpx;
  font-weight: 500;
}
</style>
