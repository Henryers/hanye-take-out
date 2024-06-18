"use strict";
const utils_http = require("../utils/http.js");
const getUserInfoAPI = (id) => {
  return utils_http.http({
    url: `/user/user/${id}`,
    method: "GET"
  });
};
const updateUserAPI = (params) => {
  return utils_http.http({
    url: "/user/user",
    method: "PUT",
    data: params
  });
};
exports.getUserInfoAPI = getUserInfoAPI;
exports.updateUserAPI = updateUserAPI;
