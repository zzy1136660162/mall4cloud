<template>
  <view class="rd-modules">
    <!-- 高校专家与成果协同 (col-2) -->
    <view class="module card-1 surface-card-hover" @click="onTap(1)">
      <view class="blob blob-1"></view>
      <view class="m-header">
        <text class="material-icon icon-txt primary">group_work</text>
        <view class="m-title">高校专家与成果协同</view>
      </view>
      <view class="m-desc">连接顶尖高校科研团队，整合优质前沿成果，打破信息壁垒，实现产学研高效对接与资源共享。</view>
      <view class="m-cta">
        <text>进入成果库</text>
        <text class="material-icon cta-arrow">arrow_forward</text>
      </view>
    </view>

    <!-- 概念验证与 CDMO 协同 -->
    <view class="module card-2 surface-card-hover" @click="onTap(2)">
      <view class="blob blob-2"></view>
      <view class="m-header">
        <text class="material-icon icon-txt secondary">science</text>
        <view class="m-title secondary">概念验证与 CDMO 协同</view>
      </view>
      <view class="m-desc">提供从实验室到中试生产的全面技术支持，降低转化风险。</view>
    </view>

    <!-- 知识产权运营 -->
    <view class="module card-3 surface-card-hover" @click="onTap(3)">
      <view class="blob blob-3"></view>
      <view class="m-header">
        <text class="material-icon icon-txt tertiary">gavel</text>
        <view class="m-title tertiary">知识产权运营</view>
      </view>
      <view class="m-desc">专业化的专利布局、价值评估及技术交易服务，保障核心资产。</view>
    </view>

    <!-- 专业应用评议与科学传播 (col-4 banner) -->
    <view class="module card-4 surface-card-hover" @click="onTap(4)">
      <view class="banner-bg"></view>
      <view class="banner-inner">
        <view class="banner-text">
          <view class="m-header">
            <text class="material-icon icon-txt primary">campaign</text>
            <view class="m-title">专业应用评议与科学传播</view>
          </view>
          <view class="m-desc">基于行业专家的深度评议，结合多元渠道进行精准的科学普及与市场化传播，提升成果影响力。</view>
        </view>
        <view class="banner-btn">
          <text>了解详情</text>
          <text class="material-icon chev">chevron_right</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'RdCapabilityModules',
  methods: {
    onTap(idx) {
      this.$emit('tap', idx)
    }
  }
}
</script>

<style lang="scss" scoped>
.rd-modules {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.module {
  position: relative;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  overflow: hidden;
  background: #ffffff;
  box-sizing: border-box;
}

.card-1 {
  width: 100%;
  min-height: 240rpx;
}
.card-2 {
  width: calc((100% - 16rpx) / 2);
  min-height: 240rpx;
}
.card-3 {
  width: calc((100% - 16rpx) / 2);
  min-height: 240rpx;
}
.card-4 {
  width: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #eff4ff 100%) !important;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(40rpx);
  pointer-events: none;
}

.blob-1 {
  top: -40rpx;
  right: -40rpx;
  width: 200rpx;
  height: 200rpx;
  background: rgba(0, 88, 190, 0.05);
}

.blob-2 {
  bottom: -40rpx;
  right: -40rpx;
  width: 160rpx;
  height: 160rpx;
  background: rgba(0, 108, 73, 0.05);
}

.blob-3 {
  top: -40rpx;
  left: -40rpx;
  width: 140rpx;
  height: 140rpx;
  background: rgba(70, 72, 212, 0.05);
}

.m-header {
  display: flex;
  align-items: center;
  gap: 4rpx;
  z-index: 2;
  position: relative;
}

.material-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 48rpx;
  line-height: 1;
  font-weight: 400;
}

.icon-txt.primary { color: #0058be; }
.icon-txt.secondary { color: #006c49; }
.icon-txt.tertiary { color: #4648d4; }

.m-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  flex: 1;
  &.secondary { color: #006c49; }
  &.tertiary { color: #4648d4; }
}

.m-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
  flex: 1;
  z-index: 2;
  position: relative;
}

.m-cta {
  display: flex;
  align-items: center;
  gap: 4rpx;
  margin-top: auto;
  color: #006c49;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  z-index: 2;
  position: relative;
}

.cta-arrow {
  font-size: 28rpx;
}

.banner-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #ffffff 0%, #eff4ff 100%);
  opacity: 0.5;
  pointer-events: none;
  z-index: 0;
}

.banner-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24rpx;
  width: 100%;
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex: 1;
}

.banner-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 24rpx;
  border: 1rpx solid #c2c6d6;
  border-radius: 12rpx;
  color: #0b1c30;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  background: #ffffff;
  flex-shrink: 0;
}

.chev {
  font-size: 28rpx;
}
</style>
