<template>
  <div class="root">
    <el-alert
      title="欢迎使用 Tenant Site"
      type="info"
      show-icon
      :closable="false"
    >
    </el-alert>
  </div>
</template>
<script>
export default {
  name: "admin--dashboard--index"
};
</script>
<style lang="scss" scoped>
.root {
  text-align: center;
}
</style>
