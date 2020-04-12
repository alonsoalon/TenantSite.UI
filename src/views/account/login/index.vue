<template>
  <div class="bg">
    <el-scrollbar class="page-component__scroll" style="height:100%;">
      <div style="height:10%;" />
      <el-card
        shadow="always"
        class="login-card"
        :body-style="{ padding: '0px' }"
      >
        <div class="title">Admin</div>
        <div class="desc">Tenant Site 用户登录入口</div>
        <el-form ref="form" :model="form" :rules="formRules">
          <el-form-item prop="userName">
            <el-input
              ref="userName"
              v-model="form.userName"
              type="text"
              auto-complete="off"
              placeholder="账号"
            >
              <i slot="prefix" class="el-input__icon el-icon-user" />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!-- <input type="password" style="display:none;width:0;height:0;"> -->
            <el-input
              ref="password"
              v-model="form.password"
              auto-complete="new-password"
              show-password
              placeholder="密码"
              @keyup.enter.native="onLogin"
            >
              <i slot="prefix" class="el-input__icon el-icon-lock" />
            </el-input>
          </el-form-item>

          <el-form-item v-if="tenantMode === 0" prop="tenant">
            <el-select
              v-model="form.tenant"
              placeholder="请选择服务"
              style="width:100%"
            >
              <el-option
                v-for="item in tenants"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
          <el-form-item style="width:100%;">
            <el-button
              type="primary"
              :loading="loginLoading"
              :disabled="loginDisabled"
              style="width:100%;"
              @click.native.prevent="onLogin"
              >{{ loginText }}</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
      <div style="height:5%;" />
    </el-scrollbar>
  </div>
</template>

<script>
// import { getVerifyCode } from '@/api/admin/auth'
import { mapActions } from "vuex";
import { getTenants } from "@/api/account";
import Setting from "@/settings";
import util from "@/libs/util.js";
export default {
  data() {
    return {
      form: {
        userName: "admin",
        password: "111111",
        tenant: "tenant1"
      },
      formRules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      tenants: [],
      tenantMode: Setting.tenantMode,
      checked: true,
      loginDisabled: false,
      loginLoading: false,
      loginText: "登录"
    };
  },
  mounted() {
    if (this.tenantMode === 0) {
      this.setTenantsByApi();
    } else {
      this.setTenantByHost();
    }
  },
  methods: {
    ...mapActions("admin/account", ["login"]),

    /**
     * 设置租户信息
     */
    setTenantByHost() {
      var tenant = util.getTenantByHost();
      if (tenant !== "") {
        this.form.tenant = tenant;
      } else {
        this.loginDisabled = true;
        this.loginText = "无法按Host获取租户";
        this.$message({
          message: "无法按Host获取租户,请确认当前是部署在二级域名下",
          type: "error"
        });
      }
      return;
    },

    /**
     * 设置租户选择框数据
     */
    setTenantsByApi() {
      this.loginDisabled = true;
      this.loginText = "加载租户信息中...";
      const res = getTenants();
      if (!res) {
        this.loginLoading = false;
        this.loginText = "租户信息获取失败，刷新重试";
        return;
      }
      if (!res.success) {
        if (res.message) {
          this.$message({
            message: res.message,
            type: "error"
          });
        }
        this.loginText = "租户信息获取失败，刷新网页重试";
        return;
      }
      this.loginDisabled = false;
      this.loginText = "登录";
      this.tenants = res.data;
    },

    loginValidate() {
      let isValid = false;
      this.$refs.form.validate(async valid => {
        isValid = valid;
      });
      return isValid;
    },

    onLogin() {
      if (!this.loginValidate()) {
        return;
      }

      this.loginLoading = true;
      this.loginText = "登录中...";
      const params = { ...this.form };
      // const res = await this.login(params);

      this.login(params)
        .then(res => {
          if (!res) {
            this.loginLoading = false;
            this.loginText = "重新登录";
            return;
          }
          if (!res.success) {
            this.loginLoading = false;
            this.loginText = "重新登录";
            if (res.message) {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          } else {
            this.loginText = "登录";
            this.loginLoading = false;
            const redirect = this.$route.query
              ? this.$route.query.redirect
              : "";
            this.$router.replace({ path: redirect || "/" });
          }
        })
        .catch(() => {
          this.loginLoading = false;
          this.loginText = "出错了，重新登录";
        });
    }
  }
};
</script>

<style scoped>
.bg {
  height: 100%;
  background: #3a8ee6;
  background: -webkit-linear-gradient(top left, #3a8ee6 0%, #3a8ee6 100%);
  background: linear-gradient(to bottom right, #3a8ee6 0, #3a8ee6);
  opacity: 0.8;
}
.bg >>> .el-scrollbar__view {
  height: 100%;
}
.verifyCode >>> .el-input__inner {
  letter-spacing: 2px;
}

@media screen and (max-width: 768px) {
  .login-card {
    width: 70%;
  }
}
</style>
<style lang="scss" scoped>
.login-card {
  width: 350px;
  padding: 25px 25px 5px 25px;
  position: relative;
  margin: 0 auto;

  .title {
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 33px;
    font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
    vertical-align: middle;
    margin: 0px;
    text-align: center;
  }

  .desc {
    margin-top: 12px;
    margin-bottom: 30px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
  }

  .remember {
    margin: 0px 0px 25px 0px;
  }
}
</style>
