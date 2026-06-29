<template>
  <view class="rd-capabilities">
    <view
      v-for="(c, idx) in list"
      :key="idx"
      class="cap-card surface-card"
    >
      <view class="cap-image" :class="['bg-' + c.tone]">
        <!-- 文字占位：原 UI 用实验/CDMO 图片。小程序中采用主题色背景 + 图标模拟 -->
        <view class="cap-image-icon">
          <text class="material-icon icon-txt">{{ c.icon }}</text>
        </view>
        <view class="cap-image-tag tag tag-mono">{{ c.tag }}</view>
        <view class="cap-image-title">{{ c.title }}</view>
      </view>
      <view class="cap-body">
        <view class="cap-desc">{{ c.desc }}</view>
        <view class="cap-list">
          <view v-for="(it, i) in c.items" :key="i" class="cap-item">
            <text class="material-icon check-icon">check_circle</text>
            <text>{{ it }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RdCapabilityCards',
  data() {
    return {
      list: [
        {
          title: '概念验证能力',
          tag: 'PROOF',
          icon: 'science',
          desc: '配备先进的软硬件设施，针对早期科研成果进行技术可行性与商业潜力的初步验证，提供详实的数据报告。',
          items: ['原型开发支持', '技术指标测试'],
          tone: 'blue'
        },
        {
          title: 'CDMO 转化能力',
          tag: 'CDMO',
          icon: 'factory',
          desc: '提供从工艺研发、工艺放大到商业化生产的一站式服务，遵循严格的质量管理体系，加速产品上市进程。',
          items: ['GMP 标准产线', '规模化量产方案'],
          tone: 'green'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.rd-capabilities {
  display: flex;
  gap: 24rpx;
}

.cap-card {
  flex: 1;
  overflow: hidden;
  background: #ffffff;
}

.cap-image {
  height: 220rpx;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 24rpx;
  overflow: hidden;
}

.bg-blue {
  background: linear-gradient(135deg, #cbdbf5 0%, #adc6ff 100%);
}

.bg-green {
  background: linear-gradient(135deg, #b8e8d4 0%, #4edea3 100%);
}

.cap-image-icon {
  position: absolute;
  top: 24rpx;
  right: 24rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.material-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 48rpx;
  line-height: 1;
  font-weight: 400;
}

.icon-txt {
  color: #ffffff;
  font-size: 44rpx;
}

.cap-image-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  padding: 6rpx 16rpx;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 20rpx;
  font-weight: 500;
  letter-spacing: 0.1em;
  color: #0b1c30;
}

.cap-image-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
  z-index: 2;
  position: relative;
}

.cap-body {
  padding: 24rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.cap-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
}

.cap-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  margin-top: 8rpx;
}

.cap-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #0b1c30;
}

.check-icon {
  color: #006c49;
  font-size: 32rpx !important;
}
</style>
