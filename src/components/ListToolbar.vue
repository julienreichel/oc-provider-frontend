<template>
  <div class="list-toolbar q-mb-md">
    <q-input
      dense
      debounce="200"
      outlined
      :model-value="modelValue"
      :label="$t('documents.filterLabel')"
      :placeholder="$t('documents.filterPlaceholder')"
      :aria-label="$t('a11y.filterDocuments')"
      @update:model-value="onInput"
      clearable
    >
      <template #prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const onInput = (value: string | number | null): void => {
  emit('update:modelValue', typeof value === 'string' ? value : (value?.toString() ?? ''));
};
</script>

<style scoped>
.list-toolbar {
  max-width: 360px;
}
</style>
