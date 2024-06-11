<template>
  <div class="selectInput">
    <el-input v-model="keyValue" type="text" style="width: 100%" placeholder="请选择口味" clearable readonly
      @focus="selectFlavor(true)" @blur="outSelect(false)" />
    <div v-if="mak && dishFlavorsData.length" class="flavorSelect">
      <span v-for="(item, index) in dishFlavorsData" :key="index" class="items" @click="checkOption(item, index)">{{
        item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// defineProps defineEmits 无需显示导入，但下面还是要定义使用的
interface DishFlavorName {
  name: string;
}

const props = defineProps({
  dishFlavorsData: {
    type: Array as () => DishFlavorName[],
    default: () => [],
  },
  value: {
    type: [String, Number],
    default: '',
  },
  index: {
    type: Number,
    default: 0,
  },
})

const mak = ref(false);
const keyValue = ref(props.value)

const selectFlavor = (status: any) => {
  mak.value = status;
}

const outSelect = (status: any) => {
  setTimeout(() => {
    mak.value = status;
  }, 200)
}

// 使用setup语法糖的话要先引入defineEmits来定义
const emit = defineEmits(["select"])
const checkOption = (item: any, index: number) => {
  emit('select', item.name, props.index, index)
  keyValue.value = item.name
}

watch(() => props.value, (newVal) => {
  keyValue.value = newVal
})

</script>

<style lang="less" scoped>
.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;

  .flavorSelect {
    position: absolute;
    width: 100%;
    // padding: 0 10px;
    border-radius: 3px;
    border: solid 1px #e4e7ed;
    line-height: 30px;
    text-align: center;
    background: #fff;
    top: 50px;
    z-index: 99;

    .items {
      cursor: pointer;
      display: inline-block;
      width: 100%;
      line-height: 35px;
      border-bottom: solid 1px #f4f4f4;
      color: #666;
      margin: 0 !important;

      &:hover {
        background-color: #fffbf0;
      }

      &:active {
        background-color: #fffbf0;
        color: #ffc200;
      }
    }

    .none {
      font-size: 14px;
    }
  }
}
</style>