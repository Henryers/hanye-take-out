"use strict";
const common_vendor = require("../../common/vendor.js");
const api_category = require("../../api/category.js");
const api_cart = require("../../api/cart.js");
const api_dish = require("../../api/dish.js");
const api_setmeal = require("../../api/setmeal.js");
require("../../utils/http.js");
require("../../stores/modules/user.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "detail",
  setup(__props) {
    const categoryList = common_vendor.ref([]);
    const dish = common_vendor.ref();
    const setmeal = common_vendor.ref();
    const openCartList = common_vendor.ref(false);
    const cartList = common_vendor.ref([]);
    const CartAllNumber = common_vendor.ref(0);
    const CartAllPrice = common_vendor.ref(0);
    const visible = common_vendor.ref(false);
    const dialogDish = common_vendor.ref();
    const flavors = common_vendor.ref([]);
    const chosedflavors = common_vendor.ref([]);
    common_vendor.onLoad(async (options) => {
      await getCartList();
      await getCategoryData();
      if (options && "dishId" in options) {
        console.log("dishId", options.dishId);
        init(options.dishId, "dishId");
      } else {
        console.log("setmealId", options == null ? void 0 : options.setmealId);
        init(options == null ? void 0 : options.setmealId, "setmealId");
      }
    });
    const init = async (id, type) => {
      let res;
      console.log("init", id, type);
      if (type === "dishId") {
        res = await api_dish.getDishByIdAPI(id);
        dish.value = res.data;
      } else {
        res = await api_setmeal.getSetmealAPI(id);
        setmeal.value = res.data;
      }
      console.log(res);
      console.log(dish.value);
      console.log(setmeal.value);
    };
    const getCategoryData = async () => {
      const res = await api_category.getCategoryAPI();
      console.log(res);
      categoryList.value = res.data;
      console.log("categoryList", categoryList.value);
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
    const getCopies = (dish2) => {
      var _a, _b, _c;
      console.log("getCopies", dish2);
      const sort = (_a = categoryList.value.find((item) => item.id === dish2.categoryId)) == null ? void 0 : _a.sort;
      console.log("category？", sort);
      if (sort && sort < 20) {
        return ((_b = cartList.value.find((item) => item.dishId === dish2.id)) == null ? void 0 : _b.number) || 0;
      } else {
        return ((_c = cartList.value.find((item) => item.setmealId === dish2.id)) == null ? void 0 : _c.number) || 0;
      }
    };
    const chooseNorm = async (dish2) => {
      console.log("点击了选择规格chooseNorm，得到了该菜品的所有口味数据", dish2.flavors);
      flavors.value = dish2.flavors;
      const tmpdish = Object.assign({}, dish2);
      delete tmpdish.flavors;
      dialogDish.value = tmpdish;
      const moreNormdata = dish2.flavors.map((obj) => ({ ...obj, list: JSON.parse(obj.list) }));
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
    const addToCart = async (dish2) => {
      console.log("dialog中点击加入购物车addToCart, dialogdish:", dish2);
      if (!chosedflavors.value || chosedflavors.value.length <= 0) {
        common_vendor.index.showToast({
          title: "请选择规格",
          icon: "none"
        });
        return false;
      }
      const partialCart = { dishId: dish2.id, dishFlavor: chosedflavors.value.join(",") };
      await api_cart.addToCartAPI(partialCart);
      await getCartList();
      chosedflavors.value = [];
      visible.value = false;
    };
    const addDishAction = async (item, form) => {
      console.log("点击了 “+” 添加菜品数量按钮", item, form);
      if (form == "购物车") {
        console.log("addCart", item);
        const partialCart = {
          dishId: item.dishId,
          setmealId: item.setmealId,
          dishFlavor: item.dishFlavor
        };
        await api_cart.addToCartAPI(partialCart);
      } else if (form == "菜品") {
        const partialCart = { dishId: dish.value.id };
        await api_cart.addToCartAPI(partialCart);
      } else {
        const partialCart = { setmealId: setmeal.value.id };
        await api_cart.addToCartAPI(partialCart);
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
      } else if (form == "菜品") {
        const partialCart = { dishId: dish.value.id };
        await api_cart.subCartAPI(partialCart);
      } else {
        const partialCart = { setmealId: setmeal.value.id };
        await api_cart.subCartAPI(partialCart);
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
    return (_ctx, _cache) => {
      var _a;
      return common_vendor.e({
        a: dish.value
      }, dish.value ? common_vendor.e({
        b: dish.value.pic,
        c: common_vendor.t(dish.value.name),
        d: common_vendor.t(dish.value.detail),
        e: common_vendor.t(dish.value.price),
        f: dish.value && "flavors" in dish.value && dish.value.flavors.length > 0
      }, dish.value && "flavors" in dish.value && dish.value.flavors.length > 0 ? {
        g: common_vendor.o(($event) => chooseNorm(dish.value))
      } : common_vendor.e({
        h: getCopies(dish.value) > 0
      }, getCopies(dish.value) > 0 ? {
        i: common_vendor.o(($event) => subDishAction(dish.value, "菜品"))
      } : {}, {
        j: getCopies(dish.value) > 0
      }, getCopies(dish.value) > 0 ? {
        k: common_vendor.t(getCopies(dish.value))
      } : {}, {
        l: common_vendor.o(($event) => addDishAction(dish.value, "菜品"))
      })) : {}, {
        m: setmeal.value
      }, setmeal.value ? common_vendor.e({
        n: common_vendor.f(setmeal.value.setmealDishes, (item, k0, i0) => {
          return {
            a: item.pic,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.detail),
            d: item.name
          };
        }),
        o: common_vendor.t(setmeal.value.detail),
        p: common_vendor.t((_a = setmeal.value) == null ? void 0 : _a.price),
        q: getCopies(setmeal.value) > 0
      }, getCopies(setmeal.value) > 0 ? {
        r: common_vendor.o(($event) => subDishAction(setmeal.value, "套餐"))
      } : {}, {
        s: getCopies(setmeal.value) > 0
      }, getCopies(setmeal.value) > 0 ? {
        t: common_vendor.t(getCopies(setmeal.value))
      } : {}, {
        v: common_vendor.o(($event) => addDishAction(setmeal.value, "套餐"))
      }) : {}, {
        w: common_vendor.f(flavors.value, (flavor, k0, i0) => {
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
        x: common_vendor.o(($event) => addToCart(dialogDish.value)),
        y: visible.value,
        z: cartList.value.length === 0
      }, cartList.value.length === 0 ? {} : {
        A: common_vendor.t(CartAllNumber.value),
        B: common_vendor.t(parseFloat((Math.round(CartAllPrice.value * 100) / 100).toFixed(2))),
        C: common_vendor.o(($event) => submitOrder()),
        D: common_vendor.o(() => openCartList.value = !openCartList.value)
      }, {
        E: common_vendor.o(($event) => clearCart()),
        F: common_vendor.f(cartList.value, (obj, index, i0) => {
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
        G: common_vendor.o(($event) => openCartList.value = openCartList.value),
        H: openCartList.value,
        I: common_vendor.o(($event) => openCartList.value = !openCartList.value)
      });
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cb6f745"], ["__file", "D:/MyCode/public_project/hanye-take-out/hanye-take-out-uniapp/src/pages/detail/detail.vue"]]);
wx.createPage(MiniProgramPage);
