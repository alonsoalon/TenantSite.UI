<template>
  <section>
    <!--工具条-->
    <el-row>
      <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
        123
      </el-col>
    </el-row>

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
      <el-table-column prop="name" label="姓名" width />
      <el-table-column prop="roleNames" label="角色" width>
        <template v-slot="{ row }">
          {{ row.roleNames ? row.roleNames.join(",") : "" }}
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width />
      <el-table-column prop="status" label="状态" width>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 0 ? 'success' : 'danger'"
            disable-transitions
            >{{ scope.row.status == 0 ? "正常" : "禁用" }}</el-tag
          >
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
import { getPageList } from "@/api/admin/user";
export default {
  name: "User",
  components: {},

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
      sels: [], // 列表选中列

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
    // 获取用户列表
    async getUsers() {
      const para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        filter: this.filter
      };
      this.listLoading = true;
      console.log(1111);
      const res = await getPageList(para);
      console.log(res);
      this.listLoading = false;

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
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
    }
  }
};
</script>

<style lang="scss" scoped></style>
