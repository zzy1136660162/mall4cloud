<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { NewsItem } from '~/data/home';

defineProps<{ news: NewsItem[] }>();
</script>

<template>
  <section id="news" class="bg-brand-mist py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Insights</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">政策资讯</h2>
          <p class="mt-4 leading-8 text-slate-600">以政策法规、行业动态和申报知识为线索，帮助企业持续了解健康产品合规要求。</p>
        </div>
        <NuxtLink to="/news" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-primary">
          查看更多资讯
          <MaterialIcon name="arrow_forward" class="text-[18px]" />
        </NuxtLink>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <article v-for="item in news" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <span class="rounded-md bg-brand-soft px-3 py-1 font-medium text-brand-primary">{{ item.category }}</span>
            <span class="inline-flex items-center gap-2 text-slate-500">
              <MaterialIcon name="calendar_month" class="text-[18px]" />
              {{ item.date }}
            </span>
          </div>
          <h3 class="mt-5 text-xl font-semibold text-brand-ink">{{ item.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
