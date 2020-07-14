<template>
  <main-layout-vertical :showFooter="false">
    <template #header>
      <Auth :authority="menuCode + 'Add'" prevent style="width:100%">
        <el-button style="width:100%" icon="el-icon-plus" @click="onAdd">
          添加
        </el-button>
      </Auth>
    </template>

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
      <el-table-column type="index" width="40" label="#" />
      <el-table-column
        prop="title"
        label="标题"
        :show-overflow-tooltip="true"
      />

      <el-table-column prop="code" label="值" :show-overflow-tooltip="true" />
      <el-table-column
        prop="description"
        label="描述"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        v-for="item in exFeilds"
        :prop="item.feild"
        :label="item.label"
        :key="item.feild"
        :show-overflow-tooltip="true"
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

      <Auth
        :authority="[menuCode + 'Add', menuCode + 'Edit', menuCode + 'Delete']"
        :withContainer="false"
      >
        <el-table-column label="操作" width="180">
          <template v-slot="{ $index, row }">
            <el-button v-auth="menuCode + 'Add'" @click="onAddSub($index, row)">
              添加
            </el-button>
            <el-button v-auth="menuCode + 'Edit'" @click="onEdit($index, row)">
              编辑
            </el-button>
            <confirm-button
              v-auth="menuCode + 'Delete'"
              type="delete"
              :loading="row._loading"
              :validate="deleteValidate"
              :validate-data="row"
              @click="onDelete($index, row)"
            />
          </template>
        </el-table-column>
      </Auth>
    </el-table>
    <add-panl
      title="新增"
      :visible="addVisible"
      :headerItem="headerItem"
      :data="addItem"
      :parentOptions="treeData"
      @onChangeDrawer="onAddChangeDrawer"
      @onSuccess="onAddSuccess"
      @onError="onAddError"
    ></add-panl>

    <edit-panl
      title="编辑"
      :visible="editVisible"
      :headerItem="headerItem"
      :data="editItem"
      :parentOptions="editTreeData"
      @onChangeDrawer="onEditChangeDrawer"
      @onSuccess="onEditSuccess"
      @onError="onEditError"
    ></edit-panl>
  </main-layout-vertical>
</template>

<script>
import { cloneDeep } from "lodash";
import { listToTree } from "@/libs/util";
import { getAll, execSoftDelete } from "@/api/dictionary/dictionary-entry";
import Setting from "@/settings";
import AddPanl from "./add";
import EditPanl from "./edit";
import ConfirmButton from "@/components/confirm-button";

export default {
  // 名称必须与后台资源中'视图名称'保持一致，不然视图缓存将不能生效
  name: "dictionary--dictionary-entry--entry",
  components: { AddPanl, EditPanl, ConfirmButton },
  data() {
    return {
      menuCode: "DictionaryEntry" + ".",
      searchPlaceholder: "Label/Value",

      filter: {
        key: "",
        withDisable: true
      },

      treeData: [],
      expandRowKeys: [],
      listLoading: false,

      headerItem: {},
      exFeilds: [],

      // 新增面板属性
      addVisible: false,
      addItem: {},

      // 编辑面板属性
      editVisible: false,
      editItem: {},
      editTreeData: []
    };
  },
  computed: {},
  mounted() {},
  methods: {
    init(headerItem) {
      this.headerItem = headerItem;
      this.filter.key = "";

      // 构造扩展字段
      let exs = [];
      for (var i = 1; i < 6; i++) {
        if (headerItem["ex" + i] != null && headerItem["ex" + i] != "") {
          exs.push({ label: headerItem["ex" + i], feild: "ex" + i });
        }
      }
      this.exFeilds = exs;

      this.getList();
    },
    onSearch() {
      this.getList();
    },
    // 获取列表
    async getList() {
      const para = {
        ...this.filter,
        dictionaryHeaderId: this.headerItem.id
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
      // console.log(data);
      const tree = listToTree(data);
      const keys = data.filter(l => l.children).map(l => l.id);
      this.expandRowKeys = keys;

      this.treeData = cloneDeep(tree);
    },

    // -- add 事件 start --
    onAdd() {
      this.addItem = {
        dictionaryHeaderId: this.headerItem.id,
        parentId: "",
        title: "",
        code: "",
        description: "",
        ex1: "",
        ex2: "",
        ex3: "",
        ex4: "",
        ex5: ""
      };
      this.addVisible = true;
    },
    onAddSub(index, row) {
      this.addItem = {
        dictionaryHeaderId: this.headerItem.id,
        parentId: row.id,
        title: "",
        code: "",
        description: "",
        ex1: "",
        ex2: "",
        ex3: "",
        ex4: "",
        ex5: ""
      };
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

      this.editTreeData = [];
      let treeData = cloneDeep(this.treeData);
      this.editTreeData = filterEditItem(treeData, this.editItem.id);
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
    deleteValidate() {
      if (Setting.isDemo) {
        this.$message({
          message: this.$t("common.demoTips"),
          type: "warning"
        });
        return false;
      }
      return true;
    },
    // 删除事件
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

<style></style>
