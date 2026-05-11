<template>
  <view class="diy-tabbar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      class="item"
      :class="{ active: currentIndex === index }"
      @tap="handleTabClick(item, index)"
    >
      <view class="icon">
        <image :src="currentIndex === index ? item.selectedIconPath : item.iconPath" />
      </view>
      <view class="text">
        {{ item.text }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change'])

const tabList = ref([
  {
    pagePath: '/pages/index/index',
    text: '首页',
    iconPath: '/static/tabbar/index.png',
    selectedIconPath: '/static/tabbar/index-r.png'
  },
  {
    pagePath: '/pages/demand-index/demand-index',
    text: '研发',
    iconPath: '/static/tabbar/dev.png',
    selectedIconPath: '/static/tabbar/dev-r.png'
  },
  {
    pagePath: '/pages/sample/selection/selection',
    text: '选品',
    iconPath: '/static/tabbar/selection.png',
    selectedIconPath: '/static/tabbar/selection-r.png'
  },
  {
    pagePath: '/pages/shop-prods/shop-prods',
    text: '商城',
    iconPath: '/static/tabbar/mall.png',
    selectedIconPath: '/static/tabbar/mall-r.png'
  },
  {
    pagePath: '/pages/my/my',
    text: '我的',
    iconPath: '/static/tabbar/my.png',
    selectedIconPath: '/static/tabbar/my-r.png'
  }
])

const handleTabClick = (item, index) => {
  if (props.currentIndex !== index) {
    emit('change', {
      item,
      index
    })
    switchTab(item.pagePath)
  }
}

const switchTab = (pagePath) => {
  const routes = getCurrentPages()
  const currentRoute = routes[routes.length - 1]?.route

  const cleanPath = (path) => {
    return path.startsWith('/') ? path : '/' + path
  }

  const normalizedCurrent = cleanPath(currentRoute || '')
  const normalizedTarget = cleanPath(pagePath)

  if (normalizedCurrent === normalizedTarget) {
    return
  }

  uni.switchTab({
    url: pagePath,
    fail: () => {
      uni.navigateTo({
        url: pagePath,
        fail: (err) => {
          console.error('导航失败:', err)
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
@use "diy-tabbar";
</style>
