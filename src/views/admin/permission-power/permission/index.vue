<template>
  <main-layout-vertical :showFooter="false">
    <template #header>
      <el-form
        class="main-layout-form-query"
        :inline="true"
        :model="filter"
        @submit.native.prevent
      >
        <el-input
          v-model="filter.key"
          placeholder="名称/编号/描述"
          clearable
          @keyup.enter.native="getPermissions"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getPermissions"
          ></el-button>
        </el-input>
      </el-form>
    </template>
    <div style="margin:0 -10px 0 -10px;">
      <el-table
        v-loading="rolesLoading"
        :data="roles"
        highlight-current-row
        :stripe="false"
        :show-header="false"
        @row-click="onRowClick"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="detail">
              <span v-if="props.row.code && props.row.code !== ''">
                [{{ props.row.code }}]
              </span>
              {{ props.row.description }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="权限岗名称"> </el-table-column>
      </el-table>
    </div>
  </main-layout-vertical>
</template>

<script>
import { getAll as getPermissions } from "@/api/admin/permission";
export default {
  name: "admin-permission-power-permission",
  components: {},
  props: {
    title: {
      type: String,
      default: "新增"
    }
  },
  computed: {},
  data() {
    return {
      filter: {
        key: "" // 查询关键字
      },
      rolesLoading: false,
      roles: []
    };
  },
  mounted() {
    this.getPermissions();
  },

  methods: {
    async getPermissions() {
      const para = {
        ...this.filter
      };
      this.rolesLoading = true;
      const res = await getPermissions(para);
      this.rolesLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      this.roles = res.data;
    },
    onRowClick(row) {
      this.$emit("onRowClick", row);
    }
  }
};
</script>

<style lang="scss" scoped>
section {
  display: flex;
  flex-flow: column;
  height: 100%;
  .toolbar {
    padding: 10px;
  }
}
</style>
