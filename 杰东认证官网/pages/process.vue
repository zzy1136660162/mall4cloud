<script setup lang="ts">
import PageHero from '~/components/site/PageHero.vue';
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { homeData, pageData } from '~/data/home';

const data = pageData.process;

useSeoMeta({
  title: '申办流程 - 杰东认证',
  description: '了解杰东认证从需求评估、资料准备、申报递交、过程跟进到结果交付的服务流程。'
});
</script>

<template>
  <main>
    <PageHero :hero="data.hero" />

    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="relative">
          <div class="absolute left-6 top-0 hidden h-full w-px bg-brand-line md:block" />
          <div class="grid gap-6">
            <article v-for="step in homeData.processSteps" :key="step.step" class="relative grid gap-5 rounded-lg border border-slate-100 bg-white p-6 shadow-sm md:grid-cols-[96px_1fr] md:p-8">
              <div class="flex items-center gap-4 md:block">
                <span class="relative z-10 flex size-12 items-center justify-center rounded-md bg-brand-primary text-white">
                  <MaterialIcon :name="step.icon" class="text-[26px]" />
                </span>
                <span class="mt-4 block text-sm font-bold text-brand-primary md:text-center">{{ step.step }}</span>
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-brand-ink">{{ step.title }}</h2>
                <p class="mt-3 leading-8 text-slate-600">{{ step.summary }}</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-brand-mist py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Document Scope</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">关键资料范围</h2>
        </div>
        <div class="mt-12 grid gap-5 md:grid-cols-3">
          <article v-for="item in data.documents" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
            <span class="flex size-12 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
              <MaterialIcon :name="item.icon" class="text-[26px]" />
            </span>
            <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="rounded-lg bg-brand-deep p-8 text-white md:p-10">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-accent">Collaboration Rules</p>
          <h2 class="mt-4 text-3xl font-bold sm:text-4xl">协作原则</h2>
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            <p v-for="item in data.principles" :key="item" class="rounded-md border border-white/12 bg-white/8 p-5 leading-7 text-white/72">
              {{ item }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
