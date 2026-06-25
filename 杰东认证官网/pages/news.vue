<script setup lang="ts">
import PageHero from '~/components/site/PageHero.vue';
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { homeData, pageData } from '~/data/home';

const data = pageData.news;

useSeoMeta({
  title: '政策资讯 - 杰东认证',
  description: '杰东认证整理医药健康产品注册备案、政策法规、资料清单和申报实务相关资讯。'
});
</script>

<template>
  <main>
    <PageHero :hero="data.hero" />

    <section class="bg-white py-20">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:px-8">
        <aside>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Topics</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink">资讯专题</h2>
          <div class="mt-8 grid gap-4">
            <article v-for="topic in data.topics" :key="topic.title" class="rounded-lg bg-brand-mist p-5">
              <div class="flex items-center gap-3">
                <MaterialIcon :name="topic.icon" class="text-[24px] text-brand-primary" />
                <h3 class="font-semibold text-brand-ink">{{ topic.title }}</h3>
              </div>
              <p class="mt-3 leading-7 text-slate-600">{{ topic.summary }}</p>
            </article>
          </div>
        </aside>

        <div class="grid gap-5">
          <article v-for="item in homeData.news" :key="item.title" class="rounded-lg border border-slate-100 bg-white p-7 shadow-sm transition hover:border-brand-line hover:shadow-card">
            <div class="flex flex-wrap items-center gap-3 text-sm">
              <span class="rounded-md bg-brand-soft px-3 py-1 font-medium text-brand-primary">{{ item.category }}</span>
              <span class="inline-flex items-center gap-2 text-slate-500">
                <MaterialIcon name="calendar_month" class="text-[18px]" />
                {{ item.date }}
              </span>
            </div>
            <h2 class="mt-5 text-2xl font-semibold text-brand-ink">{{ item.title }}</h2>
            <p class="mt-3 leading-8 text-slate-600">{{ item.summary }}</p>
          </article>
        </div>
      </div>
    </section>
  </main>
</template>
