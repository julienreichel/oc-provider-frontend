<template>
  <div :aria-label="$t('a11y.documentsList')" role="region">
    <div v-if="documents.length === 0" class="q-mt-lg">
      <EmptyState
        icon="dashboard_customize"
        :title="$t('dashboard.empty.title')"
        :description="$t('dashboard.empty.description')"
        :action-label="$t('dashboard.empty.action')"
        :action-to="{ name: 'document-edit', params: { id: 'new-document' } }"
        :aria-label="$t('a11y.emptyStateMessage')"
      />
    </div>

    <div v-else>
      <DocumentCard v-for="doc in documents" :key="doc.id" :doc="doc" />

      <div class="row justify-center q-mt-md" v-if="showLoadMore">
        <q-btn
          color="primary"
          outline
          :label="$t('documents.loadMore')"
          :aria-label="$t('a11y.loadMoreDocuments')"
          @click="$emit('load-more')"
          :loading="loading"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Document } from '../models/Document';
import DocumentCard from './DocumentCard.vue';
import EmptyState from './EmptyState.vue';

defineProps<{
  documents: Document[];
  showLoadMore: boolean;
  loading: boolean;
}>();

defineEmits<{
  (event: 'load-more'): void;
}>();
</script>
