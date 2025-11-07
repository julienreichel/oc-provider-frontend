<template>
  <q-page padding class="page-container" v-bind="$attrs">
    <slot />
  </q-page>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.page-container {
  min-height: 100%;
}
</style>
