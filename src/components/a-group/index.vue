<template>
  <div>
    <el-cascader
      :placeholder="placeholder"
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
import { getUserGroups as getGroups } from "@/api/account";

export default {
  name: "AGroupSelect",
  //props: ["value"],
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "请选择"
    }
  },
  data() {
    return {
      currentValue: this.value,
      loading: false,
      groupOptions: []
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    }
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
      let treeData = listToTree(res.data);
      // 去除父级被禁用，导致找不到父级 ，经过listToTree 将自动提到顶级，过滤掉这部分数据
      this.groupOptions = treeData.filter(
        x => x.parentId === null || x.parentId === ""
      );
    }
  }
};
</script>
