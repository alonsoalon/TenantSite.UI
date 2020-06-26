# 介绍
> Base on Vue + Element UI，建议开发IDE Visual Studio Code <br />
> UI项目是一个由 
[Vue](http://vuejs.org/?_blank)、
[Vue Router](https://github.com/vuejs/vue-router?_blank)和
[webpack](http://webpack.js.org/?_blank)
驱动的单页应用。如果你以前使用过 Vue 的话,将会很容易上手。 <br />

企业应用管理系统，定位于企业应用的SaaS服务框架，企业云端应用的基础开发框架（当然也可以部署于本地），系统被设计用于多租户，采用前端后端完全分离技术方案。
抽离企业应用软件研发公共部分，让研发人员有条件聚焦在业务研发，实现了用于权限管理的基础数据维护，权限赋权，缓存，上传等常规功能。 <br />

依赖后端项目：TenantSite.Server。<br />
* github:[https://github.com/alonsoalon/TenantSite.Server](https://github.com/alonsoalon/TenantSite.Server?_blank)
* gitee:[https://gitee.com/alonsoalon/TenantSite.Server](https://gitee.com/alonsoalon/TenantSite.Server?_blank)

## Docs
* 更多文档见：[www.iusaas.com](http://www.iusaas.com?_blank)

## DEMO

[租户1示例](http://tenant1.iusaas.com/login?_blank) <br />
[租户2示例](http://tenant2.iusaas.com/login?_blank) <br />

![image](http://www.iusaas.com/intro1.jpg)

## 目录结构
```
TenantSite.UI 
├─public // vue-cli 创建的入口文件
└─src
    │  App.vue
    │  main.js 
    │  settings.env.js // 环境设置
    │  settings.js // 应用设置
    │  
    ├─api // api接口
    │  │  account.js // auth相关接口
    │  └─admin
    │          api.js           // api管理接口
    │          cache.js         // 缓存管理接口
    │          group.js         // 数据组管理接口
    │          login-log.js     // 登录日志接口
    │          operation-log.js // API访问日志管理接口
    │          permission.js    // 权限模板管理接口
    │          resource.js      // 资源管理接口
    │          role.js          // 角色管理接口
    │          user.js          // 用户管理接口
    ├─assets // 静态资源
    ├─components // vue 组件
    │  │  confirm-button.vue 
    │  │  group-select.vue
    │  ├─auth // 鉴权组件
    │  └─main-layout // 主显示区布局组件      
    ├─directives // 指令
    │  └─auth // 鉴权指令
    ├─i18n // 多语言
    ├─layouts // 页面布局组件
    │  └─basic-layout // 基础页面布局组件
    ├─libs    // 常用工具类库
    ├─request // ajax 请求
    ├─router  // 路由
    ├─store   // vuex 管理
    ├─styles  // 样式
    └─views   // 模块应用页面
        ├─account            
        │  └─login            // 登录
        ├─admin 
        │  ├─api-manage       // api管理
        │  ├─cache            // 缓存管理
        │  ├─dashboard        // api管理
        │  ├─error            // 错误页面
        │  ├─group            // 数据组页面
        │  ├─login-log        // 日志管理页面
        │  ├─operation-log    // API访问日志页面 
        │  ├─permission       // 权限模板管理页面 
        │  ├─permission-power // 权限模板赋权功能页面         
        │  ├─resource         // 资源管理页面
        │  ├─role             // 角色管理页面
        │  ├─role-power       // 角色赋权功能页面
        │  ├─user             // 用户管理页面
        │  └─user-setting     // 个人中心页面   
        └─iframe              // 外嵌页面组件
```

## 配置说明
> 更多配置见源码 src > settings.js 和 src > settings.env.js


```js
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
      : "http://www.iusaas.com:5188/",

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
      : "http://${tenant}.iusaas.com:5188/",

  // 头像地址
  avatarURL:
    env === "development"
      ? "http://localhost:5188/upload/avatar/"
      : "http://www.iusaas.com:5188/upload/avatar/",

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

```


