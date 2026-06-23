<script setup lang="ts">
import PageHero from '~/components/site/PageHero.vue';
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { pageData } from '~/data/home';

const data = pageData.about;

useSeoMeta({
  title: '关于杰东 - 杰东认证',
  description: '了解北京杰东认证服务有限公司的服务定位、资料合规能力与申报流程协作方式。'
});
</script>

<template>
  <main>
    <PageHero :hero="data.hero" />

    <section class="bg-white py-20">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Company Position</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">专注健康产品准入服务</h2>
        </div>
        <div class="grid gap-5">
          <p v-for="paragraph in data.profile" :key="paragraph" class="rounded-lg border border-slate-100 bg-brand-mist p-6 leading-8 text-slate-600">
            {{ paragraph }}
          </p>
        </div>
      </div>
    </section>

    <section class="bg-brand-mist py-20">
      <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Core Capability</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">让合规工作有结构、有节奏、有交付</h2>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <article v-for="item in data.capabilities" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
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
        <div class="grid gap-5 lg:grid-cols-4">
          <article v-for="item in data.milestones" :key="item.year" class="border-t-2 border-brand-primary pt-6">
            <span class="text-sm font-bold text-brand-primary">{{ item.year }}</span>
            <h3 class="mt-4 text-xl font-semibold text-brand-ink">{{ item.title }}</h3>
            <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
