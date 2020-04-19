<template>
  <div>
    <el-cascader
      v-loading="loading"
      v-model="currentValue"
      :options="groupOptions"
      :props="{
        checkStrictly: true,
        value: 'id',
        label: 'title',
        emitPath: false
      }"
      @change="onChange"
      style="width:100%"
      filterable
      clearable
    ></el-cascader>
  </div>
</template>

<script>
import { listToTree } from "@/libs/util";
import { getAll as getGroups } from "@/api/admin/group";
export default {
  name: "GroupSelect",
  props: ["value"],
  data() {
    return {
      currentValue: this.value,
      loading: false,
      groupOptions: []
    };
  },
  async mounted() {
    this.getGroupOptions();
  },
  methods: {
    onChange() {
      this.$emit("input", this.currentValue);
    },
    async getGroupOptions() {
      this.loading = true;
      const res = await getGroups({});
      this.loading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      this.groupOptions = listToTree(res.data);
    }
  }
};
</script>
