<template>
  <section class="dashboard-page" aria-labelledby="dashboard-heading">
    <header class="q-mb-lg">
      <h1 id="dashboard-heading" class="text-h5 q-mb-sm" data-cy="dashboard-title">
        {{ $t('dashboard.title') }}
      </h1>
      <p class="text-body1 text-grey-7">
        {{ $t('dashboard.description') }}
      </p>
    </header>

    <EmptyState
      icon="dashboard_customize"
      :title="$t('dashboard.empty.title')"
      :description="$t('dashboard.empty.description')"
      :action-label="$t('dashboard.empty.action')"
      :action-to="{ name: 'document-edit', params: { id: 'demo-document' } }"
      data-cy="dashboard-empty-state"
    />
  </section>
</template>

<script setup lang="ts">
import EmptyState from 'components/EmptyState.vue';
</script>

<style scoped>
.dashboard-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
