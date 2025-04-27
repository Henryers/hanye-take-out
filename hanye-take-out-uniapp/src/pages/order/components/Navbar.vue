<template>
  <!-- 20250428更新：顶部占位，不受下方滚动影响 -->
  <view class="navbar-fixed">
    <!-- 蓝色背景打底 -->
    <view class="navbar" :style="{paddingTop: safeAreaInsets?.top + 'px'}">
      <!-- logo文字 -->
      <view class="logo">
        <image class="back" src="@/static/icon/back.png" @tap="back"></image>
        <image class="brand" src="@/static/images/logo.png"></image>
        <text class="logo-text">REVERSE · 启动</text>
      </view>
      <view class="logo">
        <text class="logo-text"></text>
      </view>
    </view>
    <!-- 餐厅简介 -->
    <view class="info">
      <view class="info1">
        <view class="status">{{ status === true ? '营业中' : '打烊中' }}</view>
        <uni-icons custom-prefix="iconfont" type="icon-qian" size="15"></uni-icons>
        <text class="price">配送费6元</text>
      </view>
      <view class="info2">
        <text class="address">餐厅地址：广州市番禺区亚运城广场</text>
        <uni-icons @click="phone" custom-prefix="iconfont" type="icon-dianhua" size="20"></uni-icons>
      </view>
    </view>
    <view class="blank"></view>
  </view>
</template>

<script setup lang="ts">
import {getStatusAPI} from '@/api/shop'
import {onLoad} from '@dcloudio/uni-app'
import {ref} from 'vue'

// 店铺营业状态
const status = ref(true)

// 获取屏幕边界到安全区域距离
const {safeAreaInsets} = uni.getSystemInfoSync()
// 页面加载
onLoad(async () => {
  const res = await getStatusAPI()
  console.log('店铺状态---------', res)
  status.value = res.data === 1 ? true : false
})

const back = () => {
  uni.switchTab({url: '/pages/index/index'})
}

const phone = () => {
  uni.makePhoneCall({phoneNumber: '1999'})
}
</script>

<style lang="less" scoped>
.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 999;
}

/* 自定义导航条 */
.navbar {
  background-image: url(@/static/images/navigator_bg.png);
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 20px;

  .logo {
    display: flex;
    align-items: center;
    height: 64rpx;
    padding-left: 30rpx;
    padding-top: 20rpx;

    .back {
      width: 50rpx;
      height: 40rpx;
      margin: 5rpx;
    }

    .brand {
      width: 220rpx;
      height: 50rpx;
    }

    .logo-text {
      flex: 1;
      line-height: 20rpx;
      color: #fff;
      margin: 2rpx 0 0 20rpx;
      padding-left: 20rpx;
      border-left: 1rpx solid #fff;
      font-size: 24rpx;
    }
  }
}

.info {
  position: fixed;
  z-index: 100;
  top: 120rpx;
  left: 20rpx;
  width: 90%;
  // padding: 0 10rpx 0 10rpx;
  height: 120rpx;
  margin: 16rpx 20rpx;
  color: #333;
  font-size: 28rpx;
  border-radius: 10rpx;
  background-color: #fff;
  box-shadow: 0 5rpx 10rpx 5rpx #ccc;
  .status {
    display: inline-block;
    margin: 10rpx 20rpx;
    padding: 5rpx;
    border-radius: 5rpx;
    font-size: 25rpx;
    background-color: #0d8;
    color: #fff;
  }
  .price {
    margin: 10rpx;
    font-size: 28rpx;
    color: #666;
  }
  .info2 {
    position: relative;
    .address {
      margin: 10rpx 20rpx;
      font-size: 25rpx;
      color: #666;
    }
    uni-icons {
      position: absolute;
      right: 30rpx;
    }
  }
}

.icon-scan {
  font-size: 30rpx;
  padding: 15rpx;
}

.blank {
  width: 100%;
  height: 40rpx;
  background-color: #fff;
}
</style>
