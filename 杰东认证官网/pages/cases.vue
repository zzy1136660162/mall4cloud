<script setup lang="ts">
import PageHero from '~/components/site/PageHero.vue';
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { homeData, pageData } from '~/data/home';

const data = pageData.cases;

useSeoMeta({
  title: '成果示例 - 杰东认证',
  description: '查看杰东认证在保健食品、化妆品、消毒产品、医疗器械等方向的服务成果示例。'
});
</script>

<template>
  <main>
    <PageHero :hero="data.hero" />

    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="grid gap-5 md:grid-cols-2">
          <article v-for="item in homeData.cases" :key="item.title" class="rounded-lg border border-slate-100 bg-white p-7 shadow-sm transition hover:border-brand-line hover:shadow-card">
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm font-semibold text-brand-primary">{{ item.type }}</span>
              <span class="rounded-md bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary">{{ item.status }}</span>
            </div>
            <h2 class="mt-5 text-2xl font-semibold text-brand-ink">{{ item.title }}</h2>
            <p class="mt-4 leading-8 text-slate-600">{{ item.summary }}</p>
            <div class="mt-7 flex items-center gap-2 text-sm font-semibold text-brand-primary">
              <MaterialIcon name="workspace_premium" class="text-[20px]" />
              服务成果归档
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-brand-mist py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Delivery Boundary</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">服务成果展示原则</h2>
        </div>
        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <article v-for="item in data.safeguards" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
            <span class="flex size-12 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
              <MaterialIcon :name="item.icon" class="text-[26px]" />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
