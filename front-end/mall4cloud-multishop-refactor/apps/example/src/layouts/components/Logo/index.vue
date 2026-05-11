<script setup lang="ts">
defineOptions({
  name: 'Logo',
})

withDefaults(
  defineProps<{
    showLogo?: boolean
    showTitle?: boolean
  }>(),
  {
    showLogo: false,
    showTitle: true,
  },
)

const appSettingsStore = useAppSettingsStore()

const title = ref(import.meta.env.VITE_APP_TITLE)

const to = computed(() => appSettingsStore.settings.app.home.enable ? appSettingsStore.settings.app.home.fullPath : '')
</script>

<template>
  <RouterLink :to class="text-primary px-3 no-underline flex-center gap-2 h-[var(--g-sidebar-logo-height)] w-inherit" :class="{ 'cursor-default': !appSettingsStore.settings.app.home.enable }" :title="title">
    <span v-if="showTitle" class="font-bold block truncate">{{ title }}</span>
  </RouterLink>
</template>
