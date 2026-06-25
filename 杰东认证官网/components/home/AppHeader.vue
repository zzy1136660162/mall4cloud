<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { siteNav } from '~/data/home';

const route = useRoute();
const isOpen = ref(false);

const isActive = (href: string) => (href === '/' ? route.path === '/' : route.path.startsWith(href));

watch(
  () => route.path,
  () => {
    isOpen.value = false;
  }
);
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/92 backdrop-blur-xl">
    <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-3" aria-label="杰东认证首页">
        <img src="/images/brand-mark.svg" alt="" class="size-11 rounded-lg" width="44" height="44">
        <span>
          <span class="block text-lg font-semibold tracking-wide text-brand-ink">杰东认证</span>
          <span class="block text-xs uppercase tracking-[0.2em] text-slate-400">Certification Service</span>
        </span>
      </NuxtLink>

      <nav class="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex" aria-label="主导航">
        <NuxtLink
          v-for="item in siteNav"
          :key="item.href"
          :to="item.href"
          class="transition hover:text-brand-primary"
          :class="isActive(item.href) ? 'text-brand-primary' : ''"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <NuxtLink
        to="/contact"
        class="hidden items-center gap-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep lg:inline-flex"
      >
        <MaterialIcon name="call" class="text-[18px]" />
        立即咨询
      </NuxtLink>

      <button
        class="inline-flex size-11 items-center justify-center rounded-md border border-slate-200 text-brand-ink lg:hidden"
        type="button"
        aria-label="切换导航菜单"
        @click="isOpen = !isOpen"
      >
        <MaterialIcon :name="isOpen ? 'close' : 'menu'" class="text-[24px]" />
      </button>
    </div>

    <div v-if="isOpen" class="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
      <nav class="mx-auto grid max-w-7xl gap-2 text-sm font-medium text-slate-700" aria-label="移动端导航">
        <NuxtLink
          v-for="item in siteNav"
          :key="item.href"
          :to="item.href"
          class="rounded-md px-3 py-2 transition hover:bg-brand-soft hover:text-brand-primary"
          :class="isActive(item.href) ? 'bg-brand-soft text-brand-primary' : ''"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
