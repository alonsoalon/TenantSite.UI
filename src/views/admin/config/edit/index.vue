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
          <el-form-item label="配置类型" prop="configType">
            <el-radio-group v-model="dataItem.configType">
              <el-radio label="System">系统</el-radio>
              <el-radio label="Group">部门</el-radio>
              <el-radio label="User">用户</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="dataItem.configType.toUpperCase() == 'GROUP'"
            label="配置主体"
            prop="target"
          >
            <a-group
              v-model="dataItem.targetId"
              placeholder="请选择部门"
            ></a-group>
          </el-form-item>
          <el-form-item
            v-else-if="dataItem.configType.toUpperCase() == 'USER'"
            label="配置主体"
            prop="target"
          >
            <a-user
              v-model="dataItem.targetId"
              placeholder="请选择用户"
              :multiple="false"
              :label="dataItem.targetLabel"
              @select="onTargetSelect"
              disabled
            ></a-user>
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="编码" prop="code">
            <el-input v-model="dataItem.code" autocomplete="off" />
          </el-form-item>
          <el-form-item label="标题" prop="title">
            <el-input v-model="dataItem.title" />
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input v-model="dataItem.description" type="textarea" rows="2" />
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="数据类型" prop="dataType">
            <el-radio-group v-model="dataItem.dataType">
              <el-radio label="Text">文本</el-radio>
              <el-radio label="Number">数字</el-radio>
              <el-radio label="Bool">布尔</el-radio>
              <el-radio label="DateTime">日期</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="dataItem.dataType == 'Number'"
            label="值"
            prop="dataValue"
          >
            <el-input-number
              v-model="dataItem.dataValueNumber"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            v-else-if="dataItem.dataType == 'Bool'"
            label="值"
            prop="dataValue"
          >
            <el-switch
              v-model="dataItem.dataValueBool"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
          <el-form-item
            v-else-if="dataItem.dataType == 'DateTime'"
            label="值"
            prop="dataValue"
          >
            <el-date-picker
              v-model="dataItem.dataValue"
              align="right"
              type="datetime"
              placeholder="选择日期"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item v-else label="值" prop="dataValue">
            <el-input v-model="dataItem.dataValue" />
          </el-form-item>
          <el-divider content-position="left"></el-divider>

          <el-form-item label="公开" prop="isPublic">
            <el-switch v-model="dataItem.isPublic" />
          </el-form-item>

          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="dataItem.isDisabled" />
          </el-form-item>
          <el-form-item label="排序" prop="orderIndex">
            <el-input-number
              v-model="dataItem.orderIndex"
              :min="0"
            ></el-input-number>
          </el-form-item>
          <el-divider content-position="left">
            <!-- 如果指定归属组，当前数据仅对拥有该组的权限岗开放，不指定则所有权限岗可见 -->
          </el-divider>
          <el-form-item label="归属组" prop="groupId">
            <a-group v-model="dataItem.groupId"></a-group>
          </el-form-item>
          <el-divider content-position="left"></el-divider>
          <el-form-item label="创建人" prop="createdByName">
            <el-input v-model="dataItem.createdByName" :disabled="true" />
          </el-form-item>
          <el-form-item label="创建时间" prop="createdTime">
            <el-input v-model="dataItem.createdTime" :disabled="true" />
          </el-form-item>
          <el-form-item label="更新人" prop="updatedByName">
            <el-input v-model="dataItem.createdByName" :disabled="true" />
          </el-form-item>
          <el-form-item label="更新时间" prop="updatedTime">
            <el-input v-model="dataItem.createdTime" :disabled="true" />
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
import AGroup from "@/components/a-group";
import AUser from "@/components/a-user";

// 工具
import {
  //cloneDeep,
  merge
} from "lodash";
import dayjs from "dayjs";
import util from "@/libs/util.js";

// apis
import { execUpdate } from "@/api/admin/config";
import Setting from "@/settings";

export default {
  name: "admin-role-add",
  components: {
    ConfirmButton,
    AGroup,
    AUser
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
    data: {
      type: Object,
      default: () => {
        return {};
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
      dialogGroupVisible: false,
      dialogUserVisible: false,
      dataItem: {
        configType: "System",
        targetId: "",
        targetLabel: "",
        code: "",
        title: "",
        description: "",
        dataType: "",
        dataValue: "",
        isPublic: false,
        orderIndex: 0,

        dataValueBool: "0",
        dataValueNumber: 0
      },

      formRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        code: [{ required: true, message: "请输入编码", trigger: "blur" }]
        // target: [{ required: true, message: "请选择配置主体", trigger: "blur" }]
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  watch: {
    data: {
      handler(val) {
        if (val.dataType == "Bool") {
          val.dataValueBool = val.dataValue == "1" ? "1" : 0;
        } else if (val.dataType == "Number") {
          if (util.isNumber(val.dataValue)) {
            val.dataValueNumber = val.dataValue - 0;
          } else {
            val.dataValueNumber = 0;
          }
        }

        //合并传入的值
        this.dataItem = merge(this.dataItem, val);
      },
      deep: true,
      immediate: true
    }
  },
  async mounted() {},

  methods: {
    // 验证表单
    formValidate: function() {
      if (Setting.isDemo) {
        this.$message({
          message: this.$t("common.demoTips"),
          type: "warning"
        });
        return false;
      }

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
      const para = this.dataItem;
      if (para.configType.toUpperCase() == "SYSTEM") {
        para.targetId = "System";
        para.targetLabel = "系统配置";
      }

      if (para.dataType == "Bool") {
        para.dataValue = para.dataValueBool;
      } else if (para.dataType == "Number") {
        para.dataValue = para.dataValueNumber;
      } else if (para.dataType == "DateTime") {
        para.dataValue = dayjs(para.dataValue).format("YYYY-MM-DD HH:mm:ss");
      }

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

    onTargetSelect(item) {
      this.dataItem.targetLabel = item.userName;
    }
  }
};
</script>
