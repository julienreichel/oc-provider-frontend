<template>
  <div class="document-editor">
    <q-input
      filled
      :label="$t('documentEdit.fields.title')"
      :model-value="title"
      :error="Boolean(errors.title)"
      :error-message="errors.title"
      :disable="disabled"
      :aria-label="$t('a11y.documentTitleInput')"
      @update:model-value="updateTitle"
    />

    <q-input
      class="q-mt-md"
      filled
      type="textarea"
      autogrow
      :rows="6"
      :label="$t('documentEdit.fields.content')"
      :model-value="content"
      :error="Boolean(errors.content)"
      :error-message="errors.content"
      :disable="disabled"
      :aria-label="$t('a11y.documentContentInput')"
      @update:model-value="updateContent"
    />

    <q-select
      class="q-mt-md"
      filled
      :options="statusOptions"
      emit-value
      map-options
      :label="$t('documentEdit.fields.status')"
      :model-value="status"
      :disable="disabled"
      :aria-label="$t('a11y.documentStatusSelect')"
      @update:model-value="emit('update:status', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { DocumentStatus } from 'src/models/Document';
import { useI18n } from 'vue-i18n';

interface Props {
  title: string;
  content: string;
  status: DocumentStatus;
  disabled?: boolean;
  errors: {
    title?: string;
    content?: string;
  };
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  errors: () => ({}),
});

const emit = defineEmits<{
  (event: 'update:title', value: string): void;
  (event: 'update:content', value: string): void;
  (event: 'update:status', value: DocumentStatus): void;
}>();

const { t } = useI18n();

const statusOptions = computed(() => [
  { label: t('documents.status.draft'), value: 'draft' },
  { label: t('documents.status.final'), value: 'final' },
]);

const normalizeText = (value: string | number | null): string =>
  typeof value === 'string' ? value : value != null ? String(value) : '';

const updateTitle = (value: string | number | null): void => {
  emit('update:title', normalizeText(value));
};

const updateContent = (value: string | number | null): void => {
  emit('update:content', normalizeText(value));
};
</script>

<style scoped>
.document-editor {
  display: flex;
  flex-direction: column;
}
</style>
