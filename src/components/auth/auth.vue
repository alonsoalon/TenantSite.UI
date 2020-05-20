<script>
/*
eg:
    <Auth :authority="['Edit', 'Delete']">
      <template slot="noMatch">
        你无权查看评论内容
      </template>
      评论内容
    </Auth>
*/
export default {
  name: "Auth",
  props: {
    // 准入权限
    authority: {
      type: [String, Array, Function, Boolean],
      default: true
    },
    // 我的权限
    access: {
      type: [String, Array]
    },
    // 是否开启阻止模式，开启后，不会返回 noMatch 的 slot，而是阻止组件内的点击，反而给一个 $Message 提示，常用于 Button 操作
    prevent: {
      type: Boolean,
      default: false
    },
    // 在 prevent 开启时有效，点击提示的内容，当开启 customTip 时无效
    message: {
      type: String,
      default: "您没有权限进行此操作"
    },
    // 在 prevent 开启时有效，通过监听 @click 自定义提示
    customTip: {
      type: Boolean,
      default: false
    },
    // 3 种 display 状态
    display: {
      type: String
    },
    withContainer: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    isPermission() {
      let state;
      if (typeof this.authority === "boolean") {
        state = this.authority;
      } else if (this.authority instanceof Function) {
        state = this.authority();
      } else {
        const authority =
          typeof this.authority === "string"
            ? [this.authority]
            : this.authority;

        let access;
        if (this.access) {
          access =
            typeof this.access === "string" ? [this.access] : this.access;
        } else {
          access = this.$store.state.admin.user.info.functionPoints;
        }

        state = authority.some(v => access.includes(v));
      }
      return state;
    },
    options() {
      let style = {};
      if (this.display) style.display = this.display;
      return {
        class: {
          "ts-auth": true,
          "ts-auth-prevent": this.prevent
        },
        style: style
      };
    }
  },
  render(h) {
    if (this.isPermission) {
      if (this.withContainer) {
        return h("div", this.options, this.$slots.default);
      } else {
        return this.$slots.default;
      }
    } else {
      // prevent 模式下，不返回 noMatch, withContainer也不生效
      if (this.prevent) {
        return h(
          "div",
          Object.assign({}, this.options, {
            on: {
              click: this.handlePreventClick
            }
          }),
          [
            h(
              "div",
              {
                class: "ts-auth-prevent-no-match"
              },
              this.$slots.default
            )
          ]
        );
      } else {
        if (this.withContainer) {
          return h("div", this.options, this.$slots.noMatch);
        } else {
          return this.$slots.noMatch;
        }
      }
    }
  },
  methods: {
    handlePreventClick(event) {
      if (!this.isPermission) {
        if (!this.customTip) {
          this.$message({
            message: this.message,
            type: "warning"
          });
        }
        event.preventDefault();
        this.$emit("click", event);
      }
    }
  },
  created() {}
};
</script>
