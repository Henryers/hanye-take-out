<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { getCategoryByIdAPI, updateCategoryAPI } from '@/api/category'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

// ------ 数据 ------
const formLabelWidth = '60px'
const id = ref()
const form = reactive({
  id: 0,
  name: '',
  type: '',
  sort: '',
})
const updateRef = ref()

// 表单校验
const rules = {
  name: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  type: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  sort: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
}


// ------ 方法 ------

const router = useRouter()
const route = useRoute()

// 修改分类信息后提交（只有管理员才能对其他分类进行修改，否则普通分类只能对自己进行修改）
const submit = async () => {
  try {
    const valid = await updateRef.value.validate();
    if (valid) {
      console.log('submit')
      console.log(form)
      // 在这里执行表单提交操作，比如调用updateUser(form)方法等
      const res = await updateCategoryAPI(form)
      if (res.data.code !== 0) {
        // 响应拦截器已经用ElMessage打印了错误信息，这里直接return
        return false
      }
      // 然后进行 消息提示，页面跳转 等操作
      ElMessage({
        message: '修改分类信息成功',
        type: 'success',
      })
      router.push({
        path: '/category',
      })
    } else {
      console.log('form not valid!');
      return false;
    }
  } catch (error) {
    console.error('执行过程中失败:', error);
  }
}
// 取消修改
const cancel = () => {
  router.push({
    path: '/category',
  })
}

const init = async () => {
  console.log(route.query)
  if (route.query) {
    id.value = route.query.id || 0
    form.id = id.value
    let category = await getCategoryByIdAPI(id.value)
    console.log(category)
    Object.assign(form, category.data.data)
    console.log(form)
  } else {
    console.log('没有id')
  }
  console.log(id)
}

init()
</script>

<template>
  <h1>修改分类页</h1>
  <el-card>
    <el-form :model="form" :rules="rules" ref="updateRef">
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="类别" :label-width="formLabelWidth" prop="type">
        <el-input v-model="form.type" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="sort">
        <el-input v-model="form.sort" autocomplete="off" />
      </el-form-item>
    </el-form>
    <el-form-item>
      <el-button class="submit_btn" type="success" @click="submit">update</el-button>
      <el-button class="cancel_btn" type="info" plain @click="cancel">cancel</el-button>
    </el-form-item>
  </el-card>
</template>

<style scoped>
h1 {
  font-size: 20px;
  text-align: center;
  margin: 20px;
}

.el-form {
  margin-top: 30px;
  width: 500px;
  margin: 0 auto;
}

img {
  width: 60px;
  height: 50px;
  margin-right: 20px
}

.submit_btn {
  width: 100px;
  height: 40px;
  margin: 30px 0 0 400px;
}

.cancel_btn {
  width: 100px;
  height: 40px;
  margin: 30px 0 0 200px;
}
</style>
