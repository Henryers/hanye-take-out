"use strict";
const utils_http = require("../utils/http.js");
const getSetmealListAPI = (id) => {
  return utils_http.http({
    method: "GET",
    url: `/user/setmeal/list/${id}`
  });
};
const getSetmealAPI = (id) => {
  return utils_http.http({
    method: "GET",
    url: `/user/setmeal/${id}`
  });
};
exports.getSetmealAPI = getSetmealAPI;
exports.getSetmealListAPI = getSetmealListAPI;
