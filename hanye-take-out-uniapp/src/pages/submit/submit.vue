<template>
  <view class="order_content">
    <scroll-view class="order_content_box" scroll-y scroll-top="0rpx">
      <!-- 地址栏 -->
      <view class="new_address">
        <!-- 上部 -->
        <view class="top" @click="goAddress">
          <view v-if="!address" class="address_name_disabled"> 请选择收货地址 </view>
          <view v-if="address" class="address_name">
            <view class="address">
              <text class="tag" :class="'tag' + trans(label as string)"> {{ label || '其他' }} </text>
              <text class="word">{{ address }}</text>
            </view>
            <view class="name">
              <text class="name_1">{{ consignee }}</text>
              <text class="name_2">{{ phoneNumber }}</text>
            </view>
          </view>
          <view class="address_image">
            <image class="to_right" src="../../static/icon/toRight.png"></image>
          </view>
        </view>
        <!-- 下部 -->
        <view class="bottom">
          <text class="word_bottom">预计{{ arrivalTime }}送达</text>
        </view>
      </view>
      <!-- 两个白框栏 -->
      <view class="order_list_cont">
        <!-- 1、订单菜品列表 -->
        <view class="order_list">
          <view class="word_text">
            <text class="word_style">订单明细</text>
          </view>
          <view class="order-type">
            <view class="type_item" v-for="(obj, index) in cartList" :key="index">
              <view class="dish_img">
                <image mode="aspectFill" :src="obj.pic" class="dish_img_url"></image>
              </view>
              <view class="dish_info">
                <view class="dish_name"> {{ obj.name }} </view>
                <view v-if="obj.dishFlavor" class="dish_flavor"> {{ obj.dishFlavor }} </view>
                <view class="dish_amount">
                  <text v-if="obj.number && obj.number > 0" class="dish_number">x {{ obj.number }}</text>
                </view>
                <view class="dish_price"> <text class="ico">￥</text> {{ obj.amount }} </view>
              </view>
            </view>
            <view class="word_text">
              <view class="word_left">打包费</view>
              <view class="word_right">￥{{ CartAllNumber }}</view>
            </view>
            <view class="word_text">
              <view class="word_left">配送费</view>
              <view class="word_right">￥6</view>
            </view>
            <view class="all_price">
              <text class="word_right">总价 ￥{{ CartAllPrice }}</text>
            </view>
          </view>
        </view>
        <!-- 2、备注+餐具份数+发票 -->
        <view class="order_list">
          <view class="bottom_text" @click="goRemark">
            <view class="text_left">备注</view>
            <view class="text_right">{{ remark || '选择口味等' }}</view>
            <view class="right_image">
              <image class="to_right" src="../../static/icon/toRight.png"></image>
            </view>
          </view>
          <view class="bottom_text" @click="chooseCooker">
            <view class="text_left">餐具份数</view>
            <view class="text_right">{{ getCookerInfo() }}</view>
            <view class="right_image">
              <image class="to_right" src="../../static/icon/toRight.png"></image>
            </view>
          </view>
          <view class="bottom_text">
            <view class="text_left">发票</view>
            <view class="text_right">本店不支持线上发票，请致电商家提供</view>
          </view>
        </view>
      </view>
      <view class="blank"></view>
    </scroll-view>
    <!-- 底部购物车 -->
    <view class="footer_order_buttom order_form">
      <view class="order_number">
        <image src="../../static/images/cart_active.png" class="order_number_icon"></image>
        <view class="order_dish_num"> {{ CartAllNumber }} </view>
      </view>
      <view class="order_price">
        <text class="ico">￥ </text> {{ parseFloat((Math.round(CartAllPrice * 100) / 100).toFixed(2)) }}</view
      >
      <view class="order_but">
        <view class="order_but_rit" @click="payOrderHandle()"> 去支付 </view>
      </view>
    </view>
    <view class="mask-box"></view>

    <!-- 选择餐具遮罩层 -->
    <view class="pop_mask" v-show="openCooker" @click="openCooker = !openCooker">
      <view class="cook_pop" @click.stop="openCooker = openCooker">
        <view class="top_title">
          <view class="title"> 选择餐具份数 </view>
          <view class="tips"> 应监管条例要求，商家不能主动提供一次性餐具 </view>
          <view class="close" @click="closeMask">
            <image src="../../static/icon/close.png" class="close_img" />
          </view>
        </view>
        <picker-view class="picker" indicator-style="height: 50px;" :value="cookers" @change="pickerChange">
          <picker-view-column>
            <view v-for="item in cookers" :key="item" style="line-height: 50px; text-align: center">
              {{ item === -1 ? '无需餐具' : item === 0 ? '商家依据餐量提供' : item === 11 ? '10份以上' : item + '份' }}
            </view>
          </picker-view-column>
        </picker-view>
        <view class="comfirm">
          <view class="after_action">
            <label class="checkbox">
              <radio class="radio" color="#00aaff" value="cb" :checked="radioStatus" @click="radioChange" />
              {{ cookerNum === -2 || cookerNum === -1 ? '以后都无需餐具' : '以后都需要餐具，商家依据餐量提供' }}
            </label>
            <button class="comfirm_btn" @click="openCooker = !openCooker">确定</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {getDefaultAddressAPI} from '@/api/address'
import {getCartAPI} from '@/api/cart'
import {submitOrderAPI, getUnPayOrderAPI} from '@/api/order'
import type {CartItem} from '@/types/cart'
import {useAddressStore} from '@/stores/modules/address'
import {onLoad, onShow} from '@dcloudio/uni-app'
import {ref} from 'vue'

// store
const store = useAddressStore()

// 购物车列表
const cartList = ref<CartItem[]>([])
const CartAllNumber = ref(0)
const CartAllPrice = ref(0)

// 收货地址信息，如果有选择好后跳回来，则在路径参数里拿到这个address地址信息
const address = ref('')
const label = ref('')
const consignee = ref('')
const gender = ref(0)
const phoneNumber = ref('')

// 预计送达时间
const estimatedDeliveryTime = ref('')

const platform = ref('ios')

const openCooker = ref(false)
const cookerNum = ref(-2)
const cookers = ref([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11])

const radioStatus = ref(false)

const remark = ref('')
const arrivalTime = ref('')
const addressId = ref(0)

// 查询获取购物车列表
const getCartList = async () => {
  const res = await getCartAPI()
  console.log('初始化购物车列表', res)
  cartList.value = res.data
  // 计算总数量
  CartAllNumber.value = cartList.value.reduce((acc, cur) => acc + cur.number, 0)
  // 计算总价格 = 菜品总价 + 打包费 + 配送费
  CartAllPrice.value = cartList.value.reduce((acc, cur) => acc + cur.amount * cur.number, 0) + CartAllNumber.value + 6
  console.log('CartAllNumber', CartAllNumber.value)
  console.log('CartAllPrice', CartAllPrice.value)
}

onLoad(async (options: any) => {
  // 先加载默认地址(如果有的话)
  await getAddressBookDefault()
  // 再看看路径参数有没有传过来的地址，有的话以这个地址为准
  console.log('options', options)
  if (options.address) {
    const addressObj = JSON.parse(options.address)
    console.log('获取新的地址啊！addressObj', addressObj)
    addressId.value = addressObj.id
    label.value = addressObj.label
    address.value = addressObj.provinceName + addressObj.cityName + addressObj.districtName + addressObj.detail
    phoneNumber.value = addressObj.phone
    consignee.value = addressObj.consignee
  } else if (options.remark) {
    remark.value = options.remark
  }
  console.log('我地址id赋值了啊1-------------', addressId.value)
  // 获取购物车列表
  await getCartList()
  // 获取一小时以后的时间，作为预计送达的时间
  getHarfAnOur()
  // 默认选择的餐具状态
  if (store.defaultCook === '无需餐具') {
    cookerNum.value = -1
  } else if (store.defaultCook === '商家依据餐量提供') {
    cookerNum.value = 0
  }
})

onShow(async (options: any) => {
  console.log('options', options)
  await getCartList()
})

// 初始化平台：ios/android
const initPlatform = () => {
  const res = uni.getSystemInfoSync()
  platform.value = res.platform
}

// 日期转字符串格式
const DateToStr = (date: Date) => {
  var year = date.getFullYear() //年
  var month = date.getMonth() //月
  var day = date.getDate() //日
  var hours = date.getHours() //时
  var min = date.getMinutes() //分
  var second = date.getSeconds() //秒
  return (
    year +
    '-' +
    (month + 1 > 9 ? month + 1 : '0' + (month + 1)) +
    '-' +
    (day > 9 ? day : '0' + day) +
    ' ' +
    (hours > 9 ? hours : '0' + hours) +
    ':' +
    (min > 9 ? min : '0' + min) +
    ':' +
    (second > 9 ? second : '0' + second)
  )
}
// 获取一小时以后的时间
const getHarfAnOur = () => {
  const date = new Date()
  date.setTime(date.getTime() + 3600000)
  const formattedDate = DateToStr(date)
  estimatedDeliveryTime.value = formattedDate
  let hours = date.getHours()
  let minutes = date.getMinutes()
  if (hours < 10) hours = parseInt('0' + hours)
  if (minutes < 10) minutes = parseInt('0' + minutes)
  arrivalTime.value = hours + ':' + minutes
}
// 默认地址查询
const getAddressBookDefault = async () => {
  const res = await getDefaultAddressAPI()
  if (res.code === 0) {
    console.log('默认地址', res.data)
    addressId.value = 0
    if (res.data.provinceName) {
      address.value = res.data.provinceName + res.data.cityName + res.data.districtName + res.data.detail
    }
    phoneNumber.value = res.data.phone as string
    consignee.value = res.data.consignee as string
    gender.value = res.data.gender as number
    addressId.value = res.data.id as number
  }
}

// 标签文字转数字
const trans = (item: string) => {
  switch (item) {
    case '公司':
      return '1'
    case '家':
      return '2'
    case '学校':
      return '3'
    default:
      return '4'
  }
}

// 去地址页面
const goAddress = () => {
  // 记录等下跳转到地址管理后，选好地址要返回当前这个订单页面
  store.addressBackUrl = '/pages/submit/submit'
  uni.redirectTo({
    url: '/pages/address/address',
  })
}

// 去备注页面
const goRemark = () => {
  uni.redirectTo({
    url: '/pages/remark/remark',
  })
}
// 选择餐具
const chooseCooker = () => {
  openCooker.value = true
}
// 餐具对应信息
const getCookerInfo = () => {
  if (cookerNum.value === -2) return '请依据实际情况填写，避免浪费'
  else if (cookerNum.value === -1) return '无需餐具'
  else if (cookerNum.value === 0) return '商家依据餐量提供'
  else if (cookerNum.value === 11) return '10份以上'
  else return cookerNum.value + '份'
}
const pickerChange = (ev: any) => {
  console.log(ev.detail.value)
  cookerNum.value = ev.detail.value[0] - 1
}
// 改变radio状态，顺便改变store里默认餐具选择的状态
const radioChange = () => {
  radioStatus.value = !radioStatus.value
  if (radioStatus.value) {
    store.defaultCook = cookerNum.value === -1 ? '无需餐具' : '商家依据餐量提供'
  } else {
    store.defaultCook = '请依据实际情况填写，避免浪费'
  }
}
const closeMask = () => {
  openCooker.value = false
  // openPayType.value = false
}

// 支付下单
const payOrderHandle = async () => {
  // 先去后端查询一下是否有未支付但没取消的订单，如果有的话无法下单
  const unPayRes = await getUnPayOrderAPI()
  console.log('未支付订单', unPayRes)
  if (unPayRes.data !== 0) {
    console.log('有未支付订单', unPayRes.data)
    uni.showToast({
      title: '有未支付订单，请先支付或取消！',
      icon: 'none',
    })
    return false
  }
  if (!address.value) {
    uni.showToast({
      title: '请选择收货地址',
      icon: 'none',
    })
    return false
  }
  // 餐具： -2未选择，-1无需餐具，0商家依据餐量提供，其他数字具体数量
  if (cookerNum.value === -2) {
    uni.showToast({
      title: '请选择餐具份数',
      icon: 'none',
    })
    return false
  }
  console.log('我传地址id了啊2--------------', addressId.value)
  const params = {
    payMethod: 1,
    addressId: addressId.value,
    remark: remark.value,
    estimatedDeliveryTime: estimatedDeliveryTime.value, // 预计到达时间
    deliveryStatus: 1, // 立即送出
    tablewareNumber: cookerNum.value, // 餐具份数
    tablewareStatus: cookerNum.value === 0 ? 1 : 0, // 餐具状态: 1按餐量提供，0选择具体数量
    packAmount: CartAllNumber.value,
    amount: CartAllPrice.value,
  }
  console.log('生成订单params', params)
  const res = await submitOrderAPI(params)
  if (res.code === 0) {
    console.log('订单生成成功', res.data)
    // 此时订单已生成，跳转到支付页面
    // uni.navigateTo({url: '/pages/order/success'})
    uni.redirectTo({
      url:
        '/pages/pay/pay?' +
        'orderId=' +
        res.data!.id +
        '&orderAmount=' +
        res.data!.orderAmount +
        '&orderNumber=' +
        res.data!.orderNumber +
        '&orderTime=' +
        res.data!.orderTime,
    })
  } else {
    uni.showToast({
      title: res.msg || '操作失败',
      icon: 'none',
    })
  }
}
</script>

<style lang="less" scoped>
.order_content {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0 0 0;
  position: relative;
  background-color: #cceeff;
  .order_content_box {
    width: 100%;
    height: 100%;
    // 不知道为啥要加这个，才有底部的padding出现
    .blank {
      height: 1rpx;
    }
  }
  box-sizing: border-box;
  .restaurant_info_box {
    position: relative;
    width: 100%;
    height: 160rpx;
    // 注释掉背景色
    .restaurant_info {
      position: absolute;
      z-index: 9;
      left: 30rpx;
      // transform: translateX(-50%);
      display: flex;
      width: calc(100% - 60rpx);
      // margin:0 auto;
      background: rgba(255, 255, 255, 0.97);
      box-shadow: 0px 4rpx 10rpx 0px rgba(69, 69, 69, 0.1);
      border-radius: 16rpx;
      padding: 40rpx;
      box-sizing: border-box;
      .left_info {
        flex: 1;
        .title {
          font-size: 36rpx;
        }
        .position {
          font-size: 36rpx;
        }
      }
      .restaurant_logo {
        .restaurant_logo_img {
          display: block;
          width: 320rpx;
          height: 120rpx;
          border-radius: 16rpx;
        }
      }
    }
  }

  // 地址栏
  .new_address {
    width: 730rpx;
    height: 240rpx;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 12rpx;
    z-index: 10;
    margin-bottom: 20rpx;
    display: flex;
    flex-direction: column;

    // 上部
    .top {
      margin: 0 22rpx 0 30rpx;
      flex: 1;
      display: flex;
      // align-items: center;
      .address_name {
        flex: 1;
        // display: flex;
        // flex-direction: column;
        overflow: hidden;
        .address {
          // flex: 1;
          height: 50rpx;
          line-height: 50rpx;
          margin-top: 22rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          // 标签
          .tag {
            display: inline-block;
            width: 70rpx;
            height: 45rpx;
            border-radius: 4rpx;
            margin-right: 20rpx;
            font-size: 25rpx;
            line-height: 45rpx;
            color: #333333;
            text-align: center;
            background: #e1f1fe;
          }

          .tag2 {
            background: #fef8e7;
          }

          .tag3 {
            background: #e7fef8;
          }

          .tag4 {
            background: #fee7e7;
          }
          .word {
            vertical-align: middle;
            opacity: 1;
            font-size: 32rpx;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 550;
            color: #20232a;
          }
        }
        .name {
          // flex: 1;
          height: 34rpx;
          line-height: 34rpx;
          margin-top: 8rpx;
          .name_1,
          .name_2 {
            opacity: 1;
            font-size: 26rpx;
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: center;
            color: #333333;
          }
          .name_2 {
            margin-left: 10rpx;
          }
        }
      }
      .address_name_disabled {
        flex: 1;
        font-size: 32rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #bdbdbd;
        align-self: center;
      }
      .address_image {
        width: 80rpx;
        height: 100%;
        position: relative;
        .to_right {
          width: 30rpx;
          height: 30rpx;
          vertical-align: middle;
          margin-bottom: 10rpx;
          position: absolute;
          top: 50%;
          right: 6rpx;
          transform: translateY(-50%);
        }
      }
    }
    // 下部
    .bottom {
      margin: 0 28rpx;
      height: 94rpx;
      // line-height: 94rpx;
      border-top: 1px dashed #ebebeb;
      box-sizing: border-box;
      .word_bottom {
        opacity: 1;
        font-size: 26rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #333333;
        height: 34rpx;
        line-height: 34rpx;
        margin-top: 24rpx;
        display: inline-block;
      }
    }
  }

  // 订单container，包括订单明细+备注
  .order_list_cont {
    width: 730rpx;
    margin: 0 auto;
    // 订单明细/备注 的白色圆角矩形容器
    .order_list {
      border-radius: 15rpx;
      background-color: #fff;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      position: relative;
      margin-bottom: 20rpx;
      &:last-child {
        margin-bottom: 176rpx;
      }
      // 菜品列表
      .order-type {
        padding: 40rpx 0 10rpx 0;
        // 菜品列表的每个元素
        .type_item {
          display: flex;
          margin-bottom: 30rpx;
          .dish_img {
            width: 100rpx;
            margin: 0 20rpx 0 32rpx;
            .dish_img_url {
              display: block;
              width: 100rpx;
              height: 100rpx;
              border-radius: 8rpx;
            }
          }
          .dish_info {
            position: relative;
            flex: 1;
            margin-right: 20rpx;
            // margin: 0 20rpx 20rpx 0;
            // margin-bottom: 200rpx;
            .dish_name {
              font-size: 30rpx;
              font-weight: bold;
              color: #20232a;
            }
            .dish_flavor {
              font-size: 24rpx;
              color: #818693;
              height: 30rpx;
              line-height: 30rpx;
              margin-top: 10rpx;
            }
            .dish_amount {
              font-size: 24rpx;
              color: #818693;
              height: 30rpx;
              line-height: 30rpx;
              margin-top: 10rpx;
              .ico {
                font-size: 24rpx;
              }
              .dish_number {
                padding: 10rpx 0;
                font-size: 24rpx;
              }
            }
            .dish_price {
              position: absolute;
              right: 20rpx;
              bottom: 40rpx;
              display: flex;
              font-size: 32rpx;
              color: #e94e3c;
              font-family: DIN, DIN-Medium;
              font-weight: 500;
              .ico {
                line-height: 42rpx;
                font-size: 24rpx;
              }
            }
          }
        }
      }
      .seize_seat {
        width: 100%;
        height: 98rpx;
      }
      .word_text {
        display: flex;
        align-items: center;
        margin: 0 20rpx 0 30rpx;
        border-bottom: 1px solid #efefef;
        height: 120rpx;
        line-height: 120rpx;
        .word_left {
          width: 50%;
          height: 44rpx;
          opacity: 1;
          font-size: 32rpx;
          text-align: left;
          color: #333333;
          line-height: 44rpx;
          letter-spacing: 0px;
        }
        .word_right {
          width: 50%;
          height: 44rpx;
          opacity: 1;
          font-size: 32rpx;
          text-align: right;
          color: #333333;
          line-height: 44rpx;
          letter-spacing: 0px;
          padding-right: 20rpx;
        }
      }
      .all_price {
        margin: 0 16rpx 0 22rpx;
        height: 120rpx;
        line-height: 120rpx;
        .word_right {
          height: 44rpx;
          opacity: 1;
          font-size: 32rpx;
          text-align: left;
          color: #333333;
          line-height: 44rpx;
          letter-spacing: 0px;
          padding-left: 500rpx;
        }
      }
      .bottom_text {
        display: flex;
        align-items: center;
        margin: 0 20rpx 0 30rpx;
        height: 100rpx;
        line-height: 100rpx;
        .text_left {
          width: 30%;
          height: 44rpx;
          opacity: 1;
          font-size: 32rpx;
          text-align: left;
          color: #333333;
          line-height: 44rpx;
          letter-spacing: 0px;
        }
        .text_right {
          width: 70%;
          height: 44rpx;
          font-size: 24rpx;
          text-align: right;
          color: #666666;
          line-height: 44rpx;
          letter-spacing: 0px;
          padding-right: 20rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .right_image {
          width: 30rpx;
          height: 100%;
          position: relative;
          .to_right {
            width: 30rpx;
            height: 30rpx;
            vertical-align: middle;
            margin-bottom: 10rpx;
            position: absolute;
            top: 50%;
            right: 6rpx;
            transform: translateY(-50%);
          }
        }
      }
    }
  }
  .footer_order_buttom {
    position: fixed;
    display: flex;
    bottom: 48rpx;
    width: calc(100% - 60rpx);
    height: 88rpx;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.9);
    border-radius: 50rpx;
    box-shadow: 0px 6rpx 10rpx 0px rgba(0, 0, 0, 0.25);
    z-index: 999;
    padding: 0rpx 10rpx;
    box-sizing: border-box;
    .order_number {
      position: relative;
      width: 120rpx;
      .order_number_icon {
        position: absolute;
        display: block;
        width: 120rpx;
        height: 118rpx;
        left: 12rpx;
        bottom: 0px;
      }
      .order_dish_num {
        position: absolute;
        display: inline-block;
        z-index: 9;
        // width: 36rpx;
        min-width: 12rpx;
        height: 36rpx;
        line-height: 36rpx;
        padding: 0 12rpx;
        left: 92rpx;
        font-size: 24rpx;
        top: -8rpx;
        // text-align: center;
        border-radius: 20rpx;
        background-color: #e94e3c;
        color: #fff;
        font-weight: 500;
      }
    }
    .order_price {
      flex: 1;
      text-align: left;
      color: #fff;
      line-height: 88rpx;
      padding-left: 34rpx;
      box-sizing: border-box;
      font-size: 36rpx;
      font-weight: bold;
      .ico {
        font-size: 24rpx;
      }
    }
    .order_but {
      // background-color: #d8d8d8;
      // width: 364rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 72rpx;
      text-align: center;
      margin-top: 8rpx;
      display: flex;
      .order_but_left {
        flex: 1;
        background-color: #473d26;
        color: #ffb302;
        border-radius: 72rpx 0 0 72rpx;
      }
      .order_but_rit {
        // flex: 1;
        width: 200rpx;
        border-radius: 72rpx;
        background: #22bbff;
        font-size: 30rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        color: #fff;
      }
    }
  }
  .pop_mask {
    position: fixed;
    width: 100%;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 999;
    background-color: rgba(0, 0, 0, 0.4);
    .cook_pop {
      width: 100%;
      height: 60vh;
      position: absolute;
      bottom: 0;
      left: 0;
      background-color: #fff;
      border-radius: 20rpx 20rpx 0 0;
      padding: 20rpx 30rpx 30rpx 30rpx;
      box-sizing: border-box;

      .top_title {
        // display: flex;
        // flex-direction: row;
        position: relative;
        // justify-content: space-between;
        border-bottom: solid 1px #ebeef5;
        padding-bottom: 20rpx;

        .title {
          width: 100%;
          text-align: center;
          font-size: 30rpx;
          line-height: 50rpx;
          font-weight: bold;
          color: #20232a;
        }
        .tips {
          width: 100%;
          text-align: center;
          font-size: 20rpx;
          line-height: 40rpx;
          color: #999999;
        }
        .close {
          position: absolute;
          top: 20rpx;
          right: 0;

          .close_img {
            width: 40rpx;
            height: 40rpx;
          }
        }
      }
      .picker {
        width: 100%;
        height: 400rpx;
      }
      .comfirm {
        display: flex;
        justify-content: space-between;
        align-items: center;
        // margin-top: 20rpx;
        width: 600rpx;
        margin: 20rpx auto;
        background-color: #fea;
        border-radius: 10rpx 10rpx 30rpx 30rpx;
        .after_action {
          // height: 200rpx;
          font-size: 24rpx;
          line-height: 60rpx;
          color: #999999;
          .checkbox {
            padding: 10rpx;
            radio .wx-radio-input {
              width: 30rpx;
              height: 30rpx;
              border-radius: 50%;
            }
          }
          .comfirm_btn {
            width: 600rpx;
            height: 80rpx;
            line-height: 80rpx;
            border-radius: 40rpx;
            background: #00aaff;
            color: #fff;
            font-size: 30rpx;
            text-align: center;
            letter-spacing: 0px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
  .mask-box {
    position: absolute;
    height: 176rpx;
    width: 100%;
    bottom: 0;
    background-color: #f6f6f6;
    opacity: 0.5;
  }
}

.dish_detail_pop {
  width: calc(100vw - 160rpx);
  box-sizing: border-box;
  position: relative;
  top: 50%;
  left: 50%;
  padding: 40rpx;
  transform: translateX(-50%) translateY(-50%);
  background: #fff;
  border-radius: 20rpx;

  .div_big_image {
    width: 100%;
    height: 320rpx;
    border-radius: 10rpx;
  }

  .title {
    font-size: 40rpx;
    line-height: 80rpx;
    text-align: center;
    font-weight: bold;
  }

  .dish_items {
    height: 60vh;
  }

  .but_item {
    display: flex;
    position: relative;
    flex: 1;

    .price {
      text-align: left;
      color: #e94e3c;
      line-height: 88rpx;
      box-sizing: border-box;
      font-size: 48rpx;
      font-weight: bold;

      .ico {
        font-size: 28rpx;
      }
    }

    .active {
      position: absolute;
      right: 0rpx;
      bottom: 20rpx;
      display: flex;

      .dish_add,
      .dish_red {
        display: block;
        width: 72rpx;
        height: 72rpx;
      }

      .dish_number {
        padding: 0 10rpx;
        line-height: 72rpx;
        font-size: 30rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
      }

      .dish_card_add {
        width: 200rpx;
        line-height: 60rpx;
        text-align: center;
        font-weight: 500;
        font-size: 28rpx;
        opacity: 1;
        background: #ffc200;
        border-radius: 30rpx;
      }
    }
  }
}

.more_norm_pop {
  width: calc(100vw - 160rpx);
  box-sizing: border-box;
  position: relative;
  top: 50%;
  left: 50%;
  padding: 40rpx;
  transform: translateX(-50%) translateY(-50%);
  background: #fff;
  border-radius: 20rpx;

  .div_big_image {
    width: 100%;
    border-radius: 10rpx;
  }

  .title {
    font-size: 40rpx;
    line-height: 80rpx;
    text-align: center;
    font-weight: bold;
  }

  .items_cont {
    display: flex;
    flex-wrap: wrap;
    margin-left: -14rpx;
    max-height: 50vh;

    .item_row {
      .flavor_name {
        height: 40rpx;
        opacity: 1;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #666666;
        line-height: 40rpx;
        padding-left: 10rpx;
        padding-top: 20rpx;
      }

      .flavor_item {
        display: flex;
        flex-wrap: wrap;

        .item {
          border: 1px solid #ffb302;
          border-radius: 12rpx;
          margin: 20rpx 10rpx;
          padding: 0 26rpx;
          height: 60rpx;
          line-height: 60rpx;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
        }

        .act {
          // background: linear-gradient(144deg, #ffda05 18%, #ffb302 80%);
          background: #ffc200;
          border: 1px solid #ffc200;
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
        }
      }
    }
  }

  .but_item {
    display: flex;
    position: relative;
    flex: 1;
    padding-left: 10rpx;
    margin: 34rpx 0 -20rpx 0;

    .price {
      text-align: left;
      color: #e94e3c;
      line-height: 88rpx;
      box-sizing: border-box;
      font-size: 48rpx;
      font-family: DIN, DIN-Medium;
      font-weight: 500;

      .ico {
        font-size: 28rpx;
      }
    }

    .active {
      position: absolute;
      right: 0rpx;
      bottom: 20rpx;
      display: flex;

      .dish_add,
      .dish_red {
        display: block;
        width: 72rpx;
        height: 72rpx;
      }

      .dish_number {
        line-height: 72rpx;
        font-size: 24rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
      }

      .dish_card_add {
        width: 200rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-weight: 500;
        font-size: 28rpx;
        opacity: 1;
        // background: linear-gradient(144deg, #ffda05 18%, #ffb302 80%);
        background: #ffc200;
        border-radius: 30rpx;
      }
    }
  }
}

.lodding {
  position: relative;
  top: 40%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  .lodding_ico {
    width: 160rpx;
    height: 160rpx;
    border-radius: 100%;
  }
}
</style>
