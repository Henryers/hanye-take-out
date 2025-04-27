<template>
  <Navbar />
  <view class="viewport">
    <!-- 分类 -->
    <view class="categories">
      <!-- 左侧：分类列表 -->
      <scroll-view class="primary" scroll-y>
        <view
          v-for="(item, index) in categoryList"
          :key="item.id"
          class="item"
          :class="{active: index === activeIndex}"
          @tap="getDishOrSetmealList(index)"
        >
          <text class="name"> {{ item.name }} </text>
        </view>
      </scroll-view>
      <!-- 右侧：菜品/套餐列表 -->
      <scroll-view class="secondary" scroll-y>
        <view class="section">
          <navigator
            v-for="dish in dishList"
            :key="dish.id"
            class="dish"
            hover-class="none"
            :url="`/pages/detail/detail?${categoryList[activeIndex].sort < 20 ? 'dishId' : 'setmealId'}=${dish.id}`"
          >
            <image class="image" :src="dish.pic"></image>
            <view class="dishinfo">
              <view class="name ellipsis">{{ dish.name }}</view>
              <view class="detail ellipsis">{{ dish.detail }}</view>
              <view class="price">
                <text class="symbol">¥</text>
                <text class="number">{{ dish.price }}</text>
              </view>
              <!-- 1、选择规格(口味) -->
              <image
                v-if="'flavors' in dish && dish.flavors.length > 0"
                class="choosenorm"
                src="../../static/images/选择规格.png"
                @tap.stop="chooseNorm(dish)"
                mode="scaleToFill"
              />
              <!-- 2、加减菜品 -->
              <view v-else class="sub_add">
                <!-- 减菜按钮 -->
                <image
                  v-if="getCopies(dish) > 0"
                  src="../../static/icon/sub.png"
                  @tap.stop="subDishAction(dish, '普通')"
                  class="sub"
                ></image>
                <!-- 菜品份数 -->
                <text v-if="getCopies(dish) > 0" class="dish_number">{{ getCopies(dish) }}</text>
                <!-- 加菜按钮 -->
                <image src="../../static/icon/add.png" @tap.stop="addDishAction(dish, '普通')" class="add" />
              </view>
            </view>
          </navigator>
        </view>
      </scroll-view>
    </view>
  </view>

  <!-- 菜品口味选择dialog弹窗 -->
  <view class="dialog" v-show="visible">
    <view class="flavor_pop">
      <view class="title">选择规格</view>
      <scroll-view class="scroll" scroll-y>
        <!-- 双层口味数组 -->
        <view v-for="flavor in flavors" :key="flavor.name" class="flavor">
          <view>{{ flavor.name }}</view>
          <view
            :class="{flavorItem: true, active: chosedflavors.findIndex((it) => item === it) !== -1}"
            v-for="(item, index) in JSON.parse(flavor.list)"
            :key="index"
            @tap="chooseFlavor(JSON.parse(flavor.list), item)"
          >
            {{ item }}
          </view>
        </view>
      </scroll-view>
      <view class="addToCart" @tap="addToCart(dialogDish as DishToCartItem)">加入购物车</view>
    </view>
    <view class="close_dialog" @click="visible = false">×</view>
  </view>

  <!-- 灰色空购物车 -->
  <view class="footer_order_buttom" v-if="cartList.length === 0">
    <view class="order_number">
      <image src="../../static/images/cart_empty.png" class="order_number_icon"></image>
    </view>
    <view class="order_price"> <text class="ico">￥</text> 0 </view>
    <view class="order_btn"> ￥0起送 </view>
  </view>
  <!-- 亮起的购物车 -->
  <view class="footer_order_buttom" @click="() => (openCartList = !openCartList)" v-else>
    <view class="order_number">
      <image src="../../static/images/cart_active.png" class="order_number_icon"></image>
      <view class="order_dish_num"> {{ CartAllNumber }} </view>
    </view>
    <view class="order_price">
      <text class="ico">￥ </text> {{ parseFloat((Math.round(CartAllPrice * 100) / 100).toFixed(2)) }}
    </view>
    <view class="order_btn_active" @click.stop="submitOrder()"> 去结算 </view>
  </view>

  <!-- 底部购物车菜品列表 -->
  <view class="pop_mask" v-show="openCartList" @click="openCartList = !openCartList">
    <view class="cart_pop" @click.stop="openCartList = openCartList">
      <view class="top_title">
        <view class="tit"> 购物车 </view>
        <view class="clear" @click.stop="clearCart()">
          <image class="clear_icon" src="../../static/icon/clear.png"></image>
          <text class="clear-des">清空 </text>
        </view>
      </view>
      <scroll-view class="card_order_list" scroll-y scroll-top="40rpx">
        <view class="type_item" v-for="(obj, index) in cartList" :key="index">
          <view class="dish_img">
            <image mode="aspectFill" :src="obj.pic" class="dish_img_url"></image>
          </view>
          <view class="dish_info">
            <view class="dish_name"> {{ obj.name }} </view>
            <view class="dish_price"> <text class="ico">￥</text> {{ obj.amount }} </view>
            <view class="dish_flavor"> {{ obj.dishFlavor }} </view>
            <view class="dish_active">
              <image
                v-if="obj.number && obj.number > 0"
                src="../../static/icon/sub.png"
                @click.stop="subDishAction(obj, '购物车')"
                class="dish_sub"
              ></image>
              <text v-if="obj.number && obj.number > 0" class="dish_number">{{ obj.number }}</text>
              <image src="../../static/icon/add.png" class="dish_add" @click.stop="addDishAction(obj, '购物车')">
              </image>
            </view>
          </view>
        </view>
        <view class="seize_seat"></view>
      </scroll-view>
    </view>
  </view>

  <view v-show="!status" class="close" @click="goBack">
    <view class="text">本店已打烊</view>
  </view>
</template>

<script setup lang="ts">
import {getStatusAPI} from '@/api/shop'
import {getCategoryAPI} from '@/api/category'
import {getDishListAPI} from '@/api/dish'
import {getSetmealListAPI} from '@/api/setmeal'
import {addToCartAPI, subCartAPI, getCartAPI, cleanCartAPI} from '@/api/cart'
import type {CategoryItem} from '@/types/category'
import type {DishItem, FlavorItem, DishToCartItem} from '@/types/dish'
import type {SetmealItem} from '@/types/setmeal'
import type {CartDTO, CartItem} from '@/types/cart'
import {onLoad, onShow} from '@dcloudio/uni-app'
import {ref} from 'vue'
import Navbar from './components/Navbar.vue'

// ------ data ------
// 店铺营业状态
const status = ref(true)
// 左侧分类列表
const categoryList = ref<CategoryItem[]>([])
// 高亮下标
const activeIndex = ref(0)
// 高亮口味下标
const activeFlavorIndex = ref(0)
// 菜品/套餐列表
const dishList = ref<(DishItem | SetmealItem)[]>([])
// 套餐列表
const setmealList = ref<SetmealItem[]>([])
// 是否打开底部购物车列表
const openCartList = ref(false)
// 购物车列表
const cartList = ref<CartItem[]>([])
const CartAllNumber = ref(0)
const CartAllPrice = ref(0)
// 是否显示弹窗
const visible = ref(false)
// 弹窗中对应的菜品和口味数据，用于加入购物车
const dialogDish = ref<DishToCartItem>()
const flavors = ref<FlavorItem[]>([])
// 已选择的口味列表
const chosedflavors = ref<string[]>([])

// ------ method ------
const getCategoryData = async () => {
  const res = await getCategoryAPI()
  console.log(res)
  categoryList.value = res.data
  console.log('categoryList', categoryList.value)
}

const getDishOrSetmealList = async (index: number) => {
  activeIndex.value = index
  console.log('index', index)
  console.log('getList by this category', categoryList.value[index])
  let res
  if (categoryList.value[index].type === 1) {
    res = await getDishListAPI(categoryList.value[index].id)
  } else {
    res = await getSetmealListAPI(categoryList.value[index].id)
  }
  console.log(res)
  dishList.value = res.data
}

// 查询获取购物车列表
const getCartList = async () => {
  const res = await getCartAPI()
  console.log('初始化购物车列表', res)
  cartList.value = res.data
  CartAllNumber.value = cartList.value.reduce((acc, cur) => acc + cur.number, 0)
  CartAllPrice.value = cartList.value.reduce((acc, cur) => acc + cur.amount * cur.number, 0)
  console.log('CartAllNumber', CartAllNumber.value)
  console.log('CartAllPrice', CartAllPrice.value)
  // 如果减少菜品导致购物车为空，关闭购物车列表
  if (cartList.value.length === 0) {
    openCartList.value = false
  }
}

// 只有菜品才要选择规格/口味(多种口味规格数据处理)
const chooseNorm = async (dish: DishItem) => {
  console.log('点击了选择规格chooseNorm，得到了该菜品的所有口味数据', dish.flavors)
  // 所有口味数据放到flavors中
  flavors.value = dish.flavors
  // dish -> dialogDish, flavor涉及类型转换(所有flavors -> 已选的flavors)，需要绕过ts校验
  const tmpdish = Object.assign({}, dish) as unknown as DishToCartItem
  // 删除临时对象中的 'flavors' 属性
  delete tmpdish.flavors
  dialogDish.value = tmpdish
  // 对 dish.flavors 数组中的每种口味进行映射，将list字段用 JSON.parse 转为数组，其他数据不动
  const moreNormdata = dish.flavors.map((obj) => ({...obj, list: JSON.parse(obj.list)}))
  // 有口味的菜品，初始化选择每行的第一个口味，作为已选口味数据
  moreNormdata.forEach((item) => {
    if (item.list && item.list.length > 0) {
      chosedflavors.value.push(item.list[0])
    }
  })
  visible.value = true
}

// 选择菜品口味 obj: 当前行的所有口味数据，flavor: 当前点击的口味
// 每行口味只能选择0或1个口味
const chooseFlavor = (obj: string[], flavor: string) => {
  console.log('chooseFlavor', flavor)
  let ind = -1
  // 判断所有已选过口味(多个口味list中选过口味的集合)中，有没有口味属于当前行下
  // 外层：遍历当前行所有口味n，内层：遍历已选择的口味列表，查找是否存在n，存在则(!=-1)返回true
  // ind表示"当前行选择的口味"在已选口味列表中的位置，-1表示之前没选过当前行的口味
  let findst = obj.some((n) => {
    ind = chosedflavors.value.findIndex((o) => o == n)
    return ind != -1
  })
  // 查询"当前口味"在已选口味列表中的位置（-1表示之前没选过）
  const indexInChosed = chosedflavors.value.findIndex((it) => it == flavor)
  console.log('ind', ind)
  console.log('indexInChosed', indexInChosed)
  // 1、如果当前口味没选过，且当前行没有选过口味，直接添加
  if (indexInChosed == -1 && !findst) {
    console.log('1、当前口味没选过，且当前行没选过口味')
    chosedflavors.value.push(flavor)
  }
  // 2、如果当前口味没选过，但当前行选过口味，替换掉当前行选过的口味（确保每行只能选一个口味）
  else if (indexInChosed == -1 && findst && ind >= 0) {
    console.log('2、当前口味没选过，但当前行选过口味，替换掉当前行选过的口味')
    chosedflavors.value.splice(ind, 1) // 当前行上次选过的口味对应的索引是ind
    chosedflavors.value.push(flavor)
  }
  // 3、如果当前口味选过，进行反选操作，也就是直接删除（即当前行不选择口味了）
  else {
    console.log('3、当前口味选过，进行反选操作，也就是直接删除')
    chosedflavors.value.splice(indexInChosed, 1)
  }
  // 选择的口味列表，先拼接成字符串，再赋值给dialogDish.flavors字段
  dialogDish.value!.flavors = chosedflavors.value.join(',')
  // 我确定不可能为空！因为打开dialog触发的chooseNorm函数中，已经为dialogDish赋值过了
  console.log('选好口味后，看看带口味字符串的，dialog中的菜品长什么样？ dialogDish', dialogDish.value)
}

// 获取购物车中某个菜品的数量
const getCopies = (dish: DishItem | SetmealItem) => {
  console.log('getCopies', dish)
  // 有可能是菜品/套餐，所以要判断
  if (categoryList.value[activeIndex.value].sort < 20) {
    return cartList.value.find((item) => item.dishId === dish.id)?.number || 0
  } else {
    return cartList.value.find((item) => item.setmealId === dish.id)?.number || 0
  }
}

// dialog中点击加入购物车(有口味必定是菜品dish)
const addToCart = async (dish: DishToCartItem) => {
  console.log('addToCart', dish)
  // dialog中必定是菜品且有口味，需要判断是否有选择口味，必须有口味才能发送给后端
  if (!chosedflavors.value || chosedflavors.value.length <= 0) {
    uni.showToast({
      title: '请选择规格',
      icon: 'none',
    })
    return false
  }
  // 菜品需要拼接口味list，转为string，作为dishFlavor字段发送给后端
  const partialCart: Partial<CartDTO> = {dishId: dish.id, dishFlavor: chosedflavors.value.join(',')}
  await addToCartAPI(partialCart)
  // 数据库更新，所以拿到新的购物车列表(cartList)，页面才能跟着刷新
  await getCartList()
  // 请求发送成功后，清空已选择的口味数据，并关闭dialog弹窗
  chosedflavors.value = []
  visible.value = false
}

// "+"按钮，form: 购物车/普通视图中的按钮
const addDishAction = async (item: any, form: string) => {
  console.log('点击了dialog的 “+” 添加菜品数量按钮', item, form)
  console.log(categoryList.value[activeIndex.value].sort < 20)
  if (form == '购物车') {
    // 1、直接数量-1，传的参数是cartItem类型，dishId、setmealId必是一个null 一个不null，所以直接全传
    console.log('addCart', item)
    const partialCart: Partial<CartDTO> = {
      dishId: item.dishId,
      setmealId: item.setmealId,
      dishFlavor: item.dishFlavor,
    }
    await addToCartAPI(partialCart)
  } else {
    // 2、dishItem无dishId、setmealId两个属性，因此得判断
    console.log('普通页面下的dish，点击能直接添加(而不弹出dialog)的菜品说明无口味', item)
    if (categoryList.value[activeIndex.value].sort < 20) {
      const partialCart: Partial<CartDTO> = {dishId: item.id}
      await addToCartAPI(partialCart)
    } else {
      const partialCart: Partial<CartDTO> = {setmealId: item.id}
      await addToCartAPI(partialCart)
    }
  }
  // 数据库更新，所以拿到新的购物车列表(cartList)，页面才能跟着刷新
  await getCartList()
}

// "-"按钮，form: 购物车/普通视图中的按钮
const subDishAction = async (item: any, form: string) => {
  console.log('点击了减少菜品数量按钮subDishAction--------------------', item, form)
  if (form == '购物车') {
    // 1、直接数量-1，传的参数是cartItem类型，dishId、setmealId必是一个null 一个不null，所以直接全传
    console.log('subCart', item)
    const partialCart: Partial<CartDTO> = {
      dishId: item.dishId,
      setmealId: item.setmealId,
      dishFlavor: item.dishFlavor,
    }
    await subCartAPI(partialCart)
  } else {
    // 2、dishItem无dishId、setmealId两个属性，因此得判断
    console.log('普通页面下的dish，不是dialog中的菜品说明无口味', item)
    if (categoryList.value[activeIndex.value].sort < 20) {
      const partialCart: Partial<CartDTO> = {dishId: item.id}
      await subCartAPI(partialCart)
    } else {
      const partialCart: Partial<CartDTO> = {setmealId: item.id}
      await subCartAPI(partialCart)
    }
  }
  // 数据库更新，所以拿到新的购物车列表(cartList)，页面才能跟着刷新
  await getCartList()
}

// 清空购物车
const clearCart = async () => {
  await cleanCartAPI()
  await getCartList()
  openCartList.value = false
}

// 提交订单
const submitOrder = () => {
  console.log('submitOrder')
  // 跳转到订单确认页面
  uni.navigateTo({
    url: '/pages/submit/submit',
  })
}

const goBack = () => {
  uni.switchTab({url: '/pages/index/index'})
}

// 页面加载
onLoad(async () => {
  const res = await getStatusAPI()
  console.log('店铺状态---------', res)
  status.value = res.data === 1 ? true : false
  await getCategoryData()
  await getDishOrSetmealList(0) // 默认加载第一个分类下的菜品列表
  await getCartList() // 获取购物车列表(一开始为空)
})
onShow(async () => {
  await getCategoryData()
  await getCartList()
})
</script>

<style lang="less" scoped>
.dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1000;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  .flavor_pop {
    position: relative;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    padding: 40rpx;
    border-radius: 20rpx;
    width: 70%;
    height: 35%;
    background-color: #fff;
    justify-content: center;

    .title {
      font-size: 36rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .scroll {
      height: 80%;
      padding-bottom: 20rpx;
    }

    .flavor {
      padding: 10rpx 0;
    }

    .flavorItem {
      margin: 10rpx 20rpx 10rpx 0;
      padding: 10rpx;
      display: inline-block;
      border: #00aaff 1rpx solid;
      border-radius: 20rpx;
      text-align: center;
      font-size: 20rpx;
    }
    .active {
      background-color: #00aaff;
      color: #fff;
    }

    .addToCart {
      position: absolute;
      bottom: 20rpx;
      right: 30rpx;
      width: 150rpx;
      height: 50rpx;
      background-color: #00aaff;
      color: #fff;
      font-size: 20rpx;
      text-align: center;
      line-height: 50rpx;
      border-radius: 30rpx;
    }
  }

  .close_dialog {
    position: fixed;
    top: 75%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    font-size: 40rpx;
    text-align: center;
    line-height: 60rpx;
  }
}

.setmeal_pop {
  position: relative;
  top: 50%;
  left: 50%;
  padding: 40rpx;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 20rpx;
  width: 100%;
  height: 100%;
  background-color: #fff;
  justify-content: center;
}

.viewport {
  padding-top: 130px; // 上方为固定的简介栏，调整出一定高度来（不然不知道为啥fixed不占一段高度）
  height: 100%;
  display: flex;
  flex-direction: column;
}

.search {
  padding: 0 30rpx 20rpx;
  background-color: #fff;

  .input {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64rpx;
    padding-left: 26rpx;
    color: #8b8b8b;
    font-size: 28rpx;
    border-radius: 32rpx;
    background-color: #f3f4f4;
  }
}

.icon-search {
  &::before {
    margin-right: 10rpx;
  }
}

/* 分类 */
.categories {
  flex: 1;
  min-height: 400rpx;
  display: flex;
}

/* 一级分类 */
.primary {
  overflow: hidden;
  width: 180rpx;
  flex: none;
  background-color: #f6f6f6;

  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96rpx;
    font-size: 26rpx;
    color: #595c63;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 42rpx;
      bottom: 0;
      width: 96rpx;
      border-top: 1rpx solid #e3e4e7;
    }
  }

  .active {
    background-color: #fff;
  }
}

.primary .item:last-child::after,
.primary .active::after {
  display: none;
}

/* 二级分类 */
.secondary {
  background-color: #fff;

  .carousel {
    height: 200rpx;
    margin: 0 30rpx 20rpx;
    border-radius: 4rpx;
    overflow: hidden;
  }

  .panel {
    margin: 0 30rpx 0rpx;
  }

  .title {
    height: 60rpx;
    line-height: 60rpx;
    color: #333;
    font-size: 28rpx;
    border-bottom: 1rpx solid #f7f7f8;
  }

  .more {
    &::after {
      font-family: 'erabbit' !important;
      content: '\e6c2';
    }
  }

  .section {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx 0;

    .dish {
      width: 520rpx;
      margin: 10rpx 30rpx 10rpx 20rpx;
      // background-color: #f6f6f6;
      display: flex;

      image {
        width: 150rpx;
        height: 150rpx;
        border-radius: 15rpx;
      }

      .dishinfo {
        width: 300rpx;
        padding: 10rpx;
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: space-between;
        flex: 1;

        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .name {
          padding: 5rpx;
          font-size: 24rpx;
          color: #222;
        }

        .detail {
          padding: 5rpx;
          font-size: 18rpx;
          color: #333;
        }

        .price {
          padding: 5rpx;
          font-size: 18rpx;
          color: #cf4444;
        }

        .number {
          font-size: 24rpx;
          margin-left: 2rpx;
        }

        // image {
        //   position: absolute;
        //   right: 20rpx;
        //   bottom: 20rpx;
        //   width: 30rpx;
        //   height: 30rpx;
        // }

        .choosenorm {
          position: absolute;
          right: 20rpx;
          bottom: 10rpx;
          width: 112rpx;
          height: 45rpx;
        }

        .sub_add {
          display: flex;
          position: absolute;
          right: 20rpx;
          bottom: 10rpx;

          .sub {
            // margin-right: 90rpx;
            width: 35rpx;
            height: 35rpx;
          }

          .add {
            width: 35rpx;
            height: 35rpx;
          }

          .dish_number {
            padding: 0 10rpx;
            line-height: 30rpx;
            font-size: 20rpx;
            font-family: PingFangSC, PingFangSC-Medium;
            font-weight: 500;
          }
        }
      }

      .name {
        padding: 5rpx;
        font-size: 22rpx;
        color: #333;
      }

      .price {
        padding: 5rpx;
        font-size: 18rpx;
        color: #cf4444;
      }

      .number {
        font-size: 24rpx;
        margin-left: 2rpx;
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
  margin: 0 30rpx;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 50rpx;
  box-shadow: 0px 6rpx 10rpx 0px rgba(0, 0, 0, 0.25);
  z-index: 1000;
  padding: 0rpx 10rpx;
  box-sizing: border-box;

  .order_number {
    position: relative;
    width: 120rpx;

    .order_number_icon {
      position: absolute;
      display: block;
      width: 120rpx;
      height: 120rpx;
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
    font-family: DIN, DIN-Medium;
    font-weight: 500;

    .ico {
      font-size: 24rpx;
    }
  }

  .order_btn {
    background-color: #d8d8d8;
    width: 204rpx;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 72rpx;
    color: #fff;
    text-align: center;
    font-weight: bold;
    margin-top: 8rpx;
  }

  .order_btn_active {
    width: 204rpx;
    height: 72rpx;
    line-height: 72rpx;
    border-radius: 72rpx;
    color: #fff;
    text-align: center;
    font-weight: bold;
    margin-top: 8rpx;
    background: #00aaff;
  }
}

.pop_mask {
  position: fixed;
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.4);

  .pop {
    width: 60%;
    position: relative;
    top: 40%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    background: #fff;
    border-radius: 20rpx;

    .open_table_cont {
      padding-top: 60rpx;

      .cont_tit {
        font-size: 36rpx;
        color: #20232a;
        text-align: center;
      }

      .people_num_act {
        display: flex;
        width: 60%;
        margin: 0 auto;

        .red,
        .add {
          width: 112rpx;
          height: 112rpx;
        }

        .people_num {
          line-height: 112rpx;
          flex: 1;
          text-align: center;
          font-size: 30rpx;
          color: #20232a;
        }
      }
    }

    .butList {
      background: #f7f7f7;
      display: flex;
      text-align: center;
      border-radius: 20rpx;

      .define {
        flex: 1;
        font-size: 36rpx;
        line-height: 100rpx;
      }

      .cancel {
        flex: 1;
        font-size: 36rpx;
        line-height: 100rpx;
      }
    }
  }

  .cart_pop {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 60vh;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 20rpx 30rpx 30rpx 30rpx;
    box-sizing: border-box;

    .top_title {
      display: flex;
      justify-content: space-between;
      border-bottom: solid 1px #ebeef5;
      padding-bottom: 20rpx;

      .tit {
        font-size: 40rpx;
        font-weight: bold;
        color: #20232a;
      }

      .clear {
        color: #999999;
        font-size: 28rpx;
        font-weight: 400;
        display: flex;
        align-items: center;
        font-family: PingFangSC, PingFangSC-Regular;

        // position: relative;
        // top: 14rpx;
        .clear_icon {
          // position: relative;
          // top: 0rpx;
          width: 30rpx;
          height: 30rpx;
          margin-right: 8rpx;
        }

        .clear-des {
          height: 56rpx;
          line-height: 56rpx;
        }
      }
    }

    .card_order_list {
      background-color: #fff;
      padding-top: 40rpx;
      box-sizing: border-box;
      height: calc(100% - 0rpx);
      flex: 1;
      position: relative;

      .type_item {
        display: flex;
        margin-bottom: 40rpx;

        .dish_img {
          width: 128rpx;
          margin-right: 30rpx;

          .dish_img_url {
            display: block;
            width: 128rpx;
            height: 128rpx;
            border-radius: 8rpx;
          }
        }

        .dish_info {
          position: relative;
          flex: 1;
          padding-bottom: 40rpx;
          border-bottom: solid 1px #ebeef5;

          .dish_name {
            font-size: 32rpx;
            color: #333333;
            font-family: PingFangSC, PingFangSC-Semibold;
            font-weight: 600;
          }

          .dish_price {
            font-size: 36rpx;
            color: #e94e3c;
            font-weight: bold;

            .ico {
              font-size: 24rpx;
            }
          }

          .dish_flavor {
            font-size: 20rpx;
            color: #666;
          }

          .dish_active {
            position: absolute;
            right: 20rpx;
            bottom: 20rpx;
            display: flex;

            .dish_add,
            .dish_sub {
              display: block;
              width: 50rpx;
              height: 50rpx;
              margin: 11rpx;
            }

            .dish_number {
              padding: 0 10rpx;
              line-height: 72rpx;
              font-size: 30rpx;
              font-family: PingFangSC, PingFangSC-Medium;
              font-weight: 500;
            }
          }
        }
      }

      &::before {
        content: '';
        position: absolute;
        width: 100vw;
        height: 120rpx;
        z-index: 99;
        background: linear-gradient(0deg, rgba(255, 255, 255, 1) 10%, rgba(255, 255, 255, 0));
        bottom: 0px;
        left: 0px;
      }

      .seize_seat {
        width: 100%;
        height: 120rpx;
      }
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
          padding: 0 10rpx;
          line-height: 72rpx;
          font-size: 30rpx;
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

  .close {
    position: absolute;
    bottom: -180rpx;
    left: 50%;
    transform: translateX(-50%);

    .close_img {
      width: 88rpx;
      height: 88rpx;
    }
  }
}
.close {
  position: absolute;
  top: 0;
  right: 0;
  width: 750rpx;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
  line-height: 40rpx;
  font-size: 24rpx;
  color: #000;
  .text {
    width: 750rpx;
    height: 200rpx;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    bottom: 0;
    text-align: center;
    line-height: 200rpx;
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
  }
}
</style>
