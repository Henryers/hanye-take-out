<template>
  <div class="container">
    <h2 class="chartTitle">订单统计</h2>
    <div class="charBox">
      <div class="orderProportion">
        <div>
          <p class="simple">订单完成率</p>
          <p class="deep">{{ (orderdata.orderCompletionRate * 100).toFixed(1) }}%</p>
        </div>
        <div class="symbol">=</div>
        <div>
          <p class="simple">有效订单</p>
          <p class="deep">{{ orderdata.validOrderCount }}</p>
        </div>
        <div class="symbol">/</div>
        <div>
          <p class="simple">订单总数</p>
          <p class="deep">{{ orderdata.totalOrderCount }}</p>
        </div>
      </div>
      <div id="ordermain" style="width: 100%; height: 300px"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue';
import * as echarts from 'echarts';

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

interface OverviewData {
  // Define the structure of overviewData if needed
}

const props = defineProps<{
  orderdata: OrderData;
  overviewData: OverviewData;
}>();


const initChart = () => {
  const chartDom = document.getElementById('ordermain') as HTMLElement;
  const myChart = echarts.init(chartDom);
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderRadius: 2,
      textStyle: {
        color: '#333',
        fontSize: 12,
        fontWeight: 300,
      },
    },
    grid: {
      top: '15%',
      left: '6%',
      right: '10%',
      bottom: '12%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLabel: {
        textStyle: {
          color: '#666',
          fontSize: '12px',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#E5E4E4',
          width: 1,
        },
      },
      data: props.orderdata.data.dateList,
    },
    yAxis: [
      {
        type: 'value',
        min: 0,
        // interval: 50,
        axisLabel: {
          textStyle: {
            color: '#666',
            fontSize: '12px',
          },
        },
      },
    ],
    legend: {
      // 对指定的data线，设置不同的legend格式
      // data: ['用户总量（个）', '新增用户（个）'],
      bottom: '0%',
      icon: 'rect',
      itemWidth: 20,
      itemHeight: 2,
      textStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    series: [
      {
        name: '订单总数（个）',
        type: 'line',
        smooth: false,
        showSymbol: false,
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#FFD000',
            lineStyle: {
              color: '#FFD000',
            },
          },
          emphasis: {
            color: '#fff',
            borderWidth: 5,
            borderColor: '#FFC100',
          },
        },
        areaStyle: {
          // opacity: 0.5,
          // 从上到下渐变，(0,0)是上部，(0,1)是下部
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255, 221, 0, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 221, 0, 0)'
            }
          ])
        },
        data: props.orderdata.data.orderCountList,
      },
      {
        name: '有效订单（个）',
        type: 'line',
        smooth: false,
        showSymbol: false,
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: '#FD7F7F',
            lineStyle: {
              color: '#FD7F7F',
            },
          },
          emphasis: {
            color: '#fff',
            borderWidth: 5,
            borderColor: '#FD7F7F',
          },
        },
        areaStyle: {
          // opacity: 0.5,
          // 从上到下渐变，(0,0)是上部，(0,1)是下部
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(255, 1, 0, 1)'
            },
            {
              offset: 1,
              color: 'rgba(255, 1, 0, 0)'
            }
          ])
        },
        data: props.orderdata.data.validOrderCountList,
      },
    ],
  };
  myChart.setOption(option);
};

onMounted(() => {
  initChart();
});

watch(() => props.orderdata, (newVal) => {
  if (newVal) {
    initChart();
  }
});
</script>


<style lang="less" scoped>
.chartTitle {
  font-size: 16px;
  color: #333;
  margin: 10px 20px;
}

.orderProportion {
  display: flex;
  margin-left: 20px;
  .simple{
    font-size: 14px;
    color: #666;
  }
  .deep{
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  .symbol{
    font-size: 16px;
    font-weight: bold;
    color: #666;
    margin: 10px;
  }
}
</style>