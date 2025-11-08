<template>
  <router-link class="document-card__link" :to="targetRoute" data-cy="document-card">
    <q-card class="document-card q-pa-md q-mb-md" :aria-label="doc.title" role="article" clickable>
      <div class="row items-center justify-between q-mb-sm">
        <div class="text-subtitle1">{{ doc.title }}</div>
        <q-badge
          :label="$t(`documents.status.${displayStatus}`)"
          :color="statusBadgeColor"
          :aria-label="`Document status: ${$t(`documents.status.${displayStatus}`)}`"
        />
      </div>

      <div class="text-caption text-grey-7">
        {{ $t('documents.createdAt', { date: doc.createdAt }) }}
      </div>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { Document } from '../models/Document';

const props = defineProps<{
  doc: Document;
}>();

const targetRoute = computed<RouteLocationRaw>(() => {
  if (props.doc.accessCode) {
    return {
      name: 'document-send',
      params: { id: props.doc.id },
      query: { code: props.doc.accessCode },
    };
  }

  return { name: 'document-edit', params: { id: props.doc.id } };
});

const displayStatus = computed(() => {
  // If document has been sent (has accessCode), show "sent" status
  if (props.doc.accessCode) {
    return 'sent';
  }
  
  // Otherwise show the original status
  return props.doc.status;
});

const statusBadgeColor = computed(() => {
  if (displayStatus.value === 'sent') {
    return 'positive';
  }
  
  if (displayStatus.value === 'final') {
    return 'positive';
  }
  
  return 'primary';
});
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
