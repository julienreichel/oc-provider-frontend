<template>
  <div class="send-result-panel" :aria-label="$t('a11y.sendResultPanel')">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ $t('documentSend.result.title') }}
        </div>
        <p class="text-body2 text-grey-7">
          {{ $t('documentSend.result.instructions') }}
        </p>
      </q-card-section>
      <q-card-section>
        <CopyField
          :label="$t('documentSend.accessLabel')"
          :helper-text="$t('documentSend.accessHelper')"
          :value="accessCode"
          :aria-label="$t('a11y.documentAccessCode')"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import CopyField from './CopyField.vue';

defineProps<{
  accessCode: string;
}>();
</script>

<style scoped>
.send-result-panel {
  max-width: 640px;
}
</style>
