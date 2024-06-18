"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "uniTransition",
  emits: ["click", "change"],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    modeClass: {
      type: [Array, String],
      default() {
        return "fade";
      }
    },
    duration: {
      type: Number,
      default: 300
    },
    styles: {
      type: Object,
      default() {
        return {};
      }
    },
    customClass: {
      type: String,
      default: ""
    },
    onceRender: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false,
      transform: "",
      opacity: 1,
      animationData: {},
      durationTime: 300,
      config: {}
    };
  },
  watch: {
    show: {
      handler(newVal) {
        if (newVal) {
          this.open();
        } else {
          if (this.isShow) {
            this.close();
          }
        }
      },
      immediate: true
    }
  },
  computed: {
    // 生成样式数据
    stylesObject() {
      let styles = {
        ...this.styles,
        "transition-duration": this.duration / 1e3 + "s"
      };
      let transform = "";
      for (let i in styles) {
        let line = this.toLine(i);
        transform += line + ":" + styles[i] + ";";
      }
      return transform;
    },
    // 初始化动画条件
    transformStyles() {
      return "transform:" + this.transform + ";opacity:" + this.opacity + ";" + this.stylesObject;
    }
  },
  created() {
    this.config = {
      duration: this.duration,
      timingFunction: "ease",
      transformOrigin: "50% 50%",
      delay: 0
    };
    this.durationTime = this.duration;
  },
  methods: {
    /**
     *  ref 触发 初始化动画
     */
    init(obj = {}) {
      if (obj.duration) {
        this.durationTime = obj.duration;
      }
      this.animation = common_vendor.createAnimation(Object.assign(this.config, obj), this);
    },
    /**
     * 点击组件触发回调
     */
    onClick() {
      this.$emit("click", {
        detail: this.isShow
      });
    },
    /**
     * ref 触发 动画分组
     * @param {Object} obj
     */
    step(obj, config = {}) {
      if (!this.animation)
        return;
      for (let i in obj) {
        try {
          if (typeof obj[i] === "object") {
            this.animation[i](...obj[i]);
          } else {
            this.animation[i](obj[i]);
          }
        } catch (e) {
          console.error(`方法 ${i} 不存在`);
        }
      }
      this.animation.step(config);
      return this;
    },
    /**
     *  ref 触发 执行动画
     */
    run(fn) {
      if (!this.animation)
        return;
      this.animation.run(fn);
    },
    // 开始过度动画
    open() {
      clearTimeout(this.timer);
      this.transform = "";
      this.isShow = true;
      let { opacity, transform } = this.styleInit(false);
      if (typeof opacity !== "undefined") {
        this.opacity = opacity;
      }
      this.transform = transform;
      this.$nextTick(() => {
        this.timer = setTimeout(() => {
          this.animation = common_vendor.createAnimation(this.config, this);
          this.tranfromInit(false).step();
          this.animation.run();
          this.$emit("change", {
            detail: this.isShow
          });
        }, 20);
      });
    },
    // 关闭过度动画
    close(type) {
      if (!this.animation)
        return;
      this.tranfromInit(true).step().run(() => {
        this.isShow = false;
        this.animationData = null;
        this.animation = null;
        let { opacity, transform } = this.styleInit(false);
        this.opacity = opacity || 1;
        this.transform = transform;
        this.$emit("change", {
          detail: this.isShow
        });
      });
    },
    // 处理动画开始前的默认样式
    styleInit(type) {
      let styles = {
        transform: ""
      };
      let buildStyle = (type2, mode) => {
        if (mode === "fade") {
          styles.opacity = this.animationType(type2)[mode];
        } else {
          styles.transform += this.animationType(type2)[mode] + " ";
        }
      };
      if (typeof this.modeClass === "string") {
        buildStyle(type, this.modeClass);
      } else {
        this.modeClass.forEach((mode) => {
          buildStyle(type, mode);
        });
      }
      return styles;
    },
    // 处理内置组合动画
    tranfromInit(type) {
      let buildTranfrom = (type2, mode) => {
        let aniNum = null;
        if (mode === "fade") {
          aniNum = type2 ? 0 : 1;
        } else {
          aniNum = type2 ? "-100%" : "0";
          if (mode === "zoom-in") {
            aniNum = type2 ? 0.8 : 1;
          }
          if (mode === "zoom-out") {
            aniNum = type2 ? 1.2 : 1;
          }
          if (mode === "slide-right") {
            aniNum = type2 ? "100%" : "0";
          }
          if (mode === "slide-bottom") {
            aniNum = type2 ? "100%" : "0";
          }
        }
        this.animation[this.animationMode()[mode]](aniNum);
      };
      if (typeof this.modeClass === "string") {
        buildTranfrom(type, this.modeClass);
      } else {
        this.modeClass.forEach((mode) => {
          buildTranfrom(type, mode);
        });
      }
      return this.animation;
    },
    animationType(type) {
      return {
        fade: type ? 1 : 0,
        "slide-top": `translateY(${type ? "0" : "-100%"})`,
        "slide-right": `translateX(${type ? "0" : "100%"})`,
        "slide-bottom": `translateY(${type ? "0" : "100%"})`,
        "slide-left": `translateX(${type ? "0" : "-100%"})`,
        "zoom-in": `scaleX(${type ? 1 : 0.8}) scaleY(${type ? 1 : 0.8})`,
        "zoom-out": `scaleX(${type ? 1 : 1.2}) scaleY(${type ? 1 : 1.2})`
      };
    },
    // 内置动画类型与实际动画对应字典
    animationMode() {
      return {
        fade: "opacity",
        "slide-top": "translateY",
        "slide-right": "translateX",
        "slide-bottom": "translateY",
        "slide-left": "translateX",
        "zoom-in": "scale",
        "zoom-out": "scale"
      };
    },
    // 驼峰转中横线
    toLine(name) {
      return name.replace(/([A-Z])/g, "-$1").toLowerCase();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.isShow,
    b: $data.animationData,
    c: common_vendor.n($props.customClass),
    d: common_vendor.s($options.transformStyles),
    e: common_vendor.o((...args) => $options.onClick && $options.onClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/node_modules/@dcloudio/uni-ui/lib/uni-transition/uni-transition.vue"]]);
wx.createComponent(Component);
