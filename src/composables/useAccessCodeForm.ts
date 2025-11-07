import { ref, computed } from 'vue';

export interface SubmitResult {
  valid: boolean;
  normalizedCode: string;
}

/**
 * Composable for managing access code form state and validation
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useAccessCodeForm() {
  // Reactive state
  const code = ref('');
  const isValidated = ref(false);

  // Computed validation state
  const isValid = computed(() => {
    if (!isValidated.value) return true; // Not validated yet
    return code.value.trim().length > 0;
  });

  /**
   * Validates the form and returns submission result
   */
  function submit(): SubmitResult {
    isValidated.value = true;

    const normalizedCode = code.value.trim();
    const valid = normalizedCode.length > 0;

    return {
      valid,
      normalizedCode: valid ? normalizedCode : '',
    };
  }

  /**
   * Resets the form to initial state
   */
  function reset(): void {
    code.value = '';
    isValidated.value = false;
  }

  return {
    // State
    code,
    isValidated,
    isValid,

    // Actions
    submit,
    reset,
  } as const;
}
