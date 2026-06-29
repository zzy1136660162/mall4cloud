<template>
  <view class="rd-timeline-card surface-card">
    <view class="card-header">
      <view class="card-title">转化流程概览</view>
      <view class="card-sub">标准化的八步转化路径，确保科研成果高效、安全落地。</view>
    </view>

    <scroll-view scroll-x class="timeline-scroll" :show-scrollbar="false">
      <view class="timeline">
        <view class="line"></view>
        <view
          v-for="(s, idx) in stages"
          :key="idx"
          class="stage"
        >
          <view class="dot" :class="['state-' + s.state]">{{ idx + 1 }}</view>
          <view class="label" :class="['state-' + s.state]">{{ s.name }}</view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  name: 'RdProcessTimeline',
  data() {
    return {
      stages: [
        { name: '资源入库', state: 'done' },
        { name: '需求征集', state: 'done' },
        { name: '项目立项', state: 'active' },
        { name: '概念验证', state: 'todo' },
        { name: 'CDMO 转化', state: 'todo' },
        { name: 'IP 运营', state: 'todo' },
        { name: '科学传播', state: 'todo' },
        { name: '市场转化', state: 'todo' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.rd-timeline-card {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
}

.card-sub {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.6;
  color: #424754;
}

.timeline-scroll {
  width: 100%;
  white-space: nowrap;
}

.timeline {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0;
  min-width: 100%;
  justify-content: space-between;
  padding: 24rpx 8rpx 16rpx;
}

.line {
  position: absolute;
  top: 50%;
  left: 24rpx;
  right: 24rpx;
  height: 2rpx;
  background: #d3e4fe;
  transform: translateY(-50%);
  z-index: 0;
}

.stage {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  flex: 1;
  min-width: 110rpx;
}

.dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 26rpx;
  font-weight: 600;
  border: 4rpx solid #ffffff;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
}

.dot.state-done {
  background: #006c49;
  color: #ffffff;
}

.dot.state-active {
  background: #6cf8bb;
  color: #00714d;
  box-shadow: 0 0 0 6rpx rgba(108, 248, 187, 0.4), 0 2rpx 6rpx rgba(0, 0, 0, 0.08);
}

.dot.state-todo {
  background: #d3e4fe;
  color: #424754;
}

.label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  line-height: 1;
  letter-spacing: 0.05em;
  text-align: center;
  font-weight: 500;
  white-space: nowrap;
  width: 80rpx;
}

.label.state-done {
  color: #0b1c30;
  font-weight: 600;
}

.label.state-active {
  color: #00714d;
  font-weight: 700;
}

.label.state-todo {
  color: #727785;
}
</style>
