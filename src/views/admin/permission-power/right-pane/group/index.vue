<template>
  <!--列表-->
  <el-table
    ref="multipleTable"
    v-loading="listLoading"
    highlight-current-row
    :data="data"
    row-key="id"
    :default-expand-all="false"
    :expand-row-keys="expandRowKeys"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    style="width: 100%;"
    @select-all="selectAll"
    @select="select"
  >
    <el-table-column type="selection" align="center" width="50" />
    <el-table-column prop="title" label="名称" width />
    <el-table-column prop="code" label="编码" width />
  </el-table>
</template>
<script>
import { cloneDeep } from "lodash";
import { listToTree, treeToList } from "@/libs/util";
import { getAll } from "@/api/admin/group";

import { getGroupIdsByPermissionId } from "@/api/admin/permission";

export default {
  name: "admin--permissioon-power--group",
  props: {},
  components: {},
  data() {
    return {
      filter: {
        key: "" // 查询关键字
      },
      data: [],
      expandRowKeys: [],
      listLoading: false
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.getList();
  },
  methods: {
    async getList() {
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

      const keys = data.filter(l => l.opened).map(l => l.id);
      this.expandRowKeys = keys;

      const tree = listToTree(data).filter(
        x => x.parentId === null || x.parentId === ""
      );
      this.data = cloneDeep(tree);
    },
    async setChecked(permissionItem) {
      const para = {
        permissionId: permissionItem.id
      };
      this.listLoading = true;
      const res = await getGroupIdsByPermissionId(para);
      this.listLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }

      const checkIds = res.data;
      if (checkIds === null || checkIds.length === 0) {
        this.$refs.multipleTable.clearSelection();
        return;
      }

      const rows = treeToList(this.data);
      rows.forEach(row => {
        const checked = checkIds.includes(row.id);
        this.$refs.multipleTable.toggleRowSelection(row, checked);
      });

      this.emitParent(this.$refs.multipleTable.selection);
    },

    // eslint-disable-next-line no-unused-vars
    select: function(selection, row) {
      this.emitParent(this.$refs.multipleTable.selection);
    },
    // eslint-disable-next-line no-unused-vars
    selectAll: function(selection) {
      this.emitParent(this.$refs.multipleTable.selection);
    },
    emitParent(checkedItems) {
      this.$emit("onChange", checkedItems);
    }
  }
};
</script>
