<template>
  <section>
    <el-drawer
      :title="title"
      :size="size"
      :append-to-body="true"
      :visible.sync="drawerVisible"
      :direction="direction"
      :wrapperClosable="wrapperClosable"
      class="drawer"
      @close="onClosePanl"
    >
      <section class="drawer-body">
        <!-- el-form 是修改的内容 其他复制到表单组件原则上不做修改 -->
        <el-form
          ref="refForm"
          :model="data"
          label-width="80px"
          :inline="false"
          size="small"
          :rules="formRules"
        >
          <el-form-item label="标题" prop="title">
            <el-input v-model="data.title" />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input v-model="data.description" type="textarea" rows="2" />
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="data.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="ICON" prop="icon">
            <el-input v-model="data.icon" />
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="资源类型" prop="resourceType">
            <el-radio-group v-model="data.resourceType">
              <el-radio :label="1">资源分组</el-radio>
              <el-radio :label="2">资源菜单</el-radio>
              <el-radio :label="3">功能点</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="菜单类型"
            prop="linkType"
            v-if="data.resourceType === 2"
          >
            <el-radio-group
              v-model="data.linkType"
              v-if="data.resourceType === 2"
            >
              <el-radio :label="1">视图组件</el-radio>
              <el-radio :label="2">外部链接</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="打开模式"
            prop="openMode"
            v-if="data.resourceType === 2"
          >
            <el-radio-group v-model="data.openMode">
              <el-radio :label="1">内部窗口</el-radio>
              <el-radio :label="2">外部窗口</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            label="Path"
            prop="path"
            v-if="
              data.resourceType === 2 &&
                data.linkType &&
                data.resourceType === 2
            "
          >
            <el-input v-model="data.path" />
            如果以/blank开头命名路径，系统将以新窗口打开，并不带菜单导航和顶栏页面
          </el-form-item>
          <el-form-item
            :label="data.linkType === 2 ? '外链URL' : '视图路径'"
            prop="viewPath"
            v-if="data.resourceType === 2"
          >
            <el-input v-model="data.viewPath" />
          </el-form-item>
          <el-form-item
            label="视图名称"
            prop="viewName"
            v-if="data.resourceType === 2 && data.linkType === 1"
          >
            <el-input v-model="data.viewName">
              <el-button
                slot="append"
                icon="el-icon-bottom"
                @click="generateViewName"
              ></el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="是否缓存"
            prop="viewCache"
            v-if="data.resourceType === 2 && data.linkType === 1"
          >
            <el-switch v-model="data.viewCache" />
          </el-form-item>
          <el-form-item
            label="可否关闭"
            prop="closable"
            v-if="
              data.resourceType === 2 &&
                (data.linkType === 1 ||
                  (data.linkType === 2 && data.openMode === 1))
            "
          >
            <el-switch v-model="data.closable" />
          </el-form-item>
          <el-divider content-position="left"></el-divider>

          <el-form-item label="父级" prop="parentId">
            <el-cascader
              v-model="data.parentId"
              :options="parentOptions"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'title',
                emitPath: false
              }"
              style="width:100%"
              filterable
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="隐藏" prop="isHidden">
            <el-switch v-model="data.isHidden" />
          </el-form-item>
          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="data.isDisabled" />
          </el-form-item>
          <el-divider content-position="left">
            <!-- 如果指定归属组，当前数据仅对拥有该组的权限岗开放，不指定则所有权限岗可见 -->
          </el-divider>
          <el-form-item label="归属组" prop="groupId">
            <group-select v-model="data.groupId"></group-select>
          </el-form-item>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="drawerVisible = false">
          {{ this.$t("common.cancel") }}
        </el-button>
        <confirm-button
          :validate="formValidate"
          :loading="loading"
          type="submit"
          @click="onSubmit"
        />
      </div>
    </el-drawer>
  </section>
</template>

<script>
// 组件
import ConfirmButton from "@/components/confirm-button";
import GroupSelect from "@/components/group-select";
// 工具
import { cloneDeep } from "lodash";
// import { listToTree } from "@/libs/util";
// apis
import { execCreate } from "@/api/admin/resource";

export default {
  name: "admin-resource-add",
  components: {
    ConfirmButton,
    GroupSelect
  },
  props: {
    title: {
      type: String,
      default: "新增"
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
        return {
          resourceType: 2,
          linkType: 1,
          viewPath: "",
          viewName: "",
          viewCache: false
        };
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
    }
  },
  data() {
    return {
      loading: false,
      //data: {},
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        code: [{ required: true, message: "请输入Code", trigger: "blur" }]
      }
    };
  },
  // watch: {
  //   parentId: value => {
  //     this.data.parentId = value;
  //   }
  // },

  async mounted() {},

  methods: {
    // 验证表单
    formValidate: function() {
      let isValid = false;
      this.$refs.refForm.validate(valid => {
        isValid = valid;
      });
      return isValid;
    },
    // 关闭表单面板重置表单控件
    onClosePanl() {
      this.$refs.refForm.resetFields();
    },
    async onSubmit() {
      this.loading = true;
      const para = cloneDeep(this.data);
      const res = await execCreate(para);
      this.loading = false;

      if (res.success) {
        this.$message({ message: this.$t("common.addOk"), type: "success" });
        this.$refs.refForm.resetFields();
        this.drawerVisible = false;
        // 成功后钩子，共父级调用
        this.$emit("onSuccess", para, res);
      } else {
        this.$message({ message: res.message, type: "error" });
        // 失败后钩子，共父级调用
        this.$emit("onError", para, res);
      }
    },
    generateViewName() {
      if (!this.data.viewPath || this.data.viewPath === "") {
        this.$message({
          message: "视图路径为空，不能生成视图名称",
          type: "warning"
        });
        return;
      }

      let str = this.data.viewPath;
      str = str.startsWith("/") ? str.replace(/\//, "") : str;
      str = str.replace(/\//g, "--");
      this.data.viewName = str;
    }
  }
};
</script>
