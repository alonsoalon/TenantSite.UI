<template>
  <div v-if="!item.isHidden">
    <el-submenu
      v-if="item.children && item.children.length > 0"
      :index="item.id"
    >
      <template #title>
        <i v-if="item.icon" :class="item.icon" />
        <span>{{ item.title }}</span>
      </template>
      <menu-item v-for="child in item.children" :key="child.id" :item="child" />
    </el-submenu>
    <template v-else-if="item.path">
      <a
        v-if="item.linkType === 2 && item.openMode === 2"
        :href="item.viewPath"
        target="_blank"
        rel="noopener"
      >
        <el-menu-item :index="item.path">
          <i v-if="item.icon" :class="item.icon" />
          <span>{{ item.title }}</span>
        </el-menu-item>
      </a>
      <router-link v-else :to="item.path" tag="div">
        <el-menu-item :index="item.path">
          <i v-if="item.icon" :class="item.icon" />
          <span>{{ item.title }}</span>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>
