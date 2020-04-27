<template>
  <el-container style="height:100%;">
    <el-header v-if="showHeader" height="auto" class="mainHeader">
      <slot name="header" />
    </el-header>
    <el-main class="mainScroll">
      <slot />
    </el-main>
    <el-footer v-if="showFooter" height="auto" class="mainFooter">
      <slot name="footer" />
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: "main-layout-vertical",
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style lang="scss" scoped>
.mainHeader {
  padding: 10px;
  border-bottom: 1px #eee solid;
}

.mainFooter {
  padding: 10px;
  border-top: 1px #eee solid;
}
.mainScroll {
  padding: 0px 10px;
}
.mainScroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.mainScroll::-webkit-scrollbar-thumb {
  background-color: #d5d5d5;
  border-radius: 5px;
}
</style>
