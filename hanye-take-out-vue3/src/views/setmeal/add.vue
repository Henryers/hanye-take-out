<script lang="ts" setup>
import { reactive, ref } from 'vue'
import AddDish from './components/AddDish.vue'
import { addSetmealAPI, getSetmealByIdAPI, updateSetmealAPI } from '@/api/setmeal'
import { getCategoryPageListAPI } from '@/api/category'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

// ------ 配置 ------
const dialogVisible = ref(false)  // 添加菜品弹窗是否显示
const formLabelWidth = '70px'    // 表单label宽度
// const actionType = ref('add')  // 当前操作类型，add为新增，update为修改更新
// 直接看有没有query.id就行，有的话就是update，没有就是add

// ------ 数据 ------

interface Category {
  id: number
  name: string
}
interface SetmealDish {
  dishId: number
  name: string
  price: number
  copies: number
}
// 套餐分类(type=2)列表
const categoryList = ref<Category[]>([])
// 套餐当前选择的菜品，用于表格展示（退出dialog时的暂存状态）
const dishTable = ref<SetmealDish[]>([])
// 套餐当前选择的菜品，用于提交（在dialog中时的动态状态）
let selectList: SetmealDish[] = []
const inputValue = ref('')  // input框的实时动态变化值
const searchKey = ref('')  // 搜索关键字

const form = reactive({
  id: 0,
  name: '',
  pic: '',
  setmealDishes: [] as SetmealDish[],
  detail: '',
  price: 0,
  status: '',
  categoryId: ''
})
// 图片下的隐藏input框
const inputRef1 = ref<HTMLInputElement | null>(null)
const addRef = ref()

// 表单校验
const rules = {
  name: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  setmealDishes: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  detail: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  price: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
  categoryId: [
    { required: true, trigger: 'blur', message: '不能为空' },
  ],
}


// ------ 方法 ------

const router = useRouter()
const route = useRoute()

const init = async () => {
  // 1. 获取套餐分类，等下套餐选择分类时有个下拉框，要展示所有套餐的分类
  // 由于复用分页查询的API，这里不需要分页且数据量较少，所以pageSize设置为100
  const { data: res } = await getCategoryPageListAPI({ page: 1, pageSize: 100, type: 2 })
  console.log('分类列表')
  console.log(res.data)
  categoryList.value = res.data.records
  console.log('categoryList: ', categoryList.value)
  // 2. 由于当前页面可能是add也可能是update，所以要根据路由参数来判断是否需要dishTable等数据的初始化
  if (route.query.id !== undefined) {
    console.log('来到修改套餐页面update, 套餐id为', route.query.id as string)
    form.id = route.query.id ? parseInt(route.query.id as string) : 0
    let setmeal = await getSetmealByIdAPI(form.id)
    console.log(setmeal)
    Object.assign(form, setmeal.data.data)
    console.log(form)
    // 顺便把form里面的setmealDishes赋值给dishTable，用于回显
    dishTable.value = form.setmealDishes
  } else {
    console.log('来到新增套餐页面add')
  }
}

init()


// 选择图片->点击事件->让选择框出现
const chooseImg = () => {
  // 模拟点击input框的行为，通过点击按钮触发另一个input框的事件，移花接木
  // 否则直接调用input框，其样式不太好改    input框中有个inputRef1属性，让inputRef1去click模拟点击行为
  if (inputRef1.value) {
    inputRef1.value.click() // 当input框的type是file时，click()方法会触发选择文件的对话框(弹出文件管理器)
  }
}

// 在文件管理器中选择图片后触发的改变事件：预览
const onFileChange1 = (e: Event) => {
  // 获取用户选择的文件列表（伪数组）
  console.log(e)
  const target = e.target as HTMLInputElement
  const files = target.files;
  if (files && files.length > 0) {
    // 选择了图片
    console.log(files[0])
    // 文件 -> base64字符串  (可以发给后台)
    // 1. 创建 FileReader 对象
    const fr = new FileReader()
    // 2. 调用 readAsDataURL 函数，读取文件内容
    fr.readAsDataURL(files[0])
    // 3. 监听 fr 的 onload 事件，文件转为base64字符串成功后会触发该事件
    fr.onload = () => {
      // 4. 通过 e.target.result 获取到读取的结果，值是字符串（base64 格式的字符串）
      form.pic = fr.result as string
      console.log('avatar')
      console.log(form.pic)
    }
  }
}

// 取消修改
const cancel = () => {
  router.push({
    path: '/setmeal',
  })
}

// 点击搜索按钮，才把当前搜索框的内容作为搜索关键字，否则value一直动态变化
// 如果不用searchKey，直接用value，那么每次输入框的值变化，都会触发搜索，无法暂存中间变量
const searchHandle = () => {
  searchKey.value = inputValue.value
}
// 删除套餐菜品
const delDishHandle = (index: any) => {
  dishTable.value.splice(index, 1)
  selectList = dishTable.value
  // selectList.splice(index, 1)
}

// 获取添加菜品数据 - 确定加菜倒序展示
const getSelectList = (value: any) => {
  console.log('拿到子组件emit过来的checkedList?', value)
  selectList = [...value].reverse()
}

// 打开添加菜品对话框，初始化时清空搜索框残留数据
const openAddDish = (st: string) => {
  console.log('打开添加菜品对话框，初始化时清空搜索框残留数据')
  console.log('打开的状态st ', st)
  console.log('动态的selectList ', selectList)
  console.log('动态的dishTable ', dishTable.value)
  searchKey.value = ''
  // 同时要将外面的dishTable回显到dialog中，即将dishTable赋值给selectList
  selectList = JSON.parse(JSON.stringify(dishTable.value))
  dialogVisible.value = true
}
// 取消添加菜品，退出对话框，selectList还是保留原来外面的dishTable数据
const handleClose = () => {
  dialogVisible.value = false
  // 利用序列化和反序列化，实现对象的深拷贝，而不是只传个引用而已
  selectList = JSON.parse(JSON.stringify(dishTable.value))
}
// 确认添加菜品，退出对话框，将选中的菜品列表selectList赋值给dishTable
const addTableList = () => {
  console.log('添加菜品之前，到底有没有selectList？', selectList)
  dishTable.value = JSON.parse(JSON.stringify(selectList))
  // 添加菜品，刚开始所有份数都默认为一份，且只能最后在外部table修改，dialog中退出后，之前设置的分数会都重置为1
  dishTable.value.forEach((n: any) => {
    n.copies = 1
  })
  dialogVisible.value = false
  console.log('dishTable', dishTable.value)
}

// 添加套餐信息后提交
const submit = async (keep: any) => {
  console.log('keep,为空就是新增', keep)
  console.log('add提交表单，需要先将dishTable赋值给form.setmealDishes')
  console.log('dishTable', dishTable.value)
  console.log('selectList', selectList)
  console.log('form', form)
  console.log('开始进行赋值')
  form.setmealDishes = dishTable.value.map((obj: any) => ({
    copies: obj.copies,
    dishId: obj.dishId,
    name: obj.name,
    price: obj.price
  }))
  console.log('赋值后的form.setmealDishes', form.setmealDishes)
  console.log('form', form)
  const valid = await addRef.value.validate()
  if (valid) {
    // 输入合法性校验成功后，需要进行逻辑校验
    // 1. 套餐下菜品不能为空
    if (form.setmealDishes.length === 0) {
      ElMessage({
        message: '套餐下菜品不能为空',
        type: 'warning',
      })
      return false
    }
    console.log('submit')
    console.log(form)
    // --- 处理完毕，开始提交 ---
    // 情况1：无路径参数，form.id保持默认值0，新增套餐
    if (form.id === 0) {
      console.log('新增套餐')
      const res = await addSetmealAPI(form)
      if (res.data.code !== 0) {
        console.log('新增套餐失败！')
        return false
      }
      // 然后进行 消息提示
      ElMessage({
        message: '新增套餐成功',
        type: 'success',
      })
      // 根据keep的值，决定是 保存退出 还是 继续添加
      if (keep) {
        // 继续添加，清空表单
        form.id = 0
        form.name = ''
        form.pic = ''
        form.setmealDishes = []
        form.detail = ''
        form.price = 0
        form.status = ''
        form.categoryId = ''
        // 清空表格
        dishTable.value = []
      } else {
        // 保存退出
        router.push({
          path: '/setmeal',
        })
      }
    }
    // 情况2：有路径参数，修改套餐
    else {
      console.log('修改套餐')
      const res = await updateSetmealAPI(form)
      if (res.data.code !== 0) {
        console.log('修改套餐失败！')
        return false
      }
      ElMessage({
        message: '修改套餐成功',
        type: 'success',
      })
      router.push({
        path: '/setmeal',
      })
    }
  } else {
    console.log('form not valid!')
    return false
  }
}
</script>

<template>
  <h1>添加套餐页</h1>
  <el-card>
    <el-dialog v-if="dialogVisible" title="添加菜品" class="addDishList" v-model="dialogVisible" width="60%"
      :before-close="handleClose">
      <el-input v-model="inputValue" class="searchDish" placeholder="请输入菜品名称进行搜索" style="width: 293px; height: 40px"
        size="small" clearable>
        <template #prefix>
          <el-icon class="el-icon-search" style="cursor: pointer" @click="searchHandle">
            <search />
          </el-icon>
        </template>
      </el-input>
      <AddDish v-if="dialogVisible" ref="adddish" :check-list="selectList" :search-key="searchKey"
        @selectList="getSelectList" />
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="addTableList">添 加</el-button>
        </span>
      </template>
    </el-dialog>

    <el-form :model="form" :rules="rules" ref="addRef">
      <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="图片" :label-width="formLabelWidth" prop="pic">
        <img class="the_img" v-if="!form.pic" src="/src/assets/image/user_default.png" alt="" />
        <img class="the_img" v-else :src="form.pic" alt="" />
        <input type="file" accept="image/*" style="display: none" ref="inputRef1" @change="onFileChange1" />
        <el-button type="primary" @click="chooseImg">
          <el-icon style="font-size: 15px; margin-right: 10px;">
            <Plus />
          </el-icon>
          选择图片
        </el-button>
      </el-form-item>
      <el-form-item label="菜品选择:">
        <div class="addDish">
          <!-- 当前没选菜品，就只展示添加菜品按钮，否则在下方要多一个已选菜品的表格 -->
          <span v-if="dishTable.length == 0" class="addBut" @click="openAddDish('new')">
            + 添加菜品</span>
          <div v-if="dishTable.length != 0" class="content">
            <div class="addBut" style="margin-bottom: 20px" @click="openAddDish('change')">
              + 添加菜品
            </div>
            <div class="table">
              <el-table :data="dishTable" style="width: 100%">
                <el-table-column prop="name" label="名称" width="180" align="center" />
                <el-table-column prop="price" label="原价" width="180" align="center">
                  <template v-slot="scope">
                    {{ ((scope.row.price).toFixed(2) * 100) / 100 }}
                  </template>
                </el-table-column>
                <el-table-column prop="copies" label="份数" align="center">
                  <template v-slot="scope">
                    <el-input-number v-model="scope.row.copies" size="small" :min="1" :max="99" label="描述文字" />
                  </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="180px;" align="center">
                  <template v-slot="scope">
                    <el-button link type="danger" size="small" class="delBut non" @click="delDishHandle(scope.$index)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="详情" :label-width="formLabelWidth" prop="detail">
        <el-input v-model="form.detail" autocomplete="off" type="textarea" />
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth" prop="price">
        <el-input v-model="form.price" autocomplete="off" />
      </el-form-item>
      <el-form-item label="分类" :label-width="formLabelWidth" prop="categoryId">
        <el-select clearable v-model="form.categoryId" placeholder="选择分类类型">
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form-item class="btn_box">
      <el-button class="submit_btn" type="success" @click="submit(0)">保存并退出</el-button>
      <el-button v-if="form.id == 0" class="continue_btn" type="success" plain @click="submit(1)">保存并继续添加</el-button>
      <el-button class="cancel_btn" type="info" plain @click="cancel">取消</el-button>
    </el-form-item>
  </el-card>
</template>

<style scoped lang="less">
h1 {
  font-size: 20px;
  text-align: center;
  margin: 20px;
}

.el-form {
  margin-top: 30px;
  width: 800px;
  margin: 0 auto;
}

img {
  width: 110px;
  height: 100px;
  margin-right: 20px
}

.btn_box {
  display: flex;

  .submit_btn {
    width: 100px;
    height: 40px;
    margin: 30px 0 0 250px;
  }

  .continue_btn {
    width: 120px;
    height: 40px;
    margin: 30px 0 0 50px;
  }

  .cancel_btn {
    width: 100px;
    height: 40px;
    margin: 30px 0 0 300px;
  }
}

.addDish {
  width: 800px;

  .addBut {
    background: #409eff;
    display: inline-block;
    padding: 0px 20px;
    border-radius: 3px;
    line-height: 40px;
    cursor: pointer;
    border-radius: 4px;
    color: #ffffff;
    font-weight: 500;
  }

  .content {
    background: #fafafb;
    padding: 20px;
    border: solid 1px #d8dde3;
    border-radius: 3px;
  }
}
</style>

<!-- el-dialog的样式修改不能用scoped包起来，要全局，类似其他element组件 -->
<style lang="less">
.addDishList {
  .searchDish {
    position: absolute;
    top: 12px;
    right: 20px;
  }

  .el-dialog__header {
    display: flex;
    padding: 10px 20px 30px 40px;
  }

  .el-dialog__footer {
    padding-top: 27px;
  }

  .el-dialog__body {
    padding: 0;
    border-bottom: solid 1px #efefef;
  }

  .searchDish {
    .el-input__inner {
      height: 40px;
      line-height: 40px;
    }
  }
}
</style>
