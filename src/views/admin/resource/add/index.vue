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
          <el-form-item label="编码" prop="Code">
            <el-input v-model="data.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="data.title" />
          </el-form-item>
          <el-form-item label="父级" prop="parentId">
            <el-cascader
              v-model="data.parentId"
              :options="options"
              @change="handleChange"
              style="width:100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="data.description" />
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
    // data: {
    //   type: Object,
    //   default: () => {}
    // },
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
        this.$emit("changeDrawer", v);
      }
    }
  },
  data() {
    return {
      data: {
        code: "",
        title: "",
        description: "",
        parentId: ""
      },
      options: [
        {
          value: "0",
          label: "用户",
          children: [
            {
              value: "0",
              label: "用户",
              children: [{ value: "0", label: "用户" }]
            }
          ]
        },
        {
          value: "1",
          label: "超管"
        }
      ]
    };
  },

  methods: {
    handleChange(value) {
      console.log(value);
    }
  }
};
</script>
