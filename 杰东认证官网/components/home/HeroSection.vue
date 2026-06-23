<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { HeroAction, HeroCard, HeroStat } from '~/data/home';

defineProps<{
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    image: string;
    primaryAction: HeroAction;
    secondaryAction: HeroAction;
    cards: HeroCard[];
    stats: HeroStat[];
  };
}>();
</script>

<template>
  <section id="top" class="relative overflow-hidden bg-gradient-to-br from-white via-brand-mist to-brand-soft">
    <div class="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,rgba(19,131,111,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,131,111,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
    <div class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-primary via-brand-accent to-brand-primary" />

    <div class="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:px-8 lg:py-20">
      <div>
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.26em] text-brand-primary">{{ hero.eyebrow }}</p>
        <h1 class="max-w-3xl text-4xl font-bold leading-tight text-brand-ink sm:text-5xl lg:text-6xl">
          {{ hero.title }}
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {{ hero.description }}
        </p>

        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <NuxtLink :to="hero.primaryAction.href" class="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-deep">
            {{ hero.primaryAction.label }}
            <MaterialIcon name="arrow_forward" class="text-[18px]" />
          </NuxtLink>
          <NuxtLink :to="hero.secondaryAction.href" class="inline-flex items-center justify-center rounded-md border border-brand-primary/25 bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-soft">
            {{ hero.secondaryAction.label }}
          </NuxtLink>
        </div>

        <dl class="mt-12 grid max-w-xl grid-cols-3 gap-4">
          <div v-for="stat in hero.stats" :key="stat.label" class="rounded-lg border border-white bg-white/78 p-4 shadow-sm">
            <dt class="text-2xl font-bold text-brand-primary">{{ stat.value }}</dt>
            <dd class="mt-1 text-xs text-slate-500 sm:text-sm">{{ stat.label }}</dd>
          </div>
        </dl>
      </div>

      <div>
        <div class="relative overflow-hidden rounded-lg border border-white bg-white shadow-soft">
          <img :src="hero.image" alt="杰东认证医药健康合规服务视觉图" class="aspect-[4/3] w-full object-cover" width="900" height="675">
          <div class="absolute inset-x-5 bottom-5 grid gap-3 sm:grid-cols-2">
            <div v-for="card in hero.cards" :key="card.title" class="rounded-md border border-white/70 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div class="flex items-center gap-3">
                <span class="flex size-9 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
                  <MaterialIcon :name="card.icon" class="text-[20px]" />
                </span>
                <h2 class="text-sm font-semibold text-brand-ink">{{ card.title }}</h2>
              </div>
              <p class="mt-2 text-xs leading-5 text-slate-600">{{ card.summary }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
