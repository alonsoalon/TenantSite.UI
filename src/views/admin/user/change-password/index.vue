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
            <span>{{ data.userName }}</span>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="data.password"
              show-password
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="data.confirmPassword"
              show-password
              autocomplete="off"
            />
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
// 组件
import ConfirmButton from "@/components/confirm-button";
// 工具
import { cloneDeep } from "lodash";
// apis
import { userChangePassword as execUpdate } from "@/api/admin/user";

export default {
  name: "admin-user-edit",
  components: {
    ConfirmButton
  },
  props: {
    title: {
      type: String,
      default: "改密"
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
    data: {
      type: Object,
      default: () => {
        return {
          id: "",
          revision: "",
          userName: "",
          password: "",
          confirmPassword: ""
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
      formRules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        confirmPassword: [
          {
            required: true,
            message: "请输入确认密码，与密码一致",
            trigger: "blur"
          }
        ]
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
      console.log(555, para);
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
