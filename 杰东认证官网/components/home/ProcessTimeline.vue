<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import type { ProcessStep } from '~/data/home';

defineProps<{ steps: ProcessStep[] }>();
</script>

<template>
  <section id="process" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Process</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">申办流程</h2>
        <p class="mt-4 leading-8 text-slate-600">从产品情况评估开始，到资料准备、递交、跟进和交付，建立清晰可追踪的服务节点。</p>
      </div>

      <div class="mt-12 overflow-hidden rounded-lg bg-brand-deep">
        <img src="/images/process-path.svg" alt="" class="hidden w-full lg:block" width="1120" height="320">
        <div class="grid gap-px bg-white/10 lg:grid-cols-5">
          <article v-for="step in steps" :key="step.step" class="bg-brand-deep p-6 text-white">
            <div class="flex items-center justify-between gap-4">
              <span class="text-sm font-bold text-brand-accent">{{ step.step }}</span>
              <MaterialIcon :name="step.icon" class="text-[28px] text-brand-accent" />
            </div>
            <h3 class="mt-5 text-lg font-semibold">{{ step.title }}</h3>
            <p class="mt-3 leading-7 text-white/68">{{ step.summary }}</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>
