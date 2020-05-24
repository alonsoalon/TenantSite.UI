<template>
  <main-layout-horizontal>
    <template #aside>
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
              @keyup.enter.native="getRoles"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getRoles"
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
                  <br />
                  {{ props.row.description }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="角色名称"> </el-table-column>
          </el-table>
        </div>
      </main-layout-vertical>
    </template>
    {{ this.currentItemTitle }}
    <template #main>
      <main-layout-vertical
        v-loading="currentRoleId === ''"
        element-loading-text="请选择需要赋权的角色"
        element-loading-spinner="none"
      >
        <template #header>
          <div style="line-height:32px;font-size:14px;">
            {{
              currentItemTitle === ""
                ? "请选择需要赋权的角色"
                : "[" + currentItemTitle + "] 资源分配"
            }}
          </div>
        </template>
        <template #footer>
          <Auth :authority="menuCode + 'Save'" prevent>
            <confirm-button
              type="primary"
              icon="el-icon-check"
              :validate="saveValidate"
              :loading="saveLoading"
              :disabled="saveDisabled"
              @click="save"
            >
              提交
            </confirm-button>
          </Auth>

          <el-button
            type="success"
            icon="el-icon-refresh"
            :disabled="saveDisabled"
            @click="getResourceIdsByRoleId"
            style="margin-left:10px"
          >
            重置
          </el-button>
        </template>

        <div>
          <el-table
            class="setting-table"
            ref="multipleTable"
            v-loading="ResourcesLoading"
            :data="resources"
            :default-expand-all="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            row-key="id"
            highlight-current-row
            @select-all="selectAll"
            @select="select"
          >
            <el-table-column type="selection" align="center" width="50" />
            <el-table-column prop="title" label="菜单资源" width="180">
              <template slot-scope="scope">
                <i :class="scope.row.icon" />
                {{ scope.row.title }}
              </template>
            </el-table-column>
            <el-table-column label="功能资源" width>
              <template slot-scope="{ $index, row }">
                <div class="ckb">
                  <el-checkbox-group
                    v-if="row.funcs && row.funcs.length > 0"
                    v-model="chekedFuncs"
                  >
                    <el-checkbox
                      v-for="api in row.funcs"
                      :key="api.id"
                      :label="api.id"
                    >
                      {{ api.title }}
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </main-layout-vertical>
    </template>
  </main-layout-horizontal>
</template>

<script>
import ConfirmButton from "@/components/confirm-button";
import { listToTree, treeToList } from "@/libs/util";
import {
  getAll as getRoles,
  roleAssignResources,
  getResourceIdsById as getResourceIdsByRoleId
} from "@/api/admin/role";
import { getResources } from "@/api/admin/resource";

export default {
  name: "admin--role-power--index",
  components: { ConfirmButton },
  computed: {
    saveDisabled() {
      return this.currentRoleId === "";
    }
  },
  mounted() {
    this.getRoles();
    this.getResources();
  },
  data() {
    return {
      menuCode: "RoleAuth" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      filter: {
        key: "" // 查询关键字
      },

      currentRoleId: "",
      currentItemTitle: "",

      roles: [],
      rolesLoading: false,

      resources: [],
      ResourcesLoading: false,

      checkedResources: [],
      chekedFuncs: [],

      saveLoading: false
    };
  },
  methods: {
    // 获取列表
    async getRoles() {
      const para = {
        ...this.filter
      };
      this.rolesLoading = true;
      const res = await getRoles(para);
      this.rolesLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }

      this.roles = res.data;
    },

    async getResources() {
      this.ResourcesLoading = true;
      const res = await getResources();
      this.ResourcesLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      let treeData = listToTree(res.data);
      // 去除父级被禁用，导致找不到父级的子集数据 (找不到父级的 经过listToTree后将自动提到顶级)，过滤掉这部分数据
      this.resources = treeData.filter(
        x => x.parentId === null || x.parentId === ""
      );
    },

    async getResourceIdsByRoleId() {
      const para = {
        roleId: this.currentRoleId
      };
      this.ResourcesLoading = true;
      const res = await getResourceIdsByRoleId(para);
      this.ResourcesLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }

      const resourceIds = res.data;
      const rows = treeToList(this.resources);

      rows.forEach(row => {
        const checked = resourceIds.includes(row.id);
        this.$refs.multipleTable.toggleRowSelection(row, checked);
      });
      this.checkedResources = this.$refs.multipleTable.selection;

      const menuIds = this.checkedResources.map(s => {
        return s.id;
      });
      const funcIds = [];
      resourceIds.forEach(id => {
        if (!menuIds.includes(id)) {
          funcIds.push(id);
        }
      });
      this.chekedFuncs = funcIds;
    },

    onRowClick(row) {
      if (this.currentRoleId === row.id) {
        return;
      }
      this.currentItemTitle = row.title;
      this.currentRoleId = row.id;
      this.getResourceIdsByRoleId();
    },

    selectFuncs(checked, row) {
      if (row.funcs) {
        row.funcs.forEach(a => {
          const index = this.chekedFuncs.indexOf(a.id);
          if (checked) {
            if (index === -1) {
              this.chekedFuncs.push(a.id);
            }
          } else {
            if (index > -1) {
              this.chekedFuncs.splice(index, 1);
            }
          }
        });
      }
    },

    selectAll: function(selection) {
      const selections = treeToList(selection);
      const rows = treeToList(this.resources);
      const checked = selections.length === rows.length;
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row, checked);
        this.selectFuncs(checked, row);
      });

      this.checkedResources = this.$refs.multipleTable.selection;
    },

    select: function(selection, row) {
      const checked = selection.some(s => s.id === row.id);
      if (row.children && row.children.length > 0) {
        const rows = treeToList(row.children);
        rows.forEach(r => {
          this.$refs.multipleTable.toggleRowSelection(r, checked);
          this.selectFuncs(checked, r);
        });
      } else {
        this.selectFuncs(checked, row);
      }

      this.checkedResources = this.$refs.multipleTable.selection;
    },
    // 验证保存
    saveValidate() {
      //6657691850302504960 系统管理-管理
      //6661267477010006016 授权管理-管理
      if (
        this.currentRoleId == "6657691850302504960" ||
        this.currentRoleId == "6661267477010006016"
      ) {
        this.$message({
          message: "演示环境，系统管理、授权管理两个角色禁止变动其资源",
          type: "warning"
        });
        return false;
      }

      let isValid = true;
      if (this.currentRoleId === "") {
        this.$message({ message: "请选择角色！", type: "warning" });
        isValid = false;
        return isValid;
      }
      if (!(this.checkedResources.length > 0 || this.chekedFuncs.length > 0)) {
        this.$message({ message: "请选择权限！", type: "warning" });
        isValid = false;
        return isValid;
      }
      return isValid;
    },
    // 保存权限
    async save() {
      const resourceIds = this.checkedResources.map(s => {
        return s.id;
      });
      if (this.chekedFuncs.length > 0) {
        resourceIds.push(...this.chekedFuncs);
      }
      const para = { resourceIds, roleId: this.currentRoleId };

      this.saveLoading = true;
      const res = await roleAssignResources(para);
      this.saveLoading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.updateOk"), type: "success" });
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.ckb {
  padding-top: 0px;
  height: 23px;
}
.ckb /deep/ .el-checkbox-group .el-checkbox .el-checkbox__label {
  font-size: 13px;
}
</style>
