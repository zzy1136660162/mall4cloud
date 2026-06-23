<script setup lang="ts">
import AdvantageSection from '~/components/home/AdvantageSection.vue';
import CaseShowcase from '~/components/home/CaseShowcase.vue';
import HeroSection from '~/components/home/HeroSection.vue';
import NewsSection from '~/components/home/NewsSection.vue';
import ProcessTimeline from '~/components/home/ProcessTimeline.vue';
import ServiceGrid from '~/components/home/ServiceGrid.vue';
import { homeData } from '~/data/home';

useSeoMeta({
  title: '杰东认证 - 医药健康产品批文批号代办服务伙伴',
  description:
    '北京杰东认证服务有限公司提供消字号代办、保健用品号代办、健字号代办及 OEM、ODM 代加工服务。',
  keywords:
    '杰东认证,北京杰东,批文批号,消字号代办,保健用品号代办,健字号代办,OEM代加工,ODM代加工',
  ogTitle: '杰东认证 - 医药健康产品批文批号代办服务伙伴',
  ogDescription: '聚焦消字号、保健用品号、健字号代办及 OEM、ODM 代加工服务。',
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
