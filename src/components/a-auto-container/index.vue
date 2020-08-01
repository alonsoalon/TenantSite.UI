<template>
  <div class="a-container">
    <div class="a-main">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: "a-auto-container"
};
</script>

<style lang="scss" scoped>
.a-container {
  display: flex;
  flex-direction: row;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
  min-width: 0;

  height: 100%;
  .a-main {
    display: block;
    flex: 1;
    flex-basis: auto;
    overflow: auto;
    box-sizing: border-box;
    margin: 10px;
    border: #e6e6e6 1px solid;
  }
}

.a-container.is-vertical {
  flex-direction: column;
  -webkit-box-orient: vertical;
}
</style>
