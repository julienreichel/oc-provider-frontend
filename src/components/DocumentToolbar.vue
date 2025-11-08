<template>
  <div class="document-toolbar q-gutter-sm">
    <q-btn
      color="primary"
      :label="isNew ? $t('documentEdit.actions.create') : $t('documentEdit.actions.save')"
      :disable="!canSave"
      :loading="saving"
      :aria-label="$t('a11y.saveDocument')"
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
      @click="$emit('send')"
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
withDefaults(
  defineProps<{
    isNew: boolean;
    canSave: boolean;
    saving: boolean;
    canSend?: boolean;
    sending?: boolean;
    showSend?: boolean;
  }>(),
  {
    canSend: false,
    sending: false,
    showSend: false,
  },
);

defineEmits<{
  (event: 'save'): void;
  (event: 'close'): void;
  (event: 'send'): void;
}>();
</script>

<style scoped>
.document-toolbar {
  display: flex;
  align-items: center;
}
</style>
