<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getCategoryPageListAPI } from '@/api/category'
import { getDishPageListAPI } from '@/api/dish'
import Empty from '@/components/Empty.vue'

// ------ .d.ts 属性类型接口 ------
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
interface checkDish {
  name: string
  price: number
  status: number
}

// ------ 数据 ------
// 左侧菜品分类
const dishCategoryList = ref<Category[]>([])
// 中间栏显示左侧选择的菜品分类下对应的所有菜品dishList
const dishList = ref<checkDish[]>([])
// 所有菜品列表，包括详细信息
const allDishList = ref<SetmealDish[]>([])
const keyInd = ref(0)
// 已选所有菜品的名称列表(正序操作)
const checkedList = ref<string[]>([])
// 已选所有菜品的详情列表(倒序展示)
const checkedListAll = ref<SetmealDish[]>([])
// 菜品分类的categoryId集合
const ids = new Set()

const props = defineProps({
  checkList: {
    type: Array as() => SetmealDish[],
    default: () => [],
  },
  searchKey: {
    type: String,
    default: '',
  },
})

// ------ 方法 ------
const init = () => {
  // 拿到所有菜品列表，包括详细信息
  getAllDishList()
  // 拿到左侧分类
  getdishCategoryList()
  // 将外部selectedList赋值给checkedList、checkedListAll，进行初始化
  checkedList.value = props.checkList.map((it) => it.name)
  checkedListAll.value = props.checkList.slice().reverse()
}

onMounted(() => {
  init()
})

// 监视搜索框，一变化就根据新的值模糊查询菜品
// searchKey 是父组件的搜索值，因此使用箭头函数表示指向父级的this
watch(() => props.searchKey, (value) => {
  console.log('子组件adddish watch监视到 搜索框输入的值发生变化，新值为： ', value)
  if (value.trim()) {
    getDishForName(value)
  }
})

// 拿到所有菜品列表，包括详细信息
const getAllDishList = async () => {
  const { data: res } = await getDishPageListAPI({ page: 1, pageSize: 100, type: 1})
  allDishList.value = res.data.records
}

// 拿到左侧菜品分类
const getdishCategoryList = async () => {
  const { data: res } = await getCategoryPageListAPI({ page: 1, pageSize: 100, type: 1 })
  dishCategoryList.value = res.data.records
  // 默认选中第一个分类，组件中间部分展示左侧第一个"菜品分类"下的菜品
  getDishList(res.data.records[0].id)
}

// 拿到当前左侧选择菜品分类下的菜品列表dishList，显示在中间栏
const getDishList = async (id: number) => {
  const { data: res } = await getDishPageListAPI({ page: 1, pageSize: 100, categoryId: id })
  if (res.data.records.length == 0) {
    dishList.value = []
    return
  }
  let newArr = res.data.records
  newArr.forEach((n: any) => {
    n.dishId = n.id
    n.copies = 1
  })
  dishList.value = newArr
  ids.add(id)
  console.log('allDishList', allDishList.value)
  console.log('dishList', dishList.value)
  console.log('ids', ids)
}

// 根据搜索框的关键词name，模糊查询菜品
const getDishForName = async (name: string) => {
  const { data: res } = await getDishPageListAPI({ page: 1, pageSize: 100, name })
  let newArr = res.data.records
  // 加个dishId名，和后端名称对应！
  newArr.forEach((n: any) => {
    n.dishId = n.id
  })
  dishList.value = newArr
}

// 点击左侧菜品分类，拿到对应分类下的菜品列表，显示在中间栏
const checkTypeHandle = (ind: number, id: number) => {
  // ind 是当前点击的菜品分类的索引，id 是当前点击的菜品分类的categoryId
  console.log('点击了左侧菜品分类，看看点了啥', ind, id)
  keyInd.value = ind
  // 先清空（不然还保留上一个页面的数据），再去拿到当前点击的菜品分类下的菜品列表dishList
  // 清空写在getDishList里
  getDishList(id)
  console.log('看看dishList', dishList.value)
  console.log('如果是空，长度应该是0', dishList.value.length)
}

// 使用setup语法糖的话要先引入defineEmits来定义
const emit = defineEmits(["selectList"])
// 点击菜品复选框checkbox，将选中的菜品添加到右侧已选菜品列表/从右边已选菜品列表中删除
const checkedListHandle = (value: [string]) => {
  console.log('点击了checkbox，看看点了啥', value)
  checkedListAll.value.reverse()
  const list = allDishList.value.filter((item) => {
    let data
    value.forEach((it) => {
      if (item.name == it) {
        data = item
      }
    })
    return data
  })
  // concat 组成新的checkedListAll，然后再去重
  const dishListCat = [...checkedListAll.value, ...list]
  let arrData: any = []
  // 去重: 遍历每个菜品item，有就返回allArrData，没有就返回undefined
  // 遍历过程中arrData收集记录所有菜品名，用于每次遍历判断来避免重复加入
  checkedListAll.value = dishListCat.filter((item) => {
    let allArrData
    if (arrData.length == 0) {
      arrData.push(item.name)
      allArrData = item
    } else {
      const st = arrData.some((it: any) => item.name == it)
      if (!st) {
        arrData.push(item.name)
        allArrData = item
      }
    }
    return allArrData
  })
  if (value.length < arrData.length) {
    checkedListAll.value = checkedListAll.value.filter((item) => {
      if (value.some((it) => it == item.name)) {
        return item
      }
    })
  }
  // 加个dishId名，和后端名称对应
  checkedListAll.value.forEach((n: any) => {
    n.dishId = n.id
  })
  // 让父组件知道已选菜品的变化
  emit('selectList', checkedListAll.value)
  checkedListAll.value.reverse()
  console.log('看看点checkbox后的checkedListAll ', checkedListAll.value)
}

// 点击右边栏的删除小按钮，删除已选菜品列表中的某个菜品
const delCheck = (name: any) => {
  console.log('点击了删除按钮，看看点了啥', name)
  const index = checkedList.value.findIndex((it) => it === name)
  const indexAll = checkedListAll.value.findIndex((it) => it.name === name)
  checkedList.value.splice(index, 1)
  checkedListAll.value.splice(indexAll, 1)
  emit('selectList', checkedListAll.value)
}
</script>

<template>
  <div class="addDish">
    <div class="leftCont">
      <!-- 搜索菜品时不展示左侧分类 -->
      <div v-show="searchKey.trim() == ''" class="tabBut">
        <span v-for="(item, index) in dishCategoryList" :key="index" :class="{ act: index == keyInd }"
          @click="checkTypeHandle(index, item.id)">{{ item.name }}</span>
      </div>
      <!-- 中间栏显示左侧选择的菜品分类下对应的dishList -->
      <div class="tabList">
        <div class="table" :class="{ borderNone: !dishList.length }">
          <div v-if="dishList.length == 0" style="padding-left: 10px">
            <Empty />
          </div>
          <el-checkbox-group v-if="dishList.length > 0" v-model="checkedList" @change="checkedListHandle">
            <div v-for="(item, index) in dishList" :key="item.name" class="items">
              <el-checkbox :key="index" :value="item.name">
                <div class="item">
                  <span style="flex: 3; text-align: left">{{ item.name }}</span>
                  <span>{{ item.status == 0 ? '停售' : '在售' }}</span>
                  <span>{{ (Number(item.price)).toFixed(2) }}</span>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="ritCont">
      <div class="tit">
        已选菜品({{ checkedListAll.length }})
      </div>
      <div class="items">
        <div v-for="(item, ind) in checkedListAll" :key="ind" class="item">
          <span>{{ item.name }}</span>
          <span class="price">￥ {{ (Number(item.price)).toFixed(2) }} </span>
          <span class="del" @click="delCheck(item.name)">
            <img src="../../../assets/image/btn_clean@2x.png" alt="">
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.addDish {
  padding: 0 20px;
  display: flex;
  line-height: 40px;

  .empty-box {
    img {
      width: 190px;
      height: 147px;
    }
  }

  .borderNone {
    border: none !important;
  }

  span,
  .tit {
    color: #333;
  }

  .leftCont {
    display: flex;
    border-right: solid 1px #efefef;
    width: 65%;
    padding: 15px;

    .tabBut {
      width: 110px;
      font-weight: bold;
      border-right: solid 2px #aaaaaa;

      span {
        display: block;
        text-align: center;
        // border-right: solid 2px #f4f4f4;
        cursor: pointer;
        position: relative;
      }
    }

    .act {
      border-color: #aaeeee !important;
      color: #33aaff !important;
    }

    .act::after {
      content: '  ';
      display: inline-block;
      background-color: #79c9fc;
      width: 2px;
      height: 40px;
      position: absolute;
      right: -2px;
    }

    .tabList {
      flex: 1;
      padding: 15px;
      height: 400px;
      overflow-y: scroll;

      .table {
        border: solid 1px #f4f4f4;
        border-bottom: solid 1px #f4f4f4;

        .items {
          border-bottom: solid 1px #f4f4f4;
          padding: 0 10px;
          display: flex;

          .el-checkbox,
          .el-checkbox__value {
            width: 100%;
          }

          .item {
            display: flex;
            padding-right: 20px;

            span {
              display: inline-block;
              text-align: center;
              flex: 1;
              font-weight: normal;
            }
          }
        }
      }
    }
  }

  .ritCont {
    width: 35%;

    .tit {
      margin: 0 15px;
      font-weight: bold;
    }

    .items {
      height: 338px;
      padding: 4px 15px;
      overflow: scroll;
    }

    .item {
      box-shadow: 0px 1px 4px 3px rgba(0, 0, 0, 0.03);
      display: flex;
      text-align: center;
      padding: 0 10px;
      margin-bottom: 20px;
      border-radius: 6px;
      color: #818693;

      span:first-child {
        text-align: left;
        color: #20232a;
        flex: 70%;
      }

      .price {
        display: inline-block;
        flex: 70%;
        text-align: left;
      }

      .del {
        cursor: pointer;

        img {
          position: relative;
          top: 5px;
          width: 20px;
        }
      }
    }
  }
}
</style>
