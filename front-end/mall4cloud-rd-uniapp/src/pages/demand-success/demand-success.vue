<template>
  <view class="page">
    <view class="content">
      <!-- 成功图标 -->
      <view class="success-icon-wrap">
        <view class="success-ring"></view>
        <view class="success-ring success-ring-2"></view>
        <view class="success-circle">
          <text class="material-icon success-tick">check</text>
        </view>
      </view>

      <view class="success-title">研发需求已成功提交</view>
      <view class="success-sub">我们将在 1-2 个工作日内完成需求评估并安排专人跟进�?/view>

      <!-- 需求摘�?-->
      <view class="summary surface-card">
        <view class="summary-head">
          <text class="material-icon sum-icon">description</text>
          <text class="sum-title">需求摘�?/text>
        </view>
        <view class="summary-body">
          <view class="sum-row">
            <text class="sum-label">需求编�?/text>
            <text class="sum-value">{{ demandNo || 'RD20260629001' }}</text>
          </view>
          <view class="sum-row">
            <text class="sum-label">提交时间</text>
            <text class="sum-value">{{ submitTime }}</text>
          </view>
          <view class="sum-row">
            <text class="sum-label">预计反馈</text>
            <text class="sum-value">2 个工作日�?/text>
          </view>
        </view>
      </view>

      <!-- 下一�?-->
      <view class="next-card surface-card">
        <view class="next-head">
          <text class="material-icon next-icon">arrow_forward</text>
          <text class="next-title">您可�?/text>
        </view>
        <view class="next-list">
          <view class="next-item">
            <view class="next-bullet">1</view>
            <view class="next-text">
              <view class="next-step">在「查询」页跟踪处理进度</view>
              <view class="next-desc">系统将实时同步需求评估、对接与立项的状态变化�?/view>
            </view>
          </view>
          <view class="next-item">
            <view class="next-bullet">2</view>
            <view class="next-text">
              <view class="next-step">在「成果库」中浏览相关专家</view>
              <view class="next-desc">根据您的领域筛选匹配的科研团队与项目�?/view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部按钮 -->
    <view class="footer">
      <view class="f-btn f-btn-outline" @click="onContinue">继续提交</view>
      <view class="f-btn f-btn-primary" @click="onTrace">查询进度</view>
    </view>
  </view>
</template>

<script>
import RdTabbar from '../../components/rd/rd-tabbar/rd-tabbar.vue'

export default {
  components: { RdTabbar },
  data() {
    return {
      demandNo: '',
      submitTime: ''
    }
  },
  onLoad(query) {
    this.demandNo = (query && query.demandNo) ? decodeURIComponent(query.demandNo) : ''
    const d = new Date()
    const pad = n => n < 10 ? '0' + n : '' + n
    this.submitTime = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
  },
  methods: {
    onContinue() {
      uni.reLaunch({ url: '/pages/index/index' })
    },
    onTrace() {
      uni.reLaunch({ url: '/pages/demand-trace/demand-trace' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f8f9ff;
  padding: 64rpx 32rpx 200rpx;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24rpx;
}

.success-icon-wrap {
  position: relative;
  width: 200rpx;
  height: 200rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #6cf8bb;
  opacity: 0.3;
  animation: ring-pulse 2s ease-out infinite;
}

.success-ring-2 {
  animation-delay: 1s;
}

@keyframes ring-pulse {
  0% { transform: scale(0.6); opacity: 0.6; }
  100% { transform: scale(1.4); opacity: 0; }
}

.success-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #006c49;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 108, 73, 0.3);
  z-index: 2;
}

.success-tick {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 72rpx;
  line-height: 1;
  color: #ffffff;
  font-weight: 400;
}

.success-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 40rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  text-align: center;
}

.success-sub {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #424754;
  text-align: center;
  margin-bottom: 16rpx;
}

.summary,
.next-card {
  width: 100%;
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  background: #ffffff;
  box-sizing: border-box;
}

.summary-head,
.next-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding-bottom: 8rpx;
  border-bottom: 1rpx solid #d3e4fe;
}

.sum-icon,
.next-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
  color: #006c49;
}

.sum-title,
.next-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #2170e4;
}

.summary-body {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.sum-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
  border-bottom: 1rpx dashed #d3e4fe;
  &:last-child { border-bottom: none; }
}

.sum-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
}

.sum-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 26rpx;
  font-weight: 600;
  color: #0b1c30;
}

.next-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.next-item {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
}

.next-bullet {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background: rgba(0, 88, 190, 0.1);
  color: #0058be;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 24rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.next-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.next-step {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.next-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
}

.footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx 32rpx 24rpx;
  background: #ffffff;
  border-top: 1rpx solid #d3e4fe;
  z-index: 30;
}

.f-btn {
  flex: 1;
  height: 88rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4rpx;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
}

.f-btn-outline {
  color: #0058be;
  background: #ffffff;
  border: 1rpx solid #0058be;
}

.f-btn-primary {
  background: #0058be;
  color: #ffffff;
  border: none;
  box-shadow: 0 2rpx 6rpx rgba(0, 88, 190, 0.2);
  &:active { background: #2170e4; transform: scale(0.98); }
}
</style>
