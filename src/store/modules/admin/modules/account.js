/* eslint-disable no-unused-vars */
import util from "@/libs/util";
import { login, getLoginInfo } from "@/api/account";

import router, { resetRouter, addRoutes } from "@/router";
import { MessageBox } from "element-ui";

const menus = [
  {
    id: "1",
    parentId: "0",
    path: null,
    viewPath: null,
    title: "系统管理",
    icon: "el-icon-s-platform",
    opened: true,
    closable: null,
    hidden: false,
    newWindow: null,
    external: null
  },
  {
    id: "2",
    parentId: "0",
    path: null,
    viewPath: null,
    title: "错误页面",
    icon: "el-icon-s-platform",
    opened: true,
    closable: null,
    hidden: false,
    newWindow: null,
    external: null
  },
  {
    id: "1-1",
    parentId: "1",
    path: "/",
    viewPath: "/admin/dashboard/index",
    viewName: "admin--dashboard--index",
    title: "欢迎页",
    icon: "el-icon-notebook-2",
    opened: false,
    closable: false,
    hidden: false,
    newWindow: false,
    external: false
  },
  {
    id: "1-2",
    parentId: "1",
    path: "/admin/user/index",
    viewPath: "/admin/user/index",
    viewName: "admin--user--index",
    title: "用户管理",
    icon: "el-icon-notebook-2",
    opened: false,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false,
    viewCache: true
  },
  {
    id: "1-3",
    parentId: "1",
    path: "/admin/group/index",
    viewPath: "/admin/group/index",
    viewName: "admin--group--index",
    title: "归属组管理",
    icon: "el-icon-notebook-2",
    opened: false,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false,
    viewCache: false
  },
  {
    id: "1-4",
    parentId: "1",
    path: "/admin/resource/index",
    viewPath: "/admin/resource/index",
    viewName: "admin--resource--index",
    title: "资源管理",
    icon: "el-icon-notebook-2",
    opened: false,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false,
    viewCache: false
  },
  {
    id: "1-5",
    parentId: "1",
    path: "/admin/permission/index",
    viewPath: "/admin/permission/index",
    viewName: "admin--permission--index",
    title: "权限岗管理",
    icon: "el-icon-notebook-2",
    opened: false,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false,
    viewCache: false
  },
  {
    id: "1-6",
    parentId: "1",
    path: "/admin/role/index",
    viewPath: "/admin/role/index",
    viewName: "admin--role--index",
    title: "角色管理",
    icon: "el-icon-notebook-2",
    opened: false,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false,
    viewCache: false
  },
  {
    id: "2-1",
    parentId: "2",
    path: "/admin/403",
    viewPath: "/admin/error/403/index",
    title: "403",
    icon: "",
    opened: null,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false
  },
  {
    id: "2-2",
    parentId: "2",
    path: "/admin/500",
    viewPath: "/admin/error/500/index",
    title: "500",
    icon: "",
    opened: null,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false
  },
  {
    id: "2-3",
    parentId: "2",
    path: "/admin/404",
    viewPath: "/admin/error/404/index",
    title: "404",
    icon: "",
    opened: null,
    closable: true,
    hidden: false,
    newWindow: false,
    external: false
  }
];

export default {
  namespaced: true,
  state: {
    tenant: ""
  },

  mutations: {
    set_tenant: (state, tenant) => {
      state.tenant = tenant;
    }
  },
  actions: {
    /**
     * @description 登录
     * @param {Object} param dispatch vuex dispatch
     * @param {String} param username  用户账号
     * @param {String} param password  密码
     * @param {String} param tenant 租户
     */
    async login(
      { dispatch, state },
      { userName = "", password = "", tenant = "" } = {}
    ) {
      var params = { userName, password, tenant };
      // 设置 vuex 租户信息 必须在登录前设置，不然不能准确请求对应租户后台API
      await dispatch("admin/account/setTenant", tenant, { root: true });
      var res = await login(params);
      if (res && res.success) {
        util.cookies.set("uuid", res.data.uuid);
        util.cookies.set("token", res.data.token);
        if (!res.data.info?.menus?.length > 0) {
          res.data.info.menus = menus;
        }

        // 设置 vuex 用户信息
        await dispatch("admin/user/setUserInfo", res.data.info, { root: true });
        addRoutes(menus);
      }
      return res;
    },

    /**
     * 根据token 重新取回 登录信息，包括权限菜单
     * @param {Object} param0
     */
    async getLoginInfo({ dispatch }) {
      var res = await getLoginInfo();
      if (res && res.success) {
        util.cookies.set("uuid", res.data.uuid);
        util.cookies.set("token", res.data.token);
        if (!res.data.info?.menus?.length > 0) {
          res.data.info.menus = menus;
        }

        // 设置 vuex 用户信息
        await dispatch("admin/user/setUserInfo", res.data.info, { root: true });

        addRoutes(menus);
      }
      return res;
    },

    /**
     * 登出
     * @param {Boolean} param0 confirm 登出是否弹出确认框
     * @param {Object} param1 vm VUE context
     */
    logout({ commit, dispatch }, { confirm = false, vm } = {}) {
      var logout = async () => {
        // 清空 vuex 租户信息
        await dispatch("admin/account/setTenant", "", { root: true });
        // 清空 vuex 用户信息
        await dispatch("admin/user/setUserInfo", {}, { root: true });
        // 清空 vuex 缓存的打开页面
        await dispatch("admin/page/setOpenedTabs", [], { root: true });
        // 清空 vuex 缓存的打开页面中cahced的页面
        await dispatch("admin/page/keepAliveClean", {}, { root: true });

        // 删除cookie
        util.cookies.remove("token");
        util.cookies.remove("uuid");

        //重设路由
        resetRouter();

        // 跳转路由
        router.push({
          name: "login"
        });
      };

      if (confirm) {
        vm.$confirm(
          vm.$t("basicLayout.logout.confirmContent"),
          vm.$t("basicLayout.logout.confirmTitle"),
          { type: "warning" }
        )
          .then(() => {
            logout();
          })
          .catch(() => {});
      } else {
        logout();
      }
    },
    /**
     * 设置租户信息
     * @param {Object} commit vuex commit
     * @param {Object} dispatch vuex dispatch
     */
    async setTenant({ commit, dispatch }, tenant) {
      // 持久化
      await dispatch(
        "admin/db/set",
        {
          dbName: "sys",
          path: "account.tenant",
          value: tenant,
          user: false
        },
        { root: true }
      );
      // store 赋值
      commit("set_tenant", tenant);
    },
    /**
     * 载入租户信息
     * @param {Object} commit vuex commit
     * @param {Object} dispatch vuex dispatch
     */
    async loadTenant({ commit, dispatch }) {
      // 从存储取出
      var tenant = await dispatch(
        "admin/db/get",
        {
          dbName: "sys",
          path: "account.tenant",
          defaultValue: "",
          user: false
        },
        { root: true }
      );
      // store 赋值
      commit("set_tenant", tenant);
    }
  }
};
