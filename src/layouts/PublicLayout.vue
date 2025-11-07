<template>
  <q-layout view="lHh Lpr lFf" class="public-layout">
    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-toolbar-title class="text-h6">
          {{ $t('layout.title') }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// No specific logic needed - pure layout component
</script>

<style lang="scss" scoped>
.public-layout {
  .q-header {
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .q-toolbar-title {
    font-weight: 600;
  }
}
</style>
