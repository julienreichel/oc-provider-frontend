<template>
  <q-page padding class="not-found-page">
    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <main role="main" class="text-center q-gutter-y-lg">
          <!-- Title -->
          <div>
            <h1 class="text-h3 text-weight-light q-mb-md">
              {{ $t('notFound.title') }}
            </h1>
          </div>

          <!-- Message -->
          <div>
            <p class="text-h6 text-weight-regular text-grey-7">
              {{ $t('notFound.message') }}
            </p>
          </div>

          <!-- Home Button -->
          <div class="q-mt-xl">
            <q-btn
              :to="{ name: 'access' }"
              color="primary"
              size="lg"
              unelevated
              :label="$t('notFound.ctaHome')"
              data-cy="home-link"
              class="q-px-xl"
            />
          </div>
        </main>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
// No specific logic needed for static 404 page
</script>

<style lang="scss" scoped>
.not-found-page {
  min-height: 60vh;

  h1 {
    color: #424242; // grey-8 equivalent
  }

  .q-btn {
    min-width: 160px;
  }
}
</style>
