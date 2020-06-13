<template>
  <main-layout-vertical>
    <template #header>
      <el-form
        class="main-layout-form-query"
        :inline="true"
        :model="filter"
        @submit.native.prevent
      >
        <el-form-item>
          <el-input
            v-model="filter.key"
            placeholder="用户名/显示名"
            clearable
            @keyup.enter.native="getList"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
        <el-form-item v-auth="menuCode + 'Add'">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
        :page-count="pageCount"
        :pager-count="5"
        background
        style="text-align:right;"
      >
      </el-pagination>
    </template>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      highlight-current-row
      :data="data"
      row-key="id"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" align="center" width="50" /> -->
      <el-table-column type="index" width="30" label="#" />
      <el-table-column prop="avatar" label="" width="50">
        <template slot-scope="scope">
          <div class="img">
            <!-- <el-avatar shape="square" size="small" :src="scope.row.avatar">
              <img :src="avatarDefault" />
            </el-avatar> -->

            <avatar
              :username="
                scope.row.displayName == ''
                  ? scope.row.userName
                  : scope.row.displayName
              "
              :size="33"
              :src="getAvatar(scope.row.avatar)"
            ></avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="userName" label="用户名" width />

      <el-table-column prop="displayName" label="显示名" width />
      <el-table-column prop="permissionName" label="权限岗" width />
      <el-table-column
        prop="createdTime"
        label="创建时间"
        :formatter="formatDt"
        width
      />

      <el-table-column prop="isDisabled" label="启用状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isDisabled ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.isDisabled ? "禁用" : "启用" }}
          </el-tag>
        </template>
      </el-table-column>
      <Auth
        :authority="[
          menuCode + 'ChangePassword',
          menuCode + 'Delete',
          menuCode + 'Edit'
        ]"
        :withContainer="false"
      >
        <el-table-column label="操作" width="250">
          <template v-slot="{ $index, row }">
            <el-button
              v-auth="menuCode + 'ChangePassword'"
              @click="onChangePassword($index, row)"
            >
              改密
            </el-button>
            <el-button v-auth="menuCode + 'Edit'" @click="onEdit($index, row)">
              编辑
            </el-button>
            <confirm-button
              v-auth="menuCode + 'Delete'"
              type="delete"
              :loading="row._loading"
              :validate="deleteValidate"
              :validate-data="row"
              @click="onDelete($index, row)"
            />
          </template>
        </el-table-column>
      </Auth>
    </el-table>

    <add-panl
      title="新增"
      :visible="addVisible"
      @onChangeDrawer="onAddChangeDrawer"
      @onSuccess="onAddSuccess"
      @onError="onAddError"
    ></add-panl>

    <edit-panl
      title="编辑"
      :visible="editVisible"
      :data="editItem"
      @onChangeDrawer="onEditChangeDrawer"
      @onSuccess="onEditSuccess"
      @onError="onEditError"
    ></edit-panl>
    <ChangePassword
      :data="changePasswordItem"
      :visible="changePasswordVisible"
      @onChangeDrawer="onChangePasswordChangeDrawer"
      @onSuccess="onChangePasswordSuccess"
    >
    </ChangePassword>
  </main-layout-vertical>
</template>

<script>
import { cloneDeep } from "lodash";
import { formatTime } from "@/libs/util";
import { getList, execSoftDelete } from "@/api/admin/user";
import ConfirmButton from "@/components/confirm-button";
import AddPanl from "./add/index";
import EditPanl from "./edit/index";
import ChangePassword from "./change-password/index";
import Avatar from "vue-avatar";
import Setting from "@/settings";
export default {
  name: "admin--user--index",
  components: { ConfirmButton, AddPanl, EditPanl, ChangePassword, Avatar },
  data() {
    return {
      menuCode: "User" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      avatarDefault: require("@/assets/avatar.png"),
      total: 0,
      pageSize: 20,
      currentPage: 1,

      filter: {
        key: "",
        withDisable: true
      },
      data: [],
      expandRowKeys: [],
      listLoading: false,

      // 新增面板显示属性
      addVisible: false,

      editVisible: false,
      editItem: {},

      changePasswordVisible: false,
      changePasswordItem: {}
    };
  },
  computed: {
    pageCount() {
      return this.total > 0 && this.pageSize > 0
        ? Math.ceil(this.total / this.pageSize)
        : 1;
    }
  },
  watch: {
    currentPage() {
      this.getList();
    },
    pageSize() {
      this.getList();
    }
  },
  async mounted() {
    this.getList();
  },
  methods: {
    getAvatar(path) {
      var url = path === "" || path === null ? "" : Setting.avatarURL + path;
      return url;
    },
    formatDt: function(row, column, time) {
      return formatTime(time);
    },

    // 获取列表
    async getList() {
      const para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        filter: this.filter
      };
      this.listLoading = true;
      const res = await getList(para);
      this.listLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      this.total = res.data.total;
      const data = res.data.list;
      data.forEach(d => {
        d._loading = false;
      });
      this.data = data;
    },
    // -- add 事件 start --
    onAdd() {
      this.addVisible = true;
    },
    onAddSuccess() {
      this.getList();
    },
    onAddError() {},
    onAddChangeDrawer(v) {
      this.addVisible = v;
    },
    // -- add 事件 end --
    // -- edit 事件 start --
    onEdit(index, row) {
      if (row.userName == "alonso") {
        this.$message({
          message: "演示环境，系统管理员alonso禁止编辑",
          type: "warning"
        });
      } else {
        this.editVisible = true;
        this.editItem = cloneDeep(row);
      }
    },
    onEditSuccess() {
      this.getList();
    },
    onEditError() {},
    onEditChangeDrawer(v) {
      this.editVisible = v;
    },
    // -- edit 事件 end --

    // -- 改密 事件 start --
    onChangePassword(index, row) {
      this.changePasswordItem = {
        id: row.id,
        userName: row.userName,
        revision: row.revision,
        password: "",
        confirmPassword: ""
      };
      this.changePasswordVisible = true;
    },
    onChangePasswordChangeDrawer(v) {
      this.changePasswordVisible = v;
    },
    onChangePasswordSuccess() {
      this.getList();
    },
    onChangePasswordError() {},
    // -- 改密 事件 end --

    // 删除验证
    deleteValidate(row) {
      let isValid = true;
      if (row && row.createdByName.toUpperCase() === "INSTALL") {
        this.$message({
          message: row.userName + " 为种子数据,禁止删除！",
          type: "warning"
        });
        isValid = false;
      }

      return isValid;
    },

    async onDelete(index, row) {
      row._loading = true;
      const para = { id: row.id };
      const res = await execSoftDelete(para);
      row._loading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.deleteOk"), type: "success" });
        this.getList();
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.cell .img {
  padding-top: 2px;
  height: 30px;
}
</style>
