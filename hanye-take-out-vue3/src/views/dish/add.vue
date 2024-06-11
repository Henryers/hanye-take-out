<script lang="ts" setup>
import { reactive, ref, watch } from 'vue'
import SelectInput from './components/SelectInput.vue'
import { addDishAPI, getDishByIdAPI, updateDishAPI } from '@/api/dish'
import { getCategoryPageListAPI } from '@/api/category'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

// ------ 数据 ------
// 固定死数据，应该不用响应式吧？
const dishFlavorsData = [
  { name: '口味', list: ['原味', '番茄', '黑椒', '沙拉', '麻辣'] },
  { name: '甜味', list: ['无糖', '少糖', '半糖', '多糖', '全糖'] },
  { name: '温度', list: ['热饮', '常温', '去冰', '少冰', '多冰'] },
  { name: '忌口', list: ['不要葱', '不要蒜', '不要香菜', '不要辣'] },
  { name: '辣度', list: ['不辣', '微辣', '中辣', '重辣'] }
]

interface Category {
  id: number
  name: string
}

interface DishFlavor {
  name: string
  list: any[]
}
interface LeftDishFlavors {
  name: string
  list: any[]
}
// 菜品id对应的分类列表，即categoryId字段不能只展示id值，应该根据id查询到对应的分类名进行回显
const categoryList = ref<Category[]>([])
const leftDishFlavors = ref<LeftDishFlavors[]>([])
const formLabelWidth = '70px'

const form = reactive({
  id: 0,
  name: '',
  pic: '',
  dishFlavors: [] as DishFlavor[],
  detail: '',
  price: '',
  status: '',
  categoryId: ''
})
const count = ref(0)
// 图片下的隐藏input框
const inputRef1 = ref<HTMLInputElement | null>(null)
const addRef = ref()

// 表单校验
const rules = {
  name: [
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

// 按钮 - 添加口味
const addFlavor = () => {
  console.log('addFlavor')
  console.log('form.dishFlavors.length  ', form.dishFlavors.length)
  console.log('leftDishFlavors.value.length  ', leftDishFlavors.value.length)
  console.log('dishFlavorsData.length  ', dishFlavorsData.length)
  form.dishFlavors.push({ name: '', list: [] }) // JSON.parse(JSON.stringify(form.dishFlavorsData))
  console.log('添加数据倒是改变watch啊！', form.dishFlavors)
  // getLeftDishFlavors()
  count.value++
}
const change = () => {
  console.log('watch 函数监听 count 变化，执行相应change回调 - getLeftDishFlavor')
}
watch(count, change)


// 按钮 - 删除口味
const delFlavor = (name: string) => {
  let ind = form.dishFlavors.findIndex(item => item.name === name)
  form.dishFlavors.splice(ind, 1)
  console.log('删除了', form.dishFlavors)
}

// 按钮 - 删除口味标签
const delFlavorLabel = (index: number, ind: number) => {
  console.log('delete ind', ind)
  // 打印 form.dishFlavors[index] 的类型
  console.log(typeof form.dishFlavors[index])
  console.log(form.dishFlavors[index].list)
  form.dishFlavors[index].list.splice(ind, 1)
}

// 过滤已选择的口味下拉框无法再次选择
const getLeftDishFlavors = () => {
  let arr: any = []
  dishFlavorsData.map(item => {
    // 遍历dishFlavors，如果其中所有item1都没有一个和item相等，那么会返回-1，符合未选的条件，push到arr中
    if (form.dishFlavors.findIndex(item1 => item.name === item1.name) === -1) {
      arr.push(item)
    }
  })
  console.log('getLeftDishFlavors', arr)
  leftDishFlavors.value = arr
}
const changeDishFlavors = () => {
  console.log('watch 函数监听 dishFlavors 变化，执行相应change回调 - getLeftDishFlavor')
  getLeftDishFlavors()
}
// 使用 watch 函数监听 dishFlavors 属性的变化，变化就执行相应change回调，动态更新leftDishFlavors
watch(() => form.dishFlavors, changeDishFlavors, { deep: true })

// 根据左侧选中的口味属性值，更新右侧框的口味数组元素
// val: item.name,   key: 左侧框中的口味索引,   ind: 对应在dishFlavorsData中的口味索引
const selectHandle = (val: any, key: any, ind: any) => {
  console.log('根据左侧选中的口味属性值，更新右侧框的口味数组元素: selectHandle', val, key, ind)
  const arrDate = [...form.dishFlavors]
  console.log('arrDate', arrDate)
  const index = dishFlavorsData.findIndex(item => item.name === val)
  arrDate[key] = JSON.parse(JSON.stringify(dishFlavorsData[index]))
  form.dishFlavors = arrDate
}

// 添加菜品信息后提交
const submit = async (keep: any) => {
  const valid = await addRef.value.validate();
  if (valid) {
    let params: any = { ...form }
    console.log('看看有没有拷贝成功？', params)
    // 需要先对口味数组进行json.stringfy序列化
    params.flavors = form.dishFlavors.map(obj => ({
      ...obj,
      list: JSON.stringify(obj.list)
    }))
    delete params.dishFlavors
    console.log('看看有没有serialize成功？', params)
    // --- 处理完毕，开始提交 ---
    // 情况1：无路径参数，form.id保持默认值0，新增菜品
    if (form.id === 0) {
      console.log('新增菜品')
      const res = await addDishAPI(params)
      if (res.data.code !== 0) {
        console.log('新增菜品失败！')
        return false
      }
      ElMessage({
        message: '新增菜品成功',
        type: 'success',
      })
      // 根据keep决定是否继续添加
      if (keep) {
        form.id = 0
        form.name = ''
        form.pic = ''
        form.dishFlavors = []
        form.detail = ''
        form.price = ''
        form.status = ''
        form.categoryId = ''
        getLeftDishFlavors()
      } else {
        router.push({
          path: '/dish',
        })
      }
    }
    // 情况2：有路径参数，修改菜品
    else {
      console.log('修改菜品')
      const res = await updateDishAPI(params)
      if (res.data.code !== 0) {
        console.log('修改菜品失败！')
        return false
      }
      ElMessage({
        message: '修改菜品成功',
        type: 'success',
      })
      router.push({
        path: '/dish',
      })
    }

  } else {
    console.log('form not valid!');
    return false;
  }
}
// 取消修改
const cancel = () => {
  router.push({
    path: '/dish',
  })
}

const init = async () => {
  // 1. 获取菜品分类，等下菜品选择分类时有个下拉框，要展示所有菜品的分类
  // 由于复用分页查询的API，这里不需要分页且数据量较少，所以pageSize设置为100
  const { data: res } = await getCategoryPageListAPI({ page: 1, pageSize: 100, type: 1 })
  console.log('分类列表')
  console.log(res.data)
  categoryList.value = res.data.records
  console.log('categoryList: ', categoryList.value)
  // 2. 由于当前页面可能是add也可能是update，所以要根据路由参数来判断是否需要getDishById
  if (route.query.id !== undefined) {
    console.log('修改菜品页')
    form.id = route.query.id ? parseInt(route.query.id as string) : 0
    let dish = await getDishByIdAPI(form.id)
    console.log(dish)
    Object.assign(form, dish.data.data)
    console.log(form)
    // 3. 如果是修改页面，需要将口味数组中的list字符串反序列化
    form.dishFlavors =
      dish.data.data.flavors &&
      dish.data.data.flavors.map((obj: any) => ({
        ...obj,
        list: JSON.parse(obj.list)
      }))
    // 4. 初始化左侧未选中的口味数组
    getLeftDishFlavors()
  } else {
    console.log('新增菜品页', form.id)
  }
}

init()
</script>

<template>
  <h1>添加菜品页</h1>
  <el-card>
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
      <el-form-item label="口味配置:">
        <div class="flavorBox">
          <span v-if="form.dishFlavors.length == 0" class="addBut" @click="addFlavor"> + 添加口味</span>
          <div v-if="form.dishFlavors.length != 0" class="flavor">
            <div class="title">
              <span>口味名（3个字内）</span>
            </div>
            <div class="cont">
              <div v-for="(item, index) in form.dishFlavors" :key="index" class="items">
                <div class="itTit">
                  <SelectInput :dish-flavors-data="leftDishFlavors" :index="index" :value="item.name"
                    @select="selectHandle" />
                </div>
                <div class="labItems" style="display: flex">
                  <span v-for="(it, ind) in item.list" :key="ind">{{ it }}
                    <i @click="delFlavorLabel(index, ind)">X</i></span>
                  <div class="inputBox"></div>
                </div>
                <span class="delFlavor delBut non" @click="delFlavor(item.name)">删除</span>
              </div>
            </div>
            <div v-if="!!leftDishFlavors.length && form.dishFlavors.length < dishFlavorsData.length" class="addBut"
              @click="addFlavor">
              添加口味
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
    <el-form-item>
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

.flavorBox {
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

  .flavor {
    border: solid 1px #dfe2e8;
    border-radius: 3px;
    padding: 15px;
    background: #fafafb;

    .title {
      color: #606168;

      .des-box {
        padding-left: 44px;
      }
    }

    .cont {
      .items {
        display: flex;
        margin: 10px 0;

        .itTit {
          width: 150px;
          margin-right: 15px;

          input {
            width: 100%;
          }
        }

        .labItems {
          flex: 1;
          display: flex;
          flex-wrap: wrap;
          border-radius: 3px;
          min-height: 39px;
          border: solid 1px #d8dde3;
          background: #fff;
          padding: 0 5px;

          span {
            display: inline-block;
            color: #ffc200;
            margin: 5px;
            line-height: 26px;
            padding: 0 10px;
            background: #fffbf0;
            border: 1px solid #fbe396;
            border-radius: 4px;
            font-size: 12px;

            i {
              cursor: pointer;
              font-style: normal;
            }
          }

          .inputBox {
            display: inline-block;
            flex: 1;
            width: 100%;
            height: 36px;
            line-height: 36px;
            overflow: hidden;
          }
        }

        .delFlavor {
          display: inline-block;
          padding: 0 10px;
          color: #f19c59;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
