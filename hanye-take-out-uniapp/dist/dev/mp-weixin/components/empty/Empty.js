"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "Empty",
  props: {
    isSearch: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(!props.isSearch ? "这里空空如也~" : "Sorry，木有找到您搜索的内容哦~")
      };
    };
  }
});
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-aaa00962"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/components/empty/Empty.vue"]]);
wx.createComponent(Component);
