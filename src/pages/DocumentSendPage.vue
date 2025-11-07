<template>
  <section class="document-send-page" aria-labelledby="document-send-heading">
    <header class="q-mb-lg">
      <h1 id="document-send-heading" class="text-h5 q-mb-xs">
        {{ $t('documentSend.title') }}
      </h1>
      <p class="text-body2 text-grey-7">
        {{ $t('documentSend.subtitle', { id: documentId }) }}
      </p>
    </header>

    <CopyField
      :label="$t('documentSend.accessLabel')"
      :value="accessCode"
      :helper-text="$t('documentSend.accessHelper')"
      data-cy="document-send-code"
    />

    <q-card flat bordered class="q-mt-lg">
      <q-card-section>
        <p class="text-body1">
          {{ $t('documentSend.placeholder') }}
        </p>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CopyField from 'components/CopyField.vue';

const route = useRoute();
const documentId = computed(() => String(route.params.id ?? ''));
const accessCode = computed(() => `${documentId.value || 'demo'}-CODE`);
</script>

<style scoped>
.document-send-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
