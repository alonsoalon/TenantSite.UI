<template>
  <main-layout-vertical>
    <template #header>
      <el-form
        class="main-layout-form-query"
        :inline="true"
        :model="filter"
        @submit.native.prevent
      >
        <el-input
          v-model="filter.key"
          placeholder="名称/编号/描述"
          clearable
          @keyup.enter.native="onSearch"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="onSearch"
          ></el-button>
        </el-input>
      </el-form>
    </template>

    <template #footer>
      <el-pagination
        layout="total,sizes, prev, pager, next"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :total="total"
        :page-count="pageCount"
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
      @row-click="onRowClick"
    >
      <el-table-column type="index" width="40" label="#" />
      <el-table-column prop="code" label="编码" :show-overflow-tooltip="true" />
      <el-table-column
        prop="title"
        label="标题"
        :show-overflow-tooltip="true"
      />
      <!-- <el-table-column
        prop="description"
        label="描述"
        :show-overflow-tooltip="true"
      /> -->
    </el-table>
  </main-layout-vertical>
</template>

<script>
// 接口
import { getList } from "@/api/dictionary/dictionary-header";

export default {
  // 名称必须与后台资源中'视图名称'保持一致，不然视图缓存将不能生效
  name: "dictionary--dictionary-entry--header",
  components: {},
  data() {
    return {
      searchPlaceholder: "编码/标题/描述",
      total: 0,
      pageSize: 20,
      currentPage: 1,
      filter: {
        key: "",
        withDisable: false
      },
      data: [],
      listLoading: false
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
      this.total = res.data.total;
      this.data = data;
    },
    onRowClick(row) {
      this.$emit("onRowClick", row);
    }
  }
};
</script>

<style></style>
