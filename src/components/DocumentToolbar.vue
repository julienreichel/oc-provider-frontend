<template>
  <div class="document-toolbar q-gutter-sm">
    <q-btn
      color="primary"
      :label="isNew ? $t('documentEdit.actions.create') : $t('documentEdit.actions.save')"
      :disable="!canSave"
      :loading="saving"
      :aria-label="$t('a11y.saveDocument')"
      data-cy="document-save-button"
      @click="$emit('save')"
    />

    <q-btn
      v-if="showSend"
      outline
      color="accent"
      icon="send"
      :label="$t('documentEdit.actions.send')"
      :disable="!canSend"
      :loading="sending"
      :aria-label="$t('a11y.sendDocument')"
      data-cy="document-send-button"
      @click="$emit('send')"
    />

    <q-btn
      v-if="showDuplicate"
      outline
      color="warning"
      icon="content_copy"
      :label="$t('documentEdit.actions.duplicate')"
      :disable="duplicateDisabled"
      :loading="duplicateLoading"
      data-cy="document-duplicate-button"
      @click="$emit('duplicate')"
    />

    <q-btn
      flat
      color="secondary"
      :label="$t('documentEdit.actions.close')"
      :aria-label="$t('a11y.closeDocumentEditor')"
      data-cy="document-close-button"
      @click="$emit('close')"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    isNew: boolean;
    canSave: boolean;
    saving: boolean;
    canSend?: boolean;
    sending?: boolean;
    showSend?: boolean;
    showDuplicate?: boolean;
    duplicateLoading?: boolean;
    duplicateDisabled?: boolean;
  }>(),
  {
    canSend: false,
    sending: false,
    showSend: false,
    showDuplicate: false,
    duplicateLoading: false,
    duplicateDisabled: false,
  },
);

defineEmits<{
  (event: 'save'): void;
  (event: 'close'): void;
  (event: 'send'): void;
  (event: 'duplicate'): void;
}>();
</script>

<style scoped>
.document-toolbar {
  display: flex;
  align-items: center;
}
</style>
