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
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="data.userName" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="data.password" autocomplete="off" />
          </el-form-item>
          <el-divider content-position="left"> </el-divider>
          <el-form-item label="显示名" prop="displayName">
            <el-input v-model="data.displayName" autocomplete="off" />
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="data.mobile" autocomplete="off" />
          </el-form-item>
          <el-form-item label="Email" prop="mail">
            <el-input v-model="data.mail" autocomplete="off" />
          </el-form-item>
          <el-form-item label="备注" prop="description">
            <el-input v-model="data.description" type="textarea" rows="2" />
          </el-form-item>
          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="data.isDisabled" />
          </el-form-item>
          <el-divider content-position="left">
            <!-- 如果指定归属组，当前数据仅对拥有该组的权限岗开放，不指定则所有权限岗可见 -->
          </el-divider>
          <el-form-item label="权限岗" prop="permissionId">
            <permission-select v-model="data.permissionId"></permission-select>
          </el-form-item>
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
import PermissionSelect from "../permission/index";
// 工具
import { cloneDeep } from "lodash";
// import { listToTree } from "@/libs/util";
// apis
import { execCreate } from "@/api/admin/user";

export default {
  name: "admin-user-add",
  components: {
    ConfirmButton,
    GroupSelect,
    PermissionSelect
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
      data: {},
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
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
    }
  }
};
</script>
