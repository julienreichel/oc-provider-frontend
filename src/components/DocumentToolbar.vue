<template>
  <div class="document-toolbar q-gutter-sm">
    <q-btn
      color="primary"
      :label="isNew ? $t('documentEdit.actions.create') : $t('documentEdit.actions.save')"
      :disable="!canSave"
      :loading="loading"
      :aria-label="$t('a11y.saveDocument')"
      @click="$emit('save')"
    />
    <q-btn
      flat
      color="secondary"
      :label="$t('documentEdit.actions.close')"
      :aria-label="$t('a11y.closeDocumentEditor')"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isNew: boolean;
  canSave: boolean;
  loading: boolean;
}>();

defineEmits<{
  (event: 'save'): void;
  (event: 'close'): void;
}>();
</script>

<style scoped>
.document-toolbar {
  display: flex;
  align-items: center;
}
</style>
