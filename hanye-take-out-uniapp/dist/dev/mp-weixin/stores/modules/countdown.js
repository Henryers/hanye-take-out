"use strict";
const common_vendor = require("../../common/vendor.js");
const useCountdownStore = common_vendor.defineStore("countdown", () => {
  const showM = common_vendor.ref(-1);
  const showS = common_vendor.ref(-1);
  const timer = common_vendor.ref(0);
  return {
    showM,
    showS,
    timer
  };
});
exports.useCountdownStore = useCountdownStore;
