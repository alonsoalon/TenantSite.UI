/* eslint-disable no-undef */
import store from "@/store";
import axios from "axios";
import util from "@/libs/util";
import Setting from "@/settings";
import { Message } from "element-ui";

function showErrorMessage(message, type = "error") {
  Message({
    message: message,
    type: type
  });
}

function getBaseUrl() {
  var tenant = store.state.admin.account.tenant;
  if (tenant === "") {
    Message({
      message: "租户信息获取失败",
      type: type
    });
    throw new error("租户信息获取失败");
  }
  var baseURL = `${Setting.apiBaseURL}`;
  var str = baseURL.replace(/\$\{tenant\}/, tenant);
  return str;
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: "",
  timeout: 20000 // 请求超时时间
});

// request 请求拦截器
service.interceptors.request.use(
  config => {
    const token = util.cookies.get("token");
    config.headers["Authorization"] = "Bearer " + token;
    if (!config.url.startsWith("http")) {
      let baseUrl = getBaseUrl();
      baseUrl = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
      let apiUrl = config.url.startsWith("/")
        ? config.url.substring(1, config.url.length)
        : config.url;
      config.url = baseUrl + apiUrl;
    }
    console.log(config.url);
    return config;
  },
  error => {
    // 发送失败
    console.log(error);
    return Promise.reject(error);
  }
);

// response 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    const { code, success } = res;
    if (code === undefined || success === undefined) {
      // 如果没有 code success 代表这不是项目后端开发的接口
      showErrorMessage("接口返回数据不满足UI要求");
    }
    return res;
  },
  async error => {
    let res = { success: false, code: 0, message: "" };
    if (error.response) {
      var data = error.response.data;
      if (_.isPlainObject(data)) {
        res = {
          success: false,
          code: error?.response?.data?.status
            ? error?.response?.data?.status
            : 0,
          message: error.message,
          ...error.response.data
        };
        //console.log(res);
      } else if (_.isString(data)) {
        if (_.isNumber(error.response.status)) {
          res.code = error.response.status;
        }
        res.message = data || error.response.statusText;
      }
    } else {
      res.message = error.message;
    }
    return res;
  }
);

export default service;
