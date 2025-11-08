<template>
  <section class="document-edit-page" aria-labelledby="document-edit-heading">
    <header class="q-mb-lg">
      <h1 id="document-edit-heading" class="text-h5 q-mb-xs">
        {{ $t('documentEdit.title') }}
      </h1>
      <p class="text-body2 text-grey-7">
        {{
          isNewDocument
            ? $t('documentEdit.subtitleNew')
            : $t('documentEdit.subtitle', { id: route.params.id })
        }}
      </p>
    </header>

    <div v-if="showInitialLoading" class="q-my-xl">
      <LoadingState />
    </div>

    <ErrorState
      v-else-if="currentError"
      :error="currentError"
      @retry="handleRetry"
      class="q-my-xl"
      :aria-label="$t('a11y.documentErrorState')"
    />

    <q-card v-else flat bordered>
      <q-card-section class="row items-center justify-between">
        <DocumentToolbar
          :is-new="isNewDocument"
          :can-save="canSave"
          :loading="busy"
          @save="handleSave"
          @close="handleClose"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <DocumentEditor
          :title="form.title"
          :content="form.content"
          :status="form.status"
          :disabled="busy"
          :errors="{ title: titleError, content: contentError }"
          @update:title="(value) => (form.title = value)"
          @update:content="(value) => (form.content = value)"
          @update:status="(value) => (form.status = value)"
        />
      </q-card-section>

      <q-separator v-if="!isNewDocument && documentDoc" />

      <q-card-section v-if="!isNewDocument && documentDoc">
        <DocumentMetadataPanel :doc="documentDoc" />
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import LoadingState from 'components/LoadingState.vue';
import ErrorState from 'components/ErrorState.vue';
import DocumentEditor from 'components/DocumentEditor.vue';
import DocumentToolbar from 'components/DocumentToolbar.vue';
import DocumentMetadataPanel from 'components/DocumentMetadataPanel.vue';
import type { Document, DocumentStatus, DocumentUpdate } from 'src/models/Document';
import type { ApiError } from 'src/models/ApiError';
import { useDocument } from 'src/composables/useDocument';
import { useCreateDocument } from 'src/composables/useCreateDocument';

interface FormState {
  title: string;
  content: string;
  status: DocumentStatus;
}

const route = useRoute();
const router = useRouter();
const { t } = useI18n();
const $q = useQuasar();

const form = reactive<FormState>({
  title: '',
  content: '',
  status: 'draft',
});

const createComposable = useCreateDocument();
const documentComposable = shallowRef<ReturnType<typeof useDocument> | null>(null);

const setupDocumentComposable = (id: string | null): void => {
  documentComposable.value = id ? useDocument(id) : null;
  if (id) {
    void documentComposable.value?.load();
  } else {
    resetForm();
  }
};

watch(
  () => route.params.id,
  (param) => {
    const id = typeof param === 'string' ? param : '';
    if (!id || id === 'new') {
      setupDocumentComposable(null);
    } else {
      setupDocumentComposable(id);
    }
  },
  { immediate: true },
);

watch(
  () => documentComposable.value?.doc.value,
  (doc) => {
    if (doc) {
      resetForm(doc);
    }
  },
  { immediate: true },
);

const isNewDocument = computed(() => String(route.params.id ?? 'new') === 'new');
const documentDoc = computed<Document | null>(() => documentComposable.value?.doc.value ?? null);
const documentLoading = computed(() => documentComposable.value?.loading.value ?? false);
const documentError = computed<ApiError | null>(
  () => documentComposable.value?.error.value ?? null,
);

const currentError = computed<ApiError | null>(() =>
  isNewDocument.value ? createComposable.error.value : documentError.value,
);

const busy = computed(() =>
  isNewDocument.value ? createComposable.creating.value : documentLoading.value,
);

const showInitialLoading = computed(
  () => !isNewDocument.value && !documentDoc.value && documentLoading.value,
);

const titleError = computed(() => (form.title.trim() ? '' : t('documentEdit.validation.title')));
const contentError = computed(() =>
  form.content.trim() ? '' : t('documentEdit.validation.content'),
);

const formValid = computed(() => !titleError.value && !contentError.value);

const isDirty = computed(() => {
  if (isNewDocument.value) {
    return form.title.trim().length > 0 || form.content.trim().length > 0;
  }

  const doc = documentDoc.value;
  if (!doc) {
    return false;
  }

  return form.title !== doc.title || form.content !== doc.content || form.status !== doc.status;
});

const canSave = computed(() => formValid.value && isDirty.value && !busy.value);

const resetForm = (doc?: Document): void => {
  form.title = doc?.title ?? '';
  form.content = doc?.content ?? '';
  form.status = doc?.status ?? 'draft';
};

const handleSave = async (): Promise<void> => {
  if (!canSave.value) {
    return;
  }

  if (isNewDocument.value) {
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      status: form.status,
    };
    const newId = await createComposable.create(payload);
    if (newId) {
      $q.notify({
        type: 'positive',
        message: t('documentEdit.toast.created'),
      });
      await router.replace({ name: 'document-edit', params: { id: newId } });
    }
    return;
  }

  const doc = documentDoc.value;
  if (!doc) {
    return;
  }

  const patch: DocumentUpdate = {};
  if (form.title !== doc.title) {
    patch.title = form.title.trim();
  }
  if (form.content !== doc.content) {
    patch.content = form.content.trim();
  }
  if (form.status !== doc.status) {
    patch.status = form.status;
  }

  if (Object.keys(patch).length === 0) {
    return;
  }

  await documentComposable.value?.save(patch);
  $q.notify({
    type: 'positive',
    message: t('documentEdit.toast.saved'),
  });
};

const handleClose = (): void => {
  void router.push({ name: 'dashboard' });
};

const handleRetry = (): void => {
  if (documentComposable.value) {
    void documentComposable.value.load();
  }
};
</script>

<style scoped>
.document-edit-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
