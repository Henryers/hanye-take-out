"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const stores_modules_countdown = require("../../stores/modules/countdown.js");
require("../../utils/http.js");
require("../../stores/modules/user.js");
if (!Array) {
  const _easycom_uni_countdown2 = common_vendor.resolveComponent("uni-countdown");
  _easycom_uni_countdown2();
}
const _easycom_uni_countdown = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-countdown/uni-countdown.js";
if (!Math) {
  _easycom_uni_countdown();
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "pay",
  setup(__props) {
    const countdownStore = stores_modules_countdown.useCountdownStore();
    const orderId = common_vendor.ref(0);
    const orderNumber = common_vendor.ref("");
    const orderAmount = common_vendor.ref(0);
    const orderTime = common_vendor.ref();
    common_vendor.ref(null);
    common_vendor.onLoad(async (options) => {
      console.log("orderTime什么东西？", options);
      orderId.value = options.orderId;
      orderNumber.value = options.orderNumber;
      orderAmount.value = options.orderAmount;
      orderTime.value = options.orderTime.replace(" ", "T");
    });
    const toSuccess = async () => {
      if (countdownStore.showM == -1 && countdownStore.showS == -1) {
        common_vendor.index.redirectTo({
          url: "/pages/orderDetail/orderDetail?orderId=" + orderId.value
        });
        return;
      }
      console.log("支付成功");
      const payDTO = {
        orderNumber: orderNumber.value,
        payMethod: 1
        // 本平台默认微信支付
      };
      await api_order.payOrderAPI(payDTO);
      if (countdownStore.timer !== void 0) {
        clearInterval(countdownStore.timer);
        countdownStore.timer = void 0;
      }
      common_vendor.index.redirectTo({
        url: "/pages/submit/success?orderId=" + orderId.value + "&orderNumber=" + orderNumber.value + "&orderAmount=" + orderAmount.value + "&orderTime=" + orderTime.value
      });
    };
    const timeup = () => {
      console.log("------------ 执行了一次倒计时timeup ---------------");
      let timeupSecond = common_vendor.ref(20);
      if (countdownStore.timer !== void 0) {
        clearInterval(countdownStore.timer);
      }
      countdownStore.timer = setInterval(() => {
        console.log("什么timer？", countdownStore.timer);
        console.log("看看是不是一秒执行一次", orderTime.value);
        let buy_time = new Date(orderTime.value).getTime();
        let time = buy_time + 15 * 60 * 1e3 - (/* @__PURE__ */ new Date()).getTime();
        console.log("time", time);
        if (time > 0 && countdownStore.timer !== void 0) {
          var m = time / 1e3 / 60 % 60;
          console.log("m", m);
          var s = time / 1e3 % 60;
          console.log("s", s);
          timeupSecond.value = time / 1e3;
          console.log("timeupSecond小于0？", timeupSecond.value);
          countdownStore.showM = Math.floor(m);
          countdownStore.showS = Math.floor(s);
        } else {
          console.log("订单已超时！");
          clearInterval(countdownStore.timer);
          countdownStore.showM = -1;
          countdownStore.showS = -1;
          cancelOrder();
        }
      }, 1e3);
    };
    const cancelOrder = async () => {
      await api_order.cancelOrderAPI(orderId.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.unref(countdownStore).showM == 0 && common_vendor.unref(countdownStore).showS == 0
      }, common_vendor.unref(countdownStore).showM == 0 && common_vendor.unref(countdownStore).showS == 0 ? {} : {
        b: common_vendor.o(($event) => timeup()),
        c: common_vendor.p({
          color: "#888",
          ["show-day"]: false,
          ["show-hour"]: false,
          minute: common_vendor.unref(countdownStore).showM,
          second: common_vendor.unref(countdownStore).showS
        })
      }, {
        d: common_vendor.t(orderAmount.value),
        e: common_vendor.t(orderNumber.value),
        f: common_vendor.o(($event) => toSuccess())
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8a6251df"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/pay/pay.vue"]]);
wx.createPage(MiniProgramPage);
