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

    <ListToolbar v-model="search" />

    <div v-if="loading">
      <LoadingState />
    </div>

    <div v-else-if="error">
      <ErrorState :error="error" @retry="refresh" />
    </div>

    <DocumentList
      v-else
      :documents="filteredDocuments"
      :show-load-more="Boolean(nextCursor)"
      :loading="loading"
      @load-more="fetchNext"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ListToolbar from 'components/ListToolbar.vue';
import DocumentList from 'components/DocumentList.vue';
import LoadingState from 'components/LoadingState.vue';
import ErrorState from 'components/ErrorState.vue';
import { useDocuments } from 'src/composables/useDocuments';

const search = ref('');
const { items, nextCursor, loading, error, refresh, fetchNext } = useDocuments();

const filteredDocuments = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) {
    return items.value;
  }

  return items.value.filter((doc) => doc.title.toLowerCase().includes(term));
});

void refresh();
</script>

<style scoped>
.dashboard-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
