"use strict";
const common_vendor = require("../common/vendor.js");
const stores_modules_user = require("../stores/modules/user.js");
const baseURL = "http://localhost:8081";
const httpInterceptor = {
  // 拦截前触发
  invoke(options) {
    var _a;
    if (!options.url.startsWith("http")) {
      options.url = baseURL + options.url;
    }
    options.timeout = 1e4;
    options.header = {
      "source-client": "miniapp",
      ...options.header
    };
    const userStore = stores_modules_user.useUserStore();
    const token = (_a = userStore.profile) == null ? void 0 : _a.token;
    console.log("token", token);
    if (token) {
      options.header.Authorization = token;
    }
  }
};
common_vendor.index.addInterceptor("request", httpInterceptor);
const http = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      ...options,
      // 响应成功
      success(res) {
        console.log("响应  ", res);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else if (res.statusCode === 401) {
          const userStore = stores_modules_user.useUserStore();
          userStore.clearProfile();
          common_vendor.index.navigateTo({ url: "/pages/login/login" });
          reject(res);
        } else {
          common_vendor.index.showToast({
            title: res.data.msg || "请求失败",
            icon: "none"
          });
        }
      },
      // 响应失败
      fail(err) {
        common_vendor.index.showToast({
          title: "网络不行，换个试试？",
          icon: "none"
          // mask: true,
        });
        reject(err);
      }
    });
  });
};
exports.http = http;
