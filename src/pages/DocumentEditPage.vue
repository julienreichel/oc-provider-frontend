<template>
  <section class="document-edit-page" aria-labelledby="document-edit-heading">
    <header class="q-mb-lg">
      <h1 id="document-edit-heading" class="text-h5 q-mb-xs">
        {{ $t('documentEdit.title') }}
      </h1>
      <p class="text-body2 text-grey-7">
        {{ $t('documentEdit.subtitle', { id: documentId }) }}
      </p>
    </header>

    <q-card flat bordered data-cy="document-editor-placeholder">
      <q-card-section>
        <p class="text-body1">
          {{ $t('documentEdit.placeholder') }}
        </p>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const documentId = computed(() => String(route.params.id ?? ''));
</script>

<style scoped>
.document-edit-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
