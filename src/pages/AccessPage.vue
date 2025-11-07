<template>
  <q-page padding :aria-label="$t('a11y.accessPage')">
    <!-- Skip link for screen readers -->
    <a href="#main-content" class="sr-only sr-only-focusable" :aria-label="$t('a11y.skipToMain')">
      {{ $t('a11y.skipToMain') }}
    </a>

    <div class="row justify-center">
      <div class="col-12 col-sm-8 col-md-6 col-lg-4">
        <q-card class="q-pa-lg">
          <q-card-section>
            <main id="main-content" role="main">
              <h1 class="text-h5 text-center q-mb-md" :aria-label="$t('a11y.accessPageTitle')">
                {{ $t('access.title') }}
              </h1>

              <p class="text-body2 text-center text-grey-7 q-mb-lg">
                {{ $t('access.instructions') }}
              </p>

              <form @submit.prevent="handleSubmit" :aria-label="$t('a11y.accessForm')" novalidate>
                <div class="q-mb-md">
                  <label
                    :for="inputId"
                    class="text-body2 q-mb-sm block"
                    :class="{ 'text-negative': showError }"
                  >
                    {{ $t('access.label') }}
                    <span aria-hidden="true">*</span>
                  </label>

                  <q-input
                    :id="inputId"
                    v-model="form.code.value"
                    :placeholder="$t('access.placeholder')"
                    :error="showError"
                    :error-message="showError ? $t('access.validation.required') : undefined"
                    :aria-describedby="showError ? errorId : instructionId"
                    :aria-invalid="showError"
                    :aria-label="$t('a11y.accessInputField')"
                    aria-required="true"
                    outlined
                    class="q-mb-sm"
                    @keydown.enter="handleSubmit"
                  />

                  <!-- Instructions for screen readers -->
                  <div :id="instructionId" class="sr-only" aria-live="polite">
                    {{ $t('access.instructions') }}
                  </div>

                  <!-- Error message with proper ARIA -->
                  <div
                    v-if="showError"
                    :id="errorId"
                    class="text-negative text-caption q-mt-xs"
                    role="alert"
                    aria-live="assertive"
                    :aria-label="$t('a11y.accessInputError')"
                  >
                    {{ $t('access.validation.required') }}
                  </div>
                </div>

                <div class="row justify-center">
                  <q-btn
                    type="submit"
                    color="primary"
                    :label="$t('access.submit')"
                    :aria-label="$t('a11y.accessSubmitButton')"
                    :aria-describedby="showError ? errorId : instructionId"
                    class="q-px-xl"
                  />
                </div>
              </form>
            </main>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAccessCodeForm } from '../composables/useAccessCodeForm';

const router = useRouter();
const form = useAccessCodeForm();

// Generate unique IDs for accessibility
const inputId = ref(`access-code-${Date.now()}`);
const errorId = ref(`access-error-${Date.now()}`);
const instructionId = ref(`access-instruction-${Date.now()}`);

// Computed property for error display
const showError = computed(() => !form.isValid.value && form.isValidated.value);

// Focus management
onMounted(() => {
  // Focus the input when the page loads for better UX
  const inputElement = document.getElementById(inputId.value);
  if (inputElement) {
    inputElement.focus();
  }
});

/**
 * Handles form submission
 * Validates the form and navigates to the view page if valid
 */
function handleSubmit(): void {
  const result = form.submit();

  if (result.valid) {
    // Navigate to the view page with the normalized code
    void router.push(`/view/${result.normalizedCode}`);
  }
  // If invalid, form.isValid will be false and error will be shown
}
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

/* Block display for label */
.block {
  display: block;
}
</style>
