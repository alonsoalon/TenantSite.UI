<template>
  <div
    class="paneView"
    ref="refScroll"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "ScrollBar",
  props: {},
  data() {
    return {};
  },
  methods: {
    onMouseEnter() {
      //this.$refs.refScroll.style.overflowY = "auto";
    },
    onMouseLeave() {
      // this.$refs.refScroll.style.overflowY = "hidden";
    }
  }
};
</script>
<style lang="scss" scoped>
.paneView {
  flex: 1;
  overflow-y: auto;
}

.paneView::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.paneView::-webkit-scrollbar-thumb {
  background-color: #d5d5d5;
  border-radius: 5px;
}
</style>
