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
          :saving="busy"
          :show-send="showSendButton"
          :can-send="canSendDocument"
          :sending="sendBusy"
          :show-duplicate="showDuplicateButton"
          :duplicate-loading="duplicateBusy"
          :duplicate-disabled="duplicateBusy"
          @save="handleSave"
          @close="handleClose"
          @send="openSendDialog"
          @duplicate="handleDuplicate"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <DocumentEditor
          :title="form.title"
          :content="form.content"
          :status="form.status"
          :disabled="disableEditor"
          :errors="{ title: titleError, content: contentError }"
          @update:title="(value) => (form.title = value)"
          @update:content="(value) => (form.content = value)"
          @update:status="(value) => (form.status = value)"
        />
      </q-card-section>

      <q-separator v-if="!isNewDocument && documentDoc" />

      <q-card-section v-if="!isNewDocument && documentDoc">
        <q-banner
          v-if="showDuplicateButton"
          class="bg-blue-1 text-blue-10 q-mb-md"
          data-cy="document-locked-banner"
        >
          {{ $t('documentEdit.lockedMessage') }}
        </q-banner>
        <DocumentMetadataPanel :doc="documentDoc" />
      </q-card-section>
    </q-card>

    <SendDialog
      v-if="showSendButton"
      :model-value="sendDialogOpen"
      :status="documentDoc?.status ?? null"
      :loading="sendBusy"
      :error="sendError"
      @update:model-value="(value) => (sendDialogOpen = value)"
      @confirm="handleSendConfirm"
      @cancel="closeSendDialog"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';
import LoadingState from 'components/LoadingState.vue';
import ErrorState from 'components/ErrorState.vue';
import DocumentEditor from 'components/DocumentEditor.vue';
import DocumentToolbar from 'components/DocumentToolbar.vue';
import DocumentMetadataPanel from 'components/DocumentMetadataPanel.vue';
import SendDialog from 'components/SendDialog.vue';
import type { Document, DocumentStatus, DocumentUpdate } from 'src/models/Document';
import type { ApiError } from 'src/models/ApiError';
import { useDocument } from 'src/composables/useDocument';
import { useCreateDocument } from 'src/composables/useCreateDocument';
import { useSendDocument } from 'src/composables/useSendDocument';

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
const sendComposable = useSendDocument();
const sendDialogOpen = ref(false);

const setupDocumentComposable = (id: string | null): void => {
  documentComposable.value = id ? useDocument(id) : null;
  if (id) {
    void documentComposable.value?.load();
  } else {
    // Ensure form is clean for new document
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
const hasAccessCode = computed(() => Boolean(documentDoc.value?.accessCode));
const documentLoading = computed(() => documentComposable.value?.loading.value ?? false);
const documentError = computed<ApiError | null>(
  () => documentComposable.value?.error.value ?? null,
);

const currentError = computed<ApiError | null>(() =>
  isNewDocument.value ? createComposable.error.value : documentError.value,
);

const sendError = computed<ApiError | null>(() => sendComposable.error.value);

const busy = computed(() =>
  isNewDocument.value ? createComposable.creating.value : documentLoading.value,
);

const sendBusy = computed(() => sendComposable.sending.value);

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

const canSave = computed(
  () => formValid.value && isDirty.value && !busy.value && !hasAccessCode.value,
);

const showSendButton = computed(() => !isNewDocument.value && !hasAccessCode.value);

const canSendDocument = computed(() =>
  Boolean(
    !isNewDocument.value &&
      !hasAccessCode.value &&
      documentDoc.value?.status === 'final' &&
      !sendBusy.value,
  ),
);

const showDuplicateButton = computed(() => !isNewDocument.value && hasAccessCode.value);
const duplicateBusy = computed(() => createComposable.creating.value);
const disableEditor = computed(
  () => busy.value || (hasAccessCode.value && !isNewDocument.value),
);

const resetForm = (doc?: Document): void => {
  form.title = doc?.title ?? '';
  form.content = doc?.content ?? '';
  form.status = doc?.status ?? 'draft';
  
  // Clear any existing errors when resetting form
  if (!doc && createComposable.error.value) {
    createComposable.error.value = null;
  }
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

const openSendDialog = (): void => {
  if (!showSendButton.value) {
    return;
  }
  sendDialogOpen.value = true;
};

const closeSendDialog = (): void => {
  sendDialogOpen.value = false;
};

const handleSendConfirm = async (): Promise<void> => {
  const doc = documentDoc.value;
  if (!doc) {
    return;
  }

  const result = await sendComposable.send(doc.id);
  if (result) {
    sendDialogOpen.value = false;
    $q.notify({
      type: 'positive',
      message: t('documentSend.toast.sent'),
    });
    await router.push({
      name: 'document-send',
      params: { id: doc.id },
      query: { code: result.accessCode },
    });
  }
};

const handleDuplicate = async (): Promise<void> => {
  const doc = documentDoc.value;
  if (!doc) {
    return;
  }

  const payload = {
    title: `${doc.title} ${t('documentEdit.duplicateSuffix')}`,
    content: doc.content,
    status: 'draft' as DocumentStatus,
  };

  const newId = await createComposable.create(payload);
  if (newId) {
    $q.notify({
      type: 'positive',
      message: t('documentEdit.toast.duplicated'),
    });
    await router.replace({ name: 'document-edit', params: { id: newId } });
  }
};
</script>

<style scoped>
.document-edit-page {
  max-width: 960px;
  margin: 0 auto;
}
</style>
