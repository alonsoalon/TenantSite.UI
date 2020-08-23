<template>
  <div>
    <!--列表-->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      highlight-current-row
      :data="data"
      row-key="id"
      @select-all="selectAll"
      @select="select"
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div
            v-if="scope.row.expression != null && scope.row.expression != ''"
          >
            <el-divider content-position="left">SQL Where</el-divider>
            {{ scope.row.expression }}
          </div>

          <div v-if="scope.row.condition != null && scope.row.condition != ''">
            <!-- <el-divider content-position="left">Json Where</el-divider> -->
            {{ scope.row.condition }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="code" label="编码" width />
      <el-table-column prop="title" label="名称" width />
      <el-table-column
        prop="description"
        label="描述"
        :show-overflow-tooltip="true"
      />
    </el-table>
  </div>
</template>

<script>
import { getAll } from "@/api/admin/condition";
import { getConditionIdsByPermissionId } from "@/api/admin/permission";

export default {
  name: "admin--permission-power--condition",
  components: {},
  props: {},
  data() {
    return {
      filter: {
        key: ""
      },
      data: [],
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
      this.data = res.data;
    },
    async setChecked(permissionItem) {
      const para = {
        permissionId: permissionItem.id
      };
      this.listLoading = true;
      const res = await getConditionIdsByPermissionId(para);
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

      const rows = this.data;
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
