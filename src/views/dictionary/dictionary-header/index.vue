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
            :placeholder="searchPlaceholder"
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
      ></el-pagination>
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
      <el-table-column prop="code" label="编码" :show-overflow-tooltip="true" />
      <el-table-column
        prop="title"
        label="标题"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="description"
        label="描述"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="ex1"
        label="扩展属性"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <template v-for="i in [1, 2, 3, 4, 5]">
            <el-tag
              v-if="isEmpty(i, scope.row)"
              :key="i"
              effect="plain"
              style="margin-right:2px"
            >
              {{ scope.row["ex" + i] }}
            </el-tag>
          </template>
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
// 工具 + 组件 + 全局配置
import { cloneDeep } from "lodash";
import ConfirmButton from "@/components/confirm-button";
import Setting from "@/settings";
import AddPanl from "./add/index";
import EditPanl from "./edit/index";
// 接口
import { getList, execSoftDelete } from "@/api/dictionary/dictionary-header";

// 页面配置
let pageConfig = {
  //菜单Code,需与后台资源'资源编码'保持一致，用于按钮级权限控制
  menuCode: "DictionaryHeader",
  //页面名称，需与后台资源中'视图名称'保持一致，不然视图缓存将不能生效
  pageName: "dictionary--dictionary-header--index"
};

export default {
  // 名称必须与后台资源中'视图名称'保持一致，不然视图缓存将不能生效
  name: pageConfig.pageName,
  components: { ConfirmButton, AddPanl, EditPanl },
  data() {
    return {
      menuCode: pageConfig.menuCode + ".",
      searchPlaceholder: "编码/标题/描述",
      total: 0,
      pageSize: 20,
      currentPage: 1,
      filter: {
        key: "",
        withDisable: true
      },
      data: [],
      listLoading: false,

      // 新增面板属性
      addVisible: false,
      addItem: {},

      // 编辑面板属性
      editVisible: false,
      editItem: {}
    };
  },
  computed: {
    pageCount() {
      return this.total > 0 && this.pageSize > 0
        ? Math.ceil(this.total / this.pageSize)
        : 1;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
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
      }
      this.total = res.data.total;
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
    // 删除事件
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
    isEmpty(i, row) {
      let str = row["ex" + i];
      let res = str == null || str == "" ? false : true;
      // console.log(res, str);
      return res;
    }
  }
};
</script>

<style></style>
