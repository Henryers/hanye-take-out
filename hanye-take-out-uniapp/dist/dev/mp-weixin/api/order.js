"use strict";
const utils_http = require("../utils/http.js");
const submitOrderAPI = (params) => {
  return utils_http.http({
    url: "/user/order/submit",
    method: "POST",
    data: params
  });
};
const payOrderAPI = (params) => {
  return utils_http.http({
    url: "/user/order/payment",
    method: "PUT",
    data: params
  });
};
const getUnPayOrderAPI = () => {
  return utils_http.http({
    url: "/user/order/unPayOrderCount",
    method: "GET"
  });
};
const getOrderAPI = (id) => {
  console.log("byd !!! id", id);
  return utils_http.http({
    url: `/user/order/orderDetail/${id}`,
    method: "GET"
  });
};
const getOrderPageAPI = (params) => {
  console.log("params", params);
  return utils_http.http({
    url: "/user/order/historyOrders",
    method: "GET",
    data: params
  });
};
const cancelOrderAPI = (id) => {
  return utils_http.http({
    url: `/user/order/cancel/${id}`,
    method: "PUT"
  });
};
const reOrderAPI = (id) => {
  return utils_http.http({
    url: `/user/order/reOrder/${id}`,
    method: "POST"
  });
};
const urgeOrderAPI = (id) => {
  return utils_http.http({
    url: `/user/order/reminder/${id}`,
    method: "GET"
  });
};
exports.cancelOrderAPI = cancelOrderAPI;
exports.getOrderAPI = getOrderAPI;
exports.getOrderPageAPI = getOrderPageAPI;
exports.getUnPayOrderAPI = getUnPayOrderAPI;
exports.payOrderAPI = payOrderAPI;
exports.reOrderAPI = reOrderAPI;
exports.submitOrderAPI = submitOrderAPI;
exports.urgeOrderAPI = urgeOrderAPI;
