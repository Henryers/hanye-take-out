"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/my/my.js";
  "./pages/order/order.js";
  "./pages/detail/detail.js";
  "./pages/submit/submit.js";
  "./pages/submit/success.js";
  "./pages/address/address.js";
  "./pages/addOrEditAddress/addOrEditAddress.js";
  "./pages/remark/remark.js";
  "./pages/pay/pay.js";
  "./pages/orderDetail/orderDetail.js";
  "./pages/history/history.js";
  "./pages/updateMy/updateMy.js";
}
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "App",
  setup(__props) {
    common_vendor.onLaunch(() => {
      console.log("App Launch");
    });
    common_vendor.onShow(() => {
      console.log("App Show");
    });
    common_vendor.onHide(() => {
      console.log("App Hide");
    });
    return () => {
    };
  }
});
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/App.vue"]]);
const pinia = common_vendor.createPinia();
pinia.use(common_vendor.src_default);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  app.use(pinia);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
