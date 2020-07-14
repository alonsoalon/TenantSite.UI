<template>
  <section>
    <el-drawer
      :title="title"
      :size="size"
      :append-to-body="true"
      :visible.sync="drawerVisible"
      :direction="direction"
      :wrapperClosable="wrapperClosable"
      @close="onClosePanl"
      @open="onOpenPanl"
    >
      <el-container class="drawer-container">
        <el-main>
          <splitpanes
            class="default-theme"
            horizontal
            :dbl-click-splitter="false"
          >
            <pane size="80">
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
                      placeholder="名称/分类/请求方法/接口地址"
                      clearable
                      @keyup.enter.native="getApis"
                    >
                      <el-button
                        slot="append"
                        icon="el-icon-search"
                        @click="getApis"
                      ></el-button>
                    </el-input>
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
                    background
                    style="text-align:right;"
                  >
                  </el-pagination>
                </template>
                <!--列表-->
                <el-table
                  v-loading="topLoading"
                  highlight-current-row
                  :data="topData"
                  row-key="id"
                  @row-dblclick="selectRow"
                  style="width: 100%;"
                >
                  <!-- <el-table-column type="selection" align="center" width="50" /> -->
                  <el-table-column type="index" width="40" label="#" />
                  <el-table-column prop="category" label="分类" width="200" />
                  <el-table-column prop="httpMethod" label="接口" width="500">
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
                      <el-tag
                        v-else-if="scope.row.httpMethod == 'Get'"
                        disable-transitions
                      >
                        {{ scope.row.httpMethod }}
                      </el-tag>
                      {{ scope.row.url }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" label="名称" />
                  <!-- <el-table-column prop="url" label="接口地址" width /> -->
                </el-table>
              </main-layout-vertical>
            </pane>

            <pane min-size="20" size="20">
              <main-layout-vertical :showHeader="false" :showFooter="false">
                <el-table
                  v-loading="bottomLoading"
                  highlight-current-row
                  :data="bottomData"
                  row-key="id"
                  @row-dblclick="cancelRow"
                  style="width: 100%;"
                >
                  <el-table-column type="index" width="40" label="#" />
                  <el-table-column prop="category" label="分类" width="200" />
                  <el-table-column prop="httpMethod" label="接口" width="500">
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
                      <el-tag
                        v-else-if="scope.row.httpMethod == 'Get'"
                        disable-transitions
                      >
                        {{ scope.row.httpMethod }}
                      </el-tag>
                      {{ scope.row.url }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" label="名称" />
                  <!-- <el-table-column prop="url" label="接口地址" width /> -->
                </el-table>
              </main-layout-vertical>
            </pane>
          </splitpanes>
        </el-main>
        <el-footer>
          <el-button @click.native="drawerVisible = false">
            {{ this.$t("common.cancel") }}
          </el-button>
          <confirm-button
            :loading="submitLoading"
            type="submit"
            @click="onSubmit"
          />
        </el-footer>
      </el-container>
    </el-drawer>
  </section>
</template>

<script>
// 组件
import ConfirmButton from "@/components/confirm-button";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
// apis
import {
  getResourceApisById,
  updateResourceApisById
} from "@/api/admin/resource";

import { getList as getApis } from "@/api/admin/api";

export default {
  name: "admin-resource-add",
  components: {
    ConfirmButton,
    Splitpanes,
    Pane
  },
  props: {
    title: {
      type: String,
      default: "API分配(在待选区双击行来完成API分配，在已选区双击行可取消)"
    },
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: "rtl"
    },
    size: {
      type: String,
      default: "700px"
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },

    parentOptions: {
      type: Array
    },
    data: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    drawerVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.$emit("onChangeDrawer", v);
      }
    },
    pageCount() {
      return this.total > 0 && this.pageSize > 0
        ? Math.ceil(this.total / this.pageSize)
        : 1;
    }
  },
  watch: {
    currentPage() {
      this.getApis();
    },
    pageSize() {
      this.getApis();
    }
  },
  data() {
    return {
      total: 0,
      pageSize: 20,
      currentPage: 1,

      filter: {
        key: ""
      },
      // 待选区属性
      topLoading: false,
      topData: [],
      // 已选区属性
      bottomLoading: false,
      bottomData: [],

      submitLoading: false,
      //data: {},
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },
  async mounted() {
    this.getApis();
  },

  methods: {
    // 获取列表
    async getApis() {
      const para = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        filter: this.filter
      };
      this.topLoading = true;
      const res = await getApis(para);
      this.topLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      this.topData = res.data.list;
      this.total = res.data.total;
    },

    async getResourceApisById() {
      this.bottomLoading = true;
      const para = { resourceId: this.data.id };
      const res = await getResourceApisById(para);
      this.bottomLoading = false;

      if (res.success) {
        this.bottomData = res.data.filter(x => x !== null); // 加上排除null,防止主表数据删除后，关系未删除，返回形如[null,null]导致渲染table出错的BUG
      } else {
        this.$message({ message: res.message, type: "error" });
        this.drawerVisible = false;
      }
    },
    onOpenPanl() {
      if (!this.data.id && this.data.id === "") {
        this.$message({
          message: "没获取到当前资源，无法分配API。",
          type: "error"
        });
        this.drawerVisible = false;
        return;
      }
      this.getResourceApisById();
    },
    // 关闭表单面板重置表单控件
    onClosePanl() {
      //this.$refs.refForm.resetFields();
      this.bottomData = [];
      this.currentPage = 1;
      this.filter.key = "";
    },
    selectRow(row) {
      if (
        this.bottomData.length > 0 &&
        this.bottomData.filter(x => x.id === row.id).length > 0
      ) {
        this.$message({ message: "已选区已存在相同API", type: "error" });
      } else {
        this.bottomData.push(row);
      }
    },
    cancelRow(row) {
      this.bottomData.splice(
        this.bottomData.findIndex(item => item.id === row.id),
        1
      );
    },
    async onSubmit() {
      let ApiIds = [];

      if (this.bottomData.length > 0) {
        ApiIds = this.bottomData.map(s => {
          return s.id;
        });
      }
      const para = { resourceId: this.data.id, ApiIds: ApiIds };
      this.submitLoading = true;
      const res = await updateResourceApisById(para);
      this.submitLoading = false;

      if (res.success) {
        this.$message({ message: this.$t("common.updateOk"), type: "success" });
        //this.drawerVisible = false;
        // 成功后钩子，共父级调用
        this.$emit("onSuccess", para, res);
      } else {
        this.$message({ message: res.message, type: "error" });
        this.getResourceApisById();
        // 失败后钩子，共父级调用
        this.$emit("onError", para, res);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.drawer-container {
  height: 100%;
  overflow-y: hidden;
  .el-main {
    padding: 5px;
    overflow: hidden;
  }
  footer[style] {
    height: 52px !important;
  }
  .el-footer {
    padding: 10px;
    border-top: solid 1px #eee;
    text-align: right;
  }
}

.splitpanes.default-theme {
  background: #fff;

  .splitpanes__pane {
    background: #fff;
  }
  /deep/ .splitpanes__splitter {
    background-color: #eee;
  }
  /deep/ .mainScroll {
    padding: 0px;
  }
}
</style>
