<script setup lang="ts">

import { reactive, ref } from 'vue'
import { getEmployeePageListAPI, updateEmployeeStatusAPI, deleteEmployeeAPI } from '@/api/employee'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/store'

// ------ .d.ts 属性类型接口 ------
interface employee {
  id: number
  name: string
  account: string
  phone: string
  age: number
  gender: string
  pic: string
  status: string
  updateTime: string
}

// ------ 数据 ------
let userInfoStore = useUserInfoStore()
// 当前页的员工列表
const employeeList = ref<employee[]>([])
// 带查询的分页参数
const pageData = reactive({
  name: '',
  page: 1,
  pageSize: 6,
  total: 0
})


// ------ 方法 ------

// 页面初始化，就根据token去获取用户信息，才能实现如果没有token/token过期，刚开始就能够跳转到登录页
const init = async () => {
  // 参数解构再传进去，因为不用传total
  const { data: res } = await getEmployeePageListAPI({ page: pageData.page, pageSize: pageData.pageSize, name: pageData.name })
  console.log(res)
  console.log('员工列表')
  console.log(res.data)
  employeeList.value = res.data.records
  pageData.total = res.data.total
}

init()  // 页面初始化，写在这里时的生命周期是beforecreated/created的时候

// 监听翻页和每页显示数量的变化
const handleCurrentChange = (val: number) => {
  pageData.page = val
  init()
}

const handleSizeChange = (val: number) => {
  pageData.pageSize = val
  init()
}

// 修改员工(路径传参，到update页面后，根据id查询员工信息，回显到表单中)
const router = useRouter()
const update_btn = (row: any) => {
  console.log('要修改的行数据')
  console.log(row)
  router.push({
    name: 'employee_update',
    query: {
      id: row.id
    }
  })
}

// 修改员工状态
const change_btn = async (row: any) => {
  console.log('要修改的行数据')
  console.log(row)
  // const status = row.status === 1 ? 0 : 1
  await updateEmployeeStatusAPI(row.id)
  // 修改后刷新页面，更新数据
  init()
  ElMessage({
    type: 'success',
    message: '修改成功',
  })
}

// 删除员工
const delete_btn = (row: any) => {
  console.log('要删除的行数据')
  console.log(row)
  ElMessageBox.confirm(
    '该操作会永久删除员工，是否继续？',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
      console.log('要删除的行数据')
      console.log(row)
      await deleteEmployeeAPI(row.id)
      // 删除后刷新页面，更新数据
      init()
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}
</script>

<template>
  <el-card>
    <div class="horizontal">
      <el-input size="large" class="input" v-model="pageData.name" placeholder="请输入想查询的员工名" />
      <el-button size="large" class="btn" round type="success" @click="init()">查询员工</el-button>
      <el-button size="large" class="btn" type="primary" @click="router.push('/employee/add')">
        <el-icon style="font-size: 15px; margin-right: 10px;">
          <Plus />
        </el-icon>添加员工
      </el-button>
    </div>
    <el-table :data="employeeList" stripe>
      <!-- <el-table-column prop="id" label="id" /> -->
      <el-table-column prop="name" label="姓名" align="center" />
      <el-table-column prop="account" label="账号" align="center" />
      <el-table-column prop="phone" label="手机号" width="120px" align="center" />
      <el-table-column prop="age" label="年龄" align="center" />
      <el-table-column prop="gender" label="性别" align="center" />
      <el-table-column prop="pic" label="头像" align="center">
        <template #default="scope">
          <img v-if="scope.row.pic" :src="scope.row.pic" alt="" />
          <img v-else src="/src/assets/image/user_default.png" alt="" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" round>
            {{ scope.row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="上次操作时间" width="120px" align="center" />
      <el-table-column label="操作" width="200px" align="center">
        <!-- scope 的父组件是 el-table -->
        <template #default="scope">
          <!-- <el-button @click="update_btn(scope.row)" type="primary">修改</el-button> -->
          <el-button @click="update_btn(scope.row)" type="primary" :disabled="userInfoStore.userInfo?.account !== 'cyh'
            && userInfoStore.userInfo?.account !== scope.row.account ? true : false">修改
          </el-button>
          <el-button @click="change_btn(scope.row)" plain :type="scope.row.status === 1 ? 'danger' : 'primary'"
            :disabled="userInfoStore.userInfo?.account !== 'cyh' ? true : false">
            {{ scope.row.status === 1 ? '禁用' : '启用' }}
          </el-button>
          <el-button @click="delete_btn(scope.row)" type="danger"
            :disabled="userInfoStore.userInfo?.account !== 'cyh' ? true : false">删除
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description=" 没有数据" />
      </template>
    </el-table>

    <!-- element ui 官方推荐使用 v-model 双向绑定 而不是使用事件监听 -->
    <!-- 但是为了监听后还要调用相关函数，看来只能用事件了... -->
    <!-- 有没有办法让v-model的值发生改变时自动触发更新函数？ -->
    <el-pagination class="page" background layout="total, sizes, prev, pager, next, jumper" :total="pageData.total"
      :page-sizes="[2, 4, 6, 8]" v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
      @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </el-card>
</template>


<style lang="less" scoped>
// element-plus的样式修改
.el-table {
  width: 90%;
  height: 500px;
  margin: 3rem auto;
  text-align: center;
  border: 1px solid #e4e4e4;
}

:deep(.el-table tr) {
  font-size: 12px;
}

.el-button {
  width: 45px;
  font-size: 12px;
}

.el-pagination {
  justify-content: center;
}

// 自定义样式
body {
  background-color: #c91c1c;
}

.horizontal {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 80px;

  .input {
    width: 240px;
  }

  .btn {
    width: 120px;
  }
}

img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
}
</style>