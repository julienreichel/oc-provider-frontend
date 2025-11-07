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

    <q-card flat bordered data-cy="settings-placeholder">
      <q-card-section>
        <p class="text-body1">
          {{ $t('settings.placeholder') }}
        </p>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
// Static content placeholder
</script>

<style scoped>
.settings-page {
  max-width: 720px;
  margin: 0 auto;
}
</style>
