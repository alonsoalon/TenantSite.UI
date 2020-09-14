<template>
  <main-layout-vertical :showFooter="false">
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
            placeholder="名称/编号/描述"
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

    <!--列表-->
    <el-table
      v-loading="listLoading"
      highlight-current-row
      :data="data"
      row-key="id"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" align="center" width="50" /> -->
      <el-table-column type="index" width="40" label="#" />
      <el-table-column
        prop="configType"
        label="配置类型"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="targetLabel"
        label="配置对象"
        width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="code"
        label="编码"
        width="200"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="dataValue"
        label="值"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-switch
            v-if="scope.row.dataType == 'Bool'"
            v-model="scope.row.dataValue"
            active-value="1"
            inactive-value="0"
            disabled
          />
          <span v-else>{{ scope.row.dataValue }} </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="名称"
        width
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="description"
        label="描述"
        width
        :show-overflow-tooltip="true"
      />

      <!-- <el-table-column
        prop="dataType"
        label="数据类型"
        width="100"
        :show-overflow-tooltip="true"
      /> -->

      <el-table-column prop="isPublic" label="公开状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isPublic ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.isPublic ? "Yes" : "No" }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="isDisabled" label="启用状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isDisabled ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.isDisabled ? "禁用" : "启用" }}
          </el-tag>
        </template>
      </el-table-column> -->
      <Auth
        :authority="[menuCode + 'Delete', menuCode + 'Edit']"
        :withContainer="false"
      >
        <el-table-column label="操作" width="170">
          <template v-slot="{ $index, row }">
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
  </main-layout-vertical>
</template>

<script>
import { cloneDeep } from "lodash";
import { formatTime } from "@/libs/util";
import { getAll, execSoftDelete } from "@/api/admin/config";
import ConfirmButton from "@/components/confirm-button";
import AddPanl from "./add/index";
import EditPanl from "./edit/index";
import Setting from "@/settings";
export default {
  name: "admin--config--index",
  components: { ConfirmButton, AddPanl, EditPanl },
  data() {
    return {
      menuCode: "Config" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
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
      editTreeData: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.getList();
  },
  methods: {
    formatDt: function(row, column, time) {
      return formatTime(time);
    },

    // 获取列表
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
      this.editVisible = true;
      this.editItem = cloneDeep(row);
    },
    onEditSuccess() {
      this.getList();
    },
    onEditError() {},
    onEditChangeDrawer(v) {
      this.editVisible = v;
    },
    // -- edit 事件 end --
    // 删除验证
    // eslint-disable-next-line no-unused-vars
    deleteValidate(row) {
      if (Setting.isDemo) {
        this.$message({
          message: this.$t("common.demoTips"),
          type: "warning"
        });
        return false;
      }
      return true;
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

<style lang="scss" scoped></style>
