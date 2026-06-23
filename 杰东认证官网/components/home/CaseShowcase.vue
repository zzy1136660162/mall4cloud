<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { CaseItem } from '~/data/home';

defineProps<{ cases: CaseItem[] }>();
</script>

<template>
  <section id="cases" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Cases</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">服务成果示例</h2>
        <p class="mt-4 leading-8 text-slate-600">以服务类型、过程节点和交付内容呈现项目协作方式，帮助企业理解不同申报方向的服务重点。</p>
      </div>

      <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="item in cases" :key="item.title" class="rounded-lg border border-slate-100 p-6 transition hover:border-brand-line hover:shadow-card">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-semibold text-brand-primary">{{ item.type }}</span>
            <span class="rounded-md bg-brand-soft px-2.5 py-1 text-xs text-brand-primary">{{ item.status }}</span>
          </div>
          <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
          <div class="mt-6 flex size-10 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
            <MaterialIcon name="workspace_premium" class="text-[22px]" />
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
