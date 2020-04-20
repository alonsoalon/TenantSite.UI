<template>
  <section ref="refPane" class="multiPaneRoot">
    <multipane class="multiPane" layout="vertical">
      <div
        class="pane leftPane"
        :style="{ width: '300px', minWidth: '200px', maxWidth: '700px' }"
      >
        <div style="padding:10px;">
          <el-input v-model="input" placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>

        <el-scrollbar style="height:100%">
          <el-table :data="tableData">
            <el-table-column type="index" width="40" label="#" />
            <el-table-column prop="name" label="姓名"> </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane rightPane" :style="{ flexGrow: 1 }">
        <div style="padding:10px;">
          <el-button type="primary" icon="el-icon-check">保存</el-button>
          <el-button>刷新资源</el-button>
        </div>
        <el-scrollbar style="height:100%">
          <el-table :data="tableData">
            <el-table-column type="index" width="40" label="#" />
            <el-table-column prop="name" label="姓名"> </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </multipane>
  </section>
</template>

<script>
import { Multipane, MultipaneResizer } from "vue-multipane";
// 混合
//import mixinApp from "@/mixins/app";
export default {
  name: "admin--role-power--index",
  //mixins: [mixinApp],
  components: {
    Multipane,
    MultipaneResizer
  },
  mounted() {
    this.resize();
    this.FillPageInit();
  },
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    // 加载浏览器窗口变化自适应
    resize() {
      window.onresize = () => {
        this.FillPageInit();
      };
    },
    FillPageInit() {
      const refDom = this.$refs.refPane;
      const clientHeight = document.documentElement.clientHeight - 110;
      refDom.style.height = `${clientHeight}px`;
    }
  }
};
</script>
<style lang="scss" scoped>
.multiPaneRoot {
  .multiPane {
    height: 100%;
    .pane {
      text-align: left;
      padding: 0px;
      overflow: hidden;
      background: #fff;
      border: 1px solid rgb(230, 230, 230);
    }
    .multipane-resizer {
      margin: 0;
      left: 0;
      position: relative;
      &:before {
        display: block;
        content: "";
        width: 2px;
        height: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -20px;
        margin-left: -2px;
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
      }
      &:hover {
        &:before {
          border-color: #999;
        }
      }
    }
  }
}
</style>
