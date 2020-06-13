<template>
  <main-layout-vertical :showFooter="false" :showHeader="false">
    <section v-loading="loading">
      <el-tabs :tab-position="tabsPosition" style="padding: 20px;">
        <el-tab-pane label="更换头像" style="padding: 8px 30px;">
          <avatar></avatar>
        </el-tab-pane>
        <el-tab-pane label="个人信息" style="padding: 8px 30px;">
          <div class="title">个人信息</div>
          <user-info></user-info>
        </el-tab-pane>
        <el-tab-pane label="修改密码" style="padding: 8px 30px;">
          <div class="title">修改密码</div>
          <change-password></change-password>
        </el-tab-pane>
      </el-tabs>
    </section>
  </main-layout-vertical>
</template>

<script>
import Avatar from "./avatar";
import ChangePassword from "./change-password";
import UserInfo from "./user-info";
export default {
  name: "admin--user-setting--index",
  components: {
    Avatar,
    UserInfo,
    ChangePassword
  },
  data() {
    return {
      loading: false,
      tabsPosition: "left",

      // 个人信息面板参数 start
      generalForm: {
        id: "",
        displayName: "",
        mobile: "",
        email: "",
        remark: "",
        version: 0
      },
      generalFormRules: {
        displayName: [
          { required: true, message: "请输入显示名称", trigger: "blur" }
        ]
      }
      // 个人信息面板参数 end
    };
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.title {
  margin-bottom: 22px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  font-size: 20px;
  line-height: 28px;
}
</style>
