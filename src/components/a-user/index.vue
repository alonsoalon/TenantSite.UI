<template>
  <div>
    <template v-if="multiple">
      <el-tag
        :key="tag"
        v-for="tag in currentLabel"
        closable
        size="medium"
        :disable-transitions="false"
        @close="handleClose(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-button @click="onChoose" type="text">+ 选择</el-button>
    </template>
    <el-input
      v-else
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="currentLabel"
    >
      <el-button
        slot="append"
        icon="el-icon-close"
        title="清空"
        @click="onClear"
      ></el-button>
      <el-button
        slot="append"
        icon="el-icon-more"
        title="选择"
        @click="onChoose"
      ></el-button>
    </el-input>
    <el-dialog
      title="用户选择"
      v-dialog-drag
      :visible.sync="dialogVisible"
      append-to-body
      top="100px"
      width="50%"
    >
      <div style="height:500px; margin:-30px -10px;">
        <a-auto-container class="a-container">
          <splitpanes
            class="default-theme"
            :horizontal="false"
            :dbl-click-splitter="false"
          >
            <pane size="25" min-size="20">
              <group @onRowClick="onRowClick"></group>
            </pane>
            <pane>
              <user
                ref="refUserPane"
                v-model="currentValue"
                :valueKey="valueKey"
                :multiple="multiple"
                @onSelect="onUserSelect"
              ></user>
            </pane>
          </splitpanes>
        </a-auto-container>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- {{ currentValue }} -->
        <el-button type="primary" @click="dialogVisible = false">
          关 闭
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import AAutoContainer from "@/components/a-auto-container";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import Group from "./group";
import User from "./user";

import "@/directives/dialog-drag";

export default {
  name: "AUserSelect",
  components: { AAutoContainer, Splitpanes, Pane, Group, User },
  //   props: ["value"],
  props: {
    placeholder: {
      type: String,
      default: "请选择"
    },
    value: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Array,
      default: () => []
    },
    label: {
      // eslint-disable-next-line vue/require-prop-type-constructor
      type: String | Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: "id"
    },
    labelKey: {
      type: String,
      default: "userName"
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      currentValue: this.value,
      currentLabel: "",
      dialogVisible: false,
      selectedKeys: []
    };
  },
  created() {
    console.log(this.label);
    if (this.multiple) {
      if (this.currentValue.length > 0) {
        if (this.currentLabel.length == 0) {
          this.currentLabel = this.label;
        }
      }
    } else {
      if (this.currentValue != "") {
        if (this.currentLabel == "") {
          this.currentLabel = this.label;
        }
      }
    }
  },
  methods: {
    onRowClick(row) {
      this.$refs.refUserPane.groupInit(row);
    },
    onChoose() {
      this.dialogVisible = true;

      this.selectedKeys = [];
      if (this.multiple) {
        if (this.currentValue.length > 0) {
          this.selectedKeys = this.value;
        }
      } else {
        if (this.currentValue != "") {
          this.selectedKeys.push(this.value);
        }
      }

      this.$nextTick(() => {
        this.$refs.refUserPane.init(this.selectedKeys, this.valueKey);
      });
    },
    onUserSelect(selectedRows) {
      if (!selectedRows || selectedRows.length == 0) {
        return;
      }
      if (this.multiple) {
        this.currentValue = [];
        this.currentLabel = [];
        selectedRows.forEach(e => {
          this.currentValue.push(e[this.valueKey]);
          this.currentLabel.push(e[this.labelKey]);
        });
      } else {
        this.currentValue = "";
        this.currentLabel = "";
        this.currentValue = selectedRows[0][this.valueKey];
        this.currentLabel = selectedRows[0][this.labelKey];
      }

      this.$emit("input", this.currentValue);

      this.$emit("select", this.multiple ? selectedRows : selectedRows[0]);
    },
    handleClose(tag) {
      this.currentValue.splice(this.currentLabel.indexOf(tag), 1);
      this.currentLabel.splice(this.currentLabel.indexOf(tag), 1);
    },
    onClear() {
      this.currentValue = "";
      this.currentLabel = "";
    }
  }
};
</script>

<style lang="scss" scoped>
.splitpanes.default-theme {
  background: #fff;

  .splitpanes__pane {
    background: #fff;
  }
  /deep/ .splitpanes__splitter {
    background-color: #eee;
  }
  /deep/ .mainScroll {
    padding: 0px;
  }
}

.el-tag {
  margin-right: 10px;
}
</style>
