<template>
  <div class="container">
    <h2 class="homeTitle">
      套餐总览
      <div class="more">
        <router-link to="setmeal">套餐管理</router-link>
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </h2>
    <div class="orderviewBox">
      <ul>
        <li>
          <span class="status">
            <el-icon>
              <Finished />
            </el-icon>
            已启售
          </span>
          <span class="num">{{ setMealData.sold }}</span>
        </li>
        <li>
          <span class="status"> 
            <el-icon>
              <Lock />
            </el-icon>
            已停售
          </span>
          <span class="num">{{ setMealData.discontinued }}</span>
        </li>
        <li class="add">
          <router-link to="setmeal/add">
            <el-icon>
              <CirclePlus />
            </el-icon>
            <p>新增套餐</p>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SetMealData {
  sold: number;
  discontinued: number;
}

const props = defineProps<{
  setMealData: SetMealData;
}>()

</script>
