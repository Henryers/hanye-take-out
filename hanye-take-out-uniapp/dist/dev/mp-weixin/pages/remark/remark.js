"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "remark",
  setup(__props) {
    const remark = common_vendor.ref("");
    const returnToSubmit = () => {
      console.log("remark", remark.value);
      common_vendor.index.redirectTo({
        url: "/pages/submit/submit?remark=" + remark.value
      });
    };
    return (_ctx, _cache) => {
      return {
        a: remark.value,
        b: common_vendor.o(($event) => remark.value = $event.detail.value),
        c: common_vendor.t(remark.value.length),
        d: common_vendor.o(($event) => returnToSubmit())
      };
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cc1c9952"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/remark/remark.vue"]]);
wx.createPage(MiniProgramPage);
