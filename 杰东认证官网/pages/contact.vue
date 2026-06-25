<script setup lang="ts">
import PageHero from '~/components/site/PageHero.vue';
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { pageData } from '~/data/home';

const data = pageData.contact;

useSeoMeta({
  title: '联系我们 - 杰东认证',
  description: '联系杰东认证，沟通消字号代办、保健用品号代办、健字号代办及 OEM、ODM 代加工需求。'
});
</script>

<template>
  <main>
    <PageHero :hero="data.hero" />

    <section class="bg-white py-20">
      <div class="mx-auto grid max-w-7xl gap-6 px-5 sm:px-6 md:grid-cols-2 xl:grid-cols-5 lg:px-8">
        <article v-for="method in data.methods" :key="method.title" class="rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
          <span class="flex size-12 items-center justify-center rounded-md bg-brand-soft text-brand-primary">
            <MaterialIcon :name="method.icon" class="text-[26px]" />
          </span>
          <h2 class="mt-5 text-xl font-semibold text-brand-ink">{{ method.title }}</h2>
          <p class="mt-3 text-lg font-semibold text-brand-primary">{{ method.summary }}</p>
          <img v-if="method.image" :src="method.image" :alt="method.imageAlt || method.title" class="mt-5 size-32 rounded-md border border-slate-100 object-cover p-1" width="128" height="128">
          <ul v-if="method.items?.length" class="mt-5 space-y-2 text-sm leading-6 text-slate-600">
            <li v-for="item in method.items" :key="item" class="flex gap-2">
              <MaterialIcon name="check_circle" class="mt-1 text-[16px] text-brand-primary" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <section class="bg-brand-mist py-20">
      <div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Consultation Scope</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">可沟通的服务方向</h2>
          <div class="mt-8 flex flex-wrap gap-3">
            <span v-for="item in data.consultationTypes" :key="item" class="rounded-md bg-white px-4 py-2 text-sm font-semibold text-brand-primary shadow-sm">
              {{ item }}
            </span>
          </div>
        </div>

        <form class="rounded-lg bg-white p-6 shadow-card md:p-8" @submit.prevent>
          <div class="grid gap-5 md:grid-cols-2">
            <label class="grid gap-2 text-sm font-semibold text-brand-ink">
              姓名
              <input class="rounded-md border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-brand-primary" type="text" placeholder="请输入姓名">
            </label>
            <label class="grid gap-2 text-sm font-semibold text-brand-ink">
              联系方式
              <input class="rounded-md border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-brand-primary" type="tel" placeholder="请输入电话或邮箱">
            </label>
          </div>
          <label class="mt-5 grid gap-2 text-sm font-semibold text-brand-ink">
            咨询方向
            <select class="rounded-md border border-slate-200 px-4 py-3 font-normal outline-none transition focus:border-brand-primary">
              <option v-for="item in data.consultationTypes" :key="item">{{ item }}</option>
            </select>
          </label>
          <label class="mt-5 grid gap-2 text-sm font-semibold text-brand-ink">
            产品与资料情况
            <textarea class="min-h-36 rounded-md border border-slate-200 px-4 py-3 font-normal leading-7 outline-none transition focus:border-brand-primary" placeholder="请简要描述产品类别、目标批文、已有资料和当前进度" />
          </label>
          <button class="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep" type="submit">
            提交咨询
            <MaterialIcon name="arrow_forward" class="text-[18px]" />
          </button>
        </form>
      </div>
    </section>
  </main>
</template>
