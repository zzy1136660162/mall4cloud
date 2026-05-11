<script setup lang="ts">
const logo = 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/logo.png'

const platformStats = ref([
  { value: '13年', label: '行业深耕' },
  { value: '3万+', label: '服务企业' },
  { value: '1000+', label: '精选产品' },
])

const businessModules = ref([
  {
    id: 'product',
    name: '商品管理',
    tagline: '全面管控商品信息与分类体系',
    features: [
      '商品列表管理',
      '商品分类设置',
      '商品属性配置',
      '商品信息编辑',
    ],
  },
  {
    id: 'order',
    name: '订单管理',
    tagline: '高效处理订单全流程业务',
    features: [
      '订单列表查询',
      '订单详情查看',
      '物流信息更新',
      '售后服务支持',
    ],
  },
  {
    id: 'shop',
    name: '店铺管理',
    tagline: '灵活配置店铺展示内容',
    features: [
      '热门搜索设置',
      '首页图片管理',
      '店铺信息配置',
      '营销活动管理',
    ],
  },
])

const platformFeatures = ref([
  { title: '权限管理', description: '角色权限配置，用户体系管理' },
  { title: '达人管理', description: '达人入驻审核，合作对接服务' },
  { title: '需求管理', description: '研发需求收集，进度跟踪反馈' },
  { title: '选品管理', description: '精选商品推荐，采购对接服务' },
])

const useCases = ref([
  { title: '品牌商', description: '产品上架、订单处理、客户服务' },
  { title: '经销商', description: '采购选品、库存管理、销售分析' },
  { title: '服务商', description: '达人管理、需求响应、服务对接' },
  { title: '创业者', description: '低成本创业、全流程支持、灵活经营' },
])
</script>

<template>
  <div class="bg-background size-full absolute overflow-auto">
    <div class="mx-auto px-4 py-6 max-w-7xl md-px-8 md-py-10">
      <!-- Top Bar -->
      <div class="mb-6 flex items-center justify-between">
        <div class="flex gap-3 items-center">
          <FaIcon :name="logo" class="p-1 border rounded-lg size-10" />
          <span class="tracking-tight font-semibold">杰东药业管理系统</span>
        </div>
        <div class="text-xs text-muted-foreground">
          杰东优选平台 · 后台管理系统
        </div>
      </div>

      <!-- Hero: Asymmetric split -->
      <div class="mb-6 gap-4 grid items-stretch md-grid-cols-[3fr_2fr]">
        <!-- Left: Title & CTA -->
        <div class="hero-enter p-6 border rounded-xl relative overflow-hidden md-p-8">
          <div class="text-xs text-muted-foreground tracking-widest font-medium mb-3 uppercase">
            医健产业 · B2B平台
          </div>
          <h1 class="text-2xl leading-tight tracking-tight font-semibold mb-3 md-text-3xl">
            欢迎使用
            <div class="text-4xl tracking-tight font-semibold md-text-6xl">
              杰东药业管理系统
            </div>
          </h1>
          <p class="text-sm text-muted-foreground leading-relaxed mb-6 max-w-prose md-text-base">
            致力于<span class="text-foreground font-medium">共创医健产业创新生态圈</span>，提供商品管理、订单处理、店铺运营等全链路电商解决方案。
          </p>
        </div>

        <!-- Right: Stats -->
        <div class="gap-4 grid grid-rows-3">
          <div
            v-for="(stat, i) in platformStats"
            :key="stat.label"
            class="stat-enter border rounded-xl bg-neutral-950/[.012] dark:bg-white/5"
            :style="{ animationDelay: `${i * 100}ms` }"
          >
            <div class="p-5 flex flex-col h-full justify-between">
              <div>
                <div class="text-3xl tracking-tight font-semibold mb-1 md-text-4xl">
                  {{ stat.value }}
                </div>
                <div class="text-sm text-muted-foreground">
                  {{ stat.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Modules -->
      <div class="mb-6">
        <div class="mb-3 flex gap-2 items-center">
          <div class="rounded-full bg-primary h-4 w-0.5" />
          <h2 class="text-xs text-muted-foreground tracking-widest font-semibold uppercase">
            核心业务模块
          </h2>
        </div>
        <div class="gap-4 grid md-grid-cols-3">
          <div
            v-for="(module, i) in businessModules"
            :key="module.id"
            class="card-enter border rounded-xl bg-neutral-950/[.012] dark:bg-white/5"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <div class="flex flex-col h-full">
              <div class="p-6 border-b">
                <div class="text-sm tracking-tight font-semibold mb-1">
                  {{ module.name }}
                </div>
                <div class="text-xs text-muted-foreground leading-relaxed">
                  {{ module.tagline }}
                </div>
              </div>
              <div class="p-6 flex-col-start flex-1">
                <div class="mb-5 flex-1">
                  <ul class="space-y-1.5">
                    <li
                      v-for="feature in module.features"
                      :key="feature"
                      class="text-xs text-muted-foreground flex gap-2 items-start"
                    >
                      <span class="text-primary mt-0.5 shrink-0">·</span>
                      <span>{{ feature }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Platform Features -->
      <div class="mb-6">
        <div class="mb-3 flex gap-2 items-center">
          <div class="rounded-full bg-primary h-4 w-0.5" />
          <h2 class="text-xs text-muted-foreground tracking-widest font-semibold uppercase">
            平台功能
          </h2>
        </div>
        <div class="gap-3 grid grid-cols-2 md-grid-cols-4">
          <div
            v-for="(feature, i) in platformFeatures"
            :key="feature.title"
            class="card-enter border rounded-xl bg-neutral-950/[.012] dark:bg-white/5"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="p-5">
              <div class="text-sm font-semibold mb-2">
                {{ feature.title }}
              </div>
              <div class="text-xs text-muted-foreground leading-relaxed">
                {{ feature.description }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Use Cases -->
      <div>
        <div class="mb-4 flex gap-3 items-center">
          <div class="rounded-full bg-primary h-4 w-0.5" />
          <h2 class="text-xs text-muted-foreground tracking-widest font-semibold uppercase">
            服务对象
          </h2>
          <span class="text-xs text-muted-foreground hidden md-block">为医健行业不同角色提供专业服务</span>
        </div>
        <div class="gap-4 grid md-grid-cols-4">
          <div
            v-for="(useCase, i) in useCases"
            :key="useCase.title"
            class="card-enter border rounded-xl bg-neutral-950/[.012] dark:bg-white/5"
            :style="{ animationDelay: `${i * 80}ms` }"
          >
            <div class="p-5">
              <div class="text-sm font-semibold mb-2">
                {{ useCase.title }}
              </div>
              <div class="text-xs text-muted-foreground leading-relaxed">
                {{ useCase.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-enter {
  animation: slide-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.stat-enter {
  animation: slide-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card-enter {
  animation: fade-up 1.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.active-scale-98:active {
  transform: scale(0.98);
}
</style>
