<template>
  <section>
    <!--工具条-->
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
              v-model="filter.name"
              placeholder="用户名/昵称"
              clearable
              @keyup.enter.native="getUsers"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getUsers">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <add-panl
      title="添加用户"
      :data="addForm"
      :visible="addVisible"
      @changeDrawer="changeDrawerAdd"
    ></add-panl>
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="users"
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="userName" label="用户名" width />
      <el-table-column prop="displayName" label="姓名" width />
      <el-table-column prop="userType" label="用户类型" width>
        <template v-slot="{ row }">
          {{ row.userType == 1 ? "超管" : "普通用户" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建时间"
        :formatter="formatDt"
        width
      />
      <el-table-column prop="isDisabled" label="状态" width>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isDisabled ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.isDisabled ? "禁用" : "正常" }}
          </el-tag>
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
  </section>
</template>

<script>
import { formatTime } from "@/libs/util";
import { getPageList } from "@/api/admin/user";
// import ConfirmButton from "@/components/confirm-button";
import AddPanl from "./add/index";
export default {
  name: "admin--user--index",
  components: { AddPanl },

  data() {
    return {
      filter: {
        name: ""
      },
      users: [],
      roles: [],
      total: 0,
      pageSize: 10,
      currentPage: 1,
      listLoading: false,
      sels: [], // 列表选中列,

      addVisible: false,
      editVisible: false,

      addDialogFormVisible: false,
      editFormVisible: false, // 编辑界面是否显示
      editLoading: false,
      editFormRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      userNameReadonly: true,
      // 编辑界面数据
      editForm: {
        id: 0,
        name: "",
        userName: "",
        nickName: "",
        roleIds: []
      },

      addFormVisible: false, // 新增界面是否显示
      addLoading: false,
      addFormRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      // 新增界面数据
      addForm: {
        name: "",
        userName: "",
        nickName: "",
        password: "",
        roleIds: []
      },
      deleteLoading: false
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
      this.getUsers();
    },
    pageSize() {
      this.getUsers();
    }
  },
  async mounted() {
    this.getUsers();
  },
  methods: {
    formatDt: function(row, column, time) {
      return formatTime(time);
    },
    // 获取用户列表
    async getUsers() {
      const para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        filter: this.filter
      };
      this.listLoading = true;
      const res = await getPageList(para);
      console.log(res);
      this.listLoading = false;

      if (!res.success) {
        if (res.message) {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
        return;
      }

      this.total = res.data.total;
      const data = res.data.list;
      data.forEach(d => {
        d._loading = false;
      });
      this.users = data;
    },

    async onAdd() {
      console.log(1213);
      this.addVisible = true;
    },
    changeDrawerAdd(v) {
      this.addVisible = v;
    }
  }
};
</script>

<style lang="scss" scoped></style>
