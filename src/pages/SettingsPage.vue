<template>
  <section class="settings-page" aria-labelledby="settings-heading">
    <header class="q-mb-lg">
      <h1 id="settings-heading" class="text-h5 q-mb-xs">
        {{ $t('settings.title') }}
      </h1>
      <p class="text-body2 text-grey-7">
        {{ $t('settings.description') }}
      </p>
    </header>

    <div class="settings-page__stack q-gutter-lg">
      <HealthPanel />
    </div>
  </section>
</template>

<script setup lang="ts">
import HealthPanel from 'components/HealthPanel.vue';
</script>

<style scoped>
.settings-page {
  max-width: 720px;
  margin: 0 auto;
}

.settings-page__stack {
  display: flex;
  flex-direction: column;
}

.settings-profile__list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.settings-profile__row {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .settings-profile__row {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
