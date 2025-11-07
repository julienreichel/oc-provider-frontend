<template>
  <q-layout view="lHh Lpr lFf" class="main-layout" :aria-label="$t('a11y.mainLayout')">
    <a class="skip-link" href="#main-content" :aria-label="$t('a11y.skipToContent')">
      {{ $t('layout.skipToContent') }}
    </a>

    <HeaderBar @toggle-drawer="toggleDrawer" :aria-label="$t('a11y.headerBar')" />

    <q-drawer
      v-model="drawerOpen"
      show-if-above
      class="bg-grey-1"
      :width="240"
      :aria-label="$t('a11y.workspaceNavigation')"
      role="navigation"
    >
      <SidebarNav />
    </q-drawer>

    <q-page-container>
      <PageContainer :aria-label="$t('a11y.pageContainer')">
        <main
          id="main-content"
          tabindex="-1"
          class="main-layout__content"
          :aria-label="$t('a11y.mainContent')"
        >
          <router-view />
        </main>
      </PageContainer>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import HeaderBar from 'components/HeaderBar.vue';
import SidebarNav from 'components/SidebarNav.vue';
import PageContainer from 'components/PageContainer.vue';

const drawerOpen = ref(true);
const $q = useQuasar();

watch(
  () => $q.screen.lt.md,
  (isSmall) => {
    drawerOpen.value = !isSmall;
  },
  { immediate: true },
);

const toggleDrawer = (): void => {
  drawerOpen.value = !drawerOpen.value;
};
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 16px;
  padding: 8px 12px;
  background: #027be3;
  color: white;
  border-radius: 4px;
  z-index: 1000;
}

.skip-link:focus {
  top: 16px;
}

.main-layout__content {
  outline: none;
}
</style>
