<template>
  <main class="not-found-page" aria-labelledby="not-found-heading" role="main">
    <div class="text-center q-pa-xl">
      <h1 id="not-found-heading" class="text-h5 q-mb-md">
        {{ $t('notFound.title') }}
      </h1>
      <p class="text-body1 text-grey-7 q-mb-lg">
        {{ $t('notFound.message') }}
      </p>
      <q-btn
        color="primary"
        :label="$t('notFound.ctaHome')"
        :to="{ name: 'dashboard' }"
        data-cy="not-found-home"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
//
</script>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
