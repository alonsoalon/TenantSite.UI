import request from "@/request";
import Setting from "@/settings";

export function getTenants() {
  // todo:从租户中心获取租户信息 目前是从租户站点服务端获取的
  var tenantCenterBaseURL = Setting.tenantCenterBaseURL.endsWith("/")
    ? Setting.tenantCenterBaseURL
    : Setting.tenantCenterBaseURL + "/";
  return request.get(`${tenantCenterBaseURL}api/tenant/GetList`);
}

export function login(data) {
  return request({
    url: "api/v1/system/auth/login",
    method: "post",
    data
  });
}

export function getLoginInfo() {
  return request({
    url: "api/v1/system/auth/GetUserInfo",
    method: "get"
  });
}

export function getUserGroups() {
  return request({
    url: "api/v1/system/auth/GetUserGroups",
    method: "get"
  });
}
