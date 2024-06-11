<template>
  <!-- 信息input框列表 -->
  <view class="submit">
    <form @submit="submit">
      <view class="pic_box" @click="picChange">
        <image v-if="!user.pic" src="../../static/images/user_default.png" mode="aspectFill"></image>
        <image v-else :src="user.pic" mode="aspectFill"></image>
        <view class="text">点击上传头像</view>
      </view>
      <view class="radio">
        <view class="radio-item" v-for="(item, index) in items" :key="index" @click="genderChange(item.value)">
          <image v-if="item.value != user.gender" class="radio-img" src="../../static/icon/icon-radio.png"></image>
          <image v-else class="radio-img" src="../../static/icon/icon-radio-selected.png"></image>
          <text class="radio-label">{{ item.name }}</text>
        </view>
      </view>
      <view class="item">
        <view class="title">昵称</view>
        <input class="item_input" placeholder="请输入昵称" v-model="user.name" />
      </view>
      <view class="item">
        <view class="title">手机号</view>
        <input class="item_input" placeholder="请输入手机号" v-model="user.phone" />
      </view>
      <button form-type="submit" class="submit_btn">确认修改</button>
    </form>
  </view>
</template>

<script lang="ts" setup>
import {ref, reactive} from 'vue'
import {onLoad} from '@dcloudio/uni-app'
import {useUserStore} from '@/stores/modules/user'
import {getUserInfoAPI, updateUserAPI} from '@/api/user'

const userStore = useUserStore()

const user = reactive({
  id: userStore.profile!.id,
  name: '',
  gender: 1,
  phone: '未设置',
  pic: '',
})
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

onLoad(async () => {
  console.log('userStore', userStore.profile)
  await getUserInfo(user.id)
})

const getUserInfo = async (id: number) => {
  const res = await getUserInfoAPI(id)
  console.log('用户信息', res)
  user.name = res.data.name as string
  user.gender = res.data.gender ?? 1 // 之前没设置就默认男士
  user.phone = res.data.phone as string
  user.pic = res.data.pic as string
  console.log('user', user)
}

const picChange = () => {
  console.log('picChange')
  uni.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    maxDuration: 15,
    camera: 'back',
    // 获取图片成功的回调
    success: (res) => {
      console.log(res)
      // 解构获得图片的临时路径
      const {tempFilePath} = res.tempFiles[0]
      let base64String = ''
      wx.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        // 图片转base64成功的回调
        success: (res) => {
          base64String = 'data:image/png;base64,' + res.data
          console.log(base64String)
          user.pic = base64String
        },
      })
    },
  })
}
const genderChange = (val: number) => {
  user.gender = val
  console.log(user.gender)
}

const validateForm = (): boolean => {
  let valid = true
  // 验证昵称
  if (!user.name) {
    uni.showToast({
      title: '昵称不能为空',
      icon: 'none',
    })
    valid = false
  }
  // 验证手机号格式
  const phonePattern = /^1[3-9]\d{9}$/
  if (!user.phone) {
    uni.showToast({
      title: '手机号不能为空',
      icon: 'none',
    })
    valid = false
  } else if (!phonePattern.test(user.phone)) {
    uni.showToast({
      title: '手机号格式不正确',
      icon: 'none',
    })
    valid = false
  }
  return valid
}

const submit = async () => {
  console.log('submit', user)
  if (!validateForm()) {
    return
  }
  const res = await updateUserAPI(user)
  if (res.code === 0) {
    uni.showToast({
      title: '修改成功',
      icon: 'success',
    })
    uni.switchTab({
      url: '/pages/my/my',
    })
  }
}
</script>

<style lang="less" scoped>
.submit {
  margin: 20rpx 30rpx;
  .pic_box {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30rpx;
    position: relative;
    image {
      width: 120rpx;
      height: 120rpx;
    }
    .text {
      font-size: 25rpx;
      line-height: 50rpx;
      color: #666;
    }
  }
  .radio {
    height: 110rpx;
    font-size: 26rpx;
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
  .item {
    height: 110rpx;
    line-height: 110rpx;
    border-bottom: 1px solid #efefef;
    display: flex;
    image {
      width: 40rpx;
      height: 40rpx;
      margin-right: 20rpx;
    }
    .title {
      width: 120rpx;
      font-size: 30rpx;
      color: #333;
    }
    .item_input {
      flex: 1;
      height: 110rpx;
      line-height: 110rpx;
      font-size: 30rpx;
      color: #666;
    }
  }
  .submit_btn {
    width: 600rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background: #22ccff;
    border: none;
    color: #fff;
    font-size: 30rpx;
    text-align: center;
    margin: 40rpx auto;
  }
}
</style>
