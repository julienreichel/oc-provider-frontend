<template>
  <div class="copy-field" v-bind="$attrs">
    <q-input
      :model-value="value"
      :label="label"
      readonly
      outlined
      class="q-mb-sm"
      data-cy="copy-field-input"
    >
      <template #append>
        <q-btn
          round
          dense
          flat
          icon="content_copy"
          :aria-label="copied ? $t('components.copyField.copied') : $t('components.copyField.copy')"
          @click="copyValue"
        />
      </template>
    </q-input>

    <div v-if="helperText" class="text-caption text-grey-7">
      {{ helperText }}
    </div>

    <transition name="fade">
      <q-badge v-if="copied" color="positive" class="q-mt-sm">
        {{ $t('components.copyField.copied') }}
      </q-badge>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, toRefs } from 'vue';
import { useQuasar } from 'quasar';

interface Props {
  label: string;
  value: string;
  helperText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  helperText: '',
});

const { label, value, helperText } = toRefs(props);

const emit = defineEmits<{
  (event: 'copied'): void;
}>();

const $q = useQuasar();
const copied = ref(false);
let timeout: ReturnType<typeof setTimeout> | undefined;

const copyValue = async (): Promise<void> => {
  await $q.copyToClipboard(value.value);
  copied.value = true;
  emit('copied');

  if (timeout) {
    clearTimeout(timeout);
  }

  timeout = setTimeout(() => {
    copied.value = false;
  }, 2000);
};

onBeforeUnmount(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
