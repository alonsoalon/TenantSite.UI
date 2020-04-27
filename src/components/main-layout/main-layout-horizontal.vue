<template>
  <el-container style="height:100%; padding:10px;">
    <el-aside :width="asideWidth" class="asideContent">
      <slot name="aside" />
    </el-aside>
    <el-main class="mainContent">
      <slot name="main" />
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "main-layout-horizontal",
  props: {
    asideWidth: {
      type: String,
      default: "300px"
    }
  }
};
</script>

<style lang="scss" scoped>
.asideContent {
  border: 1px solid rgb(230, 230, 230);
  margin-right: 10px;
}

.mainContent {
  border: 1px solid rgb(230, 230, 230);
}
</style>
