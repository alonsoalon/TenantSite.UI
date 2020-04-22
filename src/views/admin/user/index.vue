<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form
          size="small"
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
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      highlight-current-row
      :data="data"
      row-key="id"
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" width="40" label="#" />
      <el-table-column prop="userName" label="用户名" width />
      <el-table-column prop="displayName" label="显示名" width />
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

      <el-table-column label="操作" width="170">
        <template v-slot="{ $index, row }">
          <el-button size="small" @click="onEdit($index, row)">编辑</el-button>
          <confirm-button
            type="delete"
            :loading="row._loading"
            :validate="deleteValidate"
            :validate-data="row"
            @click="onDelete($index, row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-row>
      <el-col :span="24" class="pagination">
        <el-pagination
          layout="total, slot, sizes, prev, jumper, next"
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :total="total"
          :page-count="pageCount"
          background
          style="text-align:right;"
        >
          <span class="el-pagination__count">，{{ pageCount }} 页</span>
        </el-pagination>
      </el-col>
    </el-row>

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
  </section>
</template>

<script>
import { cloneDeep } from "lodash";
import { formatTime } from "@/libs/util";
import { getList, execSoftDelete } from "@/api/admin/user";
import ConfirmButton from "@/components/confirm-button";
import AddPanl from "./add/index";
import EditPanl from "./edit/index";
export default {
  name: "admin--user--index",
  components: { ConfirmButton, AddPanl, EditPanl },
  data() {
    return {
      total: 0,
      pageSize: 10,
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
      editTreeData: []
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
    formatDt: function(row, column, time) {
      return formatTime(time);
    },

    // 获取列表
    async getList() {
      const para = {
        ...this.filter
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
    deleteValidate(row) {
      let isValid = true;
      if (row && row.code === "SYSTEM") {
        this.$message({ message: row.title + " 禁止删除！", type: "warning" });
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

<style lang="scss" scoped></style>
