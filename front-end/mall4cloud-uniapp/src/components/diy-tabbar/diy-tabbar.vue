<template>
  <view class="diy-tabbar">
    <view
      v-for="(item, index) in tabList"
      :key="index"
      :class="['tab-item', { active: currentIndex === index }]"
      @tap="switchTab(index)"
    >
      <view class="icon">
        <image :src="currentIndex === index ? item.selectedIcon : item.icon" mode="aspectFit" />
      </view>
      <view class="text">{{ item.text }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  currentIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['change', 'switch'])

const current = ref(props.currentIndex)

const tabList = [
  {
    text: '首页',
    pagePath: '/pages/index/index',
    icon: '/static/tabbar/index.png',
    selectedIcon: '/static/tabbar/index-r.png'
  },
  {
    text: '研发',
    pagePath: '/pages/demand-index/demand-index',
    icon: '/static/tabbar/dev.png',
    selectedIcon: '/static/tabbar/dev-r.png'
  },
  {
    text: '选品',
    pagePath: '/pages/sample/selection/selection',
    icon: '/static/tabbar/selection.png',
    selectedIcon: '/static/tabbar/selection-r.png'
  },
  {
    text: '商城',
    pagePath: '/pages/shop-prods/shop-prods',
    icon: '/static/tabbar/mall.png',
    selectedIcon: '/static/tabbar/mall-r.png'
  },
  {
    text: '我的',
    pagePath: '/pages/my/my',
    icon: '/static/tabbar/my.png',
    selectedIcon: '/static/tabbar/my-r.png'
  }
]

watch(() => props.currentIndex, (val) => {
  current.value = val
})

function switchTab(index) {
  if (current.value === index) return
  current.value = index
  emit('change', index)
  emit('switch', tabList[index])

  const item = tabList[index]
  if (item && item.pagePath) {
    const url = item.pagePath
    if (url.startsWith('/')) {
      uni.switchTab({ url })
    } else {
      uni.navigateTo({ url })
    }
  }
}
</script>

<style lang="scss" scoped>
.diy-tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 999;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 10rpx 0;
  transition: all 0.3s;
}

.tab-item .icon {
  width: 44rpx;
  height: 44rpx;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-item .icon image {
  width: 100%;
  height: 100%;
}

.tab-item .text {
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
  transition: all 0.3s;
}

.tab-item.active .text {
  color: #f6bd5f;
  font-weight: 600;
}
</style>
