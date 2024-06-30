<script setup lang="ts">
// 引入组件
import TurnoverStatistics from './components/TurnoverStatistics.vue'
import UserStatistics from './components/UserStatistics.vue'
import OrderStatistics from './components/OrderStatistics.vue'
import Top from './components/Top10.vue'

import { onMounted, ref, watch } from 'vue'
import {
  get1stAndToday,
  past7Day,
  past30Day,
  pastWeek,
  pastMonth,
} from '@/utils/date'
import {
  getTurnoverStatisticsAPI,
  getUserStatisticsAPI,
  getOrderStatisticsAPI,
  getTop10StatisticsAPI,
  exportInforAPI,
} from '@/api/statistics'
import { ElMessage, ElMessageBox } from 'element-plus'


interface TurnoverData {
  dateList: string[];
  turnoverList: number[];
}
interface UserData {
  dateList: string[];
  totalUserList: number[];
  newUserList: number[];
}
interface OrderData {
  orderCompletionRate: number;
  validOrderCount: number;
  totalOrderCount: number;
  data: {
    dateList: string[];
    orderCountList: number[];
    validOrderCountList: number[];
  };
}
interface Top10Data {
  nameList: string[];
  numberList: number[];
}

const overviewData = ref({})
// const flag = ref(2)
const tateData = ref<string[]>([])
const turnoverData = ref<TurnoverData>({
  dateList: [],
  turnoverList: []
})
const userData = ref<UserData>({
  dateList: [],
  totalUserList: [],
  newUserList: []
})
const orderData = ref<OrderData>({
  orderCompletionRate: 0,
  validOrderCount: 0,
  totalOrderCount: 0,
  data: {
    dateList: [],
    orderCountList: [],
    validOrderCountList: []
  }
})
const top10Data = ref<Top10Data>({
  nameList: [],
  numberList: []
})

onMounted(() => {
  getTitleNum(2)
})

const init = (begin: string, end: string) => {
  getTurnoverStatisticsData(begin, end)
  getUserStatisticsData(begin, end)
  getOrderStatisticsData(begin, end)
  getTopData(begin, end)
}

// chart1 营业额统计
const getTurnoverStatisticsData = async (begin: string, end: string) => {
  const { data } = await getTurnoverStatisticsAPI({ begin, end })
  turnoverData.value = {
    dateList: data.data.dateList.split(','),
    turnoverList: data.data.turnoverList.split(',')
  }
  console.log('获取到营业额统计数据：', turnoverData.value)
}

// chart2 用户统计
const getUserStatisticsData = async (begin: string, end: string) => {
  const { data: res } = await getUserStatisticsAPI({ begin, end })
  userData.value = {
    dateList: res.data.dateList.split(','),
    totalUserList: res.data.totalUserList.split(','),
    newUserList: res.data.newUserList.split(','),
  }
  console.log('获取到用户统计数据：', userData.value)
}

// chart3 订单统计
const getOrderStatisticsData = async (begin: string, end: string) => {
  const { data: res } = await getOrderStatisticsAPI({ begin, end })
  orderData.value = {
    data: {
      dateList: res.data.dateList.split(','),
      orderCountList: res.data.orderCountList.split(','),
      validOrderCountList: res.data.validOrderCountList.split(','),
    },
    totalOrderCount: res.data.totalOrderCount,
    validOrderCount: res.data.validOrderCount,
    orderCompletionRate: res.data.orderCompletionRate
  }
  console.log('获取到订单统计数据：', orderData.value)
}

// chart4 销量排名TOP10
const getTopData = async (begin: string, end: string) => {
  const { data: res } = await getTop10StatisticsAPI({ begin, end })
  top10Data.value = {
    nameList: res.data.nameList.split(',').reverse(),
    numberList: res.data.numberList.split(',').reverse(),
  }
  console.log('获取到销量top10统计数据：', top10Data.value)
}

// 获取当前选中的tab时间
const getTitleNum = (data: number) => {
  switch (data) {
    case 1:
      tateData.value = get1stAndToday()
      break
    case 2:
      tateData.value = past7Day()
      break
    case 3:
      tateData.value = past30Day()
      break
    case 4:
      tateData.value = pastWeek()
      break
    case 5:
      tateData.value = pastMonth()
      break
  }
  // 根据新的时间段获取数据
  init(tateData.value[0], tateData.value[1])
}

const nowIndex = ref(0);
const tabsParam = ['昨日', '近7日', '近30日', '本周', '本月'];

watch(nowIndex, (val) => {
  // 在这里执行 flag 变化时的操作
  console.log('Flag 变化为:', val);
})

const toggleTabs = (index: number) => {
  nowIndex.value = index;
  getTitleNum(index + 1);
};


const handleExport = async () => {
  try {
    const confirm = await ElMessageBox.confirm(
      '是否导出最近30天运营数据?',
      '导出数据',
      {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );
    // 如果用户确认导出
    if (confirm) {
      const { data } = await exportInforAPI();
      // 程序模拟点击a标签行为，实现下载excel功能
      let url = window.URL.createObjectURL(data);
      var a = document.createElement('a');
      document.body.appendChild(a);
      a.href = url;
      a.download = '运营数据统计报表.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      ElMessage({
        type: 'success',
        message: '导出成功',
      });
    }
  } catch (error) {
    // 捕获 ElMessageBox.confirm 的取消操作
    if (error === 'cancel') {
      ElMessage({
        type: 'info',
        message: '取消导出',
      });
    } else {
      console.error('导出失败:', error);
      ElMessage({
        type: 'error',
        message: '导出失败',
      });
    }
  }
};
</script>

<template>
  <div class="title-index">
    <div class="tab-change">
      <div class="tab-item" v-for="(item, index) in tabsParam" @click="toggleTabs(index)"
        :class="{ active: index === nowIndex }" :key="index">
        <div class="item">{{ item }}</div>
      </div>
      <div class="get-time">
        <p> 已选时间：{{ tateData[0] }} 至 {{ tateData[tateData.length - 1] }} </p>
      </div>
    </div>
    <el-button type="success" @click="handleExport">数据导出</el-button>
  </div>
  <div class="page">
    <el-row :gutter="20">
      <div class="turnover">
        <!-- 营业额统计 -->
        <TurnoverStatistics :turnoverdata="turnoverData" />
      </div>
      <div class="user">
        <!-- 用户统计 -->
        <UserStatistics :userdata="userData" />
      </div>
    </el-row>
    <el-row :gutter="20">
      <div class="order">
        <!-- 订单统计 -->
        <OrderStatistics :orderdata="orderData" :overviewData="overviewData" />
      </div>
      <div class="top10">
        <!-- 销量排名TOP10 -->
        <Top :top10data="top10Data" />
      </div>
    </el-row>
  </div>
</template>

<style lang="less" scoped>
.page {
  margin: 20px;
  padding: 0;
  background-color: #e9f5ff;
}

.title-index {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 30px 0 20px;

  .tab-change {
    display: flex;
    border-radius: 4px;

    .tab-item {
      width: 100px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      color: #333;
      border: 1px solid #e5e4e4;
      background-color: white;
      border-left: none;
      cursor: pointer;

      .special-item {
        .el-badge__content {
          width: 20px;
          padding: 0 5px;
        }
      }
    }

    .get-time {
      width: 300px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      align-items: center;
      font-size: 14px;
      color: #333;
    }

    .active {
      background-color: #22ccff;
      font-weight: bold;
    }

    .tab-item:first-child {
      border-left: 1px solid #e5e4e4;
    }
  }

}


.el-select {
  margin: 20px;
  width: 100px;
  float: right;
  right: 40px;
}

.turnover {
  display: inline-block;
  width: 48%;
  height: 440px;
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.user {
  display: inline-block;
  width: 48%;
  height: 440px;
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  vertical-align: top;
}

.order {
  display: inline-block;
  width: 48%;
  height: 450px;
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.top10 {
  display: inline-block;
  width: 48%;
  height: 450px;
  margin: 10px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  vertical-align: top;
}
</style>

<!-- 全局样式 -->
<style>
.my-card {
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  /* justify-content: center; */
}

.pagination {
  justify-content: center;
}
</style>