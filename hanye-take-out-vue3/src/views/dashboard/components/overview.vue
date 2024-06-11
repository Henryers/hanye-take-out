<template>
  <div class="container">
    <h2 class="homeTitle">
      今日数据<i>{{ days[1] }}</i>
      <div class="more">
        <router-link to="statistics">详细数据</router-link>
        <el-icon>
          <ArrowRight />
        </el-icon>
      </div>
    </h2>
    <div class="overviewBox">
      <ul>
        <li>
          <p class="tit">营业额</p>
          <p class="num">¥ {{ overviewData.turnover }}</p>
        </li>
        <li>
          <p class="tit">有效订单</p>
          <p class="num">{{ overviewData.validOrderCount }}</p>
        </li>
        <li>
          <p class="tit">订单完成率</p>
          <p class="num">
            {{ (overviewData.orderCompletionRate * 100).toFixed(0) }}%
          </p>
        </li>
        <li>
          <p class="tit">平均客单价</p>
          <p class="num">¥ {{ overviewData.unitPrice }}</p>
        </li>
        <li>
          <p class="tit">新增用户</p>
          <p class="num">{{ overviewData.newUsers }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { getday } from '@/utils/date'

// Define props
const props = defineProps<{
  overviewData: {
    turnover: number
    validOrderCount: number
    orderCompletionRate: number
    unitPrice: number
    newUsers: number
  }
}>()

// Computed property for days
const days = computed(() => getday())
</script>

<style lang="less" scoped>
</style>
