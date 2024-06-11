<script setup lang="ts">
import { loginAPI } from '@/api/employee'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/store'

const userInfoStore = useUserInfoStore()

const form = ref({
  account: '',
  password: ''
});
// 表单校验的ref
const loginRef = ref()

const rules = {
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9]{1,10}$/, message: '用户名必须是1-10的字母数字', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' }
  ]
}

const router = useRouter()

const loginFn = async () => {
  // 先校验输入格式是否合法
  const valid = await loginRef.value.validate()
  if (valid) {
    // 调用登录接口
    const { data: res } = await loginAPI(form.value)
    console.log(res)
    // 登录失败，提示用户，这个提示已经在响应拦截器中统一处理了，这里直接return就行
    if (res.code !== 0) {
      return false
    }
    // 登录成功，提示用户
    ElMessage.success('登录成功')
    // 把后端返回的当前登录用户信息(包括token)存储到Pinia里
    userInfoStore.userInfo = res.data
    console.log(userInfoStore.userInfo)
    // 跳转到首页
    router.push('/')
  } else {
    return false
  }
}
</script>

<template>
  <div class="background">
    <!-- 下雨效果 -->
    <div class="rain">
      <span style="--i:64;"></span>
      <span style="--i:33;"></span>
      <span style="--i:21;"></span>
      <span style="--i:95;"></span>
      <span style="--i:42;"></span>
      <span style="--i:17;"></span>
      <span style="--i:88;"></span>
      <span style="--i:50;"></span>
      <span style="--i:10;"></span>
      <span style="--i:77;"></span>
      <span style="--i:3;"></span>
      <span style="--i:29;"></span>
      <span style="--i:72;"></span>
      <span style="--i:5;"></span>
      <span style="--i:90;"></span>
      <span style="--i:49;"></span>
      <span style="--i:14;"></span>
      <span style="--i:61;"></span>
      <span style="--i:38;"></span>
      <span style="--i:81;"></span>
      <span style="--i:64;"></span>
      <span style="--i:33;"></span>
      <span style="--i:21;"></span>
      <span style="--i:95;"></span>
      <span style="--i:42;"></span>
      <span style="--i:17;"></span>
      <span style="--i:88;"></span>
      <span style="--i:50;"></span>
      <span style="--i:10;"></span>
      <span style="--i:77;"></span>
      <span style="--i:3;"></span>
      <span style="--i:29;"></span>
      <span style="--i:72;"></span>
      <span style="--i:5;"></span>
      <span style="--i:90;"></span>
      <span style="--i:49;"></span>
      <span style="--i:14;"></span>
      <span style="--i:61;"></span>
      <span style="--i:38;"></span>
      <span style="--i:81;"></span>
      <span style="--i:21;"></span>
      <span style="--i:95;"></span>
      <span style="--i:42;"></span>
      <span style="--i:17;"></span>
      <span style="--i:88;"></span>
      <span style="--i:50;"></span>
      <span style="--i:10;"></span>
      <span style="--i:77;"></span>
      <span style="--i:3;"></span>
      <span style="--i:29;"></span>
      <span style="--i:14;"></span>
      <span style="--i:61;"></span>
    </div>
    <el-form label-width="0px" class="login-box" :model="form" :rules="rules" ref="loginRef">
      <div class="title-box">登 录</div>
      <el-form-item prop="account">
        <el-input v-model="form.account" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item class="my-el-form-item">
        <el-button type="primary" class="btn-login" @click="loginFn">登录</el-button>
        <el-link type="info" @click="$router.push('/reg')">去注册</el-link>
      </el-form-item>
    </el-form>
  </div>
</template>


<style lang="less" scoped>
body {
  margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.background {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-image: url('../../assets/image/login.jpg');
  overflow: hidden; // 防止页面滚动条闪动
}

.background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  /* 黑色半透明 */
  z-index: 1;
  /* 确保伪元素在背景图之上 */
}

.rain {
  position: relative;
  display: flex;
}

.rain span {
  position: relative;
  width: 20px;
  height: 20px;
  background-color: #eee;
  margin: 0 4px;
  border-radius: 50%;
  box-shadow: 0 0 10px 5px rgba(238, 238, 238, 0.5), /* 微调颜色和透明度 */
              0 0 30px 15px rgba(238, 238, 238, 0.3), /* 模糊半径和扩散范围 */
              0 0 50px 30px rgba(221, 221, 221, 0.2);
  animation: animate 15s linear infinite;
  animation-duration: calc(200s / var(--i));
}

.rain span:nth-child(even) {
  background: #ff8800;
  /* 橙色调 */
  box-shadow: 0 0 10px 5px rgba(255, 150, 50, 0.5),
    /* 颜色和透明度 */
    0 0 30px 15px rgba(200, 100, 50, 0.3),
    0 0 50px 30px rgba(200, 50, 50, 0.1);
}


@keyframes animate {
  0% {
    transform: translateY(100vh) scale(0);
  }

  100% {
    transform: translateY(-10vh) scale(1);
  }
}

.login-box {
  z-index: 10;
  width: 400px;
  height: 340px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 0 30px;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  box-shadow: #dddddd 0 0 100px;

  .title-box {
    height: 100px;
    line-height: 100px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #00aaff;
  }

  .el-form-item {
    margin-bottom: 20px;
  }

  .btn-login {
    width: 100%;
  }

  .el-link{
    margin-top: 25px;
  }
}
</style>