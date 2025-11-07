<template>
  <div class="loading-state">
    <div class="row justify-center q-my-xl">
      <div class="col-auto text-center">
        <!-- Loading Spinner -->
        <q-spinner-dots
          color="primary"
          size="3em"
          role="status"
          :aria-label="$t('a11y.loadingSpinner')"
        />

        <!-- Loading Text -->
        <div
          class="q-mt-md text-body2 text-grey-6"
          :aria-label="$t('a11y.loadingMessage')"
          role="status"
        >
          {{ $t('document.loading') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple loading state component - no props needed
</script>

<style scoped>
.loading-state {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
