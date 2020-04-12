<template>
  <span class="fold-btn" @click="showSetting">
    <i class="el-icon-more"></i>
    <el-drawer
      size="300px"
      :append-to-body="true"
      :visible.sync="visible"
      :irection="direction"
    >
      <div slot="title">设置</div>
      <div style="padding:0 15px;">
        <el-divider>页面布局</el-divider>
        <div class="layout-header-setting-item">
          <span class="layout-header-setting-item-desc">显示全屏按钮</span>
          <span class="layout-header-setting-item-action">
            <el-switch
              :value="showFullscreen"
              @input="val => handleChangeSetting('showFullscreen', val)"
            >
            </el-switch>
          </span>
        </div>

        <div class="layout-header-setting-item">
          <span class="layout-header-setting-item-desc">标签页显示位置</span>
          <span class="layout-header-setting-item-action">
            <el-radio-group
              :value="tabPosition"
              @input="val => handleChangeSetting('tabPosition', val)"
            >
              <el-radio key="top" label="top">顶部</el-radio>
              <el-radio key="bottom" label="bottom">底部</el-radio>
            </el-radio-group>
          </span>
        </div>

        <div class="layout-header-setting-item">
          <span class="layout-header-setting-item-desc">标签样式</span>
          <span class="layout-header-setting-item-action">
            <el-radio-group
              :value="tabType"
              @input="val => handleChangeSetting('tabType', val)"
            >
              <el-radio label="">默认</el-radio>
              <el-radio label="border-card">叠状</el-radio>
            </el-radio-group>
          </span>
        </div>
      </div>
    </el-drawer>
  </span>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "HeaderSettings",
  data() {
    return {
      visible: false,
      direction: "rtl"
    };
  },
  computed: {
    ...mapState("admin/layout", ["showFullscreen", "tabPosition", "tabType"])
  },
  methods: {
    ...mapActions("admin/layout", ["updateLayoutSetting"]),
    showSetting() {
      this.visible = true;
    },
    handleChangeSetting(key, value) {
      this.updateLayoutSetting({
        key,
        value
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-header-setting-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
}

.layout-header-setting-item-action {
  flex: 0 0 auto;
}

.layout-header-setting-item-desc {
  flex: 1 1;
  font-size: 14px;
}
</style>
