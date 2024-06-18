"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_login = require("../../api/login.js");
const stores_modules_user = require("../../stores/modules/user.js");
require("../../utils/http.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    let code = "";
    common_vendor.onLoad(async () => {
      const res = await common_vendor.wx$1.login();
      code = res.code;
    });
    const login = async () => {
      console.log("login");
      const res = await api_login.loginAPI(code);
      console.log(res);
      loginSuccess(res.data);
    };
    const loginSuccess = (profile) => {
      const userStore = stores_modules_user.useUserStore();
      userStore.setProfile(profile);
      common_vendor.index.showToast({ icon: "success", title: "登录成功" });
      setTimeout(() => {
        common_vendor.index.switchTab({ url: "/pages/my/my" });
      }, 500);
    };
    const tips = async () => {
      common_vendor.index.showToast({
        title: "司辰，直接微信快捷登录就好哦~",
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(login),
        c: common_vendor.o(tips)
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cdfe2409"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/login/login.vue"]]);
wx.createPage(MiniProgramPage);
