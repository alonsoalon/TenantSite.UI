// 判定是否需要缓存
import { get } from "lodash";
const isKeepAlive = data => get(data, "meta.cache", false);
export default {
  namespaced: true,
  state: {
    // cachedViews: [],
    // tabs: [],
    // 需要缓存页面列表
    keepAlive: [],
    // 当前在Tab中打开的多页面列表
    openedTabs: []
  },
  mutations: {
    /**
     * @class keepAlive
     * @description 从已经打开的页面记录中更新需要缓存的页面记录
     * @param {Object} state vuex state
     */
    keep_alive_refresh(state) {
      state.keepAlive = state.openedTabs
        .filter(item => isKeepAlive(item))
        .map(e => e.name);
    },
    /**
     * @description 删除一个页面的缓存设置
     * @param {Object} state vuex state
     * @param {String} name name
     */
    keep_alive_remove(state, name) {
      const list = [...state.keepAlive];
      const index = list.findIndex(item => item === name);

      if (index !== -1) {
        list.splice(index, 1);
        state.keepAlive = list;
      }
    },
    /**
     * @description 增加一个页面的缓存设置
     * @param {Object} state vuex state
     * @param {String} name name
     */
    keep_alive_push(state, name) {
      const keep = [...state.keepAlive];
      keep.push(name);
      state.keepAlive = keep;
    },
    /**
     * @description 清空页面缓存设置
     * @param {Object} state vuex state
     */
    keep_alive_clean(state) {
      state.keepAlive = [];
    },
    /**
     * @description 设置打开页面列表
     * @param {Object} state vuex state
     * @param {Object} openedTabs 打开页面列表
     */
    set_opened_tabs: (state, openedTabs) => {
      state.openedTabs = openedTabs;
    }
  },
  actions: {
    async setOpenedTabs({ commit, dispatch }, openedTabs) {
      // store 赋值
      commit("set_opened_tabs", openedTabs);
      // 持久化
      await dispatch(
        "admin/db/set",
        {
          dbName: "sys",
          path: "page.openedTabs",
          value: openedTabs,
          user: true
        },
        { root: true }
      );
      // 刷新缓存列表
      commit("keep_alive_refresh");
    },

    async loadOpenedTabs({ commit, dispatch }) {
      // 从存储中取出
      var openedTabs = await dispatch(
        "admin/db/get",
        {
          dbName: "sys",
          path: "page.openedTabs",
          defaultValue: [],
          user: true
        },
        { root: true }
      );

      //todo: 未完成功能：openedTabs需过滤掉在user.info.menus中不存在的视图，即是当刷新前权限菜单发生变化后，不加载无权的菜单,并重新持久化

      // store 赋值
      commit("set_opened_tabs", openedTabs);

      // 刷新缓存列表
      commit("keep_alive_refresh");
    },

    async cleanKeepAlive({ commit }) {
      // store 赋值
      commit("keep_alive_clean");
    }
  }
};
