<script setup lang="ts">
import AdvantageSection from '~/components/home/AdvantageSection.vue';
import CaseShowcase from '~/components/home/CaseShowcase.vue';
import HeroSection from '~/components/home/HeroSection.vue';
import NewsSection from '~/components/home/NewsSection.vue';
import ProcessTimeline from '~/components/home/ProcessTimeline.vue';
import ServiceGrid from '~/components/home/ServiceGrid.vue';
import { homeData } from '~/data/home';

useSeoMeta({
  title: '杰东认证 - 医药健康产品批文批号申办服务伙伴',
  description:
    '北京杰东认证服务有限公司提供保健食品、化妆品、消毒产品、医疗器械等注册备案与合规咨询服务。',
  keywords:
    '杰东认证,北京杰东,批文批号,保健食品注册,化妆品备案,消毒产品,医疗器械备案',
  ogTitle: '杰东认证 - 医药健康产品批文批号申办服务伙伴',
  ogDescription: '聚焦健康产品批文批号、注册备案与资料合规咨询服务。',
  ogType: 'website'
});
</script>

<template>
  <main>
    <HeroSection :hero="homeData.hero" />
    <ServiceGrid :services="homeData.services" />
    <AdvantageSection :advantages="homeData.advantages" />
    <ProcessTimeline :steps="homeData.processSteps" />
    <NewsSection :news="homeData.news" />
    <CaseShowcase :cases="homeData.cases" />
  </main>
</template>
