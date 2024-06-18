"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "success",
  setup(__props) {
    const orderId = common_vendor.ref(0);
    const orderNumber = common_vendor.ref("");
    const orderAmount = common_vendor.ref(0);
    const orderTime = common_vendor.ref("");
    const arrivalTime = common_vendor.ref("");
    common_vendor.onLoad(async (options) => {
      console.log("options", options);
      orderId.value = options.orderId;
      orderNumber.value = options.orderNumber;
      orderAmount.value = options.orderAmount;
      orderTime.value = options.orderTime;
      getHarfAnOur();
    });
    const getHarfAnOur = () => {
      const date = /* @__PURE__ */ new Date();
      date.setTime(date.getTime() + 36e5);
      let hours = date.getHours().toString();
      let minutes = date.getMinutes().toString();
      if (hours.length === 1)
        hours = "0" + hours;
      if (minutes.length === 1)
        minutes = "0" + minutes;
      arrivalTime.value = hours + ":" + minutes;
    };
    const toHome = () => {
      common_vendor.index.switchTab({
        url: "/pages/index/index"
      });
    };
    const toDetail = () => {
      common_vendor.index.redirectTo({
        url: "/pages/orderDetail/orderDetail?orderId=" + orderId.value
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(arrivalTime.value),
        b: common_vendor.o(($event) => toHome()),
        c: common_vendor.o(($event) => toDetail())
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-03f045ab"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/submit/success.vue"]]);
wx.createPage(MiniProgramPage);
