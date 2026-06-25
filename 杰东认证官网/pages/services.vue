<script setup lang="ts">
import PageHero from '~/components/site/PageHero.vue';
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { homeData, pageData } from '~/data/home';

const data = pageData.services;

useSeoMeta({
  title: '服务领域 - 杰东认证',
  description: '杰东认证提供消字号代办、保健用品号代办、健字号代办及 OEM、ODM 代加工服务。'
});
</script>

<template>
  <main>
    <PageHero :hero="data.hero" />

    <section class="bg-white py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="grid gap-6 lg:grid-cols-2">
          <article
            v-for="service in homeData.services"
            :id="service.slug"
            :key="service.slug"
            class="rounded-lg border border-slate-100 bg-white p-7 shadow-sm transition hover:border-brand-line hover:shadow-card"
          >
            <div class="flex items-start gap-4">
              <span class="flex size-14 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
                <MaterialIcon :name="service.icon" class="text-[28px]" />
              </span>
              <div>
                <h2 class="text-2xl font-semibold text-brand-ink">{{ service.title }}</h2>
                <p class="mt-3 leading-8 text-slate-600">{{ service.summary }}</p>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap gap-2">
              <span v-for="tag in service.tags" :key="tag" class="rounded-md bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-primary">{{ tag }}</span>
            </div>

            <ul class="mt-7 grid gap-3">
              <li v-for="detail in service.details" :key="detail" class="flex gap-3 text-sm leading-7 text-slate-600">
                <MaterialIcon name="task_alt" class="mt-1 text-[18px] text-brand-primary" />
                <span>{{ detail }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <section class="bg-brand-mist py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Service Method</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">从品类判断到结果归档</h2>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article v-for="item in data.matrix" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
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
