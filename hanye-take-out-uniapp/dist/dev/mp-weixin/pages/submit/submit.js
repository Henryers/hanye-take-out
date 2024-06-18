"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const api_cart = require("../../api/cart.js");
const api_order = require("../../api/order.js");
const stores_modules_address = require("../../stores/modules/address.js");
require("../../utils/http.js");
require("../../stores/modules/user.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "submit",
  setup(__props) {
    const store = stores_modules_address.useAddressStore();
    const cartList = common_vendor.ref([]);
    const CartAllNumber = common_vendor.ref(0);
    const CartAllPrice = common_vendor.ref(0);
    const address = common_vendor.ref("");
    const label = common_vendor.ref("");
    const consignee = common_vendor.ref("");
    const gender = common_vendor.ref(0);
    const phoneNumber = common_vendor.ref("");
    const estimatedDeliveryTime = common_vendor.ref("");
    common_vendor.ref("ios");
    const openCooker = common_vendor.ref(false);
    const cookerNum = common_vendor.ref(-2);
    const cookers = common_vendor.ref([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    const radioStatus = common_vendor.ref(false);
    const remark = common_vendor.ref("");
    const arrivalTime = common_vendor.ref("");
    const addressId = common_vendor.ref(0);
    const getCartList = async () => {
      const res = await api_cart.getCartAPI();
      console.log("初始化购物车列表", res);
      cartList.value = res.data;
      CartAllNumber.value = cartList.value.reduce((acc, cur) => acc + cur.number, 0);
      CartAllPrice.value = cartList.value.reduce((acc, cur) => acc + cur.amount * cur.number, 0) + CartAllNumber.value + 6;
      console.log("CartAllNumber", CartAllNumber.value);
      console.log("CartAllPrice", CartAllPrice.value);
    };
    common_vendor.onLoad(async (options) => {
      await getAddressBookDefault();
      console.log("options", options);
      if (options.address) {
        const addressObj = JSON.parse(options.address);
        label.value = addressObj.label;
        address.value = addressObj.provinceName + addressObj.cityName + addressObj.districtName + addressObj.detail;
        phoneNumber.value = addressObj.phone;
        consignee.value = addressObj.consignee;
      } else if (options.remark) {
        remark.value = options.remark;
      }
      console.log("address", address.value);
      await getCartList();
      getHarfAnOur();
      if (store.defaultCook === "无需餐具") {
        cookerNum.value = -1;
      } else if (store.defaultCook === "商家依据餐量提供") {
        cookerNum.value = 0;
      }
    });
    common_vendor.onShow(async (options) => {
      console.log("options", options);
      await getCartList();
    });
    const DateToStr = (date) => {
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hours = date.getHours();
      var min = date.getMinutes();
      var second = date.getSeconds();
      return year + "-" + (month + 1 > 9 ? month + 1 : "0" + (month + 1)) + "-" + (day > 9 ? day : "0" + day) + " " + (hours > 9 ? hours : "0" + hours) + ":" + (min > 9 ? min : "0" + min) + ":" + (second > 9 ? second : "0" + second);
    };
    const getHarfAnOur = () => {
      const date = /* @__PURE__ */ new Date();
      date.setTime(date.getTime() + 36e5);
      const formattedDate = DateToStr(date);
      estimatedDeliveryTime.value = formattedDate;
      let hours = date.getHours();
      let minutes = date.getMinutes();
      if (hours < 10)
        hours = parseInt("0" + hours);
      if (minutes < 10)
        minutes = parseInt("0" + minutes);
      arrivalTime.value = hours + ":" + minutes;
    };
    const getAddressBookDefault = async () => {
      const res = await api_address.getDefaultAddressAPI();
      if (res.code === 0) {
        console.log("默认地址", res.data);
        addressId.value = 0;
        if (res.data.provinceName) {
          address.value = res.data.provinceName + res.data.cityName + res.data.districtName + res.data.detail;
        }
        phoneNumber.value = res.data.phone;
        consignee.value = res.data.consignee;
        gender.value = res.data.gender;
        addressId.value = res.data.id;
      }
    };
    const trans = (item) => {
      switch (item) {
        case "公司":
          return "1";
        case "家":
          return "2";
        case "学校":
          return "3";
        default:
          return "4";
      }
    };
    const goAddress = () => {
      store.addressBackUrl = "/pages/submit/submit";
      common_vendor.index.redirectTo({
        url: "/pages/address/address"
      });
    };
    const goRemark = () => {
      common_vendor.index.redirectTo({
        url: "/pages/remark/remark"
      });
    };
    const chooseCooker = () => {
      openCooker.value = true;
    };
    const getCookerInfo = () => {
      if (cookerNum.value === -2)
        return "请依据实际情况填写，避免浪费";
      else if (cookerNum.value === -1)
        return "无需餐具";
      else if (cookerNum.value === 0)
        return "商家依据餐量提供";
      else if (cookerNum.value === 11)
        return "10份以上";
      else
        return cookerNum.value + "份";
    };
    const pickerChange = (ev) => {
      console.log(ev.detail.value);
      cookerNum.value = ev.detail.value[0] - 1;
    };
    const radioChange = () => {
      radioStatus.value = !radioStatus.value;
      if (radioStatus.value) {
        store.defaultCook = cookerNum.value === -1 ? "无需餐具" : "商家依据餐量提供";
      } else {
        store.defaultCook = "请依据实际情况填写，避免浪费";
      }
    };
    const closeMask = () => {
      openCooker.value = false;
    };
    const payOrderHandle = async () => {
      const unPayRes = await api_order.getUnPayOrderAPI();
      console.log("未支付订单", unPayRes);
      if (unPayRes.data !== 0) {
        console.log("有未支付订单", unPayRes.data);
        common_vendor.index.showToast({
          title: "有未支付订单，请先支付或取消！",
          icon: "none"
        });
        return false;
      }
      if (!address.value) {
        common_vendor.index.showToast({
          title: "请选择收货地址",
          icon: "none"
        });
        return false;
      }
      if (cookerNum.value === -2) {
        common_vendor.index.showToast({
          title: "请选择餐具份数",
          icon: "none"
        });
        return false;
      }
      const params = {
        payMethod: 1,
        addressId: addressId.value,
        remark: remark.value,
        estimatedDeliveryTime: estimatedDeliveryTime.value,
        // 预计到达时间
        deliveryStatus: 1,
        // 立即送出
        tablewareNumber: cookerNum.value,
        // 餐具份数
        tablewareStatus: cookerNum.value === 0 ? 1 : 0,
        // 餐具状态: 1按餐量提供，0选择具体数量
        packAmount: CartAllNumber.value,
        amount: CartAllPrice.value
      };
      console.log("生成订单params", params);
      const res = await api_order.submitOrderAPI(params);
      if (res.code === 0) {
        console.log("订单生成成功", res.data);
        common_vendor.index.redirectTo({
          url: "/pages/pay/pay?orderId=" + res.data.id + "&orderAmount=" + res.data.orderAmount + "&orderNumber=" + res.data.orderNumber + "&orderTime=" + res.data.orderTime
        });
      } else {
        common_vendor.index.showToast({
          title: res.msg || "操作失败",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !address.value
      }, !address.value ? {} : {}, {
        b: address.value
      }, address.value ? {
        c: common_vendor.t(label.value || "其他"),
        d: common_vendor.n("tag" + trans(label.value)),
        e: common_vendor.t(address.value),
        f: common_vendor.t(consignee.value),
        g: common_vendor.t(phoneNumber.value)
      } : {}, {
        h: common_vendor.o(goAddress),
        i: common_vendor.t(arrivalTime.value),
        j: common_vendor.f(cartList.value, (obj, index, i0) => {
          return common_vendor.e({
            a: obj.pic,
            b: common_vendor.t(obj.name),
            c: obj.dishFlavor
          }, obj.dishFlavor ? {
            d: common_vendor.t(obj.dishFlavor)
          } : {}, {
            e: obj.number && obj.number > 0
          }, obj.number && obj.number > 0 ? {
            f: common_vendor.t(obj.number)
          } : {}, {
            g: common_vendor.t(obj.amount),
            h: index
          });
        }),
        k: common_vendor.t(CartAllNumber.value),
        l: common_vendor.t(CartAllPrice.value),
        m: common_vendor.t(remark.value || "选择口味等"),
        n: common_vendor.o(goRemark),
        o: common_vendor.t(getCookerInfo()),
        p: common_vendor.o(chooseCooker),
        q: common_vendor.t(CartAllNumber.value),
        r: common_vendor.t(parseFloat((Math.round(CartAllPrice.value * 100) / 100).toFixed(2))),
        s: common_vendor.o(($event) => payOrderHandle()),
        t: common_vendor.o(closeMask),
        v: common_vendor.f(cookers.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item === -1 ? "无需餐具" : item === 0 ? "商家依据餐量提供" : item === 11 ? "10份以上" : item + "份"),
            b: item
          };
        }),
        w: cookers.value,
        x: common_vendor.o(pickerChange),
        y: radioStatus.value,
        z: common_vendor.o(radioChange),
        A: common_vendor.t(cookerNum.value === -2 || cookerNum.value === -1 ? "以后都无需餐具" : "以后都需要餐具，商家依据餐量提供"),
        B: common_vendor.o(($event) => openCooker.value = !openCooker.value),
        C: common_vendor.o(($event) => openCooker.value = openCooker.value),
        D: openCooker.value,
        E: common_vendor.o(($event) => openCooker.value = !openCooker.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fb87e98c"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/submit/submit.vue"]]);
wx.createPage(MiniProgramPage);
