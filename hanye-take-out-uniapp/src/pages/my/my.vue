<template>
  <view class="page">
    <!-- 1、个人信息 -->
    <view class="my_info">
      <!-- 头像部分 -->
      <view class="head">
        <image class="head_image" :src="user.pic"></image>
      </view>
      <!-- 姓名、性别及手机号 -->
      <view class="phone_name">
        <!-- 姓名 -->
        <view class="name">
          <text class="name_text">{{ user.name }}</text>
          <image v-if="user.gender === 0" class="name_type" src="../../static/icon/girl.png"></image>
          <image v-else class="name_type" src="../../static/icon/boy.png"></image>
        </view>
        <!-- 电话号 -->
        <view class="phone">
          <text class="phone_text">{{ user.phone }}</text>
        </view>
      </view>
    </view>
    <!-- 2、地址管理 + 历史订单 -->
    <view class="white_box">
      <view class="bottom_text" @click="goAddress">
        <image class="icon" src="../../static/icon/address.png"></image>
        <view class="text_left">地址管理</view>
        <view class="right_image">
          <image class="to_right" src="../../static/icon/toRight.png"></image>
        </view>
      </view>
      <view class="bottom_text" @click="goHistory">
        <image class="icon" src="../../static/icon/history.png"></image>
        <view class="text_left">历史订单</view>
        <view class="right_image">
          <image class="to_right" src="../../static/icon/toRight.png"></image>
        </view>
      </view>
      <view class="bottom_text" @click="goMyself">
        <image class="icon" src="../../static/icon/my.png"></image>
        <view class="text_left">信息设置</view>
        <view class="right_image">
          <image class="to_right" src="../../static/icon/toRight.png"></image>
        </view>
      </view>
    </view>
    <view class="history_content">
      <view class="title">最近订单</view>
      <view
        class="history_item"
        v-for="(item, index) in historyOrders"
        :key="index"
        @click="toOrderDetail(item.id as number)"
      >
        <view class="item_info_box">
          <view class="history_item_left">
            <view class="history_item_order_id">订单号：{{ item.number }}</view>
            <scroll-view class="scroll_container" scroll-x>
              <view v-for="(dish, index) in item.orderDetailList" :key="index" class="image_box">
                <image :src="dish.pic" />
              </view>
            </scroll-view>
            <view class="history_item_order_time">{{ item.orderTime }}</view>
          </view>
          <view class="history_item_right">
            <view class="history_item_status">{{ statusList[item.status as number].name }}</view>
            <view class="history_item_price">￥{{ item.amount }}</view>
            <view class="history_item_dish_amount">共{{ item.packAmount }}份</view>
          </view>
        </view>
        <view class="btn_box">
          <view class="history_item_reOrder" @click.stop="reOrder(item.id as number)">再来一单</view>
          <view class="history_item_push_order" v-if="item.status === 2" @click.stop="pushOrder(item.id as number)">
            催单
          </view>
        </view>
      </view>
    </view>
  </view>
  <!-- 催单massageBox -->
  <pushMsg ref="childComp"></pushMsg>
</template>

<script lang="ts" setup>
import pushMsg from '../../components/message/pushMsg.vue'
import {ref, reactive} from 'vue'
import {onLoad, onReachBottom} from '@dcloudio/uni-app'
import {useUserStore} from '@/stores/modules/user'
import {getUserInfoAPI} from '@/api/user'
import {getOrderPageAPI, reOrderAPI, urgeOrderAPI} from '@/api/order'
import {cleanCartAPI} from '@/api/cart'
import type {OrderPageDTO, OrderVO} from '@/types/order'

const userStore = useUserStore()
const childComp: any = ref(null)

const statusList = [
  {
    status: 0,
    name: '全部订单',
  },
  {
    status: 1,
    name: '待付款',
  },
  {
    status: 2,
    name: '待接单',
  },
  {
    status: 3,
    name: '已接单',
  },
  {
    status: 4,
    name: '派送中',
  },
  {
    status: 5,
    name: '已完成',
  },
  {
    status: 6,
    name: '已取消',
  },
]

const user = reactive({
  id: userStore.profile!.id,
  name: '',
  gender: 1,
  phone: '未设置',
  pic: '',
})
const historyOrders = ref<OrderVO[]>([])
const orderDTO = ref<OrderPageDTO>({
  page: 1,
  pageSize: 6,
})
const total = ref(0)

onLoad(async (options) => {
  console.log('options', options)
  console.log('userStore', userStore.profile)
  const res = await getUserInfo(user.id)
  // 获取所有订单信息
  await getOrderPage()
})

const getUserInfo = async (id: number) => {
  const res = await getUserInfoAPI(id)
  console.log('用户信息', res)
  user.name = res.data.name as string
  user.gender = res.data.gender ?? 1 // 之前没设置就默认男士
  user.phone = res.data.phone as string
  user.pic = res.data.pic as string
}

const getOrderPage = async () => {
  console.log('orderDTO', orderDTO.value)
  const res = await getOrderPageAPI(orderDTO.value)
  historyOrders.value = historyOrders.value.concat(res.data.records)
  total.value = res.data.total
}

// 再来一单
const reOrder = async (id: number) => {
  console.log('再来一单', id)
  // 菜品批量加入购物车之前，要先清空购物车，避免批量加入购物车后数据并不完全一样
  await cleanCartAPI()
  // 再来一单会将当前订单的菜品批量加入购物车，跳转到订单页面后，购物车将高亮显示
  await reOrderAPI(id as number)

  uni.redirectTo({
    url: '/pages/order/order',
  })
}

// 催单
const pushOrder = async (id: number) => {
  console.log('催单', id)
  await urgeOrderAPI(id)
  childComp.value.openPopup()
  // uni.showToast({
  //   title: '已催单',
  //   icon: 'none',
  // })
}

// 页面上拉触底事件的处理函数
onReachBottom(() => {
  console.log('Page:', orderDTO.value.page)
  console.log('Page Size:', orderDTO.value.pageSize)
  if (orderDTO.value.page * orderDTO.value.pageSize >= Math.min(total.value, 12)) {
    console.log('end!')
    // 达到最近订单展示上限
    uni.showToast({
      title: '更多订单信息请到历史订单查看！',
      icon: 'none',
    })
    return
  }
  orderDTO.value.page += 1
  getOrderPage()
})

const toOrderDetail = (id: number) => {
  uni.navigateTo({
    url: '/pages/orderDetail/orderDetail?orderId=' + id,
  })
}

const goAddress = () => {
  uni.redirectTo({
    url: '/pages/address/address',
  })
}
const goHistory = () => {
  uni.redirectTo({
    url: '/pages/history/history',
  })
}
const goMyself = () => {
  uni.redirectTo({
    url: '/pages/updateMy/updateMy',
  })
}
</script>

<style lang="less" scoped>
.my_info {
  height: 200rpx;
  width: 750rpx;
  background-color: #cceeff;
  display: flex;
  // 头像
  .head {
    width: 200rpx;
    height: 200rpx;
    margin: auto;
    text-align: center;
    .head_image {
      width: 120rpx;
      height: 120rpx;
      line-height: 200rpx;
      vertical-align: middle;
      margin: 40rpx auto;
      border-radius: 50%;
      background-color: #fff;
    }
  }
  // 姓名电话号
  .phone_name {
    flex: 1;
    margin: auto;
    .name {
      .name_text {
        font-size: 32rpx;
        opacity: 1;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 550;
        text-align: left;
        color: #333333;
        height: 44rpx;
        line-height: 44rpx;
        margin-right: 12rpx;
      }

      .name_type {
        width: 32rpx;
        height: 32rpx;
        vertical-align: middle;
        margin-bottom: 6rpx;
      }
    }
    .phone {
      .phone_text {
        height: 40rpx;
        opacity: 1;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #333333;
        line-height: 40rpx;
      }
    }
  }
}

.white_box {
  margin: 20rpx;
  background-color: #fff;
  border-radius: 20rpx;

  .bottom_text {
    display: flex;
    align-items: center;
    margin: 0 20rpx 0 30rpx;
    height: 100rpx;
    line-height: 100rpx;
    .icon {
      width: 50rpx;
      height: 45rpx;
      padding: 8rpx 20rpx 0 0;
      vertical-align: middle;
    }
    .text_left {
      width: 100%;
      height: 44rpx;
      opacity: 1;
      font-size: 32rpx;
      text-align: left;
      color: #333333;
      line-height: 44rpx;
      letter-spacing: 0px;
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

.history_content {
  padding: 0rpx 20rpx 20rpx 20rpx;
  .title {
    font-size: 28rpx;
    color: #333;
    padding-top: 10rpx;
    font-weight: bold;
  }
  .history_item {
    // display: flex;
    // justify-content: space-between;
    height: 300rpx;
    padding: 40rpx 20rpx;
    background-color: #fff;
    margin-top: 20rpx;
    border-radius: 20rpx;
    .item_info_box {
      display: flex;
      justify-content: space-between;
      width: 100%;
      .history_item_left {
        .history_item_order_id {
          font-size: 30rpx;
          line-height: 40rpx;
          color: #333;
          margin-bottom: 20rpx;
        }
        .scroll_container {
          width: 400rpx;
          height: 130rpx;
          overflow-x: auto;
          white-space: nowrap;
          .image_box {
            width: 100rpx;
            display: inline-block;
            align-items: center;
            margin-right: 20rpx;
            text-align: center;
            image {
              display: inline-block;
              border-radius: 10rpx;
              width: 100rpx;
              height: 100rpx;
            }
          }
        }
        .history_item_order_time {
          font-size: 26rpx;
          color: #666;
        }
      }
      .history_item_right {
        text-align: right;
        .history_item_status {
          font-size: 30rpx;
          color: #0af;
          margin-bottom: 40rpx;
        }
        .history_item_price {
          font-size: 32rpx;
          line-height: 50rpx;
          color: #333;
        }
        .history_item_dish_amount {
          font-size: 26rpx;
          color: #666;
          margin-bottom: 40rpx;
        }
      }
    }
    .btn_box {
      width: 100%;
      display: inline-block;
      .history_item_reOrder {
        float: right;
        margin-left: 20rpx;
        width: 140rpx;
        height: 60rpx;
        text-align: center;
        line-height: 60rpx;
        border: #0af solid 1rpx;
        border-radius: 30rpx;
        font-size: 28rpx;
        color: #0af;
      }
      .history_item_push_order {
        float: right;
        width: 140rpx;
        height: 62rpx;
        text-align: center;
        line-height: 62rpx;
        background-color: #0af;
        border-radius: 30rpx;
        font-size: 28rpx;
        color: #fff;
      }
    }
  }
}

.scroll-view-container {
  display: flex; /* 横向排列 */
  white-space: nowrap; /* 横向排列，不换行 */
  // overflow-x: auto; /* 横向滚动 */
}

.image-box {
  display: inline-block; /* 图片盒子横向排列 */
  margin-right: 10px; /* 图片之间的间距 */
}

.dish-image {
  display: inline-block;
  width: 100px; /* 图片宽度 */
  height: 100px; /* 图片高度 */
  object-fit: cover; /* 图片填充方式 */
}
</style>

<style>
page {
  background-color: #f8f8f8;
}
</style>
