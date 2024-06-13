<template>
  <view class="customer-box">
    <view class="add_edit" :style="{height: `calc(100% - ${statusBarHeight} - 44px)`}">
      <form class="form_address">
        <view class="uni-form-item uni-column form_item">
          <view class="title">联系人</view>
          <input
            class="uni-input"
            placeholder-class="uni-place"
            v-model="form.consignee"
            placeholder="请输入联系人"
            :maxlength="5"
          />
          <view class="radio">
            <view class="radio-item" v-for="(item, index) in items" :key="index" @click="sexChangeHandle(item.value)">
              <image v-if="item.value != form.gender" class="radio-img" src="../../static/icon/icon-radio.png"></image>
              <image v-else class="radio-img" src="../../static/icon/icon-radio-selected.png"></image>
              <text class="radio-label">{{ item.name }}</text>
            </view>
          </view>
        </view>
        <view class="uni-form-item uni-column form_item">
          <view class="title">手机号</view>
          <input
            class="uni-input"
            v-model="form.phone"
            type="number"
            placeholder-class="uni-place"
            placeholder="请输入手机号"
            :maxlength="11"
          />
        </view>
        <view class="uni-form-item uni-column form_item">
          <view class="title">所在地区</view>
          <!-- 只有微信小程序端内置了省市区数据 -->
          <!-- #ifdef MP-WEIXIN -->
          <view class="form-item">
            <picker @change="pickerChange" mode="region" class="picker" :value="address?.split(' ')">
              <view v-if="address">{{ address }}</view>
              <view class="uni-place" v-else>请选择城市</view>
            </picker>
          </view>
          <!-- #endif -->
        </view>
        <view class="uni-form-item uni-column form_item">
          <view class="title">详细地址</view>
          <input
            class="uni-input"
            :class="{'detail-ios': platform == 'ios'}"
            placeholder-class="uni-place"
            v-model="form.detail"
            placeholder="精确到门牌号"
          />
        </view>
        <view class="uni-form-item uni-column form_item tag-box">
          <view class="title">标签:</view>
          <text
            :class="{active: form.label === item.name}"
            class="tag_text"
            v-for="item in options"
            :key="item.name"
            @click="getTextOption(item)"
            >{{ item.name }}
          </text>
        </view>
      </form>
      <view class="add_address">
        <button class="add_btn" @click="addAddress()">保存地址</button>
        <button v-if="showDel" class="del_btn" type="default" plain @click="deleteAddress()">删除地址</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {addAddressAPI, deleteAddressAPI, getAddressByIdAPI, updateAddressAPI} from '@/api/address'
import {onLoad, onShow, onUnload} from '@dcloudio/uni-app'
import {reactive} from 'vue'
import type {Address} from '@/types/address'

// 自己实现的省市区选择器
let fullLocationCode: [string, string, string] = ['', '', '']
const pickerChange: UniHelper.RegionPickerOnChange = (ev) => {
  console.log(ev)
  // 修改前端界面
  address.value = ev.detail.value.join(' ')
  console.log(address.value)
  // 提交后端更新
  fullLocationCode = ev.detail.code!
  console.log(fullLocationCode)
  // 拆分省市区编码给三个变量，后端需要
  form.provinceCode = fullLocationCode[0]
  form.cityCode = fullLocationCode[1]
  form.districtCode = fullLocationCode[2]
}

const platform = ref('ios')
const showDel = ref(false)
const items = [
  {
    value: 1,
    name: '男士',
  },
  {
    value: 0,
    name: '女士',
  },
]
const options = [
  {
    name: '公司',
  },
  {
    name: '家',
  },
  {
    name: '学校',
  },
]
const form = reactive({
  id: 0,
  consignee: '',
  phone: '',
  label: '',
  gender: 1,
  provinceCode: '110000',
  provinceName: '',
  cityCode: '110100',
  cityName: '',
  districtCode: '110102',
  districtName: '',
  detail: '',
})
// 联动省市县
// 弹框的初始值
const cityPickerValueDefault = [0, 0, 1]
const pickerText = ref('')
// 初始值
const address = ref('北京市 市辖区 西城区')
// 保存将要删除的
const delId = ref<number>()

onLoad(async (options) => {
  init()
  if (options && options.type === '编辑') {
    delId.value = -1 // 初始时没有要删除的地址，其id为-1
    showDel.value = true
    uni.setNavigationBarTitle({
      title: '编辑收货地址',
    })
    // 保存将要删除的id
    delId.value = options.id
    // 查询详情，用于回显原状态信息
    await queryAddressBookById(options.id)
  } else {
    showDel.value = false
  }
})
onUnload(() => {
  uni.removeStorage({
    key: 'edit',
  })
})
const statusBarHeight = () => {
  return uni.getSystemInfoSync().statusBarHeight + 'px'
}
const init = () => {
  const res = uni.getSystemInfoSync()
  platform.value = res.platform
}
const goBack = () => {
  uni.redirectTo({
    url: '/pages/address/address',
  })
}
// 查询地址详情接口
const queryAddressBookById = async (id: number) => {
  const res = await getAddressByIdAPI(id)
  if (res.code === 0) {
    const newForm = {
      provinceCode: res.data.provinceCode,
      cityCode: res.data.cityCode,
      districtCode: res.data.districtCode,
      phone: res.data.phone,
      consignee: res.data.consignee,
      gender: res.data.gender,
      label: res.data.label,
      detail: res.data.detail,
      id: res.data.id,
    }
    Object.assign(form, newForm)
    if (res.data.provinceName && res.data.cityName && res.data.districtName) {
      address.value = res.data.provinceName + '-' + res.data.cityName + '-' + res.data.districtName
    }
  }
}
// 标签的事件
const getTextOption = (item: any) => {
  console.log('点击了标签', item)
  form.label = item.name
}
// const bindTextAreaBlur = (e: any) => {
//   console.log(e.detail.value)
// }
// const radioChange = (e: any) => {
//   if (e.detail.value === 'man') {
//     form.radio = 0
//   } else {
//     form.radio = 1
//   }
// }
const sexChangeHandle = (val: number) => {
  form.gender = val
  console.log(form.gender)
}
// 新增地址
const addAddress = async () => {
  // 1、先校验
  if (form.consignee === '') {
    return uni.showToast({
      title: '联系人不能为空',
      duration: 1000,
      icon: 'none',
    })
  } else if (form.phone === '') {
    return uni.showToast({
      title: '手机号不能为空',
      duration: 1000,
      icon: 'none',
    })
  } else if (form.label === '') {
    return uni.showToast({
      title: '所属标签不能为空',
      duration: 1000,
      icon: 'none',
    })
  } else if (address.value === '') {
    return uni.showToast({
      title: '所在地区不能为空',
      duration: 1000,
      icon: 'none',
    })
  }
  if (form.phone) {
    const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (!reg.test(form.phone)) {
      return uni.showToast({
        title: '手机号输入有误',
        duration: 1000,
        icon: 'none',
      })
    }
  }
  // 2、再拼接参数params
  const params = {
    ...(form as {id?: number}),
    provinceName: address.value.split(' ')[0],
    cityName: address.value.split(' ')[1],
    districtName: address.value.split(' ')[2],
  }
  // 3、编辑 or 新增 地址
  if (showDel.value) {
    console.log('update params !!!', params)
    const res = await updateAddressAPI(params)
    if (res.code === 0) {
      uni.redirectTo({
        url: '/pages/address/address',
      })
    }
  } else {
    delete params.id
    console.log('add params with label!', params)
    const res = await addAddressAPI(params)
    if (res.code === 0) {
      uni.redirectTo({
        url: '/pages/address/address',
      })
    }
  }
}
// 删除地址
const deleteAddress = async () => {
  if (delId.value === -1 || !delId.value) {
    return uni.showToast({
      title: '删除失败',
      duration: 1000,
      icon: 'none',
    })
  }
  const res = await deleteAddressAPI(delId.value)
  if (res.code === 0) {
    uni.redirectTo({
      url: '/pages/address/address',
    })
    uni.showToast({
      title: '地址删除成功',
      duration: 1000,
      icon: 'none',
    })
    form.consignee = ''
    form.phone = ''
    // form.address = ''
    form.label = ''
    // form.radio = 0
    form.provinceCode = '110000'
    form.cityCode = '110100'
    form.districtCode = '110102'
  }
}
</script>

<style lang="less" scoped>
.add_edit {
  width: 750rpx;
  height: 100%;
  background-color: #fff;

  .form_address {
    .form_item {
      margin: 0 22rpx;
      height: 110rpx;
      line-height: 110rpx;
      border-bottom: 1px solid #efefef;
      display: flex;

      .title {
        width: 140rpx;
        opacity: 1;
        font-size: 28rpx;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 500;
        text-align: left;
        color: #333333;
        letter-spacing: 0px;
      }

      .uni-input {
        flex: 1;
        height: 110rpx;
        line-height: 110rpx;
      }

      /deep/ .uni-place {
        font-size: 26rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
      }

      .radio {
        opacity: 1;
        font-size: 26rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #333333;
        letter-spacing: 0px;
        display: flex;
        padding-right: 20rpx;

        .radio-item {
          display: flex;
          align-items: center;

          &:first-child {
            margin-right: 54rpx;
          }
        }

        .radio-img {
          width: 32rpx;
          height: 32rpx;
          margin-right: 10rpx;
        }
      }

      // 标签
      .tag_text {
        width: 68rpx;
        height: 44rpx;
        line-height: 40rpx;
        border: 1px solid #e5e4e4;
        display: inline-block;
        border-radius: 6rpx;
        text-align: center;
        margin-top: 34rpx;
        box-sizing: border-box;
        color: #333333;
        font-size: 24rpx;

        &:nth-child(3) {
          margin: 34rpx 20rpx;
        }

        &:nth-child(3) {
          &.active {
            background: #fef8e7;
            border: 1px solid #fef8e7;
          }
        }

        &:nth-child(4) {
          &.active {
            background: #e7fef8;
            border: 1px solid #e7fef8;
          }
        }
      }

      .active {
        background: #e1f1fe;
        border: 1px solid #e1f1fe;
      }
    }

    // 详细地址
    .detail {
      padding: 20rpx 22rpx;
      width: 100%;
      box-sizing: border-box;

      /deep/ .uni-place {
        font-size: 26rpx;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
        text-align: left;
      }

      // color: #999;
    }

    .detail-ios {
      padding: 20rpx 14rpx;
    }
  }

  // .tag-box {
  //   // border-top: 1px solid #efefef;
  // }

  .add_address {
    margin: 0 auto;

    .add_btn {
      margin-top: 40rpx;
      width: 668rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 36rpx;
      background: #22ccff;
      border: 1px solid #22ccff;
      opacity: 1;
      font-size: 30rpx;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      letter-spacing: 0px;

      .img_btn {
        width: 44rpx;
        height: 44rpx;
        vertical-align: middle;
        margin-bottom: 8rpx;
      }
    }

    .del_btn {
      margin-top: 40rpx;
      opacity: 1;
      background: #f6f6f6;
      border: 1px solid #f6f6f6;
      width: 668rpx;
      height: 72rpx;
      line-height: 72rpx;
      border-radius: 72rpx;
      font-size: 30rpx;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 550;
      text-align: center;
      color: #333333;
      letter-spacing: 0px;
    }
  }
}

.customer-box {
  height: 100vh;
}
</style>
