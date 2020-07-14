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
  </main-layout-vertical>
</template>

<script>
let pageCode = "DictionaryCategory";
export default {
  // 名称必须与后台资源中'视图名称'保持一致，不然视图缓存将不能生效
  name: "dictionary--category--index",
  components: {},
  data() {
    return {
      // 按钮级别控制权限实现：[菜单Code]+.
      // 配合局部Code形成[菜单Code]+.+[功能点Code] 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      menuCode: pageCode + ".",
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
  }
};
</script>

<style></style>
