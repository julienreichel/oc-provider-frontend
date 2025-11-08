<template>
  <router-link
    class="document-card__link"
    :to="{ name: 'document-edit', params: { id: doc.id } }"
    data-cy="document-card"
  >
    <q-card class="document-card q-pa-md q-mb-md" :aria-label="doc.title" role="article" clickable>
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle1">{{ doc.title }}</div>
        <q-badge
          :label="$t(`documents.status.${doc.status}`)"
          :color="doc.status === 'final' ? 'positive' : 'primary'"
          :aria-label="`Document status: ${$t(`documents.status.${doc.status}`)}`"
        />
      </div>

      <div class="text-caption text-grey-7">
        {{ $t('documents.createdAt', { date: doc.createdAt }) }}
      </div>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import type { Document } from '../models/Document';

defineProps<{
  doc: Document;
}>();
</script>

<style scoped>
.document-card__link {
  display: block;
  text-decoration: none;
}

.document-card {
  transition: box-shadow 0.2s ease;
}

.document-card:hover {
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
