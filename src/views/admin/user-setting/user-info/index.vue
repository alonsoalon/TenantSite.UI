<template>
  <el-form
    ref="editForm"
    :model="editForm"
    :rules="editFormRules"
    label-position="top"
    label-width="80px"
    @submit.native.prevent
  >
    <el-row :gutter="50">
      <el-col :sm="12" :xs="24">
        <el-form-item label="我的昵称" prop="displayName">
          <el-input v-model="editForm.displayName" />
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
        <el-form-item label="电子邮箱" prop="mail">
          <el-input v-model="editForm.mail" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editForm.description" type="textarea" rows="4" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :sm="12" :xs="24">
        <el-form-item>
          <Auth
            authority="disable"
            prevent
            message="当前为演示环境禁止修改用户信息"
          >
            <confirm-button
              :disabled="disabled"
              :validate="editFormvalidate"
              :placement="'top-end'"
              :loading="editLoading"
              style="margin-left:0px;"
              @click="onSubmit"
            >
              <template #content>
                <p>确定要更新基本信息吗？</p>
              </template>
              更新基本信息
            </confirm-button>
          </Auth>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ConfirmButton from "@/components/confirm-button";
import { updateUserInfo, getItem } from "@/api/admin/user";
export default {
  name: "admin--user-setting--user-info--index",
  components: {
    ConfirmButton
  },
  data() {
    return {
      editLoading: false,
      editFormRules: {
        displayName: [
          { required: true, message: "请输入显示名称", trigger: "blur" }
        ]
      },
      editForm: {
        id: 0,
        displayName: "",
        mobile: "",
        mail: "",
        description: ""
      }
    };
  },
  computed: {
    ...mapState("admin/user", ["info"]),
    disabled() {
      return !(this.editForm.id > 0);
    }
    // editForm() {

    //   return {
    //     id: 0,
    //     displayName: this.info.displayName,
    //     mobile: this.info.mobile,
    //     mail: this.info.mail,
    //     description: this.info.description
    //   };
    // }
  },

  async mounted() {
    await this.getUserInfo();
    //this.editForm = Object.assign(this.editForm, this.info);
    //console.log(this.editForm);
  },
  methods: {
    ...mapActions("admin/user", ["setUserInfo"]),
    async getUserInfo() {
      this.editLoading = true;
      const para = { id: this.info.id };
      const res = await getItem(para);
      this.editLoading = false;

      if (!res.success) {
        if (res.message) {
          this.$message({ message: res.message, type: "error" });
        }
        return;
      }
      this.editForm = res.data;
    },
    editFormvalidate() {
      let isValid = false;
      this.$refs.editForm.validate(valid => {
        isValid = valid;
      });
      return isValid;
    },
    async onSubmit() {
      this.editLoading = true;
      const para = { ...this.editForm };
      const res = await updateUserInfo(para);
      this.editLoading = false;

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
      var userInfo = res.data;
      this.info.displayName = userInfo.displayName;
      this.setUserInfo(this.info);
    }
  }
};
</script>

<style></style>
