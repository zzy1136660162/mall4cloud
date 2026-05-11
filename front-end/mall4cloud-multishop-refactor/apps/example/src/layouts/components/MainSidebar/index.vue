<script setup lang="ts">
import { useHotkeyBindings } from '@/hotkeys/useHotkeys'
import { useSlots } from '@/slots'
import Logo from '../Logo/index.vue'

defineOptions({
  name: 'MainSidebar',
})

defineProps<{
  enable: boolean
}>()

const appSettingsStore = useAppSettingsStore()
const appMenuStore = useAppMenuStore()

const { generateTitle, switchTo } = useAppMenu()

useHotkeyBindings({
  'menu.next': () => {
    switchTo(appMenuStore.actived + 1 < appMenuStore.allMenus.length ? appMenuStore.actived + 1 : 0)
  },
  'menu.prev': () => {
    switchTo(appMenuStore.actived - 1 >= 0 ? appMenuStore.actived - 1 : appMenuStore.allMenus.length - 1)
  },
})
</script>

<template>
  <Transition name="main-sidebar">
    <div v-if="enable" class="main-sidebar-container">
      <Component :is="useSlots('main-sidebar-top')" />
      <Logo :show-title="false" class="sidebar-logo" />
      <Component :is="useSlots('main-sidebar-after-logo')" />
      <FaScrollArea :scrollbar="false" mask class="menu overscroll-contain flex-1">
        <div
          v-if="appSettingsStore.settings.menu.mode === 'side' || (appSettingsStore.mode === 'mobile' && appSettingsStore.settings.menu.mode !== 'single')" class="py-1 flex flex-col w-full transition-all of-hidden -mt-2"
        >
          <template v-for="(item, index) in appMenuStore.allMenus" :key="index">
            <div
              class="menu-item relative transition-all" :class="{
                active: index === appMenuStore.actived,
              }"
            >
              <FaTooltip :disabled="!generateTitle(item.meta?.title)" :text="generateTitle(item.meta?.title)" side="right">
                <div
                  class="group menu-item-container relative h-full w-full min-w-0 flex items-center justify-between gap-1 rounded-lg cursor-pointer transition-colors text-[var(--g-sub-sidebar-menu-color)] hover-(bg-[var(--g-sub-sidebar-menu-hover-bg)] text-[var(--g-sub-sidebar-menu-hover-color)]) px-4 py-3!" :class="{
                    'text-[var(--g-sub-sidebar-menu-active-color)]! bg-[var(--g-sub-sidebar-menu-active-bg)]!': index === appMenuStore.actived,
                  }" @click="switchTo(index)"
                >
                  <div class="inline-flex min-w-0 flex-1 items-center justify-start gap-3">
                    <FaIcon v-if="item.meta?.icon" :name="item.meta.icon" class="menu-item-container-icon size-5 transition-transform group-hover-scale-120" />
                    <span class="block min-w-0 flex-1 truncate text-sm">
                      {{ generateTitle(item.meta?.title) }}
                    </span>
                  </div>
                </div>
              </FaTooltip>
            </div>
          </template>
        </div>
      </FaScrollArea>
      <Component :is="useSlots('main-sidebar-after-menu')" />
      <div class="px-4 py-3 flex-center">
        <AppAccountButton only-avatar :button-variant="appSettingsStore.settings.menu.mode === 'side' ? 'secondary' : 'ghost'" class="p-2 size-12" />
      </div>
      <Component :is="useSlots('main-sidebar-bottom')" />
    </div>
  </Transition>
</template>

<style scoped>
.main-sidebar-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: var(--g-main-sidebar-width);
  color: var(--g-main-sidebar-menu-color);
  background-color: var(--g-main-sidebar-bg);
  box-shadow: 1px 0 0 0 oklch(var(--border));
  transition: color 0.15s, background-color 0.15s, box-shadow 0.15s;

  .sidebar-logo {
    background-color: var(--g-main-sidebar-bg);
    transition: background-color 0.15s;
  }

  .menu {
    :deep(.menu-item) {
      .menu-item-container {
        color: var(--g-sub-sidebar-menu-color);

        &:hover {
          color: var(--g-sub-sidebar-menu-hover-color);
          background-color: var(--g-sub-sidebar-menu-hover-bg);
        }

        .menu-item-container-icon {
          flex-shrink: 0;
        }
      }

      &.active .menu-item-container {
        color: var(--g-sub-sidebar-menu-active-color) !important;
        background-color: var(--g-sub-sidebar-menu-active-bg) !important;
      }
    }
  }
}

/* 主侧边栏动画 */
.main-sidebar-enter-active,
.main-sidebar-leave-active {
  transition: 0.3s;
}

.main-sidebar-enter-from,
.main-sidebar-leave-to {
  transform: translateX(calc(var(--g-main-sidebar-width) * -1));
}
</style>
