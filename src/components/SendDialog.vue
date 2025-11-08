<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(value) => $emit('update:modelValue', value)"
  >
    <q-card class="send-dialog" :aria-label="$t('a11y.sendConfirmDialog')" role="dialog">
      <q-card-section>
        <div class="text-h6 q-mb-sm">
          {{ $t('documentSend.dialog.title') }}
        </div>
        <p class="text-body2">
          {{ warnText }}
        </p>
        <q-banner
          v-if="error"
          class="bg-red-1 text-negative q-mt-sm"
          :aria-label="$t('a11y.sendErrorState')"
          role="alert"
        >
          {{ error.message }}
        </q-banner>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="secondary"
          :label="$t('documentSend.dialog.cancel')"
          :aria-label="$t('a11y.sendCancelButton')"
          @click="$emit('cancel')"
        />
        <q-btn
          color="primary"
          :label="$t('documentSend.dialog.confirm')"
          :disable="!canSend"
          :loading="loading"
          :aria-label="$t('a11y.sendConfirmButton')"
          @click="$emit('confirm')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { DocumentStatus } from 'src/models/Document';
import type { ApiError } from 'src/models/ApiError';

const props = defineProps<{
  modelValue: boolean;
  status: DocumentStatus | null;
  loading: boolean;
  error: ApiError | null;
}>();

defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'confirm'): void;
  (event: 'cancel'): void;
}>();

const { t } = useI18n();

const warnText = computed(() =>
  props.status === 'final'
    ? t('documentSend.dialog.confirmQuestion')
    : t('documentSend.dialog.requiresFinal'),
);

const canSend = computed(() => props.status === 'final' && !props.loading);
</script>
