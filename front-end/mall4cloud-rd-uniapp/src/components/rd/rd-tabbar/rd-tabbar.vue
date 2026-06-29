<template>
  <view class="rd-tabbar" :style="{ paddingBottom: safeBottom }">
    <view
      v-for="(it, idx) in items"
      :key="idx"
      class="tab-item"
      :class="{ active: current === it.key }"
      @click="onTap(it)"
    >
      <view class="icon-wrap" :class="{ 'icon-active': current === it.key }">
        <text class="material-icon" :class="{ 'fill-icon': current === it.key }">{{ it.icon }}</text>
      </view>
      <text class="label" :class="{ 'label-active': current === it.key }">{{ it.label }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RdTabbar',
  props: {
    current: {
      type: String,
      default: 'home'
    }
  },
  data() {
    return {
      items: [
        { key: 'home', label: '首页', icon: 'home', url: '/pages/index/index' },
        { key: 'database', label: '成果库', icon: 'database', url: '/pages/expert/expert-list' },
        { key: 'search', label: '查询', icon: 'search', url: '/pages/demand-trace/demand-trace' },
        { key: 'person', label: '我的', icon: 'person', url: '/pages/my/my' }
      ],
      safeBottom: 0
    }
  },
  mounted() {
    try {
      const sys = uni.getSystemInfoSync()
      this.safeBottom = (sys.safeAreaInsets && sys.safeAreaInsets.bottom) ? sys.safeAreaInsets.bottom + 'px' : 'env(safe-area-inset-bottom)'
    } catch (e) {
      this.safeBottom = 'env(safe-area-inset-bottom)'
    }
  },
  methods: {
    onTap(item) {
      if (item.key === this.current) return
      uni.reLaunch({ url: item.url })
    }
  }
}
</script>

<style lang="scss" scoped>
.rd-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  background: #e5eeff;
  border-top: 1rpx solid #c2c6d6;
  box-shadow: 0 -4rpx 16rpx rgba(26, 54, 93, 0.06);
  border-radius: 24rpx 24rpx 0 0;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  color: #424754;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.92);
  }
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 48rpx;
  border-radius: 9999rpx;
  transition: background 0.2s;

  &.icon-active {
    background: rgba(108, 248, 187, 0.3);
  }
}

.material-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 40rpx;
  line-height: 1;
  font-weight: 400;
}

.fill-icon {
  font-variation-settings: 'FILL' 1;
}

.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  line-height: 1;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.label-active {
  color: #00714d;
  font-weight: 700;
}
</style>
