<template>
  <div>
    <div class="container homecon">
      <h2 class="homeTitle homeTitleBtn">
        订单信息
        <ul class="conTab">
          <li v-for="(item, index) in tabList" :key="index" :class="activeIndex === index ? 'active' : ''"
            @click="handleClass(index)">
            <el-badge class="item" :class="item.num >= 10 ? 'badgeW' : ''" :value="item.num > 99 ? '99+' : item.num"
              :hidden="!([2, 3].includes(item.value) && item.num)">{{ item.label }}</el-badge>
          </li>
        </ul>
      </h2>
      <div>
        <div v-if="orderData.length > 0">
          <el-table :data="orderData" stripe class="tableBox" style="width: 100%">
            <el-table-column prop="number" label="订单号"></el-table-column>
            <el-table-column label="订单菜品">
              <template #default="scope">
                <div class="ellipsisHidden">
                  <el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.orderDishes">
                    <template v-slot:reference>
                      <span>{{ scope.row.orderDishes }}</span>
                    </template>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="地址" :class-name="dialogOrderStatus === 2 ? 'address' : ''">
              <template #default="scope">
                <div class="ellipsisHidden">
                  <el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.address">
                    <template v-slot:reference>
                      <span>{{ scope.row.address }}</span>
                    </template>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="estimatedDeliveryTime" label="预计送达时间" sortable class-name="orderTime"
              min-width="130"></el-table-column>
            <el-table-column prop="amount" label="实收金额"></el-table-column>
            <el-table-column label="备注">
              <template #default="scope">
                <div class="ellipsisHidden">
                  <el-popover placement="top-start" width="200" trigger="hover" :content="scope.row.remark">
                    <template v-slot:reference>
                      <span>{{ scope.row.remark }}</span>
                    </template>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="tablewareNumber" label="餐具数量" min-width="80" align="center" v-if="status === 3">
              <template #default="scope">
                {{ scope.row.tablewareNumber === -1 ? '无需餐具' : scope.row.tablewareNumber === 0 ? '按餐量提供' :
                  scope.row.tablewareNumber }}
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center"
              :class-name="dialogOrderStatus === 0 ? 'operate' : 'otherOperate'" min-width="120px">
              <template #default="scope">
                <div class="before">
                  <el-button v-if="scope.row.status === 2" type="primary" link @click="orderAccept(scope.row)">
                    接单
                  </el-button>
                  <el-button v-if="scope.row.status === 3" type="primary" link
                    @click="deliveryOrComplete(3, scope.row.id)">
                    派送
                  </el-button>
                </div>
                <div class="middle">
                  <el-button v-if="scope.row.status === 2" type="danger" link @click="orderReject(scope.row)">
                    拒单
                  </el-button>
                  <el-button v-if="[1, 3, 4, 5].includes(scope.row.status)" type="danger" link
                    @click="cancelOrder(scope.row)">
                    取消
                  </el-button>
                </div>
                <div class="after">
                  <el-button type="primary" link @click="goDetail(scope.row.id, scope.row.status, scope.row)">
                    查看
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Empty v-else :is-search="isSearch" />
        <el-pagination v-if="counts > 10" class="pageList" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="counts" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>

    <!-- 查看弹框部分 -->
    <el-dialog title="订单信息" v-model="dialogVisible" width="53%" :before-close="handleClose" class="order-dialog">
      <el-scrollbar style="height: 100%">
        <div class="order-top">
          <div>
            <div style="display: inline-block">
              <label style="font-size: 16px">订单号：</label>
              <div class="order-num">{{ diaForm!.number }}</div>
            </div>
            <div style="display: inline-block" class="order-status"
              :class="{ status3: [3, 4].includes(dialogOrderStatus) }">
              {{
                orderList.filter((item) => item.value === dialogOrderStatus)[0]
                  .label
              }}
            </div>
          </div>
          <p><label>下单时间：</label>{{ diaForm!.orderTime }}</p>
        </div>

        <div class="order-middle">
          <div class="user-info">
            <div class="user-info-box">
              <div class="user-name">
                <label>用户名：</label>
                <span>{{ diaForm!.consignee }}</span>
              </div>
              <div class="user-phone">
                <label>手机号：</label>
                <span>{{ diaForm!.phone }}</span>
              </div>
              <div v-if="[2, 3, 4, 5].includes(dialogOrderStatus)" class="user-getTime">
                <label>{{ dialogOrderStatus === 5 ? '送达时间：' : '预计送达时间：' }}</label>
                <span>{{ dialogOrderStatus === 5 ? diaForm!.deliveryTime : diaForm!.estimatedDeliveryTime }}</span>
              </div>
              <div class="user-address">
                <label>地址：</label>
                <span>{{ diaForm!.address }}</span>
              </div>
            </div>
            <div class="user-remark" :class="{ orderCancel: dialogOrderStatus === 6 }">
              <div>{{ dialogOrderStatus === 6 ? '取消原因' : '备注' }}</div>
              <span>{{
                dialogOrderStatus === 6
                  ? diaForm!.cancelReason || diaForm!.rejectionReason
                  : diaForm!.remark
              }}</span>
            </div>
          </div>

          <div class="dish-info">
            <div class="dish-label">菜品</div>
            <div class="dish-list">
              <div v-for="(item, index) in diaForm!.orderDetailList" :key="index" class="dish-item">
                <span class="dish-name">{{ item.name }}</span>
                <span class="dish-num">x{{ item.number }}</span>
                <span class="dish-price">￥{{ item.amount ? item.amount.toFixed(2) : '' }}</span>
              </div>
            </div>
            <div class="dish-all-amount">
              <label>菜品小计</label>
              <span>￥{{ (diaForm!.amount - 6 - diaForm!.packAmount).toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <div class="order-bottom">
          <div class="amount-info">
            <div class="amount-label">费用</div>
            <div class="amount-list">
              <div class="dish-amount">
                <span class="amount-name">菜品小计：</span>
                <span class="amount-price">￥{{ (((diaForm!.amount - 6 - diaForm!.packAmount)
                  * 100) / 100).toFixed(2) }}</span>
              </div>
              <div class="send-amount">
                <span class="amount-name">派送费：</span>
                <span class="amount-price">￥6.00</span>
              </div>
              <div class="pack-amount">
                <span class="amount-name">餐盒费：</span>
                <span class="amount-price">￥{{ ((diaForm!.packAmount * 100) / 100).toFixed(2) }}</span>
              </div>
              <div class="all-amount">
                <span class="amount-name">实收金额：</span>
                <span class="amount-price">￥{{ ((diaForm!.amount * 100) / 100).toFixed(2) }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <template #footer>
        <span v-if="dialogOrderStatus !== 6" class="dialog-footer">
          <el-checkbox v-if="dialogOrderStatus === 2 && status === 2" v-model="isAutoNext">处理完自动跳转下一条</el-checkbox>
          <el-button v-if="dialogOrderStatus === 2" @click="orderReject(my_row), (isTableOperateBtn = false)">拒
            单</el-button>
          <el-button v-if="dialogOrderStatus === 2" type="primary"
            @click="orderAccept(my_row), (isTableOperateBtn = false)">接 单</el-button>

          <el-button v-if="[1, 3, 4, 5].includes(dialogOrderStatus)" @click="dialogVisible = false">返 回</el-button>
          <el-button v-if="dialogOrderStatus === 3" type="primary" @click="deliveryOrComplete(3, my_row!.id)">派
            送</el-button>
          <el-button v-if="dialogOrderStatus === 4" type="primary" @click="deliveryOrComplete(4, my_row!.id)">完
            成</el-button>
          <el-button v-if="[1].includes(dialogOrderStatus)" type="primary" @click="cancelOrder(my_row)">取消订单</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 点击拒单，弹出 填拒单/取消原因 的弹窗 -->
    <el-dialog :title="cancelDialogTitle + '原因'" v-model="cancelDialogVisible" width="42%"
      :before-close="() => ((cancelDialogVisible = false), (cancelReason = ''))" class="cancelDialog">
      <el-form label-width="90px">
        <el-form-item :label="cancelDialogTitle + '原因：'">
          <el-select v-model="cancelReason" :placeholder="'请选择' + cancelDialogTitle + '原因'">
            <el-option v-for="(item, index) in cancelDialogTitle === '取消'
              ? cancelrReasonList
              : rejectReasonList" :key="index" :label="item.label" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="cancelReason === '自定义原因'" label="原因：">
          <el-input v-model.trim="remark" type="textarea" :placeholder="'请填写您' + cancelDialogTitle + '的原因（限20字内）'"
            maxlength="20" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="; (cancelDialogVisible = false), (cancelReason = '')">取 消</el-button>
          <el-button type="primary" @click="confirmCancel">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Empty from '@/components/Empty.vue';
import {
  getOrderDetailPageAPI,
  queryOrderDetailByIdAPI,
  completeOrderAPI,
  deliveryOrderAPI,
  orderCancelAPI,
  orderRejectAPI,
  orderAcceptAPI,
} from '@/api/order'
import type { Order, OrderVO } from '@/types/order'
import { ElMessage } from 'element-plus'

const router = useRouter()

const orderStatics = ref<any>(''); // 订单统计数据
const orderId = ref<string>(''); // 订单号
const dialogOrderStatus = ref<number>(0); // 弹窗所需订单状态，用于详情展示字段
const activeIndex = ref<number>(0);
const dialogVisible = ref<boolean>(false); // 详情弹窗
const cancelDialogVisible = ref<boolean>(false); // 取消，拒单弹窗
const cancelDialogTitle = ref<string>(''); // 取消，拒绝弹窗标题
const cancelReason = ref<string>('');
const remark = ref<string>(''); // 自定义原因
const diaForm = ref<OrderVO>()
// const row = ref<any>({});
const my_row = ref<Order>()
const isAutoNext = ref<boolean>(false);
const isSearch = ref<boolean>(false);
const counts = ref<number>(0);
const page = ref<number>(1);
const pageSize = ref<number>(10);
const status = ref<number>(2); // 列表字段展示所需订单状态,用于分页请求数据
const orderData = ref<any[]>([]);
const isTableOperateBtn = ref<boolean>(true);

// 拒单原因列表
const rejectReasonList = reactive([
  { value: 1, label: '订单量较多，暂时无法接单', },
  { value: 2, label: '菜品已销售完，暂时无法接单', },
  { value: 3, label: '餐厅已打烊，暂时无法接单', },
  { value: 0, label: '自定义原因', },
])
// 取消订单原因列表
const cancelrReasonList = reactive([
  { value: 1, label: '订单量较多，暂时无法接单' },
  { value: 2, label: '菜品已销售完，暂时无法接单', },
  { value: 3, label: '骑手不足无法配送', },
  { value: 4, label: '客户电话取消', },
  { value: 0, label: '自定义原因', },
])

const orderList = [
  { label: '全部订单', value: 0 },
  { label: '待付款', value: 1 },
  { label: '待接单', value: 2 },
  { label: '待派送', value: 3 },
  { label: '派送中', value: 4 },
  { label: '已完成', value: 5 },
  { label: '已取消', value: 6 },
];

const tabList = computed(() => [
  { label: '待接单', value: 2, num: orderStatics.value.toBeConfirmed },
  { label: '待派送', value: 3, num: orderStatics.value.confirmed },
]);

// 获取订单数据
const getOrderListData = async (status: number) => {
  dialogVisible.value = false;
  const params = { page: page.value, pageSize: pageSize.value, status };
  const data = await getOrderDetailPageAPI(params);
  console.log("拿到订单数据了！", data);
  orderData.value = data.data.data.records;
  counts.value = data.data.data.total;
  if (dialogOrderStatus.value === 2 && status === 2 && isAutoNext.value
    && !isTableOperateBtn.value && data.data.records.length > 1) {
    const firstRow = data.data.records[0];
    goDetail(firstRow.id, firstRow.status, firstRow);
  }
};

// 接单
const orderAccept = async (row: any) => {
  console.log('接单', row);
  orderId.value = row.id;
  dialogOrderStatus.value = row.status;
  const res = await orderAcceptAPI({ id: orderId.value })
  if (res.data.code === 0) {
    console.log('操作成功')
    orderId.value = ''
    dialogVisible.value = false
    await getOrderListData(status.value)
    ElMessage.success('接单成功')
  } else {
    throw new Error(res.data.msg)
  }
};

const cancelOrder = (row: any) => {
  cancelDialogVisible.value = true;
  orderId.value = row.id;
  dialogOrderStatus.value = row.status;
  cancelDialogTitle.value = '取消';
  dialogVisible.value = false;
  cancelReason.value = '';
};

const orderReject = (row: any) => {
  cancelDialogVisible.value = true;
  orderId.value = row.id;
  dialogOrderStatus.value = row.status;
  cancelDialogTitle.value = '拒绝';
  dialogVisible.value = false;
  cancelReason.value = '';
};

const confirmCancel = async () => {
  if (!cancelReason.value) {
    return;
  } else if (cancelReason.value === '自定义原因' && !remark.value) {
    return;
  }
  // 判断是取消还是拒单
  const action = cancelDialogTitle.value === '取消' ? orderCancelAPI : orderRejectAPI;
  const payload = {
    id: orderId.value,
    [cancelDialogTitle.value === '取消' ? 'cancelReason' : 'rejectionReason']: cancelReason.value === '自定义原因' ? remark.value : cancelReason.value,
  };
  // 请求
  const { data: res } = await action(payload)
  if (res.code === 0) {
    cancelDialogVisible.value = false;
    orderId.value = '';
    ElMessage.success(`${cancelDialogTitle.value}成功`)
    getOrderListData(status.value);
  } else {
    throw new Error(res.msg)
  }
};

// 派送或完成订单
const deliveryOrComplete = async (status1: number, id: number) => {
  const action = status1 === 3 ? deliveryOrderAPI : completeOrderAPI;
  const params = { status1, id };

  const { data: res } = await action(params)
  if (res.code === 0) {
    orderId.value = ''
    dialogVisible.value = false
    ElMessage.success(`${status1 === 3 ? '派送成功' : '订单完成'}`)
    getOrderListData(status.value)
  } else {
    // Handle error
  }
};

// const goDetail = async (id: any, status: number, row: any) => {
//   dialogVisible.value = true;
//   dialogOrderStatus.value = status;
//   const { data: res } = await queryOrderDetailByIdAPI({ orderId: id });
//   diaForm.value = res.data;
//   row.value = row;
// };

// 打开对话框，查看订单详情
const goDetail = async (id: any, status: number, row: any) => {
  orderId.value = id
  const { data: res } = await queryOrderDetailByIdAPI({ orderId: id })
  diaForm!.value = res.data
  Object.assign(my_row, row)
  // router.push('/dashboard')
  dialogVisible.value = true
  dialogOrderStatus.value = status
}

const handleClose = () => {
  dialogVisible.value = false;
};

const handleClass = (index: number) => {
  activeIndex.value = index;
  status.value = index === 0 ? 2 : 3;
  getOrderListData(status.value);
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  getOrderListData(status.value);
};

const handleCurrentChange = (val: number) => {
  page.value = val;
  getOrderListData(status.value);
};

onMounted(() => {
  // console.log('子组件已挂载');
  getOrderListData(status.value);
});

</script>

<style lang="less" scoped>
.dashboard-container.home .homecon {
  margin-bottom: 0;
}

.tableBox {
  width: 100%;
  border: 1px solid #e4e4e4;
  border-bottom: 0;
  display: flex;
  flex-direction: row;

  .btn_box {
    display: flex;
    align-items: center;
    height: 100%;

    .before,
    .middle,
    .after {
      width: 40px;
      margin: 2px;
    }
  }
  .before,
  .middle,
  .after {
    width: 40px;
    margin: 2px;
  }
}

.order-top {
  // height: 80px;
  border-bottom: 1px solid #e7e6e6;
  padding-bottom: 26px;
  padding-left: 22px;
  padding-right: 22px;
  // margin: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .order-status {
    width: 57.25px;
    height: 27px;
    background: #333333;
    border-radius: 13.5px;
    color: white;
    margin-left: 19px;
    text-align: center;
    line-height: 27px;
  }

  .status3 {
    background: #f56c6c;
  }

  p {
    color: #333;

    label {
      color: #666;
    }
  }

  .order-num {
    font-size: 16px;
    color: #2a2929;
    font-weight: bold;
    display: inline-block;
  }
}

.order-middle {
  .user-info {
    min-height: 140px;
    background: #fbfbfa;
    margin-top: 23px;

    padding: 20px 43px;
    color: #333;

    .user-info-box {
      min-height: 55px;
      display: flex;
      flex-wrap: wrap;

      .user-name {
        flex: 67%;
      }

      .user-phone {
        flex: 33%;
      }

      .user-getTime {
        margin-top: 14px;
        flex: 80%;

        label {
          margin-right: 3px;
        }
      }

      label {
        margin-right: 17px;
        color: #666;
      }

      .user-address {
        margin-top: 14px;
        flex: 80%;

        label {
          margin-right: 30px;
        }
      }
    }

    .user-remark {
      height: 43px;
      line-height: 43px;
      background: #fffbf0;
      border: 1px solid #fbe396;
      border-radius: 4px;
      margin-top: 10px;
      padding: 6px;
      display: flex;
      align-items: center;

      div {
        display: inline-block;
        min-width: 53px;
        height: 32px;
        background: #fbe396;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        color: #333;
        margin-right: 30px;
        // padding: 12px 6px;
      }

      span {
        color: #f2a402;
      }
    }

    .orderCancel {
      background: #ffffff;
      border: 1px solid #b6b6b6;

      div {
        padding: 0 10px;
        background-color: #e5e4e4;
      }

      span {
        color: #f56c6c;
      }
    }
  }

  .dish-info {
    // min-height: 180px;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 40px;
    border-bottom: 1px solid #e7e6e6;

    .dish-label {
      color: #666;
    }

    .dish-list {
      flex: 80%;
      display: flex;
      flex-wrap: wrap;

      .dish-item {
        flex: 50%;
        margin-bottom: 14px;
        color: #333;

        .dish-num {
          margin-right: 51px;
        }
      }

      // .dish-item:nth-child(odd) {
      //   flex: 60%;
      // }
      // .dish-item:nth-child(even) {
      //   flex: 40%;
      // }
    }

    .dish-label {
      margin-right: 65px;
    }

    .dish-all-amount {
      flex: 1;
      padding-left: 92px;
      margin-top: 10px;

      label {
        color: #333333;
        font-weight: bold;
        margin-right: 5px;
      }

      span {
        color: #f56c6c;
      }
    }
  }
}

.order-bottom {
  .amount-info {
    // min-height: 180px;
    display: flex;
    flex-wrap: wrap;
    padding: 20px 40px;
    padding-bottom: 0px;

    .amount-label {
      color: #666;
      margin-right: 65px;
    }

    .amount-list {
      flex: 80%;
      display: flex;
      flex-wrap: wrap;
      color: #333;

      // height: 65px;
      .dish-amount,
      .package-amount,
      .pay-type {
        display: inline-block;
        width: 300px;
        margin-bottom: 14px;
        flex: 50%;
      }

      .send-amount,
      .all-amount,
      .pay-time {
        display: inline-block;
        flex: 50%;
        padding-left: 10%;
      }

      .package-amount {
        .amount-name {
          margin-right: 14px;
        }
      }

      .all-amount {
        .amount-name {
          margin-right: 24px;
        }

        .amount-price {
          color: #f56c6c;
        }
      }

      .send-amount {
        .amount-name {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.dashboard-container {
  .cancelTime {
    padding-left: 30px;
  }

  .orderTime {
    padding-left: 30px;
  }

  // td.operate .cell {

  //   .before,
  //   .middle,
  //   .after {
  //     height: 39px;
  //     width: 48px;
  //   }
  // }

  td.operate .cell,
  td.otherOperate .cell {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
  }
}
</style>
