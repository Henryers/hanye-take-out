"use strict";
const common_vendor = require("../../common/vendor.js");
const api_address = require("../../api/address.js");
const stores_modules_address = require("../../stores/modules/address.js");
require("../../utils/http.js");
require("../../stores/modules/user.js");
if (!Math) {
  Empty();
}
const Empty = () => "../../components/empty/Empty.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "address",
  setup(__props) {
    const store = stores_modules_address.useAddressStore();
    const testValue = common_vendor.ref(true);
    const addressList = common_vendor.ref([]);
    const addressBackUrl = store.addressBackUrl;
    const statusBarHeight = common_vendor.computed(() => common_vendor.index.getSystemInfoSync().statusBarHeight + "px");
    common_vendor.onMounted(() => {
      getAddressList();
    });
    const getAddressList = async () => {
      testValue.value = false;
      const res = await api_address.getAddressListAPI();
      if (res.code === 0) {
        testValue.value = true;
        addressList.value = res.data;
      }
    };
    const trans = (item) => {
      if (item === "公司") {
        return "1";
      } else if (item === "家") {
        return "2";
      } else if (item === "学校") {
        return "3";
      } else {
        return "4";
      }
    };
    const getLableVal = (item) => {
      if (item === null) {
        return "其他";
      }
      return item;
    };
    const addOrEdit = (type, item) => {
      if (type === "新增") {
        common_vendor.index.redirectTo({
          url: "/pages/addOrEditAddress/addOrEditAddress"
        });
      } else {
        console.log("我要去编辑地址页面！！！  item", item);
        common_vendor.index.redirectTo({
          url: "/pages/addOrEditAddress/addOrEditAddress?type=编辑&id=" + item.id
        });
      }
    };
    const choseAddress = (e, item) => {
      console.log("addressBackUrl", addressBackUrl);
      if (addressBackUrl !== "/pages/submit/submit") {
        return false;
      }
      common_vendor.index.redirectTo({
        url: "/pages/submit/submit?address=" + JSON.stringify(item)
      });
    };
    const getRadio = async (e, item) => {
      const res = await api_address.updateDefaultAddressAPI({ id: item.id });
      if (res.code === 0) {
        common_vendor.index.showToast({
          title: "默认地址设置成功",
          duration: 2e3,
          icon: "none"
        });
        getAddressList();
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: addressList.value && addressList.value.length > 0
      }, addressList.value && addressList.value.length > 0 ? {
        b: common_vendor.f(addressList.value, (item, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(getLableVal(item.label)),
            b: common_vendor.n("tag" + trans(item.label)),
            c: common_vendor.t(item.provinceName),
            d: common_vendor.t(item.cityName),
            e: common_vendor.t(item.districtName),
            f: common_vendor.t(item.detail),
            g: common_vendor.t(item.gender === 1 ? item.consignee + " 男士" : item.consignee + " 女士"),
            h: common_vendor.t(item.phone),
            i: common_vendor.o(($event) => addOrEdit("编辑", item), index),
            j: common_vendor.o(($event) => choseAddress(index, item), index)
          }, testValue.value ? {
            k: String(item.id),
            l: item.isDefault === 1,
            m: common_vendor.o(($event) => getRadio(index, item), index)
          } : {}, {
            n: common_vendor.o(($event) => getRadio(index, item), index),
            o: index
          });
        }),
        c: testValue.value
      } : {
        d: common_vendor.p({
          boxHeight: "100%",
          textLabel: "暂无地址"
        })
      }, {
        e: common_vendor.o(($event) => addOrEdit("新增", 0)),
        f: `calc(100% - 136rpx - ${statusBarHeight.value} - 44px - 20rpx)`
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-2312e3da"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/address/address.vue"]]);
wx.createPage(MiniProgramPage);
