"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_modules_user = require("../../stores/modules/user.js");
const api_user = require("../../api/user.js");
const api_order = require("../../api/order.js");
const api_cart = require("../../api/cart.js");
require("../../utils/http.js");
if (!Math) {
  pushMsg();
}
const pushMsg = () => "../../components/message/pushMsg.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "my",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const childComp = common_vendor.ref(null);
    const statusList = [
      {
        status: 0,
        name: "全部订单"
      },
      {
        status: 1,
        name: "待付款"
      },
      {
        status: 2,
        name: "待接单"
      },
      {
        status: 3,
        name: "已接单"
      },
      {
        status: 4,
        name: "派送中"
      },
      {
        status: 5,
        name: "已完成"
      },
      {
        status: 6,
        name: "已取消"
      }
    ];
    const user = common_vendor.reactive({
      id: userStore.profile.id,
      name: "",
      gender: 1,
      phone: "未设置",
      pic: ""
    });
    const historyOrders = common_vendor.ref([]);
    const orderDTO = common_vendor.ref({
      page: 1,
      pageSize: 6
    });
    const total = common_vendor.ref(0);
    common_vendor.onLoad(async (options) => {
      console.log("options", options);
      console.log("userStore", userStore.profile);
      await getUserInfo(user.id);
      await getOrderPage();
    });
    const getUserInfo = async (id) => {
      const res = await api_user.getUserInfoAPI(id);
      console.log("用户信息", res);
      user.name = res.data.name;
      user.gender = res.data.gender ?? 1;
      user.phone = res.data.phone;
      user.pic = res.data.pic;
    };
    const getOrderPage = async () => {
      console.log("orderDTO", orderDTO.value);
      const res = await api_order.getOrderPageAPI(orderDTO.value);
      historyOrders.value = historyOrders.value.concat(res.data.records);
      total.value = res.data.total;
    };
    const reOrder = async (id) => {
      console.log("再来一单", id);
      await api_cart.cleanCartAPI();
      await api_order.reOrderAPI(id);
      common_vendor.index.redirectTo({
        url: "/pages/order/order"
      });
    };
    const pushOrder = async (id) => {
      console.log("催单", id);
      await api_order.urgeOrderAPI(id);
      childComp.value.openPopup();
    };
    common_vendor.onReachBottom(() => {
      console.log("Page:", orderDTO.value.page);
      console.log("Page Size:", orderDTO.value.pageSize);
      if (orderDTO.value.page * orderDTO.value.pageSize >= Math.min(total.value, 12)) {
        console.log("end!");
        common_vendor.index.showToast({
          title: "更多订单信息请到历史订单查看！",
          icon: "none"
        });
        return;
      }
      orderDTO.value.page += 1;
      getOrderPage();
    });
    const toOrderDetail = (id) => {
      common_vendor.index.navigateTo({
        url: "/pages/orderDetail/orderDetail?orderId=" + id
      });
    };
    const goAddress = () => {
      common_vendor.index.redirectTo({
        url: "/pages/address/address"
      });
    };
    const goHistory = () => {
      common_vendor.index.redirectTo({
        url: "/pages/history/history"
      });
    };
    const goMyself = () => {
      common_vendor.index.redirectTo({
        url: "/pages/updateMy/updateMy"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: user.pic,
        b: common_vendor.t(user.name),
        c: user.gender === 0
      }, user.gender === 0 ? {} : {}, {
        d: common_vendor.t(user.phone),
        e: common_vendor.o(goAddress),
        f: common_vendor.o(goHistory),
        g: common_vendor.o(goMyself),
        h: common_vendor.f(historyOrders.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.number),
            b: common_vendor.f(item.orderDetailList, (dish, index2, i1) => {
              return {
                a: dish.pic,
                b: index2
              };
            }),
            c: common_vendor.t(item.orderTime),
            d: common_vendor.t(statusList[item.status].name),
            e: common_vendor.t(item.amount),
            f: common_vendor.t(item.packAmount),
            g: common_vendor.o(($event) => reOrder(item.id), index),
            h: item.status === 2
          }, item.status === 2 ? {
            i: common_vendor.o(($event) => pushOrder(item.id), index)
          } : {}, {
            j: index,
            k: common_vendor.o(($event) => toOrderDetail(item.id), index)
          });
        }),
        i: common_vendor.sr(childComp, "d3687551-0", {
          "k": "childComp"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d3687551"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/my/my.vue"]]);
wx.createPage(MiniProgramPage);
