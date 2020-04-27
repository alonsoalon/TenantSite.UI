<template>
  <main-layout-horizontal>
    <template #aside>
      <permission @onRowClick="onRowClick"></permission>
    </template>
    <template #main>
      <right-pane ref="refRightPane"></right-pane>
    </template>
  </main-layout-horizontal>
</template>

<script>
import Permission from "./permission/index";
import RightPane from "./right-pane/index";
export default {
  name: "admin--permission-power--index",
  components: { Permission, RightPane },
  computed: {},
  mounted() {},
  data() {
    return {};
  },
  methods: {
    onRowClick(row) {
      this.$refs.refRightPane.init(row);
    }
  }
};
</script>
<style lang="scss" scoped></style>
