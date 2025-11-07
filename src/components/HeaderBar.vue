<template>
  <q-header elevated class="header-bar bg-white text-dark" v-bind="$attrs">
    <q-toolbar class="q-px-md">
      <q-btn
        flat
        dense
        round
        icon="menu"
        class="lt-md q-mr-sm"
        :aria-label="$t('layout.menuLabel')"
        @click="emit('toggle-drawer')"
      />

      <q-toolbar-title class="text-weight-medium">
        {{ $t('layout.workspaceTitle') }}
      </q-toolbar-title>

      <div class="header-bar__actions">
        <q-badge color="primary" align="middle" class="text-uppercase">
          {{ $t('layout.betaLabel') }}
        </q-badge>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: 'toggle-drawer'): void;
}>();

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.header-bar__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
