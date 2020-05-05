import request from "@/request";

export function getTenants() {
  // todo:将来需改成后端请求
  const tenants = [
    {
      id: "1",
      code: "tenant1",
      name: "租户1"
    },
    {
      id: "2",
      code: "tenant2",
      name: "租户2"
    }
  ];

  return {
    code: 1,
    success: true,
    data: tenants,
    message: ""
  };
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
