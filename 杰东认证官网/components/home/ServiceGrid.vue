<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { ServiceItem } from '~/data/home';

defineProps<{ services: ServiceItem[] }>();
</script>

<template>
  <section id="services" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Service Fields</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">服务领域</h2>
        <p class="mt-4 leading-8 text-slate-600">围绕消字号、保健用品号、健字号代办及 OEM、ODM 代加工需求，建立清晰的服务分类。</p>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article v-for="service in services" :key="service.title" class="group rounded-lg border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
          <div class="flex items-start justify-between gap-4">
            <span class="flex size-12 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
              <MaterialIcon :name="service.icon" class="text-[26px]" />
            </span>
            <NuxtLink :to="`/services#${service.slug}`" class="text-brand-primary transition group-hover:translate-x-1 group-hover:-translate-y-1" :aria-label="`查看${service.title}`">
              <MaterialIcon name="arrow_outward" class="text-[20px]" />
            </NuxtLink>
          </div>
          <h3 class="mt-6 text-xl font-semibold text-brand-ink">{{ service.title }}</h3>
          <p class="mt-4 min-h-20 leading-7 text-slate-600">{{ service.summary }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span v-for="tag in service.tags" :key="tag" class="rounded-md bg-brand-soft px-3 py-1 text-xs font-medium text-brand-primary">{{ tag }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
