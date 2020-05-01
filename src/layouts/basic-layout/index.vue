<template>
  <el-container class="container" style="height: 100%;">
    <el-aside class="aside" :class="collapsedClass" width>
      <div
        class="logo collapsedLogo"
        :class="isCollapse ? 'logo-collapse' : ''"
      >
        <router-link
          to="/"
          tag="div"
          class="logo-text"
          style="font-size: 22px;"
        >
          {{ isCollapse ? projectNameShort : projectName }}
        </router-link>
      </div>
      <el-scrollbar
        class="page-component__scroll"
        style="border-right: solid 1px #e6e6e6;"
      >
        <el-menu
          :default-active="$route.path"
          :default-openeds="openeds"
          :collapse.sync="isCollapse"
          :unique-opened="false"
          :collapse-transition="false"
          class="aside-menu-vertical"
          @select="onSelectMenu"
        >
          <menu-item v-for="menu in menuTree" :key="menu.id" :item="menu" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="header" height="auto">
        <el-row class="navbar">
          <el-col :span="10" class="left-menu">
            <div class="left-menu-item fold-btn" @click="onCollapse">
              <i
                :class="
                  isCollapse ? 'fa el-icon-s-unfold' : 'fa el-icon-s-fold'
                "
              />
            </div>
            <div
              v-if="showReload"
              class="left-menu-item fold-btn"
              @click="handleReload"
            >
              <i class="el-icon-refresh-right" />
            </div>
            <el-breadcrumb
              separator-class="el-icon-arrow-right"
              class="breadcrumb-inner breadcrumb-container"
            >
              <template v-for="(item, index) in menueTitles">
                <el-breadcrumb-item v-if="item.title" :key="index">
                  <i :class="item.icon" v-if="showBreadcrumbIcon" />
                  {{ item.title }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </el-col>
          <el-col :span="4" class="right-menu">
            <fullscreen v-if="isDesktop && showFullscreen" />
            <el-dropdown trigger="click">
              <div class="right-menu-item">
                <el-avatar class="user-avatar" :size="36" :src="info.avatar">
                  <img :src="avatarDefault" />
                </el-avatar>
                <span>{{ info.name }}</span>
              </div>
              <el-dropdown-menu
                slot="dropdown"
                :visible-arrow="false"
                style="margin-top: 2px;width:160px;"
              >
                <el-dropdown-item
                  icon="el-icon-setting"
                  @click.native="Setting"
                >
                  {{ $t("basicLayout.user.setting") }}
                </el-dropdown-item>
                <el-dropdown-item
                  divided
                  icon="el-icon-switch-button"
                  @click.native="logoutApp"
                >
                  {{ $t("basicLayout.user.logOut") }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <Settings style="float:right" />
          </el-col>
        </el-row>
        <div v-if="tabPosition === 'top'" style="padding:0px 0px;">
          <el-tabs
            v-if="showTabs"
            ref="tabs"
            :value="tabName"
            :type="tabType"
            @tab-click="tabClick"
            @tab-remove="removeTab"
            @contextmenu.prevent.native="openRightMenu($event)"
          >
            <el-tab-pane
              v-for="tab in tabsList"
              :key="tab.path"
              :name="tab.path"
              :label="tab.meta.title"
              :closable="tab.meta.closable"
            >
              <template #label>
                <i :class="tab.meta.icon" v-if="showTabIcon" />
                {{ tab.meta.title }}
              </template>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-header>
      <el-main class="main" style="height:100%">
        <keep-alive :include="keepAlive">
          <router-view v-if="loadRouter" />
        </keep-alive>
      </el-main>
      <el-footer v-if="tabPosition === 'bottom'" class="footer" height>
        <el-tabs
          v-if="showTabs"
          ref="tabs"
          :value="tabName"
          :type="tabType"
          :tab-position="tabPosition"
          @tab-click="tabClick"
          @tab-remove="removeTab"
          @contextmenu.prevent.native="openRightMenu($event)"
        >
          <el-tab-pane
            v-for="tab in tabsList"
            :key="tab.path"
            :name="tab.path"
            :label="tab.meta.title"
            :closable="tab.meta.closable || true"
          >
            <template #label>
              <i :class="tab.meta.icon" v-if="showTabIcon" />
              {{ tab.meta.title }}
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-footer>
      <ul
        v-if="tabPosition === 'top'"
        v-show="rightMenu.visible"
        ref="rightMenu"
        :style="{ left: rightMenu.left + 'px', top: rightMenu.top + 'px' }"
        class="contextmenu"
      >
        <li v-if="canClose" @click="closecurrentTab">
          <span>{{ $t("basicLayout.tabs.close") }}</span>
        </li>

        <el-divider v-if="canClose" />

        <li v-if="canCloseOthers" @click="closeOthersTabs">
          <i class="el-icon-more" />{{ $t("basicLayout.tabs.other") }}
        </li>
        <li v-if="canCloseRight" @click="closeRightTabs">
          <i class="el-icon-right" />{{ $t("basicLayout.tabs.right") }}
        </li>
        <li v-if="canCloseLeft" @click="closeLeftTabs">
          <i class="el-icon-back" />{{ $t("basicLayout.tabs.left") }}
        </li>
        <li v-if="canCloseAll" @click="closeAllTabs">
          <span>{{ $t("basicLayout.tabs.all") }}</span>
        </li>
      </ul>
      <ul
        v-if="tabPosition === 'bottom'"
        v-show="rightMenu.visible"
        ref="rightMenu"
        :style="{ left: rightMenu.left + 'px', top: rightMenu.top + 'px' }"
        class="contextmenu"
      >
        <li v-if="canCloseAll" @click="closeAllTabs">
          <span>{{ $t("basicLayout.tabs.all") }}</span>
        </li>
        <li v-if="canCloseLeft" @click="closeLeftTabs">
          <i class="el-icon-back" />{{ $t("basicLayout.tabs.left") }}
        </li>
        <li v-if="canCloseRight" @click="closeRightTabs">
          <i class="el-icon-right" />{{ $t("basicLayout.tabs.right") }}
        </li>

        <li v-if="canCloseOthers" @click="closeOthersTabs">
          <i class="el-icon-more" />{{ $t("basicLayout.tabs.other") }}
        </li>
        <el-divider v-if="canClose" />
        <li v-if="canClose" @click="closecurrentTab">
          <span>{{ $t("basicLayout.tabs.close") }}</span>
        </li>
      </ul>
    </el-container>
  </el-container>
</template>

<script>
import Fullscreen from "./fullscreen";
import Settings from "./settings";
import { mapState, mapActions } from "vuex";
import MenuItem from "./components/menu-item";
import Sortable from "sortablejs";
import { listToTree, getTreeParents } from "@/libs/util";
// import { isExternalLink } from "@/utils/validate";

import Setting from "@/settings";

export default {
  name: "AppMain",
  components: {
    MenuItem,
    Fullscreen,
    Settings
  },
  data() {
    return {
      openeds: [],
      menuTree: [],
      projectName: "Tenant Site",
      projectNameShort: "TS",
      avatarDefault: require("@/assets/avatar.png"),
      collapsedClass: "menu-expanded",
      isCollapse: false,
      isPc: false,
      tabsList: [],
      rightMenu: {
        top: 0,
        left: 0,
        visible: false,
        selectedTab: {}
      },
      loadRouter: true
      //tabPosition: "top", // top | bottom
      //tabType: "border-card" // '' | border-card
    };
  },
  computed: {
    ...mapState("admin/user", ["info"]),
    ...mapState("admin/page", ["keepAlive", "openedTabs"]),
    ...mapState("admin/layout", [
      "isDesktop",
      "tabPosition",
      "tabType",
      "showReload",
      "showBreadcrumbIcon",
      "showTabIcon",
      "showI18n",
      "showNotice",
      "showFullscreen",
      "logoutConfirm"
    ]),
    menueTitles() {
      let parentTitles = [];
      const fullPath = this.$route.fullPath;
      const menu = this.info.menus?.find(m => m.path === fullPath);
      if (menu && menu.id !== "") {
        const parents = getTreeParents(this.menuTree, menu.id);
        parentTitles = parents.map(p => {
          return { title: p.title, icon: p.icon };
        });
        parentTitles.push({ title: menu.title, icon: menu.icon });
      }
      return parentTitles;
    },

    key() {
      const tabs = this.$store.getters.tabsList;
      const fullPath = this.$route.fullPath;
      const tab = tabs && tabs.find(t => t.fullPath === fullPath);
      const k = tab && tab._k ? tab._k : "";

      return this.$route.fullPath + k;
    },
    showTabs() {
      return this.tabsList.length > 0;
    },
    tabName() {
      return this.$route.path;
    },
    canClose() {
      return (
        this.rightMenu.selectedTab.meta &&
        this.rightMenu.selectedTab.meta.closable
      );
    },
    canCloseOthers() {
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === this.rightMenu.selectedTab.fullPath
      );
      return (
        (tabIndex === 0 && this.tabsList.length > 1) ||
        (tabIndex > 0 && this.tabsList.length > 2)
      );
    },
    canCloseRight() {
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === this.rightMenu.selectedTab.fullPath
      );
      return this.tabsList.length - 1 > tabIndex;
    },
    canCloseLeft() {
      const hasHome = this.tabsList.findIndex(t => t.fullPath === "/") >= 0;
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === this.rightMenu.selectedTab.fullPath
      );
      return tabIndex > (hasHome ? 1 : 0);
    },
    canCloseAll() {
      return this.tabsList.length > 1;
    }
  },
  async created() {
    this.isPc = window.innerWidth >= 768;
    this.collapsedClass = "menu-expanded";

    // 载入上次的tabs
    await this.loadOpenedTabs();

    // 还原会话tabs
    this.tabsList = this.$store.state.admin.page.openedTabs;

    if (this.info.menus && this.info.menus.length > 0) {
      // eslint-disable-next-line no-undef
      const cloneMenus = _.cloneDeep(this.info.menus);
      // 检查外链
      // cloneMenus.forEach(m => {
      //   if (!m.newWindow) {
      //     m.newWindow = /^(http?:|https?:|mailto:|tel:)/.test(m.path);
      //   }
      // });

      this.menuTree = listToTree(cloneMenus).filter(
        x => x.parentId === null || x.parentId === ""
      );

      this.openeds = this.info.menus.filter(l => l.opened).map(l => l.id + "");
    }

    this.addTab();
  },
  updated() {
    this.setSort();
  },
  watch: {
    // $route() {
    //   this.addTab();
    // },
    $route(to, from) {
      this.addTab();
      if (to.name === from.name) {
        // 相同路由，不同参数，跳转时，重载页面
        if (Setting.sameRouteForceUpdate) {
          this.handleReload();
        }
      }
    },
    "rightMenu.visible"(value) {
      if (value) {
        document.body.addEventListener("click", this.closeRightMenu);
      } else {
        document.body.removeEventListener("click", this.closeRightMenu);
      }
    },
    tabsList() {
      // const views = this.tabsList.map(t => t.name);
      // this.$store.commit("admin/page/set_cached_view", views);
      this.setOpenedTabs(this.tabsList);
    }
  },
  methods: {
    ...mapActions("admin/account", ["logout"]),
    ...mapActions("admin/page", [
      "setOpenedTabs",
      "loadOpenedTabs",
      "keepAliveRemove",
      "keepAlivePush"
    ]),
    // 点击选项卡
    tabClick(tab) {
      if (tab.name && tab.name !== this.tabName) {
        this.$router.push(tab.name);
      }
    },
    // 添加标签
    addTab() {
      const route = this.$route;
      if (!route.meta.title || route.meta.noTab) {
        return;
      }

      const exists = this.tabsList.some(item => item.path === route.fullPath);
      if (exists) {
        return;
      }

      // 获取视图缓存名
      const matchedIndex = route.matched && route.matched.length - 1;
      let name =
        matchedIndex >= 0 &&
        route.matched[matchedIndex].components.default.name;
      name = name || route.name;

      const tab = {
        name: name,
        path: route.path,
        fullPath: route.fullPath,
        meta: { ...route.meta }
      };

      if (tab.path === "/") {
        this.tabsList.unshift(tab);
      } else {
        this.tabsList.push(tab);
      }
    },
    // 关闭选项卡
    removeTab(targetPath) {
      this.rightMenu.visible = false;
      const index = this.tabsList.findIndex(tab => tab.path === targetPath);
      this.tabsList.splice(index, 1)[0];
      const toTab = this.tabsList[index]
        ? this.tabsList[index]
        : this.tabsList[index - 1];
      if (toTab) {
        targetPath === this.$route.fullPath && this.$router.push(toTab.path);
      } else {
        this.$router.push("/");
      }
    },
    // 退出登录
    logoutApp: function() {
      this.logout({
        confirm: true,
        vm: this
      });
    },
    // 设置
    Setting: function() {
      this.$router.push("/account/settings");
    },
    // 移动端选择菜单
    onSelectMenu: function() {
      if (!this.isPc && !this.isCollapse) {
        this.isCollapse = true;
        // this.collapsedClass = 'menu-collapsed'
      }
    },
    // 折叠导航栏
    onCollapse: function() {
      this.isCollapse = !this.isCollapse;
      // this.collapsedClass = this.isCollapse ? 'menu-collapsed':'menu-expanded';
    },
    // tab打开右键菜单
    openRightMenu(e) {
      const $target = e.target;
      const $tab = $target.closest('[role="tab"]');
      if ($tab) {
        const id = $tab.getAttribute("id");
        const ids = id.split("tab-");
        const path = ids[ids.length - 1];
        this.rightMenu.selectedTab = this.tabsList.find(
          t => t.fullPath === path
        );

        const menuMinWidth = 145;
        const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
        const offsetWidth = this.$el.offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX - offsetLeft + 15; // 15: margin right
        this.rightMenu.visible = true;
        this.$nextTick(() => {
          if (left > maxLeft) {
            this.rightMenu.left = maxLeft;
          } else {
            this.rightMenu.left = left;
          }

          if (this.tabPosition === "bottom") {
            this.rightMenu.top = e.clientY - this.$refs.rightMenu.offsetHeight;
          } else if (this.tabPosition === "top") {
            this.rightMenu.top = e.clientY;
          }
        });
      }
    },
    // tab拖拽排序
    setSort() {
      const _this = this;
      if (!this.$refs.tabs) {
        return;
      }
      const el = this.$refs.tabs.$el.querySelector('[role="tablist"]');
      Sortable.create(el, {
        ghostClass: "", // Class name for the drop placeholder,
        draggable: '[role="tab"]:not([id="tab-/"])', // Specifies which items inside the element should be draggable
        // animation: 150,
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          if (this.tabType === "border-card") {
            const targetTab = _this.tabsList.splice(evt.oldIndex, 1)[0];
            _this.tabsList.splice(evt.newIndex, 0, targetTab);
          } else {
            const targetTab = _this.tabsList.splice(evt.oldIndex - 1, 1)[0];
            _this.tabsList.splice(evt.newIndex - 1, 0, targetTab);
          }
        }
      });
    },
    // 关闭tab右键菜单
    closeRightMenu() {
      this.rightMenu.visible = false;
    },

    closecurrentTab() {
      this.rightMenu.selectedTab &&
        this.removeTab(this.rightMenu.selectedTab.fullPath);
    },
    closeOthersTabs() {
      const tab = this.rightMenu.selectedTab;
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === tab.fullPath
      );
      if (tabIndex === 0) {
        this.tabsList = [tab];
      } else {
        this.tabsList = [this.tabsList[0], tab];
      }
      this.$router.push(tab.fullPath);
    },
    closeAllTabs() {
      const tab = this.tabsList.find(t => t.fullPath === "/");
      this.tabsList = tab ? [tab] : [];
      this.$router.push("/");
    },
    closeRightTabs() {
      const selectedPath = this.rightMenu.selectedTab.fullPath;
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === selectedPath
      );
      this.tabsList = this.tabsList.slice(0, tabIndex + 1);
      const toTab = this.tabsList[this.tabsList.length - 1];
      if (toTab) {
        selectedPath !== this.$route.fullPath && this.$router.push(toTab.path);
      } else {
        this.$router.push("/");
      }
    },
    closeLeftTabs() {
      const selectedPath = this.rightMenu.selectedTab.fullPath;
      const tabIndex = this.tabsList.findIndex(
        t => t.fullPath === selectedPath
      );
      const tab = this.tabsList.find(t => t.fullPath === "/");
      this.tabsList = tab
        ? [tab, ...this.tabsList.slice(tabIndex)]
        : [...this.tabsList.slice(tabIndex)];
      const toTab = this.tabsList[this.tabsList.length - 1];
      if (toTab) {
        selectedPath !== this.$route.fullPath && this.$router.push(toTab.path);
      } else {
        this.$router.push("/");
      }
    },

    /**
     * 刷新
     */
    handleReload() {
      // 针对缓存的页面也生效
      const isCurrentPageCache = this.keepAlive.indexOf(this.$route.name) > -1;

      const pageName = this.$route.name;
      if (isCurrentPageCache) {
        this.keepAliveRemove(pageName);
      }
      this.loadRouter = false;
      this.$nextTick(() => {
        this.loadRouter = true;
        if (isCurrentPageCache) {
          this.keepAlivePush(pageName);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.container ::v-deep .el-tabs__item:focus.is-active.is-focus:not(:active) {
  -webkit-box-shadow: none;
  box-shadow: none;
  border-radius: unset;
}

.header {
  z-index: 1;
}

.footer {
  padding: 0px;
  overflow: hidden;
}

.el-breadcrumb {
  line-height: 50px !important;
}

.navbar ::v-deep {
  .el-breadcrumb__inner,
  .el-breadcrumb__separator {
    color: #f4f4f5;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
  .el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    color: #fff;
  }
  .el-dropdown {
    color: #fff;
  }
}
</style>

<style lang="scss" scoped>
.contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  border: 1px solid #ebeef5;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
  min-width: 130px;

  li {
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;

    &:hover {
      background: #eee;
    }
    i {
      margin-right: 8px;
      font-size: 14px;
      vertical-align: -1px;
    }
    span {
      margin-left: 22px;
    }
  }
  .el-divider--horizontal {
    margin: 5px 0px;
  }
}
.user-avatar {
  margin: 7px 8px 7px 0;
  vertical-align: top;
  background-color: transparent;
}
</style>

<style>
@media screen and (max-width: 680px) {
  .collapsedLogo {
    display: none;
  }

  .el-dialog {
    width: 90% !important;
  }

  .content-expanded {
    max-width: 100% !important;
    max-height: calc(100% - 80px);
  }

  .el-menu--collapse {
    width: 100% !important;
  }

  .el-date-editor.el-input,
  .el-date-editor.el-input__inner,
  .el-cascader.el-cascader--medium {
    width: 100% !important;
  }

  .el-message-box {
    width: 80%;
  }
}
</style>
