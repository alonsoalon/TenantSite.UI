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
            placeholder="操作人/接口标题/接口地址/IP地址"
            clearable
            @keyup.enter.native="onSearch"
          >
            <template #prefix>
              <i class="el-input__icon el-icon-search" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
        :pager-count="5"
        @current-change="getList"
        @size-change="pageSizeChange"
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
      <!-- <el-table-column prop="id" label="编号" width="180" /> -->
      <el-table-column type="index" width="40" label="#" />
      <el-table-column
        prop="createdByName"
        label="访问账号"
        width="160"
        :show-overflow-tooltip="true"
      >
        <template v-slot="{ row }">
          {{ row.realName }}({{ row.createdByName }})
        </template>
      </el-table-column>
      <el-table-column
        prop="ip"
        label="IP地址"
        width="130"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="apiTitle"
        label="接口名称"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="apiPath"
        label="接口地址"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column prop="browser" label="浏览器" width="100" />
      <el-table-column prop="os" label="操作系统" width="100" /> -->
      <el-table-column
        prop="elapsedMilliseconds"
        label="耗时(毫秒)"
        width="100"
      />
      <el-table-column prop="status" label="操作状态" width="80">
        <template v-slot="{ row }">
          <el-tag
            :title="row.message"
            :type="row.status ? 'success' : 'danger'"
            disable-transitions
            >{{ row.status ? "成功" : "失败" }}</el-tag
          >
        </template>
      </el-table-column>
      <!-- <el-table-column prop="message" label="操作消息" /> -->
      <el-table-column
        prop="createdTime"
        label="访问时间"
        :formatter="formatDt"
        width
      />
    </el-table>
  </main-layout-vertical>
</template>

<script>
// @size-change="getList('size-change')"
import { formatTime } from "@/libs/util";
import { getList } from "@/api/admin/operation-log";
// import log from "@/libs/util.log";
export default {
  name: "admin--operation-log--index",
  components: {},
  data() {
    return {
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

  async mounted() {
    this.getList();
  },
  methods: {
    formatDt: function(row, column, time) {
      return formatTime(time);
    },
    onSearch() {
      this.currentPage = 1;
      this.getList();
    },

    pageSizeChange() {
      // 获取最大页数
      let pageMax = Math.ceil(this.total / this.pageSize);
      // 判断跳转页数是否大于最大页数，如果大于，跳转页数就等于最大页数
      if (this.currentPage > pageMax) {
        this.currentPage = pageMax;
      }
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
      this.data = data;
      this.total = res.data.total;
    }
  }
};
</script>

<style lang="scss" scoped></style>
