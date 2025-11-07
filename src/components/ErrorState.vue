<template>
  <div class="error-state">
    <div class="row justify-center q-my-xl">
      <div class="col-12 col-sm-8 col-md-6">
        <q-card flat class="text-center q-pa-lg">
          <!-- Error Icon -->
          <q-icon
            :name="errorIcon"
            :color="errorColor"
            size="4em"
            class="q-mb-md"
            :aria-label="$t('a11y.errorIndicator')"
          />

          <!-- Error Message -->
          <div class="text-h6 q-mb-md" role="alert" :aria-label="$t('a11y.errorMessage')">
            {{ errorMessage }}
          </div>

          <!-- Retry Button -->
          <q-btn
            color="primary"
            :label="$t('document.retry')"
            icon="refresh"
            @click="$emit('retry')"
            :aria-label="$t('document.retry')"
            class="q-mt-md"
          />
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ApiError } from 'src/models/ApiError';

interface Props {
  error: ApiError;
}

interface Emits {
  (event: 'retry'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const { t } = useI18n();

/**
 * Get appropriate error message based on error code
 */
const errorMessage = computed(() => {
  switch (props.error.code) {
    case 'NOT_FOUND':
      return t('document.error.notFound');
    case 'EXPIRED':
      return t('document.error.expired');
    case 'INVALID':
    case 'UNAVAILABLE':
    case 'UNKNOWN':
    default:
      return t('document.error.unavailable');
  }
});

/**
 * Get appropriate icon based on error code
 */
const errorIcon = computed(() => {
  switch (props.error.code) {
    case 'NOT_FOUND':
      return 'search_off';
    case 'EXPIRED':
      return 'schedule';
    case 'INVALID':
      return 'error_outline';
    case 'UNAVAILABLE':
    case 'UNKNOWN':
    default:
      return 'cloud_off';
  }
});

/**
 * Get appropriate color based on error code
 */
const errorColor = computed(() => {
  switch (props.error.code) {
    case 'NOT_FOUND':
      return 'grey-6';
    case 'EXPIRED':
      return 'orange-6';
    case 'INVALID':
      return 'red-6';
    case 'UNAVAILABLE':
    case 'UNKNOWN':
    default:
      return 'blue-grey-6';
  }
});
</script>

<style scoped>
.error-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
