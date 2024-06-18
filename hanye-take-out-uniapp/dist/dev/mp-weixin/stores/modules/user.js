"use strict";
const common_vendor = require("../../common/vendor.js");
const useUserStore = common_vendor.defineStore(
  "member",
  () => {
    const profile = common_vendor.ref();
    const setProfile = (val) => {
      profile.value = val;
    };
    const clearProfile = () => {
      profile.value = void 0;
    };
    return {
      profile,
      setProfile,
      clearProfile
    };
  },
  // 持久化
  {
    // 网页端配置
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem: (key) => common_vendor.index.getStorageSync(key),
        setItem: (key, value) => common_vendor.index.setStorageSync(key, value)
      }
    }
  }
);
exports.useUserStore = useUserStore;
