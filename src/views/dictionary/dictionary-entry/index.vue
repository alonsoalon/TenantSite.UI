<template>
  <a-container class="a-container">
    <splitpanes
      class="default-theme"
      :horizontal="false"
      :dbl-click-splitter="false"
    >
      <pane size="25" min-size="20">
        <dic-header @onRowClick="onRowClick"></dic-header>
      </pane>
      <pane>
        <dic-entry
          ref="refRightPane"
          v-loading="unavailable"
          element-loading-text="请选择字典分类"
          element-loading-spinner="none"
        ></dic-entry>
      </pane>
    </splitpanes>
  </a-container>
</template>

<script>
import AContainer from "@/components/a-container";
import { Splitpanes, Pane } from "splitpanes";
import DicHeader from "./header";
import DicEntry from "./entry";

export default {
  name: "dictionary--dictionary-entry--index",
  components: { AContainer, Splitpanes, Pane, DicHeader, DicEntry },
  data() {
    return {
      unavailable: true
    };
  },
  methods: {
    onRowClick(row) {
      this.$refs.refRightPane.init(row);
      this.unavailable = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.splitpanes.default-theme {
  background: #fff;

  .splitpanes__pane {
    background: #fff;
  }
  /deep/ .splitpanes__splitter {
    background-color: #eee;
  }
  /deep/ .mainScroll {
    padding: 0px;
  }
}
</style>
