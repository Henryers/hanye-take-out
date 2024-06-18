"use strict";
const common_vendor = require("../../common/vendor.js");
const api_shop = require("../../api/shop.js");
const api_category = require("../../api/category.js");
const api_dish = require("../../api/dish.js");
const api_setmeal = require("../../api/setmeal.js");
const api_cart = require("../../api/cart.js");
require("../../utils/http.js");
require("../../stores/modules/user.js");
if (!Math) {
  Navbar();
}
const Navbar = () => "./components/Navbar.js";
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "order",
  setup(__props) {
    const status = common_vendor.ref(true);
    const categoryList = common_vendor.ref([]);
    const activeIndex = common_vendor.ref(0);
    common_vendor.ref(0);
    const dishList = common_vendor.ref([]);
    common_vendor.ref([]);
    const openCartList = common_vendor.ref(false);
    const cartList = common_vendor.ref([]);
    const CartAllNumber = common_vendor.ref(0);
    const CartAllPrice = common_vendor.ref(0);
    const visible = common_vendor.ref(false);
    const dialogDish = common_vendor.ref();
    const flavors = common_vendor.ref([]);
    const chosedflavors = common_vendor.ref([]);
    const getCategoryData = async () => {
      const res = await api_category.getCategoryAPI();
      console.log(res);
      categoryList.value = res.data;
      console.log("categoryList", categoryList.value);
    };
    const getDishOrSetmealList = async (index) => {
      activeIndex.value = index;
      console.log("index", index);
      console.log("getList by this category", categoryList.value[index]);
      let res;
      if (categoryList.value[index].type === 1) {
        res = await api_dish.getDishListAPI(categoryList.value[index].id);
      } else {
        res = await api_setmeal.getSetmealListAPI(categoryList.value[index].id);
      }
      console.log(res);
      dishList.value = res.data;
    };
    const getCartList = async () => {
      const res = await api_cart.getCartAPI();
      console.log("初始化购物车列表", res);
      cartList.value = res.data;
      CartAllNumber.value = cartList.value.reduce((acc, cur) => acc + cur.number, 0);
      CartAllPrice.value = cartList.value.reduce((acc, cur) => acc + cur.amount * cur.number, 0);
      console.log("CartAllNumber", CartAllNumber.value);
      console.log("CartAllPrice", CartAllPrice.value);
      if (cartList.value.length === 0) {
        openCartList.value = false;
      }
    };
    const chooseNorm = async (dish) => {
      console.log("点击了选择规格chooseNorm，得到了该菜品的所有口味数据", dish.flavors);
      flavors.value = dish.flavors;
      const tmpdish = Object.assign({}, dish);
      delete tmpdish.flavors;
      dialogDish.value = tmpdish;
      const moreNormdata = dish.flavors.map((obj) => ({ ...obj, list: JSON.parse(obj.list) }));
      moreNormdata.forEach((item) => {
        if (item.list && item.list.length > 0) {
          chosedflavors.value.push(item.list[0]);
        }
      });
      visible.value = true;
    };
    const chooseFlavor = (obj, flavor) => {
      console.log("chooseFlavor", flavor);
      let ind = -1;
      let findst = obj.some((n) => {
        ind = chosedflavors.value.findIndex((o) => o == n);
        return ind != -1;
      });
      const indexInChosed = chosedflavors.value.findIndex((it) => it == flavor);
      console.log("ind", ind);
      console.log("indexInChosed", indexInChosed);
      if (indexInChosed == -1 && !findst) {
        console.log("1、当前口味没选过，且当前行没选过口味");
        chosedflavors.value.push(flavor);
      } else if (indexInChosed == -1 && findst && ind >= 0) {
        console.log("2、当前口味没选过，但当前行选过口味，替换掉当前行选过的口味");
        chosedflavors.value.splice(ind, 1);
        chosedflavors.value.push(flavor);
      } else {
        console.log("3、当前口味选过，进行反选操作，也就是直接删除");
        chosedflavors.value.splice(indexInChosed, 1);
      }
      dialogDish.value.flavors = chosedflavors.value.join(",");
      console.log("选好口味后，看看带口味字符串的，dialog中的菜品长什么样？ dialogDish", dialogDish.value);
    };
    const getCopies = (dish) => {
      var _a, _b;
      console.log("getCopies", dish);
      if (categoryList.value[activeIndex.value].sort < 20) {
        return ((_a = cartList.value.find((item) => item.dishId === dish.id)) == null ? void 0 : _a.number) || 0;
      } else {
        return ((_b = cartList.value.find((item) => item.setmealId === dish.id)) == null ? void 0 : _b.number) || 0;
      }
    };
    const addToCart = async (dish) => {
      console.log("addToCart", dish);
      if (!chosedflavors.value || chosedflavors.value.length <= 0) {
        common_vendor.index.showToast({
          title: "请选择规格",
          icon: "none"
        });
        return false;
      }
      const partialCart = { dishId: dish.id, dishFlavor: chosedflavors.value.join(",") };
      await api_cart.addToCartAPI(partialCart);
      await getCartList();
      chosedflavors.value = [];
      visible.value = false;
    };
    const addDishAction = async (item, form) => {
      console.log("点击了dialog的 “+” 添加菜品数量按钮", item, form);
      console.log(categoryList.value[activeIndex.value].sort < 20);
      if (form == "购物车") {
        console.log("addCart", item);
        const partialCart = {
          dishId: item.dishId,
          setmealId: item.setmealId,
          dishFlavor: item.dishFlavor
        };
        await api_cart.addToCartAPI(partialCart);
      } else {
        console.log("普通页面下的dish，点击能直接添加(而不弹出dialog)的菜品说明无口味", item);
        if (categoryList.value[activeIndex.value].sort < 20) {
          const partialCart = { dishId: item.id };
          await api_cart.addToCartAPI(partialCart);
        } else {
          const partialCart = { setmealId: item.id };
          await api_cart.addToCartAPI(partialCart);
        }
      }
      await getCartList();
    };
    const subDishAction = async (item, form) => {
      console.log("点击了减少菜品数量按钮subDishAction--------------------", item, form);
      if (form == "购物车") {
        console.log("subCart", item);
        const partialCart = {
          dishId: item.dishId,
          setmealId: item.setmealId,
          dishFlavor: item.dishFlavor
        };
        await api_cart.subCartAPI(partialCart);
      } else {
        console.log("普通页面下的dish，不是dialog中的菜品说明无口味", item);
        if (categoryList.value[activeIndex.value].sort < 20) {
          const partialCart = { dishId: item.id };
          await api_cart.subCartAPI(partialCart);
        } else {
          const partialCart = { setmealId: item.id };
          await api_cart.subCartAPI(partialCart);
        }
      }
      await getCartList();
    };
    const clearCart = async () => {
      await api_cart.cleanCartAPI();
      await getCartList();
      openCartList.value = false;
    };
    const submitOrder = () => {
      console.log("submitOrder");
      common_vendor.index.navigateTo({
        url: "/pages/submit/submit"
      });
    };
    const goBack = () => {
      common_vendor.index.switchTab({ url: "/pages/index/index" });
    };
    common_vendor.onLoad(async () => {
      const res = await api_shop.getStatusAPI();
      console.log("店铺状态---------", res);
      status.value = res.data === 1 ? true : false;
      await getCategoryData();
      await getDishOrSetmealList(0);
      await getCartList();
    });
    common_vendor.onShow(async () => {
      await getCategoryData();
      await getCartList();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(categoryList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.name),
            b: item.id,
            c: index === activeIndex.value ? 1 : "",
            d: common_vendor.o(($event) => getDishOrSetmealList(index), item.id)
          };
        }),
        b: common_vendor.f(dishList.value, (dish, k0, i0) => {
          return common_vendor.e({
            a: dish.pic,
            b: common_vendor.t(dish.name),
            c: common_vendor.t(dish.detail),
            d: common_vendor.t(dish.price),
            e: "flavors" in dish && dish.flavors.length > 0
          }, "flavors" in dish && dish.flavors.length > 0 ? {
            f: common_vendor.o(($event) => chooseNorm(dish), dish.id)
          } : common_vendor.e({
            g: getCopies(dish) > 0
          }, getCopies(dish) > 0 ? {
            h: common_vendor.o(($event) => subDishAction(dish, "普通"), dish.id)
          } : {}, {
            i: getCopies(dish) > 0
          }, getCopies(dish) > 0 ? {
            j: common_vendor.t(getCopies(dish))
          } : {}, {
            k: common_vendor.o(($event) => addDishAction(dish, "普通"), dish.id)
          }), {
            l: dish.id,
            m: `/pages/detail/detail?${categoryList.value[activeIndex.value].sort < 20 ? "dishId" : "setmealId"}=${dish.id}`
          });
        }),
        c: common_vendor.f(flavors.value, (flavor, k0, i0) => {
          return {
            a: common_vendor.t(flavor.name),
            b: common_vendor.f(JSON.parse(flavor.list), (item, index, i1) => {
              return {
                a: common_vendor.t(item),
                b: chosedflavors.value.findIndex((it) => item === it) !== -1 ? 1 : "",
                c: index,
                d: common_vendor.o(($event) => chooseFlavor(JSON.parse(flavor.list), item), index)
              };
            }),
            c: flavor.name
          };
        }),
        d: common_vendor.o(($event) => addToCart(dialogDish.value)),
        e: common_vendor.o(($event) => visible.value = false),
        f: visible.value,
        g: cartList.value.length === 0
      }, cartList.value.length === 0 ? {} : {
        h: common_vendor.t(CartAllNumber.value),
        i: common_vendor.t(parseFloat((Math.round(CartAllPrice.value * 100) / 100).toFixed(2))),
        j: common_vendor.o(($event) => submitOrder()),
        k: common_vendor.o(() => openCartList.value = !openCartList.value)
      }, {
        l: common_vendor.o(($event) => clearCart()),
        m: common_vendor.f(cartList.value, (obj, index, i0) => {
          return common_vendor.e({
            a: obj.pic,
            b: common_vendor.t(obj.name),
            c: common_vendor.t(obj.amount),
            d: common_vendor.t(obj.dishFlavor),
            e: obj.number && obj.number > 0
          }, obj.number && obj.number > 0 ? {
            f: common_vendor.o(($event) => subDishAction(obj, "购物车"), index)
          } : {}, {
            g: obj.number && obj.number > 0
          }, obj.number && obj.number > 0 ? {
            h: common_vendor.t(obj.number)
          } : {}, {
            i: common_vendor.o(($event) => addDishAction(obj, "购物车"), index),
            j: index
          });
        }),
        n: common_vendor.o(($event) => openCartList.value = openCartList.value),
        o: openCartList.value,
        p: common_vendor.o(($event) => openCartList.value = !openCartList.value),
        q: !status.value,
        r: common_vendor.o(goBack)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-88bf5328"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/order/order.vue"]]);
wx.createPage(MiniProgramPage);
