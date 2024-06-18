"use strict";
const utils_http = require("../utils/http.js");
const addAddressAPI = (address) => {
  return utils_http.http({
    method: "POST",
    url: "/user/address",
    data: address
  });
};
const getDefaultAddressAPI = () => {
  return utils_http.http({
    method: "GET",
    url: "/user/address/default"
  });
};
const getAddressListAPI = () => {
  return utils_http.http({
    method: "GET",
    url: "/user/address/list"
  });
};
const getAddressByIdAPI = (id) => {
  return utils_http.http({
    method: "GET",
    url: `/user/address/${id}`
  });
};
const updateAddressAPI = (address) => {
  return utils_http.http({
    method: "PUT",
    url: "/user/address",
    data: address
  });
};
const updateDefaultAddressAPI = (address) => {
  return utils_http.http({
    method: "PUT",
    url: "/user/address/default",
    data: address
  });
};
const deleteAddressAPI = (id) => {
  return utils_http.http({
    method: "DELETE",
    url: `/user/address/${id}`
  });
};
exports.addAddressAPI = addAddressAPI;
exports.deleteAddressAPI = deleteAddressAPI;
exports.getAddressByIdAPI = getAddressByIdAPI;
exports.getAddressListAPI = getAddressListAPI;
exports.getDefaultAddressAPI = getDefaultAddressAPI;
exports.updateAddressAPI = updateAddressAPI;
exports.updateDefaultAddressAPI = updateDefaultAddressAPI;
