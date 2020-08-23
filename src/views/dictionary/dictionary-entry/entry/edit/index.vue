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
          <el-form-item label="值" prop="code">
            <el-input v-model="data.code" />
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input v-model="data.description" type="textarea" rows="2" />
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
          <el-divider v-if="hasExs()" content-position="left"></el-divider>

          <el-form-item v-if="hasEx(1)" :label="headerItem.ex1" prop="ex1">
            <el-input type="textarea" :rows="2" v-model="data.ex1" />
          </el-form-item>
          <el-form-item v-if="hasEx(2)" :label="headerItem.ex2" prop="ex2">
            <el-input type="textarea" :rows="2" v-model="data.ex2" />
          </el-form-item>
          <el-form-item v-if="hasEx(3)" :label="headerItem.ex3" prop="ex3">
            <el-input type="textarea" :rows="2" v-model="data.ex3" />
          </el-form-item>
          <el-form-item v-if="hasEx(4)" :label="headerItem.ex4" prop="ex4">
            <el-input type="textarea" :rows="2" v-model="data.ex4" />
          </el-form-item>
          <el-form-item v-if="hasEx(5)" :label="headerItem.ex5" prop="ex5">
            <el-input type="textarea" :rows="2" v-model="data.ex5" />
          </el-form-item>

          <el-divider content-position="left"></el-divider>

          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="data.isDisabled" />
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="归属组织" prop="groupId">
            <group-select v-model="data.groupId"></group-select>
          </el-form-item>

          <el-divider content-position="left"></el-divider>
          <el-form-item label="创建人" prop="createdByName">
            <el-input v-model="data.createdByName" :disabled="true" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createdTime">
            <el-input v-model="data.createdTime" :disabled="true" />
          </el-form-item>
          <el-form-item label="更新人" prop="updatedByName">
            <el-input v-model="data.createdByName" :disabled="true" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updatedTime">
            <el-input v-model="data.createdTime" :disabled="true" />
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
import { execUpdate } from "@/api/dictionary/dictionary-entry";

export default {
  name: "dictionary-entry--add",
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
    headerItem: {
      type: Object,
      default: () => {
        return {};
      }
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
    }
  },
  data() {
    return {
      loading: false,
      //data: {},
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        code: [{ required: true, message: "请输入值", trigger: "blur" }]
      }
    };
  },

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
      const res = await execUpdate(para);
      this.loading = false;

      if (res.success) {
        this.$message({ message: this.$t("common.updateOk"), type: "success" });
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
    hasExs() {
      var res =
        (this.headerItem.ex1 == null || this.headerItem.ex1 == "") &&
        (this.headerItem.ex2 == null || this.headerItem.ex2 == "") &&
        (this.headerItem.ex3 == null || this.headerItem.ex3 == "") &&
        (this.headerItem.ex4 == null || this.headerItem.ex4 == "") &&
        (this.headerItem.ex5 == null || this.headerItem.ex6 == "");
      return !res;
    },
    hasEx(index) {
      var res =
        this.headerItem["ex" + index] == null ||
        this.headerItem["ex" + index] == "";
      return !res;
    }
  }
};
</script>
