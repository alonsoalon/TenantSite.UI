<template>
  <span style="margin-left:10px;line-height: 1;display: inline-block;">
    <el-popover
      ref="popover"
      v-model="visible"
      :placement="placement"
      width="160"
      :disabled="disabledPopover"
      :trigger="'click'"
      :title="title"
      :content="content"
      @hide="hide"
    >
      <slot name="content">
        <p>
          {{
            type === "delete"
              ? this.$t("common.deleteConfirm")
              : this.$t("common.submitConfirm")
          }}
        </p>
      </slot>
      <slot name="footer">
        <div style="text-align: right; margin: 0">
          <el-button type="text" @click="visible = false">
            {{ this.$t("common.cancel") }}
          </el-button>
          <el-button type="primary" @click="sure">
            {{ this.$t("common.ok") }}
          </el-button>
        </div>
      </slot>
    </el-popover>
    <el-button
      v-popover:popover
      :icon="icon"
      :type="buttonType"
      :loading="loading"
      :disabled="disabled"
      _button
      @click="valid"
    >
      <slot>{{ buttonText }}</slot>
    </el-button>
  </span>
</template>

<script>
export default {
  name: "ConfirmButton",
  props: {
    title: {
      type: String,
      default: ""
    },
    content: {
      type: String,
      default: ""
    },
    loading: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placement: {
      type: String,
      default: "top-end"
    },
    //  primary|danger
    type: {
      type: String,
      default: "primary"
    },
    icon: {
      type: String,
      default: ""
    },
    validate: {
      type: Function,
      default: null
    },
    validateData: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      visible: false,
      disabledPopover: this.validate !== null,
      buttonType:
        this.type === "delete"
          ? "danger"
          : this.type === "submit"
          ? "primary"
          : this.type,
      buttonText:
        this.type === "delete" ? "删除" : this.type === "submit" ? "提交" : "",
      style: ""
    };
  },
  computed: {},
  watch: {},
  mounted: function() {},
  methods: {
    hide() {
      if (this.validate) {
        this.disabledPopover = true;
      }
    },
    valid() {
      if (this.validate) {
        const isValid = this.validate(this.validateData);
        if (isValid) {
          this.disabledPopover = false;
        }
      }
    },
    sure() {
      this.visible = false;
      this.$emit("click");
    }
  }
};
</script>
