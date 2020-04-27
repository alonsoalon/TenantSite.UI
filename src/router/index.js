import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Setting from "@/settings";
import Layout from "@/layouts/basic-layout";
import { Message } from "element-ui";

import util from "@/libs/util";

// 路由数据
// import routes from "./routes";
const _import = require("./_import_" + process.env.NODE_ENV); // 获取组件的方法

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

Vue.use(Router);

const constantRoutes = [
  {
    path: "/login",
    name: "login",
    component: _import("/account/login/index"),
    hidden: true,
    meta: {
      title: "登录"
    }
  }
];

const createRouter = () =>
  new Router({
    mode: Setting.routerMode, // require service support
    base: Setting.routerBase,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

// 生成路由
function generateRoutes(menus = []) {
  const routes = {
    path: "/",
    component: Layout,
    children: [],
    name: "",
    meta: {}
  };

  for (let m of menus) {
    // 资源不是菜单的，path为空的 进入下次循环
    if (m.resourceType !== 2 || !m.path || m.path === "") {
      continue;
    }
    if (!m.viewPath || m.viewPath === "") {
      continue;
    }

    let name = !m.viewName || m.viewName === "" ? m.path : m.viewName;
    let route = {
      name: name,
      path: m.path,
      meta: {
        auth: true,
        cache: m.viewCache,
        title: m.title,
        icon: m.icon,
        closable: m.closable
      }
    };

    if (m.title === "欢迎页") {
      console.log(m);
    }

    if (m.linkType === 1) {
      route.component = _import(m.viewPath);
    } else if (m.linkType === 2) {
      if (m.openMode === 1) {
        route.component = _import("/iframe/index");
        route.meta.src = m.viewPath;
      } else {
        continue;
      }
    }

    try {
      routes.children.push(route);
    } catch (error) {
      Message.error(`导入组件${m.viewPath}.vue失败`);
    }
  }

  var e403 = {
    path: "/403",
    name: "403",
    meta: {
      title: "403"
    },
    component: _import("/admin/error/403/index")
  };
  var e500 = {
    path: "/500",
    name: "500",
    meta: {
      title: "500"
    },
    component: _import("/admin/error/500/index")
  };
  var e404 = {
    path: "*",
    name: "404",
    meta: {
      title: "404"
    },
    component: _import("/admin/error/404/index")
  };
  routes.children.push(e403);
  routes.children.push(e500);
  routes.children.push(e404);
  return [routes];
}

// 添加路由
export function addRoutes(menus = []) {
  // 生成动态路由
  if (menus && menus.length > 0) {
    const dynamicRoutes = generateRoutes(menus);
    resetRouter();
    router.addRoutes(dynamicRoutes);
  }
}

const title = Setting.titleSuffix;
// 获取页面标题
function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return title;
}

// 刷新用户信息
var refrashUserInfo = async (to, from, next) => {
  var res = await store.dispatch("admin/account/getLoginInfo");

  if (!res) {
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }

  if (!res.success && res.message) {
    Message.error(res.message);
    next({ name: "login", query: { redirect: to.fullPath } });
    return;
  }
  var menus = store.state.admin.user.info.menus;
  const hasPermission = menus && menus.length > 0; //验证当前用户的权限菜单下是否包含跳转的菜单,暂未实现只要有菜单就放行
  if (hasPermission) {
    next({ ...to, replace: true });
  } else {
    next({ name: "login", query: { redirect: to.fullPath } });
  }
};

let count = 0;

router.beforeEach(async (to, from, next) => {
  // 覆盖默认标题
  document.title = getPageTitle(to.meta.title);

  // count === 0 代表刷新（刷新包括：浏览器刷新和直接输入了网址进入）,这种情况下通过token重新从后台刷新数据，但排除跳转到登录页和从登录页来两个情况（原因在登录页本身就会获取最新的信息）
  // count !== 0 则代表 单页应用内正常链接跳转
  if (count === 0) {
    if (to.name === "login" || from.name === "login") {
      next();
      return;
    }
    count = 1;
    // Host模式 在刷新或直接输入网址进入 需验证HOST和存储的是否一致
    if (Setting.tenantMode === 1) {
      var newTenant = util.getTenantByHost();
      if (newTenant === "") {
        next({ name: "login", query: { redirect: to.fullPath } });
        return;
      }
      // 载入租户信息
      await store.dispatch("admin/account/loadTenant");
      var oldTenant = store.state.admin.account.tenant;

      if (oldTenant !== newTenant) {
        //证明是用户直接修改了HOST后 直接访问目标地址，此时将需重新登录
        next({ name: "login", query: { redirect: to.fullPath } });
        return;
      } else {
        // 刷新用户信息
        await refrashUserInfo(to, from, next);
        return;
      }
    } else {
      // 载入租户信息
      await store.dispatch("admin/account/loadTenant");
      var tenant = store.state.admin.account.tenant;
      if (tenant === "") {
        next({ name: "login", query: { redirect: to.fullPath } });
        return;
      } else {
        // 刷新用户信息
        await refrashUserInfo(to, from, next);
        return;
      }
    }
  }

  if (to.matched.some(_ => _.meta.auth)) {
    const token = util.cookies.get("token");
    if (token && token !== "undefined") {
      next();
    } else {
      next({ name: "login", query: { redirect: to.fullPath } });
    }
  } else {
    // 不需要身份校验 直接通过
    next();
  }
});

export default router;
