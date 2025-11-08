<template>
  <nav class="sidebar-nav" v-bind="$attrs">
    <q-list padding>
      <q-item-label header class="text-grey-7 text-uppercase text-caption">
        {{ $t('navigation.title') }}
      </q-item-label>

      <q-item
        v-for="item in navItems"
        :key="item.labelKey"
        clickable
        :to="item.to"
        :exact="item.exact ?? true"
        :aria-current="isActive(item) ? 'page' : undefined"
        :aria-label="$t(item.ariaLabelKey)"
        :class="{ 'sidebar-nav__item--active': isActive(item) }"
        tabindex="0"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" />
        </q-item-section>
        <q-item-section>
          {{ $t(item.labelKey) }}
        </q-item-section>
      </q-item>
    </q-list>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

interface NavItem {
  labelKey: string;
  ariaLabelKey: string;
  icon: string;
  to: RouteLocationRaw;
  matches: string[];
  exact?: boolean;
}

const navItems: NavItem[] = [
  {
    labelKey: 'navigation.dashboard',
    ariaLabelKey: 'a11y.dashboardLink',
    icon: 'space_dashboard',
    to: { name: 'dashboard' },
    matches: ['dashboard'],
  },
  {
    labelKey: 'navigation.settings',
    ariaLabelKey: 'a11y.settingsLink',
    icon: 'settings',
    to: { name: 'settings' },
    matches: ['settings'],
  },
];

const route = useRoute();

const isActive = (item: NavItem): boolean => {
  const currentName = route.name ? String(route.name) : '';
  return item.matches.includes(currentName);
};

defineOptions({
  inheritAttrs: false,
});
</script>

<style scoped>
.sidebar-nav {
  height: 100%;
  overflow-y: auto;
}

.sidebar-nav__item--active {
  background-color: rgba(2, 123, 227, 0.12);
  font-weight: 600;
}
</style>
