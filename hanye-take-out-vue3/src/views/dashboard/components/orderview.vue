<template>
  <div class="container">
    <h2 class="homeTitle">
      订单管理<i>{{ days[1] }}</i>
      <div class="more">
        <router-link to="/order">订单明细</router-link>
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
              <DocumentAdd />
            </el-icon>
            待接单
          </span>
          <span class="num tip">
            <router-link to="/order?status=2">{{ orderviewData.waitingOrders }}</router-link>
          </span>
        </li>
        <li>
          <span class="status">
            <el-icon>
              <Bicycle />
            </el-icon>
            待派送
          </span>
          <span class="num tip">
            <router-link to="/order?status=3">{{ orderviewData.deliveredOrders }}</router-link>
          </span>
        </li>
        <li>
          <span class="status">
            <el-icon>
              <DocumentChecked />
            </el-icon>
            已完成
          </span>
          <span class="num">
            <router-link to="/order?status=5">{{ orderviewData.completedOrders }}</router-link>
          </span>
        </li>
        <li>
          <span class="status">
            <el-icon>
              <DocumentDelete />
            </el-icon>
            已取消
          </span>
          <span class="num">
            <router-link to="/order?status=6">{{ orderviewData.cancelledOrders }}</router-link>
          </span>
        </li>
        <li>
          <span class="status">
            <el-icon>
              <Document />
            </el-icon>
            全部订单
          </span>
          <span class="num">
            <router-link to="/order">{{ orderviewData.allOrders }}</router-link>
          </span>
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
  orderviewData: {
    waitingOrders: number,
    deliveredOrders: number,
    completedOrders: number,
    cancelledOrders: number,
    allOrders: number
  }
}>()

// Computed property for days
const days = computed(() => getday())
</script>

<style scoped>
</style>
