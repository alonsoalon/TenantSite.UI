<template>
  <main-layout-vertical
    class="main-layout"
    v-loading="unavailable"
    element-loading-text="请选择需要赋权的岗位"
    element-loading-spinner="none"
  >
    <template #header>
      <el-tabs v-model="activeName">
        <el-tab-pane label="角色" name="first"></el-tab-pane>
        <el-tab-pane label="数据组" name="second"></el-tab-pane>
      </el-tabs>
    </template>
    <div v-show="activeName === 'first'">
      <role ref="refRole" @onChange="getCheckedRoles"></role>
    </div>
    <div v-show="activeName === 'second'">
      <group ref="refGroup" @onChange="getCheckedGroups"></group>
    </div>
    <template #footer>
      <el-button-group>
        <el-button
          type="primary"
          icon="el-icon-check"
          :validate="saveValidate"
          :loading="saveLoading"
          :disabled="unavailable"
          @click="save"
        >
          提交
        </el-button>

        <el-button
          type="success"
          icon="el-icon-refresh"
          :disabled="unavailable"
          @click="reset"
        >
          重置
        </el-button>
      </el-button-group>
    </template>
  </main-layout-vertical>
</template>

<script>
import Role from "./role/index";
import Group from "./group/index";
import { permissionAssignPower } from "@/api/admin/permission";

export default {
  name: "admin--permission-power--permission",
  components: {
    Role,
    Group
  },
  props: {},
  computed: {
    unavailable() {
      return this.permissionItem.id === undefined ||
        this.permissionItem.id === ""
        ? true
        : false;
    }
  },
  data() {
    return {
      activeName: "first",
      saveLoading: false,
      checkedGroups: [],
      checkedRoles: [],
      permissionItem: {}
    };
  },
  mounted() {},

  methods: {
    saveValidate() {
      return true;
    },
    RoleSetChecked(permissionItem) {
      this.$refs.refRole.setChecked(permissionItem);
    },
    GroupSetChecked(permissionItem) {
      this.$refs.refGroup.setChecked(permissionItem);
    },
    init(permissionItem) {
      this.permissionItem = permissionItem;
      this.RoleSetChecked(permissionItem);
      this.GroupSetChecked(permissionItem);
    },
    reset() {
      this.init(this.permissionItem);
    },
    getCheckedRoles(items) {
      console.log(items);
      this.checkedRoles = items;
    },
    getCheckedGroups(items) {
      this.checkedGroups = items;
    },
    // 保存权限
    async save() {
      const roleIds = this.checkedRoles.map(s => {
        return s.id;
      });
      const groupIds = this.checkedGroups.map(s => {
        return s.id;
      });

      const para = { permissionId: this.permissionItem.id, roleIds, groupIds };

      this.saveLoading = true;
      const res = await permissionAssignPower(para);
      this.saveLoading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.addOk"), type: "success" });
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.main-layout {
  /deep/ .mainHeader {
    border-bottom: 0;
    padding-top: 13px;
    padding-bottom: 0;
  }
}

.mainScroll {
  padding: 0px 10px;
}
.mainScroll::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.mainScroll::-webkit-scrollbar-thumb {
  background-color: #d5d5d5;
  border-radius: 5px;
}
</style>
