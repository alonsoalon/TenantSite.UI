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
              placeholder="名称/编码"
              clearable
              @keyup.enter.native="getTreeList"
            >
              <i slot="prefix" class="el-input__icon el-icon-search" />
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getTreeList">查询</el-button>
            <el-button type="primary" @click="onAdd">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <!--列表-->
    <el-table
      v-loading="listLoading"
      highlight-current-row
      :data="treeData"
      row-key="id"
      :default-expand-all="false"
      :expand-row-keys="expandRowKeys"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      style="width: 100%;"
    >
      <el-table-column type="selection" align="center" width="50" />
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="title" label="名称" width />
      <el-table-column prop="code" label="编码" width />
      <el-table-column prop="isDisabled" label="状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isDisabled ? 'danger' : 'success'"
            disable-transitions
          >
            {{ scope.row.isDisabled ? "禁用" : "正常" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdByName" label="创建人" width />
      <el-table-column
        prop="createdTime"
        label="创建时间"
        :formatter="formatDt"
      />

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

    <add-panl
      title="新增"
      :visible="addVisible"
      :groupTree="treeData"
      @onChangeDrawer="onAddChangeDrawer"
      @onSuccess="onAddSuccess"
      @onError="onAddError"
    ></add-panl>

    <edit-panl
      title="编辑"
      :visible="editVisible"
      :groupTree="editGroupTreeData"
      :data="editItem"
      @onChangeDrawer="onEditChangeDrawer"
      @onSuccess="onEditSuccess"
      @onError="onEditError"
    ></edit-panl>
  </section>
</template>

<script>
import { cloneDeep } from "lodash";
import { formatTime, listToTree } from "@/libs/util";
import { getAll, execSoftDelete } from "@/api/admin/group";
import ConfirmButton from "@/components/confirm-button";
import AddPanl from "./add/index";
import EditPanl from "./edit/index";
export default {
  name: "admin--group--index",
  components: { ConfirmButton, AddPanl, EditPanl },
  data() {
    return {
      filter: {
        key: ""
      },
      treeData: [],
      expandRowKeys: [],
      listLoading: false,

      // 新增面板显示属性
      addVisible: false,

      editVisible: false,
      editItem: {},
      editGroupTreeData: []
    };
  },
  computed: {},
  watch: {},
  async mounted() {
    this.getTreeList();
  },
  methods: {
    formatDt: function(row, column, time) {
      return formatTime(time);
    },

    // 获取用户列表
    async getTreeList() {
      const para = {
        ...this.filter
      };
      this.listLoading = true;
      const res = await getAll(para);
      this.listLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      const data = res.data;
      data.forEach(d => {
        d._loading = false;
      });

      const keys = data.filter(l => l.opened).map(l => l.id);
      this.expandRowKeys = keys;

      const tree = listToTree(data);
      this.treeData = cloneDeep(tree);
    },
    // -- add 事件 start --
    onAdd() {
      this.addVisible = true;
    },
    onAddSuccess() {
      this.getTreeList();
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

      // 递归去除自己及自己子集数据，避免编辑自己 又选择了自己或自己的子集作为父出现的循环引用BUG
      const filterEditItem = (groupList, id) => {
        return groupList
          .filter(item => {
            return id !== item.id;
          })
          .map(item => {
            item = Object.assign({}, item);
            if (item.children) {
              item.children = filterEditItem(item.children, id);
            }
            return item;
          });
      };

      this.editGroupTreeData = [];
      let treeData = cloneDeep(this.treeData);
      this.editGroupTreeData = filterEditItem(treeData, this.editItem.id);
    },
    onEditSuccess() {
      this.getTreeList();
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
        this.getTreeList();
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
