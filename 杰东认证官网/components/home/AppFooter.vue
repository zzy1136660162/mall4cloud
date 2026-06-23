<script setup lang="ts">
import MaterialIcon from '~/components/ui/MaterialIcon.vue';
import { siteNav } from '~/data/home';

defineProps<{
  footer: {
    company: string;
    description: string;
    contactName?: string;
    phone: string;
    email: string;
    address: string;
    wechatQr?: string;
    icp?: string;
  };
}>();
</script>

<template>
  <footer id="contact" class="bg-brand-deep text-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr_0.7fr_0.7fr] lg:px-8">
      <div>
        <div class="flex items-center gap-3">
          <img src="/images/brand-mark.svg" alt="" class="size-11 rounded-lg bg-white" width="44" height="44">
          <h2 class="text-2xl font-semibold">{{ footer.company }}</h2>
        </div>
        <p class="mt-4 max-w-xl leading-7 text-white/72">{{ footer.description }}</p>
      </div>

      <div>
        <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">联系咨询</h3>
        <ul class="mt-4 space-y-3 text-sm text-white/72">
          <li v-if="footer.contactName" class="flex gap-2"><MaterialIcon name="person" class="mt-0.5 text-[18px]" />联系人：{{ footer.contactName }}</li>
          <li v-if="footer.phone" class="flex gap-2"><MaterialIcon name="call" class="mt-0.5 text-[18px]" />电话：{{ footer.phone }}</li>
          <li v-if="footer.email" class="flex gap-2"><MaterialIcon name="mail" class="mt-0.5 text-[18px]" />邮箱：{{ footer.email }}</li>
          <li v-if="footer.address" class="flex gap-2"><MaterialIcon name="location_on" class="mt-0.5 text-[18px]" />地址：{{ footer.address }}</li>
        </ul>
      </div>

      <div v-if="footer.wechatQr">
        <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">公众号</h3>
        <img :src="footer.wechatQr" alt="杰东药业公众号二维码" class="mt-4 size-28 rounded-md bg-white object-cover p-1" width="112" height="112">
      </div>

      <div>
        <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">快速导航</h3>
        <ul class="mt-4 grid grid-cols-2 gap-2 text-sm text-white/72">
          <li v-for="link in siteNav" :key="link.href">
            <NuxtLink :to="link.href" class="transition hover:text-white">{{ link.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
    <div v-if="footer.icp" class="border-t border-white/10 px-5 py-5 text-center text-xs text-white/56">
      {{ footer.icp }}
    </div>
  </footer>
</template>
