<template>
  <el-tree
    :data="dataTree"
    :props="defaultProps"
    :expand-on-click-node="false"
    :default-expand-all="true"
    :indent="16"
    class="a-condition"
  >
    <template v-slot="{ node, data }">
      <template v-if="data.logic && !data.field">
        <div style="width:100%">
          <el-radio-group v-model="data.logic">
            <el-radio label="And">并且</el-radio>
            <el-radio label="Or">或者</el-radio>
          </el-radio-group>

          <el-button-group>
            <el-button
              type="default"
              icon="el-icon-plus"
              size="mini"
              @click="onAddGroup(data)"
            >
              分组
            </el-button>
            <el-button
              type="default"
              icon="el-icon-plus"
              size="mini"
              @click="onAddCondition(data)"
            >
              条件
            </el-button>
            <el-button
              v-if="!data.root"
              type="danger"
              icon="el-icon-close"
              size="mini"
              @click="onDelete(node, data)"
            >
            </el-button>
          </el-button-group>
        </div>
      </template>
      <template v-else>
        <div>
          <el-select
            v-model="data.field"
            style="width:100px;"
            size="mini"
            @change="value => onChangeField(value, data)"
          >
            <el-option
              v-for="(o, index) in fields"
              :key="index"
              :label="o.label"
              :value="o.value"
            />
          </el-select>
          <el-select
            v-model="data.operator"
            style="width:110px;margin-left:5px;"
            size="mini"
            @change="value => onChangeOperator(value, data)"
          >
            <el-option
              v-for="(op, index) in getOperators(data.type)"
              :key="index"
              :label="op.label"
              :value="op.value"
            />
          </el-select>

          <template v-if="data.type === 'date'">
            <el-date-picker
              v-if="data.config.type.indexOf('range') >= 0"
              :key="key"
              v-model="data.value"
              :type="data.config.type"
              unlink-panels
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :default-time="data.config.defaultTime"
              :format="data.config.format"
              :value-format="data.config.valueFormat"
              :picker-options="datePickerOptions"
              style="margin-left:5px;"
              size="mini"
            />
            <el-date-picker
              v-else
              :key="key"
              v-model="data.value"
              :type="data.config.type"
              :format="data.config.format"
              :value-format="data.config.valueFormat"
              :picker-options="datePickerOptions"
              style="margin-left:5px;"
              size="mini"
            />
          </template>
          <el-input-number
            v-else-if="data.type === 'number'"
            v-model="data.value"
            controls-position="right"
            size="mini"
            style="width:120px;margin-left:5px;"
          />
          <el-switch
            v-else-if="data.type === 'bool'"
            v-model="data.value"
            size="mini"
            style="margin-left:5px;"
          />
          <el-input
            v-else
            v-model="data.value"
            size="mini"
            style="width:160px;margin-left:5px;"
          />

          <!-- <el-button
            icon="el-icon-minus"
            style="margin-left:5px;"
            @click="onDelete(node, data)"
          /> -->
          <el-button
            type="danger"
            icon="el-icon-close"
            style="margin-left:5px;"
            size="mini"
            @click="onDelete(node, data)"
          >
          </el-button>
        </div>
      </template>
    </template>
  </el-tree>
</template>

<script>
import { cloneDeep } from "lodash";
export default {
  name: "ACondition",
  props: {
    // {field: '', label: '', value: '', type: 'string', config: {type: '', format:'', valueFormat:''}}
    // 默认字段 default: true
    // 字段类型 type: 'string:字符串 | date:日期 | number:数字 | bool:布尔'
    // 日期操作符 operator: 'datetimerange'
    // 日期控件配置 config: {type: 'datetimerange', format:''yyyy-MM-dd HH:mm'', valueFormat:''yyyy-MM-dd HH:mm'', defaultTime : ['00:00:00', '00:00:00']}
    fields: {
      type: Array,
      default() {
        return [];
      }
    },
    value: {
      type: Array,
      default: () => {
        return [
          {
            root: true,
            logic: "And",
            filters: []
          }
        ];
      }
    }
  },
  data() {
    const operators = {
      equal: { label: "等于", value: "Equal" },
      notEqual: { label: "不等于", value: "NotEqual" },
      contains: { label: "包含", value: "Contains" },
      notContains: { label: "不包含", value: "NotContains" },
      startsWith: { label: "开始以", value: "StartsWith" },
      notStartsWith: { label: "开始不是以", value: "NotStartsWith" },
      endsWith: { label: "结束以", value: "EndsWith" },
      notEndsWith: { label: "结束不是以", value: "NotEndsWith" },
      lessThan: { label: "小于", value: "LessThan" },
      lessThanOrEqual: { label: "小于等于", value: "LessThanOrEqual" },
      greaterThan: { label: "大于", value: "GreaterThan" },
      greaterThanOrEqual: { label: "大于等于", value: "GreaterThanOrEqual" },
      dateRange: { label: "时间段", value: "dateRange" },
      any: { label: "在列表", value: "Any" },
      notAny: { label: "不在列表", value: "NotAny" }
    };

    const operatorGroups = {
      string: [
        operators.equal,
        operators.notEqual,
        operators.contains,
        operators.notContains,
        operators.startsWith,
        operators.notStartsWith,
        operators.endsWith,
        operators.notEndsWith
      ],
      date: [
        operators.equal,
        operators.notEqual,
        operators.lessThan,
        operators.lessThanOrEqual,
        operators.greaterThan,
        operators.greaterThanOrEqual,
        operators.dateRange
      ],
      number: [
        operators.equal,
        operators.notEqual,
        operators.lessThan,
        operators.lessThanOrEqual,
        operators.greaterThan,
        operators.greaterThanOrEqual
      ],
      bool: [operators.equal, operators.notEqual]
    };

    let firstField = {
      field: "",
      label: ""
    };
    if (this.fields && this.fields.length > 0) {
      const field = this.fields.find(a => a.default === true);
      if (field) {
        firstField = field;
      } else {
        firstField = this.fields[0];
      }
    }

    return {
      key: 1,
      dataTree: this.value,
      defaultProps: {
        label: "",
        children: "filters"
      },
      operatorGroups: operatorGroups,
      firstField: firstField,
      datePickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  created() {
    //console.log(12, this.dataTree);
  },

  watch: {
    value(val) {
      //console.log([val]);
      this.dataTree = val;
    },
    dataTree() {
      this.$emit("input", this.dataTree);
    }
  },
  mounted() {},
  methods: {
    getOperators(type) {
      const ops = this.operatorGroups[type || "string"];
      return ops && ops.length > 0 ? ops : ops["string"];
    },
    onChangeField(value, data) {
      const field = this.fields.find(a => a.value === value);
      data.value = "";
      data.label = field.label;
      data.type = field.type ? field.type : "";
      const operators = this.getOperators(data.type);
      let defaultOprator = "";
      if (field.operator) {
        const operatorIndex = operators.findIndex(
          a => a.value === field.operator
        );
        defaultOprator = operatorIndex >= 0 ? field.operator : "";
      }
      if (!defaultOprator) {
        defaultOprator = operators[0].value;
      }
      data.operator = defaultOprator;
      data.config = { ...field.config };
      if (data.type === "date") {
        let dateType = "date";
        if (data.operator === "dateRange") {
          dateType = dateType + "range";
        }
        data.config.type = data.config.type ? data.config.type : dateType;
        if (data.config.type.indexOf("range") >= 0) {
          data.operator = "dateRange";
        }
        data.config.format = data.config.format
          ? data.config.format
          : "yyyy-MM-dd";
        data.config.valueFormat = data.config.valueFormat
          ? data.config.valueFormat
          : "yyyy-MM-dd";
        data.config.defaultTime = data.config.defaultTime
          ? data.config.defaultTime
          : ["00:00:00", "00:00:00"];
      }
    },
    onChangeOperator(value, data) {
      if (data.type === "date") {
        this.key++;
        if (value === "dateRange") {
          data.value = "";
          data.config.type = data.config.type + "range";
        } else {
          if (data.config.type.indexOf("range") >= 0) {
            data.value = "";
            data.config.type = data.config.type.replace(/range$/, "");
          }
        }
      }
    },
    onAddGroup(data) {
      const newFilter = {
        logic: "And"
      };
      if (!data.filters) {
        this.$set(data, "filters", []);
      }
      data.filters.push(newFilter);
    },
    onAddCondition(data) {
      const firstOprator = this.getOperators(data.type)[0];
      const newFilter = {
        field: this.firstField.value,
        label: this.firstField.label,
        operator: firstOprator.value,
        value: ""
      };
      if (!data.filters) {
        this.$set(data, "filters", []);
      }
      const index = data.filters.findIndex(a => a.logic && !a.field);
      if (index >= 0) {
        data.filters.splice(index, 0, newFilter);
      } else {
        data.filters.push(newFilter);
      }
    },
    onDelete(node, data) {
      const parent = node.parent;
      const filters = parent.data.filters || parent.data;
      const index = filters.findIndex(d => d === data);
      filters.splice(index, 1);
    },
    reset() {
      this.dataTree.filters = [];
    },
    getDynamicFilter() {
      return cloneDeep(this.dataTree);
    },
    type(obj) {
      const toString = Object.prototype.toString;
      const map = {
        "[object Boolean]": "boolean",
        "[object Number]": "number",
        "[object String]": "string",
        "[object Function]": "function",
        "[object Array]": "array",
        "[object Date]": "date",
        "[object RegExp]": "regExp",
        "[object Undefined]": "undefined",
        "[object Null]": "null",
        "[object Object]": "object"
      };
      return map[toString.call(obj)];
    },
    deepClone(data) {
      const t = this.type(data);
      let o, i, ni;

      if (t === "array") {
        o = [];
      } else if (t === "object") {
        o = {};
      } else {
        return data;
      }

      if (t === "array") {
        for (i = 0, ni = data.length; i < ni; i++) {
          o.push(this.deepClone(data[i]));
        }
        return o;
      } else if (t === "object") {
        for (i in data) {
          if (i !== "config" && i !== "type" && i !== "label") {
            o[i] = this.deepClone(data[i]);
          }
        }
        return o;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.a-condition ::v-deep {
  .el-tree-node__content {
    height: 30px;
    margin-bottom: 5px;
  }
  .el-radio {
    margin-right: 10px;
  }
  .el-radio__label {
    padding-left: 5px;
  }
  .el-button [class*="el-icon-"] + span {
    margin-left: 2px;
  }
  .el-input-number .el-input__inner {
    text-align: left;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 160px;
  }
  .el-date-editor--datetime.el-input,
  .el-date-editor--datetime.el-input__inner {
    width: 160px;
  }
  .el-date-editor--monthrange.el-input,
  .el-date-editor--monthrange.el-input__inner {
    width: 180px;
  }
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 210px;
  }
  .el-date-editor--datetimerange.el-input,
  .el-date-editor--datetimerange.el-input__inner {
    width: 280px;
  }

  .el-range-editor.el-input__inner {
    padding: 2px 10px;
  }
}
</style>
