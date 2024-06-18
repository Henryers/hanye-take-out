"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_modules_user = require("../../stores/modules/user.js");
const api_user = require("../../api/user.js");
require("../../utils/http.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "updateMy",
  setup(__props) {
    const userStore = stores_modules_user.useUserStore();
    const user = common_vendor.reactive({
      id: userStore.profile.id,
      name: "",
      gender: 1,
      phone: "未设置",
      pic: ""
    });
    const items = [
      {
        value: 1,
        name: "男士"
      },
      {
        value: 0,
        name: "女士"
      }
    ];
    common_vendor.onLoad(async () => {
      console.log("userStore", userStore.profile);
      await getUserInfo(user.id);
    });
    const getUserInfo = async (id) => {
      const res = await api_user.getUserInfoAPI(id);
      console.log("用户信息", res);
      user.name = res.data.name;
      user.gender = res.data.gender ?? 1;
      user.phone = res.data.phone;
      user.pic = res.data.pic;
      console.log("user", user);
    };
    const picChange = () => {
      console.log("picChange");
      common_vendor.index.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        maxDuration: 15,
        camera: "back",
        // 获取图片成功的回调
        success: (res) => {
          console.log(res);
          const { tempFilePath } = res.tempFiles[0];
          let base64String = "";
          common_vendor.wx$1.getFileSystemManager().readFile({
            filePath: tempFilePath,
            encoding: "base64",
            // 图片转base64成功的回调
            success: (res2) => {
              base64String = "data:image/png;base64," + res2.data;
              console.log(base64String);
              user.pic = base64String;
            }
          });
        }
      });
    };
    const genderChange = (val) => {
      user.gender = val;
      console.log(user.gender);
    };
    const validateForm = () => {
      let valid = true;
      if (!user.name) {
        common_vendor.index.showToast({
          title: "昵称不能为空",
          icon: "none"
        });
        valid = false;
      }
      const phonePattern = /^1[3-9]\d{9}$/;
      if (!user.phone) {
        common_vendor.index.showToast({
          title: "手机号不能为空",
          icon: "none"
        });
        valid = false;
      } else if (!phonePattern.test(user.phone)) {
        common_vendor.index.showToast({
          title: "手机号格式不正确",
          icon: "none"
        });
        valid = false;
      }
      return valid;
    };
    const submit = async () => {
      console.log("submit", user);
      if (!validateForm()) {
        return;
      }
      const res = await api_user.updateUserAPI(user);
      if (res.code === 0) {
        common_vendor.index.showToast({
          title: "修改成功",
          icon: "success"
        });
        common_vendor.index.switchTab({
          url: "/pages/my/my"
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: !user.pic
      }, !user.pic ? {} : {
        b: user.pic
      }, {
        c: common_vendor.o(picChange),
        d: common_vendor.f(items, (item, index, i0) => {
          return common_vendor.e({
            a: item.value != user.gender
          }, item.value != user.gender ? {} : {}, {
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.o(($event) => genderChange(item.value), index)
          });
        }),
        e: user.name,
        f: common_vendor.o(($event) => user.name = $event.detail.value),
        g: user.phone,
        h: common_vendor.o(($event) => user.phone = $event.detail.value),
        i: common_vendor.o(submit)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-cb595a61"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/updateMy/updateMy.vue"]]);
wx.createPage(MiniProgramPage);
