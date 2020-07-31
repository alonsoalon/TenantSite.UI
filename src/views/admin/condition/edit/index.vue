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
          :model="dataItem"
          label-width="80px"
          :inline="false"
          size="small"
          :rules="formRules"
        >
          <el-form-item label="资源标识" prop="code">
            <dictionary-select
              ref="refResource"
              v-model="dataItem.code"
              code="SYS_CONDITION"
              @change="onChange"
              @load="onLoad"
              :disabled="true"
            ></dictionary-select>
          </el-form-item>
          <el-form-item label="编码" prop="code">
            <el-input v-model="dataItem.code" :disabled="true" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataItem.title" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="dataItem.description" type="textarea" rows="2" />
          </el-form-item>
          <el-divider content-position="left">
            数据条件
          </el-divider>

          <el-form-item label="动态条件" prop="JsonWhere">
            <a-condition
              ref="refCondition"
              v-model="dataItem.jsonWhere"
              :fields="fields"
            >
            </a-condition>
          </el-form-item>

          <el-form-item label="SQL" prop="Expression">
            <el-input v-model="dataItem.Expression" type="textarea" rows="4">
            </el-input>

            注：设置了SQL后，动态条件将失效。
          </el-form-item>

          <el-divider content-position="left"></el-divider>

          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="dataItem.isDisabled" />
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="归属组织" prop="groupId">
            <group-select v-model="dataItem.groupId"></group-select>
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
// 工具+组件
import ConfirmButton from "@/components/confirm-button";
import GroupSelect from "@/components/a-group-select";
import DictionarySelect from "@/components/a-dictionary";
import ACondition from "@/components/a-condition";

// apis
import { execUpdate } from "@/api/admin/condition";

export default {
  name: "admin--condition--add",
  components: {
    ConfirmButton,
    GroupSelect,
    DictionarySelect,
    ACondition
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
      default: "800px"
    },
    wrapperClosable: {
      type: Boolean,
      default: false
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
      fields: [],
      dataItem: {
        code: "",
        title: "",
        condition: "",
        jsonWhere: [{ root: true, logic: "And", filters: [] }],
        description: "",
        expression: "",
        isDisabled: false,
        groupId: ""
      },
      loading: false,
      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }]
      }
    };
  },
  watch: {
    data(val) {
      this.dataItem = val;
    },
    drawerVisible(val) {
      if (val) {
        let refResource = this.$refs.refResource;
        if (refResource) {
          let items = refResource.getCheckedNodes();
          if (items && items.length > 0) {
            this.onChange(items);
          }
        }
      }
    }
  },
  created() {},
  mounted() {
    // this.$nextTick(function() {
    //   console.log(1);
    //   this.setCondition();
    // });
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
      this.dataItem.condition = JSON.stringify(this.dataItem.jsonWhere);
      const para = this.dataItem;
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
    onChange(item) {
      if (item != null && item.length > 0 && item[0]?.data) {
        let selectedNode = item[0].data;
        this.dataItem.title = selectedNode.title;
        if (selectedNode.ex1 == null || selectedNode.ex1 == "") {
          this.fields = [];
        } else {
          let config = JSON.parse(selectedNode.ex1);
          this.fields = config;
        }
      }
    },
    // 解决组件第一次载入无法更新动态条件DOMBUG
    onLoad(items) {
      if (items && items.length > 0) {
        let selectedNodes = items.filter(x => x.code == this.dataItem.code);
        if (selectedNodes.length > 0) {
          let selectedNode = selectedNodes[0];
          if (selectedNode.ex1 == null || selectedNode.ex1 == "") {
            this.fields = [];
          } else {
            let config = JSON.parse(selectedNode.ex1);
            this.fields = config;
          }
        }
      }
    }
  }
};
</script>
