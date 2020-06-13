<template>
  <el-form
    ref="editPwdForm"
    :model="editPwdForm"
    :rules="editPwdFormRules"
    label-position="top"
    label-width="80px"
    @submit.native.prevent
  >
    <el-row>
      <el-col :sm="12" :xs="24">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="editPwdForm.oldPassword"
            type="text"
            show-password
            auto-complete="off"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="12" :xs="24">
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="editPwdForm.newPassword"
            show-password
            auto-complete="off"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="12" :xs="24">
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="editPwdForm.confirmPassword"
            show-password
            auto-complete="off"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="12" :xs="24">
        <el-form-item>
          <Auth
            authority="disable"
            prevent
            message="当前为演示环境禁止修改密码"
          >
            <ConfirmButton
              :validate="editPwdFormvalidate"
              :placement="'top-end'"
              :loading="editPwdLoading"
              style="margin-left:0px;"
              @click="onSubmitPwd"
            >
              <template #content>
                <p>确定要更新密码吗？</p>
              </template>
              更新密码
            </ConfirmButton>
          </Auth>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import ConfirmButton from "@/components/confirm-button";
import { changePassword } from "@/api/admin/user";

export default {
  name: "admin--user-setting--change-password--index",
  components: {
    ConfirmButton
  },
  data() {
    const validateNewPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.editPwdForm.confirmPassword !== "") {
          this.$refs.editPwdForm.validateField("confirmPassword");
        }
        callback();
      }
    };

    const validateConfirmPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.editPwdForm.newPassword) {
        callback(new Error("新密码和确认密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      editPwdLoading: false,
      editPwdFormRules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "blur" }
        ],
        newPassword: [
          { required: true, validator: validateNewPassword, trigger: "blur" }
        ],
        confirmPassword: [
          {
            required: true,
            validator: validateConfirmPassword,
            trigger: "blur"
          }
        ]
      },
      editPwdForm: {
        id: 0,
        password: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        version: 0
      }
    };
  },
  methods: {
    editPwdFormvalidate() {
      let isValid = false;
      this.$refs.editPwdForm.validate(valid => {
        isValid = valid;
      });
      return isValid;
    },
    async onSubmitPwd() {
      this.editPwdLoading = true;
      const para = { ...this.editPwdForm };
      const res = await changePassword(para);
      this.editPwdLoading = false;
      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }

      this.$message({
        message: this.$t("common.updateOk"),
        type: "success"
      });

      this.$refs["editPwdForm"].resetFields();
    }
  }
};
</script>

<style></style>
