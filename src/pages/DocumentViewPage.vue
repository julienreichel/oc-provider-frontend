<template>
  <q-page :aria-label="$t('a11y.documentViewPage')" class="flex flex-center">
    <!-- Skip link for screen readers -->
    <a href="#main-content" class="sr-only sr-only-focusable" :aria-label="$t('a11y.skipToMain')">
      {{ $t('a11y.skipToMain') }}
    </a>

    <div class="q-pa-md" style="max-width: 800px; width: 100%">
      <!-- Navigation landmark -->
      <nav :aria-label="$t('a11y.documentNavigation')" class="q-mb-lg">
        <q-btn
          :to="{ name: 'access' }"
          color="primary"
          outline
          icon="arrow_back"
          :label="$t('document.backToHome')"
          :aria-label="$t('document.backToHome')"
          class="q-mb-md"
        />
      </nav>

      <main id="main-content" role="main">
        <!-- Loading State -->
        <div v-if="state.loading.value" role="status" :aria-label="$t('a11y.loading')">
          <LoadingState />
        </div>

        <!-- Error State -->
        <div
          v-else-if="state.error.value"
          role="alert"
          :aria-live="announcementMode"
          :aria-label="$t('a11y.errorRegion')"
        >
          <h1 class="sr-only">{{ $t('a11y.errorRegion') }}</h1>
          <ErrorState :error="state.error.value" @retry="handleRetry" />
        </div>

        <!-- Success State -->
        <div v-else-if="state.data.value" :aria-label="$t('a11y.documentContent')">
          <h1 :id="documentTitleId" class="sr-only">
            {{ $t('document.title') }} {{ state.data.value.title || 'Document' }}
          </h1>
          <DocumentViewer :document="state.data.value" :aria-labelledby="documentTitleId" />
        </div>

        <!-- Empty State (when no data but no error) -->
        <div
          v-else
          role="status"
          :aria-live="announcementMode"
          :aria-label="$t('a11y.emptyDocumentState')"
        >
          <div class="text-center q-py-xl">
            <q-icon name="description" size="4rem" color="grey-5" />
            <h2 class="text-h6 text-grey-7 q-mt-md q-mb-sm">
              {{ $t('document.empty') }}
            </h2>
            <q-btn
              :to="{ name: 'access' }"
              color="primary"
              :label="$t('document.backToHome')"
              class="q-mt-md"
            />
          </div>
        </div>
      </main>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useDocumentByCode } from 'src/composables/useDocumentByCode';
import DocumentViewer from 'src/components/DocumentViewer.vue';
import LoadingState from 'src/components/LoadingState.vue';
import ErrorState from 'src/components/ErrorState.vue';

const route = useRoute();
const { state, load, reload } = useDocumentByCode();

const accessCode = route.params.code as string;

// Generate unique IDs for accessibility
const documentTitleId = ref(`document-title-${Date.now()}`);

// Computed property for ARIA live region behavior
const announcementMode = computed(() => {
  // Use "assertive" for errors to interrupt screen readers
  if (state.error.value) return 'assertive';
  // Use "polite" for loading states to not interrupt
  return 'polite';
});

// Focus management
onMounted(async () => {
  if (accessCode) {
    await load(accessCode);

    // Focus management after load completes
    await nextTick();

    if (state.error.value) {
      // Focus on error message for screen readers
      const errorElement = document.querySelector('[role="alert"]');
      if (errorElement && 'focus' in errorElement) {
        (errorElement as HTMLElement).focus();
      }
    } else if (state.data.value) {
      // Focus on document title for successful load
      const titleElement = document.getElementById(documentTitleId.value);
      if (titleElement) {
        titleElement.focus();
      }
    }
  }
});

const handleRetry = async (): Promise<void> => {
  await reload();

  // Focus management after retry
  await nextTick();

  if (state.error.value) {
    const errorElement = document.querySelector('[role="alert"]');
    if (errorElement && 'focus' in errorElement) {
      (errorElement as HTMLElement).focus();
    }
  } else if (state.data.value) {
    const titleElement = document.getElementById(documentTitleId.value);
    if (titleElement) {
      titleElement.focus();
    }
  }
};
</script>

<style scoped>
/* Screen reader only content */
.sr-only {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

/* Show skip link when focused */
.sr-only-focusable:focus {
  position: static !important;
  width: auto !important;
  height: auto !important;
  padding: 0.5rem 1rem !important;
  margin: 0 !important;
  overflow: visible !important;
  clip: auto !important;
  white-space: normal !important;
  background-color: var(--q-primary) !important;
  color: white !important;
  text-decoration: none !important;
  z-index: 1000 !important;
}

/* Make sr-only headings focusable for screen readers */
.sr-only:focus {
  position: static !important;
  width: auto !important;
  height: auto !important;
  padding: 0.25rem !important;
  margin: 0 !important;
  overflow: visible !important;
  clip: auto !important;
  white-space: normal !important;
}
</style>
