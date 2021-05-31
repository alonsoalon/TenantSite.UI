/**
 * 系统配置
 *
 */

const env = process.env.NODE_ENV;

const Setting = {
  //是否演示环境
  isDemo: env === "development" ? false : true,
  // 网页标题的后缀
  titleSuffix: "Tenant Site",
  // 路由模式，可选值为 history 或 hash
  routerMode: "history",
  // 应用的基路径
  routerBase: "/",

  // Cookies 默认保存时间，单位：天
  cookiesExpires: 1,

  //租户中心URL
  tenantCenterBaseURL:
    env === "development"
      ? "http://localhost:5188/"
      : "http://demoapi.iusaas.com/",

  // 租户策略
  // 0:login 登录时指定
  // 1:Host 通过Host获取
  tenantMode: env === "development" ? 0 : 1,

  // Tenant site server 接口请求地址
  // host 方式形如 http://{tenant}.localhost/
  // route方式形如 http://localhost/{tenant}/
  apiBaseURL:
    env === "development"
      ? "http://localhost:5188/${tenant}"
      : "http://demoapi.iusaas.com/${tenant}",

  // 头像地址
  avatarURL:
    env === "development"
      ? "http://localhost:5188/upload/avatar/"
      : "http://demoapi.iusaas.com/upload/avatar/",

  layout: {
    // tab 类型 "" | border-card
    tabType: "",
    // tab位置 top | bottom
    tabPosition: "top",
    // 是否显示重载按钮
    showReload: true,
    // 是否显示全屏按钮
    showFullscreen: true,
    // 是否显示通知
    showNotice: true,
    // 是否显示多语言
    showI18n: true,
    // 退出登录时，是否二次确认
    logoutConfirm: true,
    // 面包屑是否显示图标
    showBreadcrumbIcon: false,
    // 标签是否显示图标
    showTabIcon: true
  },
  // 相同路由，不同参数间进行切换，是否强力更新
  sameRouteForceUpdate: false
};

export default Setting;
