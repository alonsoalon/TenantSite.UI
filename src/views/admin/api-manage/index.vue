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
            placeholder="名称/分类/请求方法/接口地址"
            clearable
            @keyup.enter.native="onSearch"
            style="width:300px"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item v-auth="menuCode + 'Add'">
          <el-button type="primary" @click="onAdd">新增</el-button>
        </el-form-item>
        <Auth :authority="menuCode + 'GenerateApi'" prevent>
          <el-form-item>
            <confirm-button
              icon="el-icon-circle-check"
              :validate="submitValidate"
              :loading="generateApisLoading"
              @click="onGenerate"
              style="margin-left: 0px;"
            >
              <template #content>
                <p>
                  此操作将通过路由自动生成Api接口，
                  如果存在相同Api将更新，不存在将自动新增Api，确定要执行此操作吗？
                </p>
              </template>
              生成API
            </confirm-button>
          </el-form-item>
        </Auth>
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
        @size-change="getList"
        @current-change="getList"
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
      <el-table-column type="index" width="40" label="#" />
      <el-table-column prop="category" label="分类" width="200" />
      <el-table-column
        prop="httpMethod"
        label="接口 Method + Path"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.httpMethod == 'Delete'"
            type="danger"
            disable-transitions
          >
            {{ scope.row.httpMethod }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.httpMethod == 'Put'"
            type="warning"
            disable-transitions
          >
            {{ scope.row.httpMethod }}
          </el-tag>
          <el-tag
            v-else-if="scope.row.httpMethod == 'Post'"
            type="success"
            disable-transitions
          >
            {{ scope.row.httpMethod }}
          </el-tag>
          <el-tag v-else-if="scope.row.httpMethod == 'Get'" disable-transitions>
            {{ scope.row.httpMethod }}
          </el-tag>
          {{ scope.row.url }}
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="名称"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column prop="url" label="接口地址" width /> -->

      <el-table-column prop="isValidation" label="权限验证" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isValidation ? 'success' : 'danger'"
            disable-transitions
          >
            {{ scope.row.isValidation ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
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
        :authority="[menuCode + 'Delete', menuCode + 'Edit']"
        :withContainer="false"
      >
        <el-table-column label="操作" width="170">
          <template v-auth="menuCode + 'Edit'" v-slot="{ $index, row }">
            <el-button @click="onEdit($index, row)">
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
import { getList, execSoftDelete, generateApis } from "@/api/admin/api";
import ConfirmButton from "@/components/confirm-button";
import AddPanl from "./add/index";
import EditPanl from "./edit/index";
import Setting from "@/settings";
export default {
  name: "admin--api-manage--index",
  components: { ConfirmButton, AddPanl, EditPanl },
  data() {
    return {
      menuCode: "Api" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      total: 0,
      pageSize: 20,
      currentPage: 1,

      filter: {
        key: "",
        withDisable: true
      },
      data: [],
      listLoading: false,

      // 新增面板显示属性
      addVisible: false,

      editVisible: false,
      editItem: {},

      generateApisLoading: false
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
    // currentPage() {
    //   this.getList();
    // },
    // pageSize() {
    //   this.getList();
    // }
  },
  async mounted() {
    this.getList();
  },
  methods: {
    submitValidate() {
      if (Setting.isDemo) {
        this.$message({
          message: this.$t("common.demoTips"),
          type: "warning"
        });
        return false;
      }

      return true;
    },
    formatDt: function(row, column, time) {
      return formatTime(time);
    },
    onSearch() {
      this.currentPage = 1;
      this.getList();
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
      const data = res.data.list;
      if (data !== null && data.length > 0) {
        data.forEach(d => {
          d._loading = false;
        });
        this.data = data;
        this.total = res.data.total;
      }
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
    deleteValidate() {
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
    },
    async onGenerate() {
      this.generateApisLoading = true;
      const res = await generateApis();
      this.generateApisLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      } else {
        this.$message({ message: "成功生成API", type: "success" });
        this.getList();
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
