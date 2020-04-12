<template>
  <span class="fold-btn" @click="toggleFullscreen">
    <i
      class="iconfont icon-FullScreen"
      v-show="!isFullscreen"
      style="font-size:24px"
    ></i>
    <i
      class="iconfont icon-ExitFullScreen"
      v-show="isFullscreen"
      style="font-size:24px"
    ></i>
  </span>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "HeaderFullscreen",
  computed: {
    ...mapState("admin/layout", ["isFullscreen"])
  },
  methods: {
    ...mapActions("admin/layout", ["toggleFullscreen"])
  }
};
</script>
