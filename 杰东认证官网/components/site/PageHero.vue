<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { PageHero } from '~/data/home';

defineProps<{ hero: PageHero }>();
</script>

<template>
  <section class="relative overflow-hidden bg-brand-deep text-white">
    <div class="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(120deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
    <div class="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

    <div class="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
      <div>
        <div class="inline-flex items-center gap-3 rounded-md border border-white/14 bg-white/8 px-4 py-2 text-sm font-semibold text-brand-accent">
          <MaterialIcon :name="hero.icon" class="text-[20px]" />
          {{ hero.eyebrow }}
        </div>
        <h1 class="mt-7 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">{{ hero.title }}</h1>
      </div>

      <div class="flex flex-col justify-end">
        <p class="max-w-2xl text-base leading-8 text-white/72 sm:text-lg">{{ hero.description }}</p>
        <dl v-if="hero.metrics?.length" class="mt-10 grid gap-3 sm:grid-cols-3">
          <div v-for="metric in hero.metrics" :key="metric.label" class="rounded-lg border border-white/12 bg-white/8 p-4">
            <dt class="text-2xl font-bold text-brand-accent">{{ metric.value }}</dt>
            <dd class="mt-1 text-sm text-white/62">{{ metric.label }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
