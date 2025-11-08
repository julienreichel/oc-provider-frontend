<template>
  <div v-if="doc" class="metadata-panel">
    <q-list dense>
      <q-item>
        <q-item-section>
          <q-item-label caption>
            {{ $t('documentEdit.metadata.id') }}
          </q-item-label>
          <q-item-label data-cy="metadata-id">{{ doc.id }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="doc.createdAt">
        <q-item-section>
          <q-item-label caption>
            {{ $t('documentEdit.metadata.createdAt') }}
          </q-item-label>
          <q-item-label data-cy="metadata-created-at">
            {{ doc.createdAt }}
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item v-if="doc.accessCode">
        <q-item-section>
          <q-item-label caption>
            {{ $t('documentEdit.metadata.accessCode') }}
          </q-item-label>
          <q-item-label data-cy="metadata-access-code">{{ doc.accessCode }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import type { Document } from 'src/models/Document';

defineProps<{
  doc: Document | null;
}>();
</script>

<style scoped>
.metadata-panel {
  background-color: var(--q-grey-1);
  border-radius: 4px;
  padding: 8px;
}
</style>
