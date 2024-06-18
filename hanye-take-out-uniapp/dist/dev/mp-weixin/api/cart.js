"use strict";
const utils_http = require("../utils/http.js");
const addToCartAPI = (cartDTO) => {
  return utils_http.http({
    method: "POST",
    url: "/user/cart/add",
    data: cartDTO
  });
};
const subCartAPI = (cartDTO) => {
  return utils_http.http({
    method: "PUT",
    url: "/user/cart/sub",
    data: cartDTO
  });
};
const getCartAPI = () => {
  return utils_http.http({
    method: "GET",
    url: "/user/cart/list"
  });
};
const cleanCartAPI = () => {
  return utils_http.http({
    method: "DELETE",
    url: "/user/cart/clean"
  });
};
exports.addToCartAPI = addToCartAPI;
exports.cleanCartAPI = cleanCartAPI;
exports.getCartAPI = getCartAPI;
exports.subCartAPI = subCartAPI;
