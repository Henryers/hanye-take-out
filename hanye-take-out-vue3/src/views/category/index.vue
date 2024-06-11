<script setup lang="ts">

import { reactive, ref } from 'vue'
import { getCategoryPageListAPI, updateCategoryStatusAPI, deleteCategoryAPI } from '@/api/category'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

// ------ .d.ts 属性类型接口 ------
interface category {
  id: number
  name: string
  type: string
  sort: string
  status: string
  updateTime: string
}

// ------ 数据 ------

// 当前页的分类列表
const categoryList = ref<category[]>([])
// 带查询条件的分页参数
const pageData = reactive({
  name: '',
  type: '',
  page: 1,
  pageSize: 6,
  total: 0
})
const options = [
  {
    value: '1',
    label: '菜品分类',
  },
  {
    value: '2',
    label: '套餐分类',
  }
]


// ------ 方法 ------

// 页面初始化，就根据token去获取用户信息，才能实现如果没有token/token过期，刚开始就能够跳转到登录页
const init = async () => {
  // 参数解构再传进去，不用传total
  const { data: res } = await getCategoryPageListAPI
    ({ name: pageData.name, type: pageData.type, page: pageData.page, pageSize: pageData.pageSize })
  console.log(res)
  console.log('分类列表')
  console.log(res.data)
  categoryList.value = res.data.records
  pageData.total = res.data.total
}

init()  // 页面初始化/分页查询，写在这里时的生命周期是beforecreated/created的时候

// 监听翻页和每页显示数量的变化
const handleCurrentChange = (val: number) => {
  pageData.page = val
  // 条件分页查询
  init()
}

const handleSizeChange = (val: number) => {
  pageData.pageSize = val
  // 条件分页查询
  init()
}

// 修改分类(路径传参，到update页面后，根据id查询分类信息，回显到表单中)
const router = useRouter()
const update_btn = (row: any) => {
  console.log('要修改的行数据')
  console.log(row)
  router.push({
    name: 'category_update',
    query: {
      id: row.id
    }
  })
}

// 修改分类状态
const change_btn = async (row: any) => {
  console.log('要修改的行数据')
  console.log(row)
  await updateCategoryStatusAPI(row.id)
  // 修改后刷新页面，更新数据
  init()
  ElMessage({
    type: 'success',
    message: '修改成功',
  })
}

// 删除分类
const delete_btn = (row: any) => {
  console.log('要删除的行数据')
  console.log(row)
  ElMessageBox.confirm(
    '该操作会永久删除分类，是否继续？',
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
      await deleteCategoryAPI(row.id)
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
      <el-input size="large" class="input" v-model="pageData.name" placeholder="请输入分类名" />
      <el-select size="large" class="input" clearable v-model="pageData.type" placeholder="选择分类类型">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button size="large" class="btn" round type="success" @click="init()">查询分类</el-button>
      <el-button size="large" class="btn" type="primary" @click="router.push('/category/add')">
        <el-icon style="font-size: 15px; margin-right: 10px;">
          <Plus />
        </el-icon>添加分类
      </el-button>
    </div>
    <el-table :data="categoryList" stripe>
      <!-- <el-table-column prop="id" label="id" /> -->
      <el-table-column prop="name" label="分类名" align="center" />
      <el-table-column prop="type" label="类别" align="center">
        <template #default="scope">
          <span>{{ scope.row.type === 1 ? '菜品分类' : '套餐分类' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" round>
            {{ scope.row.status === 1 ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="上次操作时间" width="250px" style="font-size: 10px;" align="center" />
      <el-table-column label="操作" width="250px" align="center">
        <!-- scope 的父组件是 el-table -->
        <template #default="scope">
          <!-- <el-button class="play_btn" @click="playSong(scope.row.audio)">Play</el-button> -->
          <el-button @click="update_btn(scope.row)" type="primary">修改</el-button>
          <el-button @click="change_btn(scope.row)" plain :type="scope.row.status === 1 ? 'danger' : 'primary'">
            {{ scope.row.status === 1 ? '停售' : '起售' }}</el-button>
          <el-button @click="delete_btn(scope.row)" type="danger">删除</el-button>
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
.horizontal {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0 80px;

  .input {
    width: 200px;
  }

  .btn {
    width: 150px;
  }
}

img {
  width: 50px;
  height: 50px;
  border-radius: 10px;
}

.add_btn {
  width: 100px;
  height: 40px;
  margin-left: 900px;
}
</style>