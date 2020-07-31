<template>
  <div>
    <el-cascader
      ref="refCascader"
      v-loading="loading"
      v-model="currentValue"
      :options="options"
      :props="config"
      @change="onChange"
      style="width:100%"
      filterable
      clearable
      :disabled="disabled"
    ></el-cascader>
  </div>
</template>

<script>
import { listToTree } from "@/libs/util";
import { getAll } from "@/api/dictionary/dictionary-entry";

export default {
  name: "ADictionarySelect",
  //   props: [
  //       "value"
  //   ],
  props: {
    value: {
      type: String,
      default: ""
    },
    code: {
      type: String,
      default: ""
    },
    filterkey: {
      type: String,
      default: ""
    },
    withDisable: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      config: {
        checkStrictly: true,
        value: "code",
        label: "title",
        emitPath: false,
        multiple: this.multiple
      },
      currentValue: this.value,
      loading: false,
      options: []
    };
  },
  watch: {
    value(val) {
      this.currentValue = val;
    }
  },
  async mounted() {
    this.getOptions();
  },
  methods: {
    onChange() {
      this.$emit("input", this.currentValue);
      this.$emit("change", this.getCheckedNodes());
    },
    getCheckedNodes() {
      return this.$refs["refCascader"].getCheckedNodes();
    },
    async getOptions() {
      if (this.code == "") {
        return;
      }

      this.loading = true;
      let params = {
        dictionaryHeaderCode: this.code,
        key: this.filterkey,
        withDisable: this.withDisable
      };
      const res = await getAll(params);
      this.loading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      let treeData = listToTree(res.data);
      // 去除父级被禁用，导致找不到父级 ，经过listToTree 将自动提到顶级，过滤掉这部分数据
      this.options = treeData.filter(
        x => x.parentId === null || x.parentId === ""
      );

      this.$emit("load", res.data);
    }
  }
};
</script>
