<template>
  <section style="padding:10px;">
    <!--列表-->
    <el-table
      v-loading="listLoading"
      :data="caches"
      highlight-current-row
      style="width: 100%;height:100%;"
    >
      <el-table-column type="index" width="80" label="#" />
      <el-table-column prop="name" label="键名" width />
      <el-table-column prop="value" label="Key模板" width />
      <el-table-column prop="description" label="描述" width />
      <Auth :authority="[menuCode + 'Delete']" :withContainer="false">
        <el-table-column label="操作" width="180">
          <template v-slot="{ $index, row }">
            <confirm-button
              type="delete"
              :loading="row._loading"
              :icon="'el-icon-delete'"
              style="margin-left:0px;"
              @click="onClearCache($index, row)"
            >
              <template #content>
                <p>确定要清除使用该key模板的所有缓存吗？</p>
              </template>
              清除
            </confirm-button>
          </template>
        </el-table-column>
      </Auth>
    </el-table>
  </section>
</template>

<script>
import { getCacheKeyTemplates, clear } from "@/api/admin/cache";
import ConfirmButton from "@/components/confirm-button";
export default {
  name: "admin--cache-index",
  components: {
    ConfirmButton
  },
  data() {
    return {
      menuCode: "Cache" + ".", // 配合局部Code 用于控制按钮或功能区的权限，需与后台资源管理菜单CODE保持一致。区分大小写
      filter: {
        name: ""
      },
      caches: [],
      listLoading: false
    };
  },
  mounted() {
    this.getCaches();
  },
  methods: {
    // 获取缓存列表
    async getCaches() {
      this.listLoading = true;
      const res = await getCacheKeyTemplates();
      this.listLoading = false;

      //console.log(res);

      if (!res.success) {
        if (res.msg) {
          this.$message({
            message: res.msg,
            type: "error"
          });
        }
        return;
      }

      const data = res.data;
      data.forEach(d => {
        d._loading = false;
      });
      this.caches = data;
    },
    // 清除缓存
    async onClearCache(index, row) {
      row._loading = true;
      const para = { cacheKey: row.value };
      const res = await clear(para);
      row._loading = false;
      if (res.success) {
        this.$message({ message: "清除缓存成功", type: "success" });
      } else {
        this.$message({ message: res.message, type: "error" });
      }
    }
  }
};
</script>
