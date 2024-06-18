"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "uniPopup",
  components: {},
  emits: ["change", "maskClick"],
  props: {
    // 开启动画
    animation: {
      type: Boolean,
      default: true
    },
    // 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层
    // message: 消息提示 ; dialog : 对话框
    type: {
      type: String,
      default: "center"
    },
    // maskClick
    isMaskClick: {
      type: Boolean,
      default: null
    },
    // TODO 2 个版本后废弃属性 ，使用 isMaskClick
    maskClick: {
      type: Boolean,
      default: null
    },
    backgroundColor: {
      type: String,
      default: "none"
    },
    safeArea: {
      type: Boolean,
      default: true
    },
    maskBackgroundColor: {
      type: String,
      default: "rgba(0, 0, 0, 0.4)"
    },
    borderRadius: {
      type: String
    }
  },
  watch: {
    /**
     * 监听type类型
     */
    type: {
      handler: function(type) {
        if (!this.config[type])
          return;
        this[this.config[type]](true);
      },
      immediate: true
    },
    isDesktop: {
      handler: function(newVal) {
        if (!this.config[newVal])
          return;
        this[this.config[this.type]](true);
      },
      immediate: true
    },
    /**
     * 监听遮罩是否可点击
     * @param {Object} val
     */
    maskClick: {
      handler: function(val) {
        this.mkclick = val;
      },
      immediate: true
    },
    isMaskClick: {
      handler: function(val) {
        this.mkclick = val;
      },
      immediate: true
    },
    // H5 下禁止底部滚动
    showPopup(show) {
    }
  },
  data() {
    return {
      duration: 300,
      ani: [],
      showPopup: false,
      showTrans: false,
      popupWidth: 0,
      popupHeight: 0,
      config: {
        top: "top",
        bottom: "bottom",
        center: "center",
        left: "left",
        right: "right",
        message: "top",
        dialog: "center",
        share: "bottom"
      },
      maskClass: {
        position: "fixed",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)"
      },
      transClass: {
        backgroundColor: "transparent",
        borderRadius: this.borderRadius || "0",
        position: "fixed",
        left: 0,
        right: 0
      },
      maskShow: true,
      mkclick: true,
      popupstyle: "top"
    };
  },
  computed: {
    getStyles() {
      let res = { backgroundColor: this.bg };
      if (this.borderRadius || "0") {
        res = Object.assign(res, { borderRadius: this.borderRadius });
      }
      return res;
    },
    isDesktop() {
      return this.popupWidth >= 500 && this.popupHeight >= 500;
    },
    bg() {
      if (this.backgroundColor === "" || this.backgroundColor === "none") {
        return "transparent";
      }
      return this.backgroundColor;
    }
  },
  mounted() {
    const fixSize = () => {
      const {
        windowWidth,
        windowHeight,
        windowTop,
        safeArea,
        screenHeight,
        safeAreaInsets
      } = common_vendor.index.getSystemInfoSync();
      this.popupWidth = windowWidth;
      this.popupHeight = windowHeight + (windowTop || 0);
      if (safeArea && this.safeArea) {
        this.safeAreaInsets = screenHeight - safeArea.bottom;
      } else {
        this.safeAreaInsets = 0;
      }
    };
    fixSize();
  },
  // TODO vue3
  unmounted() {
    this.setH5Visible();
  },
  activated() {
    this.setH5Visible(!this.showPopup);
  },
  deactivated() {
    this.setH5Visible(true);
  },
  created() {
    if (this.isMaskClick === null && this.maskClick === null) {
      this.mkclick = true;
    } else {
      this.mkclick = this.isMaskClick !== null ? this.isMaskClick : this.maskClick;
    }
    if (this.animation) {
      this.duration = 300;
    } else {
      this.duration = 0;
    }
    this.messageChild = null;
    this.clearPropagation = false;
    this.maskClass.backgroundColor = this.maskBackgroundColor;
  },
  methods: {
    setH5Visible(visible = true) {
    },
    /**
     * 公用方法，不显示遮罩层
     */
    closeMask() {
      this.maskShow = false;
    },
    /**
     * 公用方法，遮罩层禁止点击
     */
    disableMask() {
      this.mkclick = false;
    },
    // TODO nvue 取消冒泡
    clear(e) {
      e.stopPropagation();
      this.clearPropagation = true;
    },
    open(direction) {
      if (this.showPopup) {
        return;
      }
      let innerType = ["top", "center", "bottom", "left", "right", "message", "dialog", "share"];
      if (!(direction && innerType.indexOf(direction) !== -1)) {
        direction = this.type;
      }
      if (!this.config[direction]) {
        console.error("缺少类型：", direction);
        return;
      }
      this[this.config[direction]]();
      this.$emit("change", {
        show: true,
        type: direction
      });
    },
    close(type) {
      this.showTrans = false;
      this.$emit("change", {
        show: false,
        type: this.type
      });
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.showPopup = false;
      }, 300);
    },
    // TODO 处理冒泡事件，头条的冒泡事件有问题 ，先这样兼容
    touchstart() {
      this.clearPropagation = false;
    },
    onTap() {
      if (this.clearPropagation) {
        this.clearPropagation = false;
        return;
      }
      this.$emit("maskClick");
      if (!this.mkclick)
        return;
      this.close();
    },
    /**
     * 顶部弹出样式处理
     */
    top(type) {
      this.popupstyle = this.isDesktop ? "fixforpc-top" : "top";
      this.ani = ["slide-top"];
      this.transClass = {
        position: "fixed",
        left: 0,
        right: 0,
        backgroundColor: this.bg,
        borderRadius: this.borderRadius || "0"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
      this.$nextTick(() => {
        if (this.messageChild && this.type === "message") {
          this.messageChild.timerClose();
        }
      });
    },
    /**
     * 底部弹出样式处理
     */
    bottom(type) {
      this.popupstyle = "bottom";
      this.ani = ["slide-bottom"];
      this.transClass = {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: this.safeAreaInsets + "px",
        backgroundColor: this.bg,
        borderRadius: this.borderRadius || "0"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    /**
     * 中间弹出样式处理
     */
    center(type) {
      this.popupstyle = "center";
      this.ani = ["fade"];
      this.transClass = {
        position: "fixed",
        display: "flex",
        flexDirection: "column",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: this.borderRadius || "0"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    left(type) {
      this.popupstyle = "left";
      this.ani = ["slide-left"];
      this.transClass = {
        position: "fixed",
        left: 0,
        bottom: 0,
        top: 0,
        backgroundColor: this.bg,
        borderRadius: this.borderRadius || "0",
        display: "flex",
        flexDirection: "column"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    },
    right(type) {
      this.popupstyle = "right";
      this.ani = ["slide-right"];
      this.transClass = {
        position: "fixed",
        bottom: 0,
        right: 0,
        top: 0,
        backgroundColor: this.bg,
        borderRadius: this.borderRadius || "0",
        display: "flex",
        flexDirection: "column"
      };
      if (type)
        return;
      this.showPopup = true;
      this.showTrans = true;
    }
  }
};
if (!Array) {
  const _easycom_uni_transition2 = common_vendor.resolveComponent("uni-transition");
  _easycom_uni_transition2();
}
const _easycom_uni_transition = () => "../uni-transition/uni-transition.js";
if (!Math) {
  _easycom_uni_transition();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.showPopup
  }, $data.showPopup ? common_vendor.e({
    b: $data.maskShow
  }, $data.maskShow ? {
    c: common_vendor.o($options.onTap),
    d: common_vendor.p({
      name: "mask",
      ["mode-class"]: "fade",
      styles: $data.maskClass,
      duration: $data.duration,
      show: $data.showTrans
    })
  } : {}, {
    e: common_vendor.s($options.getStyles),
    f: common_vendor.n($data.popupstyle),
    g: common_vendor.o((...args) => $options.clear && $options.clear(...args)),
    h: common_vendor.o($options.onTap),
    i: common_vendor.p({
      ["mode-class"]: $data.ani,
      name: "content",
      styles: $data.transClass,
      duration: $data.duration,
      show: $data.showTrans
    }),
    j: common_vendor.o((...args) => $options.touchstart && $options.touchstart(...args)),
    k: common_vendor.n($data.popupstyle),
    l: common_vendor.n($options.isDesktop ? "fixforpc-z-index" : "")
  }) : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/node_modules/@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue"]]);
wx.createComponent(Component);
