// 浏览器兼容性
import "core-js/stable";
import "regenerator-runtime/runtime";

import Vue from "vue";

import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "font-awesome/css/font-awesome.min.css";

import Cookies from "js-cookie";
import lodash from "lodash";
import i18n from "./i18n"; // 国际化

import "@/styles/index.scss";

import App from "./App.vue";
import store from "./store";
import router from "./router";

// import Setting from "@/settings";
// import util from "@/libs/util.js";

import MainLayout from "@/components/main-layout";
Vue.use(MainLayout);

Vue.use(ElementUI, {
  //size: Cookies.get("size") || "medium", // medium / small / mini
  size: Cookies.get("size") || "small",
  i18n: (key, value) => i18n.t(key, value)
});

Vue.config.productionTip = false;

Vue.prototype.$_ = lodash;

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App),
  created() {}
});
