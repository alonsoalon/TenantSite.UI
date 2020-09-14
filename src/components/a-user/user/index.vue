<template>
  <main-layout-vertical>
    <template #header>
      <div style="margin:-7px;">
        <el-input
          v-model="filter.key"
          placeholder="输入 用户名/显示名 回车键搜索"
          clearable
          @keyup.enter.native="onSearch"
          class="filter"
        >
          <template #prefix>
            <i class="el-input__icon el-icon-search" />
          </template>
        </el-input>
      </div>
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
      ref="refUserTable"
      v-loading="listLoading"
      highlight-current-row
      :data="data"
      row-key="id"
      @current-change="handleSelectionChange"
      @select="onTableSelect"
      @select-all="onTableSelectAll"
      style="width: 100%;"
    >
      <!-- <el-table-column type="selection" align="center" width="50" /> -->

      <template v-if="multiple">
        <!-- 多选 -->
        <el-table-column type="selection" align="center" width="30" />
      </template>
      <template v-else>
        <!-- 单选 -->
        <el-table-column label="" width="30">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.checked"
              @change="fixSelectBug(scope.row)"
            ></el-checkbox>
          </template>
        </el-table-column>
      </template>

      <el-table-column prop="avatar" label="" width="50">
        <template slot-scope="{ row }">
          <div class="img">
            <avatar
              :username="row.displayName == '' ? row.userName : row.displayName"
              :size="33"
              :src="getAvatar(row)"
            ></avatar>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="用户名"
        :show-overflow-tooltip="true"
        width
      />

      <el-table-column
        prop="displayName"
        label="显示名"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="permissionName"
        label="权限模板"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="groupName"
        label="所属组织"
        :show-overflow-tooltip="true"
      />
    </el-table>
  </main-layout-vertical>
</template>

<script>
import { getList } from "@/api/admin/user";
import { isArray } from "lodash";

import Avatar from "vue-avatar";
import Setting from "@/settings";

export default {
  name: "user",
  components: { Avatar },
  props: {
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menuCode: "User" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      avatarDefault: require("@/assets/avatar.png"),
      total: 0,
      pageSize: 20,
      currentPage: 1,

      filter: {
        key: "",
        groupId: ""
      },
      data: [],
      listLoading: false,

      selectedRows: [], // 选中的行集合
      selectedKeys: [], // 选中的key集合
      valueKey: "id" // key属性
    };
  },
  computed: {
    pageCount() {
      return this.total > 0 && this.pageSize > 0
        ? Math.ceil(this.total / this.pageSize)
        : 1;
    }
  },
  watch: {},
  async mounted() {
    //this.getList();
  },
  methods: {
    // 初始化（面板打开后执行）
    init(selectedKeys = [], valueKey = "id") {
      this.selectedKeys = selectedKeys;
      this.valueKey = valueKey;
      this.getList();
    },
    // 组织结构点击后执行
    groupInit(headerItem) {
      this.filter.key = "";
      if (headerItem) {
        this.filter.groupId = headerItem.id;
      } else {
        this.filter.groupId = "";
      }
      this.getList();
    },

    getAvatar(row) {
      var path = row.avatar;
      var url = "";

      // 不加这个判断，每次点击表格任意行都会重新载入图片，暂时这样解决
      if (row.avatarPath) {
        url = row.avatarPath;
      } else {
        url =
          path === "" || path === null
            ? ""
            : Setting.avatarURL + path + "?t=" + Math.random();
        row.avatarPath = url;
      }

      return row.avatarPath;
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
      this.total = res.data.total;
      const data = res.data.list;

      data.forEach(d => {
        // d._loading = false;
        d.checked = false;
      });
      this.data = data;

      // if (isArray(this.selectedKeys)) {
      //   console.log("selectedKeys 应该为数组");
      //   return;
      // }
      //this.restore();
      // 恢复选中状态

      this.$nextTick(() => {
        console.log(1111, this.selectedKeys);
        this.data.forEach(row => {
          if (this.selectedKeys.length == 0) {
            this.$refs.refUserTable.toggleRowSelection(row, false);
          } else {
            this.selectedKeys.some(e => {
              if (e == row[this.valueKey]) {
                row.checked = true;
                this.$refs.refUserTable.toggleRowSelection(row, true);
                return true;
              } else {
                row.checked = false;
                this.$refs.refUserTable.toggleRowSelection(row, false);
                return false;
              }
            });
          }
        });
      });
    },
    restore() {
      this.$nextTick(() => {
        if (!isArray(this.selectedKeys)) {
          return;
        }

        this.data.forEach(row => {
          if (this.value.length == 0) {
            this.$refs.refUserTable.toggleRowSelection(row, false);
          } else {
            this.selectedKeys.some(e => {
              if (e == row[this.valueKey]) {
                row.checked = true;
                this.$refs.refUserTable.toggleRowSelection(row, true);
                return true;
              } else {
                row.checked = false;
                this.$refs.refUserTable.toggleRowSelection(row, false);
                return false;
              }
            });
          }
        });
      });
    },

    // 取消默认选中项(单个勾选)
    /**
     *selectedRows 接口返回的默认勾选数组
     *id 列表唯一标识
     */
    onTableSelect(rows, row) {
      // console.log(rows,'rows',row,'row')
      if (!rows.includes(row)) {
        const index = this.selectedRows.findIndex(item => {
          return item.id === row.id;
        });
        this.selectedRows.splice(index, 1);
      } else {
        this.selectedRows.push(row);
      }
      this.$emit("onSelect", this.selectedRows);
    },
    // 全选操作
    onTableSelectAll(arr) {
      // console.log(arr,'全选or取消全选')
      if (!arr.length) {
        // 直接取消选中全部
        this.data.forEach(v => {
          const index = this.selectedRows.findIndex(i => {
            return i.id === v.id;
          });
          if (index !== -1) {
            this.selectedRows.splice(index, 1);
          }
        });
      } else {
        // 直接选中全部
        this.data.forEach(v => {
          const index = this.selectedRows.findIndex(i => {
            return i.id === v.id;
          });
          if (index === -1) {
            this.selectedRows.push(v);
          }
        });
      }
      this.$emit("onSelect", this.selectedRows);
    },
    // 单选才会执行
    handleSelectionChange(row) {
      if (this.multiple) {
        return;
      }
      this.data.forEach(item => {
        // 排他,每次选择时把其他选项都清除
        if (item.id == row.id) {
          item.checked = true;
        } else {
          item.checked = false;
        }
      });
      //row.checked = true;
      this.selectedRows = []; // 先清空
      this.selectedRows.push(row);
      this.$emit("onSelect", this.selectedRows);
    },
    // 修复单选时，利用选择框切换选择行时，选择框无法选中的BUG
    fixSelectBug(item) {
      item.checked = true;
    }
  }
};
</script>

<style lang="scss" scoped>
// .cell .img {
//   padding-top: 2px;
//   height: 30px;
// }
.filter /deep/ .el-input__inner {
  border: 0;
}
</style>
