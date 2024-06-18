"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const api_cart = require("../../api/cart.js");
const stores_modules_countdown = require("../../stores/modules/countdown.js");
require("../../utils/http.js");
require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_uni_countdown2 = common_vendor.resolveComponent("uni-countdown");
  _easycom_uni_countdown2();
}
const _easycom_uni_countdown = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-countdown/uni-countdown.js";
if (!Math) {
  (_easycom_uni_countdown + pushMsg)();
}
const pushMsg = () => "../../components/message/pushMsg.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "orderDetail",
  setup(__props) {
    const childComp = common_vendor.ref(null);
    const statusList = [
      {
        status: 0,
        name: "全部订单"
      },
      {
        status: 1,
        name: "等待支付"
      },
      {
        status: 2,
        name: "等待商家接单"
      },
      {
        status: 3,
        name: "商家已接单"
      },
      {
        status: 4,
        name: "正在派送中"
      },
      {
        status: 5,
        name: "订单已完成"
      },
      {
        status: 6,
        name: "订单已取消"
      }
    ];
    const countdownStore = stores_modules_countdown.useCountdownStore();
    const order = common_vendor.reactive({
      id: 0,
      // 订单id
      number: "",
      // 订单号
      status: 0,
      // 订单状态 1待付款 2待接单 3已接单 4派送中 5已完成 6已取消
      userId: 0,
      // 下单用户id
      addressBookId: 0,
      // 地址id
      orderTime: /* @__PURE__ */ new Date(),
      // 下单时间
      orderDetailList: []
      // 订单详情
    });
    common_vendor.onLoad(async (options) => {
      console.log("options", options);
      order.id = options.orderId;
      await getOrderDetail();
    });
    const getOrderDetail = async () => {
      console.log("获取订单详情");
      const res = await api_order.getOrderAPI(order.id);
      console.log("res", res);
      Object.assign(order, res.data);
      console.log("刷新得到新的order", order);
    };
    const cancelOrder = async () => {
      console.log("取消订单");
      const res = await api_order.cancelOrderAPI(order.id);
      if (res.code === 0) {
        common_vendor.index.showToast({
          title: "订单已取消",
          icon: "none"
        });
      } else {
        common_vendor.index.showModal({
          title: "提示",
          content: "商家已接单，欲取消订单请与商家联系！",
          showCancel: false,
          // 不显示取消按钮
          success: function(res2) {
            if (res2.confirm) {
              console.log("用户点击确定");
            }
          }
        });
      }
      await getOrderDetail();
    };
    const pushOrder = async () => {
      console.log("催单");
      const res = await api_order.urgeOrderAPI(order.id);
      console.log("催单res信息", res.data);
      if (childComp.value) {
        childComp.value.openPopup();
      }
    };
    const reOrder = async () => {
      console.log("再来一单");
      await api_cart.cleanCartAPI();
      await api_order.reOrderAPI(order.id);
      common_vendor.index.redirectTo({
        url: "/pages/order/order"
      });
    };
    const connectShop = () => {
      console.log("联系商家");
      common_vendor.index.makePhoneCall({
        phoneNumber: "1999"
      });
    };
    const toPay = async () => {
      console.log("支付成功");
      const payDTO = {
        orderNumber: order.number,
        payMethod: 1
        // 本平台默认微信支付
      };
      await api_order.payOrderAPI(payDTO);
      if (countdownStore.timer !== void 0) {
        clearInterval(countdownStore.timer);
        countdownStore.timer = void 0;
      }
      common_vendor.index.redirectTo({
        url: "/pages/pay/pay?orderId=" + order.id + "&orderNumber=" + order.number + "&orderAmount=" + order.amount + "&orderTime=" + order.orderTime
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(statusList[order.status].name),
        b: order.status === 1
      }, order.status === 1 ? common_vendor.e({
        c: common_vendor.unref(countdownStore).showM <= 0 && common_vendor.unref(countdownStore).showS <= 0
      }, common_vendor.unref(countdownStore).showM <= 0 && common_vendor.unref(countdownStore).showS <= 0 ? {} : {
        d: common_vendor.p({
          color: "#888",
          ["show-day"]: false,
          ["show-hour"]: false,
          minute: common_vendor.unref(countdownStore).showM,
          second: common_vendor.unref(countdownStore).showS
        })
      }) : {}, {
        e: order.status <= 2
      }, order.status <= 2 ? {
        f: common_vendor.o(cancelOrder)
      } : {}, {
        g: order.status === 1 && (common_vendor.unref(countdownStore).showM > 0 || common_vendor.unref(countdownStore).showS > 0)
      }, order.status === 1 && (common_vendor.unref(countdownStore).showM > 0 || common_vendor.unref(countdownStore).showS > 0) ? {
        h: common_vendor.o(toPay)
      } : {}, {
        i: order.status === 2
      }, order.status === 2 ? {
        j: common_vendor.o(pushOrder)
      } : {}, {
        k: order.status === 2 || order.status === 6
      }, order.status === 2 || order.status === 6 ? {
        l: common_vendor.o(reOrder)
      } : {}, {
        m: common_vendor.f(order.orderDetailList, (obj, index, i0) => {
          return common_vendor.e({
            a: obj.pic,
            b: common_vendor.t(obj.name),
            c: obj.dishFlavor
          }, obj.dishFlavor ? {
            d: common_vendor.t(obj.dishFlavor)
          } : {}, {
            e: obj.number && obj.number > 0
          }, obj.number && obj.number > 0 ? {
            f: common_vendor.t(obj.number)
          } : {}, {
            g: common_vendor.t(obj.amount),
            h: index
          });
        }),
        n: common_vendor.t(order.packAmount),
        o: common_vendor.t(order.amount),
        p: common_vendor.o(connectShop),
        q: common_vendor.t(order.remark),
        r: common_vendor.t(order.tablewareNumber == -1 ? "无需餐具" : order.tablewareNumber == 0 ? "商家根据餐量提供" : order.tablewareNumber),
        s: common_vendor.t(order.number),
        t: common_vendor.t(order.orderTime),
        v: common_vendor.t(order.address),
        w: common_vendor.t(order.packAmount === -1 ? "无需餐具" : order.packAmount === 0 ? "按餐量提供" : order.packAmount),
        x: common_vendor.sr(childComp, "2d945b00-1", {
          "k": "childComp"
        })
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2d945b00"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/orderDetail/orderDetail.vue"]]);
wx.createPage(MiniProgramPage);
