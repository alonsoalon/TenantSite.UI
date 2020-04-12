export default {
  namespaced: true,
  state: {
    // 用户信息
    info: {},
    tenant: ""
  },
  mutations: {
    set_user_info: (state, userInfo) => {
      state.info = userInfo;
    },
    set_tenant: (state, tenant) => {
      state.tenant = tenant;
    }
  },
  actions: {
    /**
     * @description 设置用户数据
     * @param {Object} commit vuex commit
     * @param {Object} dispatch vuex dispatch
     * @param {*} info info
     */
    async setUserInfo({ commit, dispatch }, info) {
      // 持久化
      await dispatch(
        "admin/db/set",
        {
          dbName: "sys",
          path: "user.info",
          value: info,
          user: true
        },
        { root: true }
      );
      // store 赋值
      commit("set_user_info", info);
    },

    /**
     * @description 从数据库取用户数据
     * @param {Object} commit vuex commit
     * @param {Object} dispatch vuex dispatch
     */
    async loadUserInfo({ commit, dispatch }) {
      // 从存储取出
      var info = await dispatch(
        "admin/db/get",
        {
          dbName: "sys",
          path: "user.info",
          defaultValue: {},
          user: true
        },
        { root: true }
      );
      commit("set_user_info", info);
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
          path: "user.tenant",
          value: tenant,
          user: true
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
          path: "user.tenant",
          defaultValue: "",
          user: true
        },
        { root: true }
      );
      // store 赋值
      commit("set_tenant", tenant);
    }
  }
};
