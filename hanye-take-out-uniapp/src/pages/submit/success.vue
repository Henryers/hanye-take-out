<template>
  <view class="container">
    <image src="../../static/icon/饿饿.png" mode="scaleToFill" />
    <view class="pay">支付成功</view>
    <view class="time">预计{{ arrivalTime }}送达</view>
    <view class="success_desc"> 后厨疯狂备餐ing, 请耐心等待~ </view>
    <view class="btn_box">
      <button class="return_btn" @click="toHome()">返回首页</button>
      <button class="detail_btn" @click="toDetail()">查看订单</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {onLoad} from '@dcloudio/uni-app'
import {ref} from 'vue'

const orderId = ref(0)
const orderNumber = ref('')
const orderAmount = ref(0)
const orderTime = ref('')
const arrivalTime = ref('')

onLoad(async (options: any) => {
  console.log('options', options)
  orderId.value = options.orderId
  orderNumber.value = options.orderNumber
  orderAmount.value = options.orderAmount
  orderTime.value = options.orderTime
  getHarfAnOur()
})

// 获取一小时以后的时间
const getHarfAnOur = () => {
  const date = new Date()
  date.setTime(date.getTime() + 3600000)
  let hours = date.getHours().toString()
  let minutes = date.getMinutes().toString()
  if (hours.length === 1) hours = '0' + hours
  if (minutes.length === 1) minutes = '0' + minutes
  arrivalTime.value = hours + ':' + minutes
}

const toHome = () => {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
const toDetail = () => {
  uni.redirectTo({
    url: '/pages/orderDetail/orderDetail?orderId=' + orderId.value,
  })
}
</script>

<style lang="less" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
image {
  width: 300rpx;
  height: 300rpx;
}
.pay {
  font-size: 32rpx;
  color: #333;
  text-align: center;
  margin-top: 100rpx;
}
.time {
  font-size: 28rpx;
  color: #0af;
  text-align: center;
  margin-top: 20rpx;
}
.success_desc {
  font-size: 28rpx;
  color: #666;
  text-align: center;
  margin-top: 50rpx;
}
.btn_box {
  display: flex;
  justify-content: space-around;
  margin-top: 100rpx;
  .return_btn {
    margin: 10px;
    width: 250rpx;
    height: 78rpx;
    line-height: 78rpx;
    border: #00aaff solid 1rpx;
    border-radius: 40rpx;
    // background: #00aaff;
    color: #00aaff;
    font-size: 30rpx;
    text-align: center;
  }
  .detail_btn {
    margin: 10px;
    width: 250rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background: #00aaff;
    border: none;
    color: #fff;
    font-size: 30rpx;
    text-align: center;
  }
}
</style>

<style lang="less">
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style>
