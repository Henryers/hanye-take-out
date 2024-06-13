<template>
  <view class="pay_box">
    <view class="time" v-if="countdownStore.showM == 0 && countdownStore.showS == 0">订单已超时</view>
    <view class="time" v-else>
      支付剩余时间
      <uni-countdown
        color="#888"
        :show-day="false"
        :show-hour="false"
        :minute="countdownStore.showM"
        :second="countdownStore.showS"
        @timeup="timeup()"
      >
      </uni-countdown>
    </view>
    <view class="price">￥{{ orderAmount }}</view>
    <view class="shop">寒夜餐厅 - {{ orderNumber }}</view>
    <view class="wechat">
      <image class="pay" src="../../static/icon/pay.png" />
      微信支付
      <image class="choose" src="../../static/icon/choose.png" />
    </view>
    <view class="bottom">
      <button class="comfirm_btn" type="primary" :plain="true" @click="toSuccess()">确认支付</button>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {getOrderAPI, payOrderAPI, cancelOrderAPI} from '@/api/order'
import {onLoad, onShow} from '@dcloudio/uni-app'
import {useCountdownStore} from '@/stores/modules/countdown'
import {ref} from 'vue'

const countdownStore = useCountdownStore()

const orderId = ref(0) // 订单id
const orderNumber = ref('') // 订单号
const orderAmount = ref(0) // 订单金额
const orderTime = ref<Date>() // 订单时间

const countdownRef = ref(null)

onLoad(async (options: any) => {
  console.log('orderTime什么东西？', options)
  orderId.value = options.orderId
  orderNumber.value = options.orderNumber
  orderAmount.value = options.orderAmount
  orderTime.value = options.orderTime.replace(' ', 'T')
})

// 支付成功
const toSuccess = async () => {
  // 若订单已超时，跳转到订单已取消页面
  if (countdownStore.showM == -1 && countdownStore.showS == -1) {
    uni.redirectTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + orderId.value,
    })
    return
  }
  console.log('支付成功')
  // 支付后修改订单状态
  const payDTO = {
    orderNumber: orderNumber.value,
    payMethod: 1, // 本平台默认微信支付
  }
  await payOrderAPI(payDTO)
  // 关闭定时器
  if (countdownStore.timer !== undefined) {
    clearInterval(countdownStore.timer)
    countdownStore.timer = undefined
  }
  uni.redirectTo({
    url:
      '/pages/submit/success?orderId=' +
      orderId.value +
      '&orderNumber=' +
      orderNumber.value +
      '&orderAmount=' +
      orderAmount.value +
      '&orderTime=' +
      orderTime.value,
  })
}

// 倒计时
const timeup = () => {
  console.log('------------ 执行了一次倒计时timeup ---------------')
  // setInterval间歇调用，每隔一秒调用一次
  let timeupSecond = ref(20)
  // 如果 timer 已经存在，先清除它
  if (countdownStore.timer !== undefined) {
    clearInterval(countdownStore.timer)
  }
  countdownStore.timer = setInterval(() => {
    console.log('什么timer？', countdownStore.timer)
    console.log('看看是不是一秒执行一次', orderTime.value)
    // 订单下单时间
    let buy_time = new Date(orderTime.value as Date).getTime()
    // 计算剩余时间
    // 测试20秒就够，正式15分钟
    // let time = buy_time + 20 * 1000 - new Date().getTime()
    // 最终代码是15分钟，测试时我才没那个功夫时间等！
    let time = buy_time + 15 * 60 * 1000 - new Date().getTime()
    console.log('time', time)
    if (time > 0 && countdownStore.timer !== undefined) {
      // 计算剩余的分钟
      var m = (time / 1000 / 60) % 60
      console.log('m', m)
      // 计算剩余的秒数
      var s = (time / 1000) % 60
      console.log('s', s)
      timeupSecond.value = time / 1000
      console.log('timeupSecond小于0？', timeupSecond.value)
      countdownStore.showM = Math.floor(m)
      countdownStore.showS = Math.floor(s)
      // showTime.value = minutes.value + ':' + seconds.value
    } else {
      console.log('订单已超时！')
      clearInterval(countdownStore.timer) // 停止计时器
      // 再重置pinia中的倒计时的分秒初始值
      countdownStore.showM = -1
      countdownStore.showS = -1
      // uni.showToast({
      //   title: '时间到',
      // })
      // 取消订单
      cancelOrder()
    }
  }, 1000)
}

// 超时要取消订单
const cancelOrder = async () => {
  await cancelOrderAPI(orderId.value)
  // uni.redirectTo({
  //   url: '/pages/orderDetail/orderDetail?orderId=' + orderId.value,
  // })
}
</script>

<style lang="less" scoped>
.pay_box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
  .time {
    display: flex;
    margin-top: 100rpx;
    color: #888;
    font-size: 28rpx;
  }
  .price {
    font-size: 80rpx;
    font-weight: bold;
    margin-top: 20rpx;
  }
  .shop {
    display: flex;
    margin-top: 20rpx;
    font-size: 28rpx;
    color: #888;
  }
  .wechat {
    display: flex;
    width: 90%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #fff;
    border-radius: 10rpx;
    margin: 100rpx 20rpx;
    position: relative;
    .pay {
      width: 40rpx;
      height: 40rpx;
      padding: 20rpx;
    }
    .choose {
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      top: 20rpx;
      right: 20rpx;
    }
  }
}

.bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .comfirm_btn {
    position: absolute;
    bottom: 30rpx;
    width: 600rpx;
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

<style>
page {
  background-color: #f8f8f8;
}
</style>
