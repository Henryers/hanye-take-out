<script setup lang="ts" name:="my-register">
// 导出是命名导出，所以这里导入要加{}
import { registerAPI } from '@/api/employee'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const form = ref({ // 表单的数据对象
  account: '', // 用户名
  password: '', // 密码
  repassword: '' // 确认密码
})
// 表单校验的ref
const registerRef = ref()

// 自定义校验规则: 两次密码是否一致
// 注意：必须在data函数里定义此箭头函数，才能确保this.from能使用，从而获取到password的值
const samePwd = (rules: any, value: any, callback: any) => {
  if (value !== form.value.password) {
    // 如果验证失败，则调用 回调函数时，指定一个 Error 对象。
    callback(new Error('两次输入的密码不一致!'))
  } else {
    // 如果验证成功，则直接调用 callback 回调函数即可。
    callback()
  }
}
const rules = { // 表单的规则检验对象
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,10}$/,
      message: '用户名必须是1-10的大小写字母数字',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是6-15的非空字符',
      trigger: 'blur'
    }
  ],
  repassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15的非空字符', trigger: 'blur' },
    { validator: samePwd, trigger: 'blur' }
  ]
}

const router = useRouter()

const registerFn = async () => {
  // 先校验输入格式是否合法
  const valid = await registerRef.value.validate()
  if (valid) {
    // 通过校验，拿到绑定的数据
    console.log('注册的表单ref:  ', registerRef)
    console.log('form.value:  ', form.value)
    // 1.调用注册接口，通过接口的return request，拿到promise对象
    const { data: res } = await registerAPI(form.value)
    console.log(res)
    // 2.注册失败，响应拦截器已经ElMessage提示用户，这里直接返回
    if (res.code !== 0) {
      console.log('注册失败！')
      return false
    }
    // 3.注册成功，提示用户
    ElMessage.success('注册成功!')
    // 4.路由跳转到登录页面
    router.push('/login')
  } else {
    return false // 阻止默认提交行为（表单下面红色提示）
  }
}
</script>

<template>
  <!-- 注册页面的整体盒子 -->
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
    <!-- 注册的盒子 -->
    <div class="reg-box">
      <!-- 标题“后台管理系统(图片)”的盒子 -->
      <div class="title-box">注 册</div>
      <!-- 注册的表单区域 -->
      <!-- el-form 自带校验能力，所以直接自定义规则就行(不用什么自定义监听之类的) -->
      <el-form :model="form" label-width="0px" :rules="rules" ref="registerRef">
        <el-form-item prop="account">
          <el-input placeholder="请输入用户名" v-model="form.account"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" placeholder="请再次确认密码" v-model="form.repassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-reg" @click="registerFn">注册</el-button>
          <el-link class="router" type="info" @click="router.push('/login')">去登录</el-link>
        </el-form-item>
      </el-form>
    </div>
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
  background-image: url('../../assets/image/reg.jpg');
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
  box-shadow: 0 0 10px 5px rgba(238, 238, 238, 0.5),
    /* 微调颜色和透明度 */
    0 0 30px 15px rgba(238, 238, 238, 0.3),
    /* 模糊半径和扩散范围 */
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

.reg-box {
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
    height: 60px;
    line-height: 60px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    color: #00aaff;
    margin-bottom: 20px;
  }

  .btn-reg {
    width: 100%; // 可以让其占满一行，不用考虑怎么变成块级然后独占一行之类的...
  }

  .router {
    text-align: left;
  }

  .el-link {
    margin-top: 20px;
  }
}
</style>
