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
          label-width="110px"
          :inline="false"
          size="small"
          :rules="formRules"
        >
          <el-form-item label="任务名称" prop="name">
            <el-input
              v-model="dataItem.name"
              autocomplete="off"
              @input="$forceUpdate()"
            />
          </el-form-item>
          <el-form-item label="分组名称" prop="jobGroup">
            <el-input
              v-model="dataItem.jobGroup"
              autocomplete="off"
              @input="$forceUpdate()"
            />
          </el-form-item>
          <el-form-item label="触发器类型" prop="triggerType">
            <el-radio-group
              v-model="dataItem.triggerType"
              @change="onTriggerTypeChange"
            >
              <el-radio-button
                v-for="item in triggerTypes"
                :key="item.value"
                :label="item.value"
                >{{ item.label }}</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
          <template v-if="dataItem.triggerType === 0">
            <el-divider content-position="left"></el-divider>
            <el-form-item label="执行次数" prop="runTimes">
              <el-input-number v-model="dataItem.runTimes" :max="1000" />
            </el-form-item>
            <el-form-item label="执行间隔(秒)" prop="intervalSecond">
              <el-input-number v-model="dataItem.intervalSecond" />
            </el-form-item>
          </template>
          <template v-else>
            <el-divider content-position="left"></el-divider>
            <el-form-item label="表达式" prop="cron">
              <cron-input
                v-model="dataItem.cron"
                @change="onChangeCron"
                @reset="onResetCron"
              />
            </el-form-item>
          </template>
          <el-divider content-position="left"></el-divider>
          <el-tooltip
            class="item"
            effect="dark"
            content=" 任务开始时间未设定，默认从第一次执行任务的时间"
            placement="top-start"
          >
            <el-form-item label="开始时间" prop="beginTime">
              <el-date-picker
                v-model="dataItem.beginTime"
                type="datetime"
                placeholder="选择开始时间"
                format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
            </el-form-item>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content=" 任务结束时间未设定，表示永久有效"
            placement="top-start"
          >
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker
                v-model="dataItem.endTime"
                type="datetime"
                placeholder="选择结束时间"
                format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
            </el-form-item>
          </el-tooltip>
          <!-- <el-form-item label="程序集" prop="assemblyName">
            <el-input v-model="dataItem.assemblyName" :disabled="true" />
          </el-form-item> -->
          <el-tooltip
            class="item"
            effect="dark"
            content="注意实体名称大小写，与程序保持一致"
            placement="top-start"
          >
            <el-form-item label="类名" prop="className">
              <el-input
                v-model="dataItem.className"
                autocomplete="off"
                @input="$forceUpdate()"
              />
            </el-form-item>
          </el-tooltip>
          <el-form-item label="默认系统库" prop="isDefaultDatabase">
            <el-switch
              v-model="dataItem.isDefaultDatabase"
              @change="onDefaultDatabase"
            ></el-switch>
          </el-form-item>
          <template v-if="dataItem.isDefaultDatabase === false">
            <el-form-item label="库类型" prop="dbType"
              ><!--, trigger: 'blur' -->
              <el-radio-group v-model="dataItem.dbType">
                <el-radio-button
                  v-for="item in dbTypes"
                  :key="item.id"
                  :label="item.id"
                  >{{ item.title }}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-tooltip
              class="item"
              effect="dark"
              content="为确保任务正常执行，请填写正确的连接字符串"
              placement="top-start"
            >
              <el-form-item label="连接字符串" prop="connectionString">
                <el-input v-model="dataItem.connectionString" />
              </el-form-item>
            </el-tooltip>
          </template>
          <!--<el-form-item label="数据库参数" prop="connectionParam" >
            <el-input type="textarea" rows="4" v-model="dataItem.connectionParam" autocomplete="off" @input="$forceUpdate()"/>
          </el-form-item>-->

          <el-tooltip
            class="item"
            effect="dark"
            content="请填写正确的JSON字符串"
            placement="top-start"
          >
            <el-form-item label="参数" prop="jobParams">
              <el-input
                type="textarea"
                rows="4"
                v-model="dataItem.jobParams"
                autocomplete="off"
                @input="$forceUpdate()"
              />
            </el-form-item>
          </el-tooltip>
          <el-form-item label="任务描述" prop="remark">
            <el-input
              type="textarea"
              v-model="dataItem.remark"
              autocomplete="off"
              @input="$forceUpdate()"
            />
          </el-form-item>
          <el-form-item label="启动" prop="isStart">
            <el-switch v-model="dataItem.isStart" @change="$forceUpdate()" />
          </el-form-item>
          <el-form-item label="禁用" prop="isDisabled">
            <el-switch v-model="dataItem.isDisabled" @change="$forceUpdate()" />
          </el-form-item>
        </el-form>
      </section>
      <div class="drawer-footer">
        <el-button @click.native="drawerVisible = false">{{
          this.$t("common.cancel")
        }}</el-button>
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
import CronInput from "vue-cron-generator/src/components/cron-input";
import { DEFAULT_CRON_EXPRESSION } from "vue-cron-generator/src/constant/filed";

// 工具
import { cloneDeep } from "lodash";

// apis
import { execCreate } from "@/api/admin/task-qz";

export default {
  name: "admin--tasks--add",
  components: {
    ConfirmButton,
    CronInput
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
    }
  },
  data() {
    return {
      loading: false,

      dataItem: {
        isDefaultDatabase: true,
        cron: DEFAULT_CRON_EXPRESSION,
        triggerType: 0, //默认触发器类型
        jobParams: "",
        dbType: 0,
        connectionString: ""
      },
      triggerTypes: [
        { label: "Simple", value: 0 },
        { label: "Cron", value: 1 }
      ],
      formRules: {
        name: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
        jobGroup: [
          { required: true, message: "请输入表达式", trigger: "blur" }
        ],
        className: [
          { required: true, message: "请填写任务实体名称", trigger: "blur" }
        ],
        dbType: [
          { required: true, message: "请指定数据库类型", trigger: "change" }
        ],
        connectionString: [
          {
            required: true,
            message: "请填写指定数据库的连接字符串",
            trigger: "blur"
          }
        ]
      },
      dialogVisible: false,
      dbTypes: [
        { id: 0, label: "MySql", title: "MySql" },
        { id: 1, label: "SqlServer", title: "SqlServer" },
        { id: 2, label: "PostgreSql", title: "PostgreSql" },
        { id: 3, label: "Oracle", title: "Oracle" },
        { id: 4, label: "Sqlite", title: "Sqlite" },
        { id: 11, label: "MsAccess", title: "MsAccess" },
        { id: 12, label: "Dameng", title: "Dameng" }
      ]
    };
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
      //this.loading = true;
      if (!this.dataItem.isDefaultDatabase) {
        const _d = {
          ConnectionString: this.dataItem.connectionString,
          DbType: this.dataItem.dbType
        };
        this.$set(this.dataItem, "connectionParam", JSON.stringify(_d));
      } else {
        this.$set(this.dataItem, "connectionParam", "");
      }
      if (this.dataItem.triggerType === 0) {
        this.dataItem.cron = "";
      }
      const para = cloneDeep(this.dataItem);
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
    },
    onChangeCron(cron) {
      this.dataItem.cron = cron;
    },
    // eslint-disable-next-line no-unused-vars
    onResetCron(cron) {
      this.dataItem.cron = DEFAULT_CRON_EXPRESSION;
    },
    onDefaultDatabase(v) {
      if (v) {
        this.dataItem.dbType = -1;
        this.dataItem.connectionString = "";
      }
    },
    onTriggerTypeChange(v) {
      if (v === 1) {
        this.dataItem.runTimes = "";
        this.dataItem.intervalSecond = "";
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
  async mounted() {}
};
</script>
