<script setup lang="ts">
import { compile } from 'path-to-regexp'
import Breadcrumb from '../../../Breadcrumb/index.vue'
import BreadcrumbItem from '../../../Breadcrumb/item.vue'

defineOptions({
  name: 'ToolbarBreadcrumb',
})

const route = useRoute()

const appSettingsStore = useAppSettingsStore()

const { generateTitle } = useAppMenu()

interface BreadcrumbRecord {
  path: string
  title?: string | (() => string)
}

const breadcrumbList = computed<BreadcrumbRecord[]>(() => {
  const list: BreadcrumbRecord[] = []

  // 如果启用了主页，则首先添加主页
  if (appSettingsStore.settings.app.home.enable) {
    list.push({
      path: appSettingsStore.settings.app.home.fullPath,
      title: appSettingsStore.settings.app.home.title,
    })
  }

  // 使用 route.matched 获取路由匹配
  route.matched.forEach((item) => {
    // 跳过没有标题或明确设置 breadcrumb: false 的路由
    if (item.meta?.breadcrumb !== false && item.meta?.title) {
      list.push({
        path: item.path,
        title: item.meta?.title,
      })
    }
  })

  return list
})

function pathCompile(path: string) {
  const toPath = compile(path)
  return toPath(route.params)
}
</script>

<template>
  <Breadcrumb v-if="appSettingsStore.mode === 'pc'" class="breadcrumb px-2 whitespace-nowrap">
    <TransitionGroup name="breadcrumb">
      <BreadcrumbItem v-for="(item, index) in breadcrumbList" :key="item.path" :to="index < breadcrumbList.length - 1 && item.path !== '' ? pathCompile(item.path) : ''">
        {{ generateTitle(item.title) }}
      </BreadcrumbItem>
    </TransitionGroup>
  </Breadcrumb>
</template>

<style scoped>
/* 面包屑动画 */
.breadcrumb-enter-active {
  transition: transform 0.3s, opacity 0.3s;
}

.breadcrumb-enter-from {
  opacity: 0;
  transform: translateX(30px) skewX(-50deg);
}
</style>
