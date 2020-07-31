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
        <el-tab-pane label="数据条件" name="second"></el-tab-pane>
      </el-tabs>
    </template>
    <div v-show="activeName === 'first'">
      <role ref="refRole" @onChange="getCheckedRoles"></role>
    </div>

    <div v-show="activeName === 'second'">
      <condition
        ref="refCondition"
        @onChange="getCheckedConditions"
      ></condition>
    </div>
    <template #footer>
      <Auth :authority="menuCode + 'Save'" prevent>
        <confirm-button
          type="primary"
          icon="el-icon-check"
          :validate="saveValidate"
          :validate-data="permissionItem"
          :loading="saveLoading"
          :disabled="unavailable"
          @click="save"
        >
          提交
        </confirm-button>
      </Auth>

      <el-button
        type="success"
        icon="el-icon-refresh"
        :disabled="unavailable"
        @click="reset"
        style="margin-left:10px"
      >
        重置
      </el-button>
    </template>
  </main-layout-vertical>
</template>

<script>
import Role from "./role/index";
import Condition from "./condition/index";
import { permissionAssignPower } from "@/api/admin/permission";
import ConfirmButton from "@/components/confirm-button";
import Setting from "@/settings";
export default {
  name: "admin--permission-power--permission",
  components: {
    Role,
    Condition,
    ConfirmButton
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
      menuCode: "PermissionAuth" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      activeName: "first",
      saveLoading: false,
      checkedConditions: [],
      checkedRoles: [],
      permissionItem: {}
    };
  },
  mounted() {},

  methods: {
    // eslint-disable-next-line no-unused-vars
    saveValidate(item) {
      if (Setting.isDemo) {
        this.$message({
          message: this.$t("common.demoTips"),
          type: "warning"
        });
        return false;
      }

      return true;
    },
    RoleSetChecked(permissionItem) {
      this.$refs.refRole.setChecked(permissionItem);
    },
    ConditionSetChecked(permissionItem) {
      this.$refs.refCondition.setChecked(permissionItem);
    },
    init(permissionItem) {
      this.permissionItem = permissionItem;
      this.RoleSetChecked(permissionItem);
      this.ConditionSetChecked(permissionItem);
    },
    reset() {
      this.init(this.permissionItem);
    },
    getCheckedRoles(items) {
      this.checkedRoles = items;
    },
    getCheckedConditions(items) {
      this.checkedConditions = items;
    },
    // 保存权限
    async save() {
      const roleIds = this.checkedRoles.map(s => {
        return s.id;
      });
      const ConditionIds = this.checkedConditions.map(s => {
        return s.id;
      });

      const para = {
        permissionId: this.permissionItem.id,
        roleIds,
        ConditionIds
      };

      this.saveLoading = true;
      const res = await permissionAssignPower(para);
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
