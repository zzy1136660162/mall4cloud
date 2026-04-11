<template>
  <view class="page">
    <view class="header">
      <text class="title">研发</text>
      <text class="subtitle">产品研发与创新</text>
    </view>
    <view class="content">
      <view class="feature-card">
        <view class="feature-icon">🔬</view>
        <view class="feature-title">OEM/ODM</view>
        <view class="feature-desc">专业贴牌加工服务</view>
      </view>
      <view class="feature-card">
        <view class="feature-icon">📋</view>
        <view class="feature-title">资质认证</view>
        <view class="feature-desc">全方位合规支持</view>
      </view>
      <view class="feature-card">
        <view class="feature-icon">🏭</view>
        <view class="feature-title">生产制造</view>
        <view class="feature-desc">智能化生产线</view>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: env(safe-area-inset-bottom);
}

.header {
  background: linear-gradient(135deg, #134585 0%, #194276 100%);
  padding: 60rpx 40rpx;
  text-align: center;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.85);
}

.content {
  padding: 40rpx;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24rpx;
}

.feature-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  text-align: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.feature-icon {
  font-size: 60rpx;
  margin-bottom: 20rpx;
}

.feature-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.feature-desc {
  font-size: 26rpx;
  color: #666;
}
</style>
