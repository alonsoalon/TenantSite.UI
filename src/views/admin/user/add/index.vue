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
    >
      <section class="drawer-body">
        <!-- el-form 是修改的内容 其他复制到表单组件原则上不做修改 -->
        <el-form
          ref="refForm"
          :model="data"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item label="用户" prop="userName">
            <el-input v-model="data.userName" autocomplete="off" />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="data.password"
              show-password
              autocomplete="off"
            />
          </el-form-item>

          <el-form-item label="姓名" prop="name">
            <el-input v-model="data.name" autocomplete="off" />
          </el-form-item>

          <el-form-item label="类型" prop="name">
            <el-select
              v-model="data.userType"
              style="width:100%"
              placeholder="请选择"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="电话" prop="name">
            <el-input v-model="data.mobile" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" prop="name">
            <el-input v-model="data.mail" autocomplete="off" />
          </el-form-item>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="drawerVisible = false">取消</el-button>
      </div>
    </el-drawer>
  </section>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    title: {
      type: String,
      default: "Title"
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
      default: "500px"
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
        this.$emit("changeDrawer", v);
      }
    }
  },
  data() {
    return {
      addFormRules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      options: [
        {
          value: "0",
          label: "用户"
        },
        {
          value: "1",
          label: "超管"
        }
      ]
    };
  }
};
</script>
