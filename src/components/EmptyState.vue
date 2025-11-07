<template>
  <q-card flat bordered class="empty-state" v-bind="$attrs">
    <q-card-section class="text-center">
      <q-icon
        v-if="icon"
        :name="icon"
        size="48px"
        color="primary"
        class="q-mb-md"
        aria-hidden="true"
      />

      <div class="text-h6 q-mb-sm">
        {{ title }}
      </div>

      <p class="text-body2 text-grey-7 q-mb-lg">
        {{ description }}
      </p>

      <q-btn
        v-if="actionLabel"
        color="primary"
        :label="actionLabel"
        :to="actionTo"
        @click="handleAction"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface Props {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: RouteLocationRaw;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (event: 'action'): void;
}>();

const handleAction = (): void => {
  if (!props.actionTo) {
    emit('action');
  }
};

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.empty-state {
  max-width: 520px;
  margin: 0 auto;
}
</style>
