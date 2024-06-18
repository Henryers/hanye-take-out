"use strict";
const utils_http = require("../utils/http.js");
const loginAPI = (code) => {
  return utils_http.http({
    method: "POST",
    url: "/user/user/login",
    data: { code }
  });
};
exports.loginAPI = loginAPI;
