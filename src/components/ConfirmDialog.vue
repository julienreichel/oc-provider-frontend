<template>
  <q-dialog :model-value="modelValue" @update:model-value="updateModel">
    <q-card class="confirm-dialog">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ title }}
        </div>
        <p class="text-body2 text-grey-7">
          {{ message }}
        </p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="secondary"
          :label="cancelLabel ?? $t('components.confirmDialog.cancel')"
          @click="handleCancel"
        />
        <q-btn
          color="primary"
          :label="confirmLabel ?? $t('components.confirmDialog.confirm')"
          @click="handleConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

defineProps<Props>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'confirm'): void;
  (event: 'cancel'): void;
}>();

const updateModel = (value: boolean): void => {
  emit('update:modelValue', value);
};

const closeDialog = (): void => {
  emit('update:modelValue', false);
};

const handleConfirm = (): void => {
  emit('confirm');
  closeDialog();
};

const handleCancel = (): void => {
  emit('cancel');
  closeDialog();
};

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.confirm-dialog {
  min-width: 320px;
}
</style>
