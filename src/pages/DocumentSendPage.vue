<template>
  <section class="document-send-page" aria-labelledby="document-send-heading">
    <header class="q-mb-lg">
      <h1 id="document-send-heading" class="text-h5 q-mb-xs">
        {{ $t('documentSend.title') }}
      </h1>
      <p class="text-body2 text-grey-7">
        {{ $t('documentSend.subtitle', { id: route.params.id }) }}
      </p>
    </header>

    <div v-if="!accessCode" class="q-mt-xl">
      <ErrorState
        :error="{ code: 'INVALID', message: $t('documentSend.missingCode') }"
        @retry="handleBack"
        :aria-label="$t('a11y.sendErrorState')"
      />
    </div>
    <SendResultPanel v-else :access-code="accessCode" />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SendResultPanel from 'src/components/SendResultPanel.vue';
import ErrorState from 'src/components/ErrorState.vue';

const route = useRoute();
const router = useRouter();

const accessCode = computed(() => {
  const fromQuery = route.query.code;
  if (typeof fromQuery === 'string' && fromQuery.length > 0) {
    return fromQuery;
  }
  return null;
});

const handleBack = (): void => {
  void router.push({ name: 'dashboard' });
};
</script>

<style scoped>
.document-send-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
