<template>
  <main-layout-vertical :showFooter="false">
    <template #header>
      <div style="margin:-7px; padding-left:5px;">
        <el-button type="text" icon="el-icon-user-solid" @click="onAllUser">
          显示全部用户
        </el-button>
      </div>
    </template>
    <!--列表-->
    <el-table
      ref="refGroupTable"
      v-loading="listLoading"
      highlight-current-row
      :data="treeData"
      row-key="id"
      :default-expand-all="false"
      :expand-row-keys="expandRowKeys"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :show-header="false"
      @row-click="onRowClick"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" align="center" width="50" /> -->
      <!-- <el-table-column type="index" width="80" label="#" /> -->
      <el-table-column
        prop="title"
        label="名称"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column prop="code" label="编码" width /> -->
    </el-table>
  </main-layout-vertical>
</template>

<script>
import { cloneDeep } from "lodash";
import { formatTime, listToTree } from "@/libs/util";
import { getAll } from "@/api/admin/group";

export default {
  name: "Group",
  components: {},
  data() {
    return {
      menuCode: "Group" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      filter: {
        key: "" // 查询关键字
      },
      treeData: [],
      expandRowKeys: [],
      listLoading: false,

      // 新增面板显示属性
      addVisible: false,

      editVisible: false,
      editItem: {},
      editTreeData: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.getTreeList();
  },
  methods: {
    formatDt: function(row, column, time) {
      return formatTime(time);
    },

    // 获取列表
    async getTreeList() {
      const para = {
        ...this.filter
      };
      this.listLoading = true;
      const res = await getAll(para);
      this.listLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      const data = res.data;
      data.forEach(d => {
        d._loading = false;
      });

      const keys = data.filter(l => l.opened).map(l => l.id);
      this.expandRowKeys = keys;

      const tree = listToTree(data);
      this.treeData = cloneDeep(tree);
    },
    onRowClick(row) {
      this.$emit("onRowClick", row);
    },
    onAllUser() {
      this.$emit("onRowClick", "");
      this.$refs.refGroupTable.setCurrentRow();
    }
  }
};
</script>

<style lang="scss" scoped></style>
