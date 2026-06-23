# Jiedong Certification Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 3 SSR homepage for 杰东认证 using TailwindCSS and local mock data.

**Architecture:** The app is a Nuxt 3 SSR project with a single homepage composed from focused Vue components. Homepage content is centralized in `data/home.ts`, while `pages/index.vue` wires data into sections and defines SEO metadata.

**Tech Stack:** Nuxt 3, Vue 3, TypeScript, TailwindCSS, lucide-vue-next, Vitest for mock data checks.

---

## File Structure

- Create `package.json` for Nuxt scripts and dependencies.
- Create `.gitignore` to exclude dependencies, build output, local Nuxt files, and `.superpowers/`.
- Create `nuxt.config.ts` for SSR, TailwindCSS, CSS entry, and TypeScript settings.
- Create `tailwind.config.ts` for content scanning and brand tokens.
- Create `assets/css/tailwind.css` for Tailwind layers and global base styling.
- Create `app.vue` as the Nuxt app root.
- Create `data/home.ts` for structured mock homepage content.
- Create `tests/home-data.test.ts` to validate required homepage mock data.
- Create `vitest.config.ts` for TypeScript test execution.
- Create `components/home/AppHeader.vue`.
- Create `components/home/HeroSection.vue`.
- Create `components/home/ServiceGrid.vue`.
- Create `components/home/AdvantageSection.vue`.
- Create `components/home/ProcessTimeline.vue`.
- Create `components/home/NewsSection.vue`.
- Create `components/home/CaseShowcase.vue`.
- Create `components/home/AppFooter.vue`.
- Create `pages/index.vue` to compose the homepage and set SEO metadata.

---

### Task 1: Project Baseline

**Files:**

- Create: `package.json`
- Create: `.gitignore`
- Create: `nuxt.config.ts`
- Create: `tailwind.config.ts`
- Create: `assets/css/tailwind.css`
- Create: `app.vue`

- [ ] **Step 1: Initialize Git repository**

Run:

```bash
git init
```

Expected: Git creates a new `.git` directory in the project root.

- [ ] **Step 2: Create `package.json`**

Create `package.json`:

```json
{
  "name": "jiedong-certification-homepage",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "test": "vitest run",
    "typecheck": "nuxt typecheck"
  },
  "dependencies": {
    "@nuxtjs/tailwindcss": "^6.12.0",
    "lucide-vue-next": "^0.468.0",
    "nuxt": "^3.15.0",
    "vue": "^3.5.0"
  },
  "devDependencies": {
    "@vue/test-utils": "^2.4.6",
    "happy-dom": "^15.11.7",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8",
    "vue-tsc": "^2.1.10"
  }
}
```

- [ ] **Step 3: Create `.gitignore`**

Create `.gitignore`:

```gitignore
node_modules
.nuxt
.output
.data
.env
.env.*
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
.superpowers/
```

- [ ] **Step 4: Create Nuxt and Tailwind config**

Create `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  ssr: true,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/tailwind.css'],
  app: {
    head: {
      htmlAttrs: {
        lang: 'zh-CN'
      }
    }
  },
  typescript: {
    strict: true,
    typeCheck: true
  },
  devtools: {
    enabled: true
  }
});
```

Create `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
    './data/**/*.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#12313b',
          deep: '#0d3b4a',
          primary: '#13836f',
          accent: '#20b694',
          soft: '#e7f5f2',
          mist: '#f5fbfa'
        }
      },
      boxShadow: {
        soft: '0 24px 70px rgba(14, 78, 91, 0.12)'
      }
    }
  }
};
```

- [ ] **Step 5: Create global CSS and app root**

Create `assets/css/tailwind.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-white text-brand-ink antialiased;
    font-family: "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif;
  }

  ::selection {
    @apply bg-brand-accent text-white;
  }
}
```

Create `app.vue`:

```vue
<template>
  <NuxtPage />
</template>
```

- [ ] **Step 6: Install dependencies**

Run:

```bash
npm install
```

Expected: `node_modules` and `package-lock.json` are created without dependency resolution errors.

- [ ] **Step 7: Commit baseline**

Run:

```bash
git add package.json package-lock.json .gitignore nuxt.config.ts tailwind.config.ts assets/css/tailwind.css app.vue
git commit -m "chore: initialize nuxt homepage project"
```

Expected: Git records the project baseline commit.

---

### Task 2: Mock Data Contract

**Files:**

- Create: `data/home.ts`
- Create: `vitest.config.ts`
- Create: `tests/home-data.test.ts`

- [ ] **Step 1: Write the data contract test**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true
  }
});
```

Create `tests/home-data.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { homeData } from '../data/home';

describe('homeData', () => {
  it('contains the required homepage sections', () => {
    expect(homeData.hero.title).toContain('批文批号');
    expect(homeData.services).toHaveLength(6);
    expect(homeData.advantages).toHaveLength(4);
    expect(homeData.processSteps).toHaveLength(5);
    expect(homeData.news.length).toBeGreaterThanOrEqual(4);
    expect(homeData.cases.length).toBeGreaterThanOrEqual(4);
    expect(homeData.footer.company).toBe('北京杰东认证服务有限公司');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm run test
```

Expected: FAIL because `data/home.ts` does not exist yet.

- [ ] **Step 3: Create mock homepage data**

Create `data/home.ts`:

```ts
export interface HeroStat {
  value: string;
  label: string;
}

export interface ServiceItem {
  title: string;
  summary: string;
  tags: string[];
}

export interface AdvantageItem {
  title: string;
  summary: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  summary: string;
}

export interface NewsItem {
  category: string;
  title: string;
  date: string;
  summary: string;
}

export interface CaseItem {
  type: string;
  title: string;
  status: string;
  summary: string;
}

export const homeData = {
  hero: {
    eyebrow: 'Healthcare Compliance Service',
    title: '医药健康产品批文批号申办服务伙伴',
    description:
      '聚焦保健食品、化妆品、消毒产品、医疗器械等注册备案与合规咨询，提供资料审核、申报路径设计和全过程节点跟进服务。',
    primaryAction: '咨询服务',
    secondaryAction: '查看申办流程',
    stats: [
      { value: '20+', label: '细分申报方向' },
      { value: '5步', label: '标准化服务流程' },
      { value: '7类', label: '政策资讯专题' }
    ] satisfies HeroStat[]
  },
  services: [
    {
      title: '保健食品注册与备案',
      summary: '围绕国食健字、保健食品资料整理、配方与标签合规进行申报路径设计。',
      tags: ['国食健字', '资料清单', '标签合规']
    },
    {
      title: '化妆品备案与申报',
      summary: '支持国产非特殊化妆品备案、特殊化妆品申报资料梳理与法规要点核对。',
      tags: ['化妆品备案', '功效宣称', '配方审核']
    },
    {
      title: '消毒产品卫生安全评价',
      summary: '协助消毒产品评价报告、卫消字相关资料准备及生产许可要求梳理。',
      tags: ['卫消字', '评价报告', '许可资料']
    },
    {
      title: '医疗器械注册备案',
      summary: '面向一类医疗器械备案、产品分类判断和注册资料路径提供咨询支持。',
      tags: ['器械分类', '备案路径', '资料辅导']
    },
    {
      title: '药品相关批号咨询',
      summary: '围绕国药准字、药品广告审查、说明书标签等方向提供政策解读。',
      tags: ['国药准字', '药品知识', '政策解读']
    },
    {
      title: '食字号与特种批文咨询',
      summary: '覆盖食品生产许可、QS、药食同源、新食品原料等健康产品准入问题。',
      tags: ['食字号', 'QS', '新食品原料']
    }
  ] satisfies ServiceItem[],
  advantages: [
    {
      title: '申报路径设计',
      summary: '根据产品属性、法规要求和企业现状，梳理更清晰的申报路线。'
    },
    {
      title: '资料审核与清单管理',
      summary: '围绕申请表、检测报告、标签样稿、配方材料等关键资料进行结构化核对。'
    },
    {
      title: '政策法规跟踪',
      summary: '持续关注医药健康、食品、化妆品、消毒产品与医疗器械监管动态。'
    },
    {
      title: '全流程节点跟进',
      summary: '从需求评估到结果交付，帮助企业把握申报周期中的关键节点。'
    }
  ] satisfies AdvantageItem[],
  processSteps: [
    { step: '01', title: '需求评估', summary: '了解产品类型、企业资质、目标批文和已有资料。' },
    { step: '02', title: '资料准备', summary: '输出资料清单，协助整理申报所需文件与证明材料。' },
    { step: '03', title: '申报递交', summary: '根据申报路径完成资料核对、格式整理与递交流程衔接。' },
    { step: '04', title: '过程跟进', summary: '跟踪审查反馈、补正要求和过程节点，降低沟通成本。' },
    { step: '05', title: '结果交付', summary: '交付结果文件、归档资料，并提供后续维护建议。' }
  ] satisfies ProcessStep[],
  news: [
    {
      category: '政策法规',
      title: '中医药标准化研究转化与管理要求持续完善',
      date: '2026-06-18',
      summary: '关注行业标准更新对健康产品申报资料和合规表述的影响。'
    },
    {
      category: '医疗器械',
      title: '第一类医疗器械备案资料准备要点',
      date: '2026-06-12',
      summary: '从产品分类、说明书、技术要求等角度梳理备案前置准备。'
    },
    {
      category: '化妆品',
      title: '国产非特殊化妆品备案流程关注事项',
      date: '2026-06-06',
      summary: '整理配方、功效宣称、标签与安全评估资料的常见问题。'
    },
    {
      category: '消毒产品',
      title: '消毒产品卫生安全评价报告资料清单',
      date: '2026-05-28',
      summary: '围绕检测、标签、生产条件和评价报告进行申报资料说明。'
    }
  ] satisfies NewsItem[],
  cases: [
    {
      type: '保健食品',
      title: '保健食品注册资料整理项目',
      status: '资料归档',
      summary: '协助企业梳理配方依据、标签样稿和申报资料目录。'
    },
    {
      type: '化妆品',
      title: '国产非特殊化妆品备案咨询',
      status: '流程完成',
      summary: '围绕产品备案路径、功效宣称和基础资料进行合规咨询。'
    },
    {
      type: '消毒产品',
      title: '卫生安全评价资料辅导',
      status: '节点跟进',
      summary: '支持检测资料、标签内容和评价报告文件的准备工作。'
    },
    {
      type: '医疗器械',
      title: '一类医疗器械备案路径咨询',
      status: '方案交付',
      summary: '协助判断产品分类并形成备案资料准备建议。'
    }
  ] satisfies CaseItem[],
  footer: {
    company: '北京杰东认证服务有限公司',
    description: '专注医药健康产品批文批号、注册备案与合规咨询服务。',
    phone: '010-0000-0000',
    email: 'service@jiedong.example',
    address: '北京市朝阳区健康产业服务示范地址',
    icp: '京ICP备12045069号-1'
  }
};
```

- [ ] **Step 4: Run test to verify it passes**

Run:

```bash
npm run test
```

Expected: PASS with one test file and one passing test.

- [ ] **Step 5: Commit mock data**

Run:

```bash
git add data/home.ts vitest.config.ts tests/home-data.test.ts
git commit -m "test: define homepage mock data contract"
```

Expected: Git records the mock data and test.

---

### Task 3: Header, Hero, and Footer

**Files:**

- Create: `components/home/AppHeader.vue`
- Create: `components/home/HeroSection.vue`
- Create: `components/home/AppFooter.vue`

- [ ] **Step 1: Create app header**

Create `components/home/AppHeader.vue`:

```vue
<script setup lang="ts">
import { Menu, Phone, X } from 'lucide-vue-next';

const isOpen = ref(false);

const navItems = [
  { label: '首页', href: '#top' },
  { label: '关于杰东', href: '#about' },
  { label: '服务领域', href: '#services' },
  { label: '申办流程', href: '#process' },
  { label: '政策资讯', href: '#news' },
  { label: '成功案例', href: '#cases' },
  { label: '联系我们', href: '#contact' }
];
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-100 bg-white/92 backdrop-blur-xl">
    <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
      <a href="#top" class="flex items-center gap-3" aria-label="杰东认证首页">
        <span class="flex size-11 items-center justify-center rounded-lg bg-brand-primary text-lg font-bold text-white">JD</span>
        <span>
          <span class="block text-lg font-semibold tracking-wide text-brand-ink">杰东认证</span>
          <span class="block text-xs uppercase tracking-[0.2em] text-slate-400">Certification Service</span>
        </span>
      </a>

      <nav class="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex" aria-label="主导航">
        <a v-for="item in navItems" :key="item.href" :href="item.href" class="transition hover:text-brand-primary">
          {{ item.label }}
        </a>
      </nav>

      <a href="#contact" class="hidden items-center gap-2 rounded-md bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-deep lg:inline-flex">
        <Phone class="size-4" />
        立即咨询
      </a>

      <button class="inline-flex size-11 items-center justify-center rounded-md border border-slate-200 text-brand-ink lg:hidden" type="button" aria-label="切换导航菜单" @click="isOpen = !isOpen">
        <X v-if="isOpen" class="size-5" />
        <Menu v-else class="size-5" />
      </button>
    </div>

    <div v-if="isOpen" class="border-t border-slate-100 bg-white px-5 py-4 lg:hidden">
      <nav class="mx-auto grid max-w-7xl gap-2 text-sm font-medium text-slate-700" aria-label="移动端导航">
        <a v-for="item in navItems" :key="item.href" :href="item.href" class="rounded-md px-3 py-2 transition hover:bg-brand-soft hover:text-brand-primary" @click="isOpen = false">
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>
```

- [ ] **Step 2: Create hero section**

Create `components/home/HeroSection.vue`:

```vue
<script setup lang="ts">
import { ArrowRight, CheckCircle2 } from 'lucide-vue-next';
import type { HeroStat } from '~/data/home';

defineProps<{
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
    stats: HeroStat[];
  };
}>();

const matrix = ['保健食品注册', '化妆品备案', '消毒产品评价', '医疗器械咨询'];
</script>

<template>
  <section id="top" class="relative overflow-hidden bg-gradient-to-br from-white via-brand-mist to-brand-soft">
    <div class="absolute right-0 top-20 h-72 w-72 rounded-full bg-brand-accent/10 blur-3xl" />
    <div class="mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div class="relative z-10">
        <p class="mb-5 text-sm font-semibold uppercase tracking-[0.26em] text-brand-primary">{{ hero.eyebrow }}</p>
        <h1 class="max-w-3xl text-4xl font-bold leading-tight text-brand-ink sm:text-5xl lg:text-6xl">
          {{ hero.title }}
        </h1>
        <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {{ hero.description }}
        </p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <a href="#contact" class="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-brand-deep">
            {{ hero.primaryAction }}
            <ArrowRight class="size-4" />
          </a>
          <a href="#process" class="inline-flex items-center justify-center rounded-md border border-brand-primary/25 bg-white px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-soft">
            {{ hero.secondaryAction }}
          </a>
        </div>
        <dl class="mt-12 grid max-w-xl grid-cols-3 gap-4">
          <div v-for="stat in hero.stats" :key="stat.label" class="rounded-lg border border-white bg-white/70 p-4 shadow-sm">
            <dt class="text-2xl font-bold text-brand-primary">{{ stat.value }}</dt>
            <dd class="mt-1 text-xs text-slate-500 sm:text-sm">{{ stat.label }}</dd>
          </div>
        </dl>
      </div>

      <div class="relative z-10">
        <div class="rounded-lg border border-white bg-white/82 p-5 shadow-soft backdrop-blur">
          <div class="rounded-lg bg-brand-deep p-6 text-white">
            <p class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">Service Matrix</p>
            <h2 class="mt-4 text-2xl font-semibold">健康产品合规准入服务矩阵</h2>
            <div class="mt-8 grid gap-3 sm:grid-cols-2">
              <div v-for="item in matrix" :key="item" class="flex items-center gap-3 rounded-md bg-white/10 p-4">
                <CheckCircle2 class="size-5 shrink-0 text-brand-accent" />
                <span class="text-sm font-medium">{{ item }}</span>
              </div>
            </div>
          </div>
          <div class="grid gap-4 pt-5 sm:grid-cols-2">
            <div class="rounded-lg bg-brand-mist p-5">
              <p class="text-sm text-slate-500">资料审核</p>
              <p class="mt-2 text-2xl font-bold text-brand-ink">清单化</p>
            </div>
            <div class="rounded-lg bg-brand-mist p-5">
              <p class="text-sm text-slate-500">过程跟进</p>
              <p class="mt-2 text-2xl font-bold text-brand-ink">节点化</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Create footer**

Create `components/home/AppFooter.vue`:

```vue
<script setup lang="ts">
defineProps<{
  footer: {
    company: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    icp: string;
  };
}>();

const links = ['关于杰东', '服务领域', '申办流程', '政策资讯', '成功案例'];
</script>

<template>
  <footer id="contact" class="bg-brand-deep text-white">
    <div class="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
      <div>
        <h2 class="text-2xl font-semibold">{{ footer.company }}</h2>
        <p class="mt-4 max-w-xl leading-7 text-white/72">{{ footer.description }}</p>
      </div>
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">联系咨询</h3>
        <ul class="mt-4 space-y-2 text-sm text-white/72">
          <li>电话：{{ footer.phone }}</li>
          <li>邮箱：{{ footer.email }}</li>
          <li>地址：{{ footer.address }}</li>
        </ul>
      </div>
      <div>
        <h3 class="text-sm font-semibold uppercase tracking-[0.22em] text-brand-accent">快速导航</h3>
        <ul class="mt-4 grid grid-cols-2 gap-2 text-sm text-white/72">
          <li v-for="link in links" :key="link">{{ link }}</li>
        </ul>
      </div>
    </div>
    <div class="border-t border-white/10 px-5 py-5 text-center text-xs text-white/56">
      {{ footer.icp }} · Mock data for frontend display
    </div>
  </footer>
</template>
```

- [ ] **Step 4: Commit shell components**

Run:

```bash
git add components/home/AppHeader.vue components/home/HeroSection.vue components/home/AppFooter.vue
git commit -m "feat: add homepage shell components"
```

Expected: Git records header, hero, and footer components.

---

### Task 4: Homepage Content Sections

**Files:**

- Create: `components/home/ServiceGrid.vue`
- Create: `components/home/AdvantageSection.vue`
- Create: `components/home/ProcessTimeline.vue`
- Create: `components/home/NewsSection.vue`
- Create: `components/home/CaseShowcase.vue`

- [ ] **Step 1: Create service grid**

Create `components/home/ServiceGrid.vue`:

```vue
<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import type { ServiceItem } from '~/data/home';

defineProps<{ services: ServiceItem[] }>();
</script>

<template>
  <section id="services" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Service Fields</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">服务领域</h2>
        <p class="mt-4 leading-8 text-slate-600">围绕医药健康产品上市准入中的批文批号、注册备案与资料合规问题，建立清晰的服务分类。</p>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="service in services" :key="service.title" class="group rounded-lg border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-xl font-semibold text-brand-ink">{{ service.title }}</h3>
            <ArrowUpRight class="size-5 shrink-0 text-brand-primary transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </div>
          <p class="mt-4 min-h-20 leading-7 text-slate-600">{{ service.summary }}</p>
          <div class="mt-6 flex flex-wrap gap-2">
            <span v-for="tag in service.tags" :key="tag" class="rounded-md bg-brand-soft px-3 py-1 text-xs font-medium text-brand-primary">{{ tag }}</span>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 2: Create advantage section**

Create `components/home/AdvantageSection.vue`:

```vue
<script setup lang="ts">
import { ClipboardCheck, FileSearch, Route, ShieldCheck } from 'lucide-vue-next';
import type { AdvantageItem } from '~/data/home';

defineProps<{ advantages: AdvantageItem[] }>();

const icons = [Route, ClipboardCheck, FileSearch, ShieldCheck];
</script>

<template>
  <section id="about" class="bg-brand-mist py-20">
    <div class="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Why Jiedong</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">以专业流程降低申报沟通成本</h2>
        <p class="mt-5 leading-8 text-slate-600">杰东认证以资料、路径、政策和节点为核心，帮助企业把复杂的健康产品准入工作拆解成可推进的步骤。</p>
      </div>
      <div class="grid gap-5 sm:grid-cols-2">
        <article v-for="(item, index) in advantages" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
          <component :is="icons[index]" class="size-8 text-brand-primary" />
          <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 3: Create process timeline**

Create `components/home/ProcessTimeline.vue`:

```vue
<script setup lang="ts">
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
      <div class="mt-12 grid gap-5 lg:grid-cols-5">
        <article v-for="step in steps" :key="step.step" class="relative rounded-lg border border-slate-100 bg-white p-6 shadow-sm">
          <div class="text-sm font-bold text-brand-primary">{{ step.step }}</div>
          <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ step.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ step.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 4: Create news section**

Create `components/home/NewsSection.vue`:

```vue
<script setup lang="ts">
import { CalendarDays } from 'lucide-vue-next';
import type { NewsItem } from '~/data/home';

defineProps<{ news: NewsItem[] }>();
</script>

<template>
  <section id="news" class="bg-brand-mist py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div class="max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Insights</p>
          <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">政策资讯</h2>
          <p class="mt-4 leading-8 text-slate-600">以政策法规、行业动态和申报知识为线索，帮助企业持续了解健康产品合规要求。</p>
        </div>
        <a href="#" class="text-sm font-semibold text-brand-primary">查看更多资讯</a>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-2">
        <article v-for="item in news" :key="item.title" class="rounded-lg bg-white p-6 shadow-sm">
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <span class="rounded-md bg-brand-soft px-3 py-1 font-medium text-brand-primary">{{ item.category }}</span>
            <span class="inline-flex items-center gap-2 text-slate-500">
              <CalendarDays class="size-4" />
              {{ item.date }}
            </span>
          </div>
          <h3 class="mt-5 text-xl font-semibold text-brand-ink">{{ item.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 5: Create case showcase**

Create `components/home/CaseShowcase.vue`:

```vue
<script setup lang="ts">
import type { CaseItem } from '~/data/home';

defineProps<{ cases: CaseItem[] }>();
</script>

<template>
  <section id="cases" class="bg-white py-20">
    <div class="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Cases</p>
        <h2 class="mt-4 text-3xl font-bold text-brand-ink sm:text-4xl">服务成果示例</h2>
        <p class="mt-4 leading-8 text-slate-600">以下为 mock 展示内容，用于呈现服务类型和项目状态，不包含真实客户敏感信息。</p>
      </div>
      <div class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <article v-for="item in cases" :key="item.title" class="rounded-lg border border-slate-100 p-6">
          <div class="flex items-center justify-between gap-3">
            <span class="text-sm font-semibold text-brand-primary">{{ item.type }}</span>
            <span class="rounded-md bg-brand-soft px-2.5 py-1 text-xs text-brand-primary">{{ item.status }}</span>
          </div>
          <h3 class="mt-5 text-lg font-semibold text-brand-ink">{{ item.title }}</h3>
          <p class="mt-3 leading-7 text-slate-600">{{ item.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
```

- [ ] **Step 6: Commit content sections**

Run:

```bash
git add components/home/ServiceGrid.vue components/home/AdvantageSection.vue components/home/ProcessTimeline.vue components/home/NewsSection.vue components/home/CaseShowcase.vue
git commit -m "feat: add homepage content sections"
```

Expected: Git records the service, advantage, process, news, and case components.

---

### Task 5: Compose Homepage and SEO

**Files:**

- Create: `pages/index.vue`

- [ ] **Step 1: Create homepage composition**

Create `pages/index.vue`:

```vue
<script setup lang="ts">
import AppFooter from '~/components/home/AppFooter.vue';
import AppHeader from '~/components/home/AppHeader.vue';
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
  ogDescription:
    '聚焦保健食品、化妆品、消毒产品、医疗器械等注册备案与合规咨询。',
  ogType: 'website'
});
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main>
      <HeroSection :hero="homeData.hero" />
      <ServiceGrid :services="homeData.services" />
      <AdvantageSection :advantages="homeData.advantages" />
      <ProcessTimeline :steps="homeData.processSteps" />
      <NewsSection :news="homeData.news" />
      <CaseShowcase :cases="homeData.cases" />
    </main>
    <AppFooter :footer="homeData.footer" />
  </div>
</template>
```

- [ ] **Step 2: Run tests and typecheck**

Run:

```bash
npm run test
npm run typecheck
```

Expected: Tests pass and Nuxt typecheck completes without TypeScript errors.

- [ ] **Step 3: Run local dev server**

Run:

```bash
npm run dev
```

Expected: Nuxt starts and prints a local URL such as `http://localhost:3000/`.

- [ ] **Step 4: Verify SSR page output**

Run in another terminal while the dev server is running:

```bash
curl http://localhost:3000/ | findstr "医药健康产品批文批号申办服务伙伴"
```

Expected: The response contains the homepage title text, confirming the SSR response includes page content.

- [ ] **Step 5: Commit homepage composition**

Run:

```bash
git add pages/index.vue
git commit -m "feat: compose ssr homepage"
```

Expected: Git records the homepage route.

---

### Task 6: Final Verification and Responsive QA

**Files:**

- Modify only if verification reveals a concrete layout or type issue.

- [ ] **Step 1: Build the project**

Run:

```bash
npm run build
```

Expected: Nuxt build completes and writes `.output`.

- [ ] **Step 2: Check desktop homepage**

Open the dev server URL at a desktop viewport around `1440x900`.

Expected:

- Header sticks to the top and does not overlap content.
- Hero uses two columns.
- Service cards are in three columns.
- Process steps are in five columns.
- Text is readable and buttons do not overflow.

- [ ] **Step 3: Check mobile homepage**

Open the dev server URL at a mobile viewport around `390x844`.

Expected:

- Header shows menu button.
- Mobile menu opens and closes.
- Hero becomes single column.
- Cards and news items stack vertically.
- No text overlaps or escapes its container.

- [ ] **Step 4: Run final automated checks**

Run:

```bash
npm run test
npm run typecheck
npm run build
```

Expected: All commands pass.

- [ ] **Step 5: Commit verification fixes if any**

If files changed during QA, run:

```bash
git add .
git commit -m "fix: polish homepage responsive layout"
```

Expected: Git records only concrete fixes found during verification. If no files changed, skip this commit.

