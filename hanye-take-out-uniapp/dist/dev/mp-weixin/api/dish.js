"use strict";
const utils_http = require("../utils/http.js");
const getDishListAPI = (id) => {
  return utils_http.http({
    method: "GET",
    url: `/user/dish/list/${id}`
  });
};
const getDishByIdAPI = (id) => {
  return utils_http.http({
    method: "GET",
    url: `/user/dish/dish/${id}`
  });
};
exports.getDishByIdAPI = getDishByIdAPI;
exports.getDishListAPI = getDishListAPI;
