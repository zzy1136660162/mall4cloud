<template>
  <view
    class="floating-service-entry"
    :style="entryStyle"
    @tap="navigateToTarget"
  >
    <view class="icon-wrap">
      <text class="icon-text">
        {{ icon }}
      </text>
    </view>
    <view class="content">
      <text class="title">
        {{ label }}
      </text>
      <text
        v-if="subtitle"
        class="subtitle"
      >
        {{ subtitle }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: '/pages/chat/chat'
  },
  label: {
    type: String,
    default: '智能客服'
  },
  subtitle: {
    type: String,
    default: '在线解答'
  },
  icon: {
    type: String,
    default: '客服'
  },
  right: {
    type: String,
    default: '28rpx'
  },
  bottom: {
    type: String,
    default: 'calc(132rpx + env(safe-area-inset-bottom))'
  }
})

const entryStyle = computed(() => ({
  right: props.right,
  bottom: props.bottom
}))

const navigateToTarget = () => {
  uni.navigateTo({
    url: props.url
  })
}
</script>

<style lang="scss" scoped>
.floating-service-entry {
  position: fixed;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 16rpx;
  min-width: 212rpx;
  padding: 18rpx 22rpx 18rpx 18rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, #1f1f1f 0%, #3a3a3a 100%);
  box-shadow: 0 12rpx 28rpx rgba(0, 0, 0, 0.18);
  box-sizing: border-box;
}

.floating-service-entry:active {
  transform: scale(0.96);
}

.icon-wrap {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
  box-shadow: inset 0 2rpx 8rpx rgba(255, 255, 255, 0.45);
}

.icon-text {
  font-size: 22rpx;
  line-height: 1;
  color: #5c3810;
  font-weight: 700;
}

.content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.title {
  font-size: 26rpx;
  line-height: 1.2;
  color: #fff;
  font-weight: 600;
}

.subtitle {
  margin-top: 4rpx;
  font-size: 20rpx;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.72);
}
</style>
