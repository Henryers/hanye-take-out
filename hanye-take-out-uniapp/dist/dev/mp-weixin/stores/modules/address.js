"use strict";
const common_vendor = require("../../common/vendor.js");
const useAddressStore = common_vendor.defineStore("address", () => {
  const addressBackUrl = common_vendor.ref("");
  const defaultCook = common_vendor.ref("请依据实际情况填写，避免浪费");
  function updateAddressBackUrl(provider) {
    addressBackUrl.value = provider;
  }
  return {
    addressBackUrl,
    // remark,
    defaultCook,
    updateAddressBackUrl
  };
});
exports.useAddressStore = useAddressStore;
