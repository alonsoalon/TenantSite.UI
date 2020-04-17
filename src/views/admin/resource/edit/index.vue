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
          <el-form-item label="父级" prop="parentId">
            <el-cascader
              v-model="data.parentId"
              :options="groupTree"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'title',
                emitPath: false
              }"
              style="width:100%"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item label="描述" prop="description">
            <el-input v-model="data.description" type="textarea" rows="2" />
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="data.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="data.isDisabled" />
          </el-form-item>
          <el-form-item v-if="data.children" label="展开" prop="opened">
            <el-switch v-model="data.opened" />
          </el-form-item>
          <el-form-item label="排序" prop="orderIndex">
            <el-input-number
              v-model="data.orderIndex"
              :min="0"
            ></el-input-number>
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
          @click="onSubmit"
        />
      </div>
    </el-drawer>
  </section>
</template>

<script>
import ConfirmButton from "@/components/confirm-button";
import { cloneDeep } from "lodash";
import { execUpdate } from "@/api/admin/resource";

export default {
  name: "admin-resource-edit",
  components: {
    ConfirmButton
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
    groupTree: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => {}
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
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      }
    };
  },

  async mounted() {
    // this.getGroupTree();
  },

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
    }
  }
};
</script>
