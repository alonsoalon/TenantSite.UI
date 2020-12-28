<template>
  <main-layout-vertical>
    <template #header>
      <el-form class="main-layout-form-query" :inline="true" :model="filter" @submit.native.prevent>
        <el-form-item>
          <el-input
            v-model="filter.key"
            placeholder="任务/任务分组"
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
      <el-table-column type="index" width="40" label="#" />
      <el-table-column prop="name" label="任务名称" width="110" />
      <el-table-column prop="jobGroup" label="分组名称" width="140" />
      <el-table-column prop="cron" label="Cron表达式" width="120" />
      <el-table-column prop="remark" label="备注" fit="false" width />
      <el-table-column prop="triggerState" label="运行状态" width="80">
        <template slot-scope="scope">
          <el-tag type="info" disable-transitions v-if="scope.row.triggerState==='正常'" >{{ scope.row.triggerState }}</el-tag>
          <el-tag type="warning" disable-transitions v-else-if="scope.row.triggerState==='暂停'" >{{ scope.row.triggerState }}</el-tag>
          <el-tag type="success" disable-transitions v-else-if="scope.row.triggerState==='完成'" >{{ scope.row.triggerState }}</el-tag>
          <el-tag type="danger" disable-transitions v-else-if="scope.row.triggerState==='错误'" >{{ scope.row.triggerState }}</el-tag>
          <el-tag type="danger" disable-transitions v-else-if="scope.row.triggerState==='阻塞'" >{{ scope.row.triggerState }}</el-tag>
          <el-tag disable-transitions v-else>{{ scope.row.triggerState }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nextFireTime" label="下一次执行时间" width="150">
        <template slot-scope="scope">
          {{scope.row.nextFireTime}}
        </template>
      </el-table-column>
      <el-table-column prop="isDisabled" label="启用状态" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isDisabled ? 'danger' : 'success'"
            disable-transitions
          >{{ scope.row.isDisabled ? "禁用" : "启用" }}</el-tag>
        </template>
      </el-table-column>
      <Auth :authority="[menuCode + 'Delete', menuCode + 'Edit',menuCode+'Start',menuCode+'Resume',menuCode+'Pause',menuCode+'Stop']" :withContainer="false">
        <el-table-column label="操作" min-width="40">
          <template v-slot="{ $index, row }">
            <template v-if="row.triggerState==='暂停'||row.triggerState==='错误'||row.triggerState==='完成'">
              <el-button type="success" v-auth="menuCode + 'Resume'" @click="onResume($index, row)">重启</el-button>
            </template>
            <template  v-else-if="row.triggerState==='不存在'">
              <el-button v-auth="menuCode + 'Edit'" @click="onEdit($index, row)">编辑</el-button>
            <el-button type="success" v-auth="menuCode + 'Start'" @click="onStart($index, row)">启动</el-button>
            <confirm-button v-auth="menuCode + 'Delete'" type="delete" :loading="row._loading" @click="onDelete($index, row)" />
            </template>
            <template v-else>
              <el-button type="warning" v-auth="menuCode + 'Pause'" @click="onPause($index, row)">暂停</el-button>
              <el-button type="danger" v-auth="menuCode + 'Stop'" @click="onStop($index, row)">停止</el-button>
            </template>
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
import ConfirmButton from "@/components/confirm-button";

//apis
import {
  getList,
  startJob,
  stopJob,
  resumeJob,
  pauseJob,
  execSoftDelete
} from "@/api/admin/task-qz";

import AddPanl from "./add/index";
import EditPanl from "./edit/index";

export default {
  name: "admin--tasks--index",
  components: { ConfirmButton, AddPanl, EditPanl },
  data() {
    return {
      menuCode: "TaskQuartz" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
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
  async mounted() {
    this.getList();
  },
  watch: {},
  methods: {
    onSearch() {
      this.currentPage = 1;
      this.getList();
    },
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
      this.editItem = cloneDeep(row);
      this.editVisible = true;
    },
    onEditSuccess() {
      this.getList();
    },
    onEditError() {},
    onEditChangeDrawer(v) {
      this.editVisible = v;
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
    async onStart(index, row) {
      row._loading = true;
      const para = { jobId: row.id };
      const res = await startJob(para);
      row._loading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.startOk"), type: "success" });
        this.getList();
      } else {
        this.$message({ message: res.message, type: "error" });
        row.isStart = false;
      }
    },
    async onStop(index, row) {
      row._loading = true;
      const para = { jobId: row.id };
      const res = await stopJob(para);
      row._loading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.stopOk"), type: "success" });
        this.getList();
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    },
    async onPause(index, row) {
      row._loading = true;
      const para = { jobId: row.id };
      const res = await pauseJob(para);
      row._loading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.pauseOk"), type: "success" });
        this.getList();
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    },
   async onResume(index,row){
      row._loading = true;
      const para = { jobId: row.id };
      const res = await resumeJob(para);
      row._loading = false;
      if (res.success) {
        this.$message({ message: this.$t("common.resumeOk"), type: "success" });
        this.getList();
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    }
  }
};
</script>
<style scoped>
</style>