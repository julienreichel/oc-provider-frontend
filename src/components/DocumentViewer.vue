<template>
  <div class="document-viewer">
    <!-- Document Header -->
    <div class="document-header q-mb-lg">
      <h1 class="text-h4 q-mb-md" :aria-label="$t('a11y.documentTitle')">
        {{ document.title }}
      </h1>

      <div class="text-caption text-grey-6" :aria-label="$t('a11y.documentMetadata')">
        {{ formattedCreatedAt }}
      </div>
    </div>

    <!-- Document Content -->
    <div class="document-content">
      <q-card flat class="q-pa-lg">
        <q-card-section>
          <pre class="document-text" :aria-label="$t('a11y.documentContent')">{{
            document.content
          }}</pre>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { PublicDocument } from 'src/models/PublicDocument';

interface Props {
  document: PublicDocument;
}

const props = defineProps<Props>();
const { t } = useI18n();

/**
 * Formats the ISO date string into a readable format
 */
const formattedCreatedAt = computed(() => {
  const date = new Date(props.document.createdAt);

  // Format as "January 15, 2024" using toLocaleDateString
  const formatted = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Use i18n template with the formatted date
  return t('document.createdAt', { date: formatted });
});
</script>

<style scoped>
.document-viewer {
  max-width: 800px;
  margin: 0 auto;
}

.document-header {
  text-align: center;
}

.document-text {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  padding: 0;
}

.document-content .q-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
