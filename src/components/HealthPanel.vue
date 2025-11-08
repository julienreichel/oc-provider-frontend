<template>
  <q-card
    flat
    bordered
    class="health-panel"
    data-cy="health-panel"
    :aria-label="$t('settings.health.ariaLabel')"
  >
    <q-card-section>
      <div class="text-subtitle1 q-mb-xs">{{ $t('settings.health.title') }}</div>
      <p class="text-body2 text-grey-7 q-mb-none">
        {{ $t('settings.health.description') }}
      </p>
    </q-card-section>

    <q-separator />

    <div v-if="loading" class="health-panel__state q-pa-md">
      <LoadingState />
    </div>

    <div v-else class="health-panel__body q-pa-md q-pt-sm">
      <q-list separator :aria-label="$t('a11y.healthStatusList')">
        <q-item>
          <q-item-section>
            <div class="text-body1">{{ $t('settings.health.apiHealthLabel') }}</div>
            <div v-if="healthTimestamp" class="text-caption text-grey-7">
              {{ $t('settings.health.checkedAt', { timestamp: healthTimestamp }) }}
            </div>
          </q-item-section>
          <q-item-section side top>
            <q-badge
              rounded
              :color="healthBadge.color"
              :label="$t(healthBadge.labelKey)"
              :aria-label="$t(healthBadge.labelKey)"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="text-body1">{{ $t('settings.health.readyLabel') }}</div>
            <div class="text-caption text-grey-7">
              {{ $t(databaseDescriptionKey) }}
            </div>
          </q-item-section>
          <q-item-section side top>
            <q-badge
              rounded
              :color="readyBadge.color"
              :label="$t(readyBadge.labelKey)"
              :aria-label="$t(readyBadge.labelKey)"
            />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <div class="text-body1">{{ $t('settings.health.databaseLabel') }}</div>
            <div class="text-caption text-grey-7">
              {{ $t(databaseLabelKey) }}
            </div>
          </q-item-section>
        </q-item>
      </q-list>

      <q-banner
        v-if="error"
        class="health-panel__error bg-red-1 text-negative q-mt-md"
        rounded
      >
        {{ error.message }}
      </q-banner>
    </div>

    <q-separator />

    <q-card-actions align="right">
      <q-btn
        color="primary"
        flat
        :label="$t('settings.health.refresh')"
        :loading="loading"
        :disable="loading"
        @click="handleRefresh"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import LoadingState from 'components/LoadingState.vue';
import type { UseHealthResult } from 'src/composables/useHealth';
import { useHealth } from 'src/composables/useHealth';

const props = withDefaults(
  defineProps<{
    useHealthImpl?: () => UseHealthResult;
  }>(),
  {
    useHealthImpl: () => useHealth(),
  },
);

const healthComposable = props.useHealthImpl();
const { health, ready, loading, error, check } = healthComposable;

onMounted(() => {
  void check();
});

const healthTimestamp = computed(() => {
  const timestamp = health.value?.timestamp;
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString();
});

const healthBadge = computed(() => {
  if (health.value?.status === 'ok') {
    return { labelKey: 'settings.health.status.ok', color: 'positive' };
  }
  if (error.value) {
    return { labelKey: 'settings.health.status.error', color: 'negative' };
  }
  return { labelKey: 'settings.health.status.unknown', color: 'grey-6' };
});

const readyBadge = computed(() => {
  if (ready.value?.status === 'ready' && ready.value.database === 'connected') {
    return { labelKey: 'settings.health.status.ready', color: 'positive' };
  }
  if (ready.value?.status === 'ready' && ready.value.database === 'disconnected') {
    return { labelKey: 'settings.health.status.degraded', color: 'warning' };
  }
  if (error.value) {
    return { labelKey: 'settings.health.status.error', color: 'negative' };
  }
  return { labelKey: 'settings.health.status.unknown', color: 'grey-6' };
});

const databaseLabelKey = computed(() =>
  ready.value?.database === 'connected'
    ? 'settings.health.database.connected'
    : 'settings.health.database.disconnected',
);

const databaseDescriptionKey = computed(() =>
  ready.value?.database === 'connected'
    ? 'settings.health.readyDescription.connected'
    : 'settings.health.readyDescription.disconnected',
);

const handleRefresh = async (): Promise<void> => {
  await check();
};
</script>

<style scoped>
.health-panel__state {
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.health-panel__error {
  font-size: 0.875rem;
}
</style>
