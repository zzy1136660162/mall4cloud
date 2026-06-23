<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { AdvantageItem } from '~/data/home';

defineProps<{ advantages: AdvantageItem[] }>();
</script>

<template>
  <section id="about" class="bg-brand-mist py-20">
    <div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Why Jiedong</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">以专业流程降低申报沟通成本</h2>
        <p class="mt-5 leading-8 text-slate-600">杰东认证以资料、路径、政策和节点为核心，帮助企业把复杂的健康产品准入工作拆解成可推进的步骤。</p>
        <img src="/images/certification-grid.svg" alt="" class="mt-8 hidden w-full rounded-lg border border-white shadow-card lg:block" width="920" height="640">
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <article v-for="item in advantages" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
          <span class="flex size-12 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
            <MaterialIcon :name="item.icon" class="text-[26px]" />
          </span>
          <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
