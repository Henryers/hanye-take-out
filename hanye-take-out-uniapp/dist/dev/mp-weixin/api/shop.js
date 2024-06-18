"use strict";
const utils_http = require("../utils/http.js");
const getStatusAPI = () => {
  return utils_http.http({
    method: "GET",
    url: "/user/shop/status"
  });
};
exports.getStatusAPI = getStatusAPI;
