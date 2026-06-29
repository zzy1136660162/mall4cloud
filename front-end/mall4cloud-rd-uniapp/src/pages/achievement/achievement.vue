<template>
  <view class="page">
    <!-- 顶部蓝色渐变背景 -->
    <view class="top-bg"></view>

    <scroll-view scroll-y class="content">
      <!-- 转化流程概览 -->
      <view class="rounded-card flow">
        <view class="flow-head">
          <view class="flow-title">转化流程概览</view>
          <view class="flow-desc">标准化的八步转化路径，确保科研成果高效、安全落地。</view>
        </view>
        <scroll-view scroll-x class="flow-stages-scroll" :show-scrollbar="false">
          <view class="flow-stages">
            <view class="flow-line"></view>
            <view
              class="stage"
              v-for="(s, i) in flowStages"
              :key="s.id"
              :class="{ active: s.active, done: i < 2 }"
            >
              <view class="stage-circle">
                <text class="stage-num">{{ s.id }}</text>
              </view>
              <text class="stage-name">{{ s.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 协同能力 4 项 -->
      <view class="rounded-card caps">
        <view class="cap-item" v-for="(c, idx) in capabilities" :key="c.id">
          <view class="cap-icon-wrap">
            <view class="cap-icon">{{ ['🤝', '🧪', '©', '🛰️'][idx] || '📑' }}</view>
          </view>
          <view class="cap-info">
            <view class="cap-title">{{ c.title }}</view>
            <view class="cap-desc">{{ c.desc }}</view>
            <view
              v-if="c.highlight"
              class="cap-highlight"
              :class="{ primary: c.highlightColor === 'primary' }"
              @tap="onCapTap(c)"
            >
              {{ c.highlight }} ›
            </view>
          </view>
        </view>
      </view>

      <!-- 能力卡片 2 项（灰色占位 + 描述） -->
      <view class="rounded-card ability-card" v-for="(a, i) in abilityCards" :key="a.id">
        <view class="ability-img">
          <text class="img-label">img</text>
        </view>
        <view class="ability-title">{{ a.title }}</view>
        <view class="ability-desc">{{ a.desc }}</view>
        <view class="ability-points">
          <view class="point" v-for="(p, idx) in a.points" :key="idx">
            <text class="point-icon">✓</text>
            <text class="point-text">{{ p }}</text>
          </view>
        </view>
      </view>

      <!-- 提交研发需求 按钮 -->
      <view class="rounded-card submit-card" @tap="onSubmitDemand">
        <text class="submit-icon">📝</text>
        <text class="submit-text">提交研发需求</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { flowStages, capabilities, abilityCards } from '@/utils/data.js'

export default {
  data() {
    return {
      flowStages,
      capabilities,
      abilityCards
    }
  },
  methods: {
    onCapTap(c) {
      uni.showToast({ title: '进入: ' + c.title, icon: 'none' })
    },
    onSubmitDemand() {
      uni.navigateTo({ url: '/pages/demand-submit/demand-submit' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: var(--bg-page);
}

.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 360rpx;
  background: linear-gradient(180deg, #c9d6ff 0%, #dde6ff 55%, #f3f6ff 100%);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  padding: 80rpx 32rpx 220rpx;
  box-sizing: border-box;
}

.rounded-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: none;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 6rpx 20rpx rgba(60, 90, 170, 0.08);
}

/* 流程 */
.flow-head {
  margin-bottom: 24rpx;
}
.flow-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 8rpx;
}
.flow-desc {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.flow-stages-scroll {
  white-space: nowrap;
  width: 100%;
}
.flow-stages {
  display: inline-flex;
  align-items: flex-start;
  position: relative;
  padding: 30rpx 0 10rpx;
  min-width: 100%;
  justify-content: space-between;
}
.flow-line {
  position: absolute;
  top: 60rpx;
  left: 30rpx;
  right: 30rpx;
  height: 4rpx;
  background: var(--surface-variant);
  z-index: 0;
}
.stage {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 110rpx;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.stage-circle {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: var(--surface-variant);
  color: var(--on-surface-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
  border: 4rpx solid #ffffff;
  box-shadow: 0 2rpx 8rpx rgba(11, 28, 48, 0.06);
}
.stage.done .stage-circle {
  background: var(--secondary);
  color: #ffffff;
}
.stage.active .stage-circle {
  background: var(--secondary-container);
  color: var(--secondary);
  box-shadow: 0 0 0 4rpx rgba(108, 248, 187, 0.3);
}
.stage-name {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: var(--on-surface-variant);
  text-align: center;
  line-height: 1.3;
  white-space: normal;
  width: 100rpx;
}
.stage.done .stage-name {
  color: var(--on-surface);
  font-weight: 600;
}
.stage.active .stage-name {
  color: var(--secondary);
  font-weight: 700;
}

/* 协同能力 */
.cap-item {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--outline-variant);
}
.cap-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.cap-item:first-child {
  padding-top: 0;
}
.cap-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: var(--primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cap-icon {
  font-size: 36rpx;
}
.cap-info {
  flex: 1;
}
.cap-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 8rpx;
}
.cap-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--on-surface-variant);
}
.cap-highlight {
  margin-top: 12rpx;
  display: inline-flex;
  align-items: center;
  padding: 6rpx 16rpx;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 8rpx;
  font-size: 22rpx;
  font-weight: 500;
}

/* 能力卡片 */
.ability-card {
  background: #ffffff;
}
.ability-img {
  width: 100%;
  height: 240rpx;
  background: #e8edf5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}
.img-label {
  color: #8c93a4;
  font-size: 24rpx;
}
.ability-title {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 12rpx;
}
.ability-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--on-surface-variant);
  margin-bottom: 16rpx;
}
.ability-points {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.point {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.point-icon {
  color: var(--primary);
  font-size: 24rpx;
  font-weight: 700;
}
.point-text {
  font-size: 24rpx;
  color: var(--on-surface);
}

/* 提交按钮 */
.submit-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: var(--primary);
  border: none;
  color: #ffffff;
  height: 96rpx;
  font-size: 30rpx;
  font-weight: 600;
  margin-bottom: 32rpx;
}
.submit-icon {
  font-size: 32rpx;
}
</style>
