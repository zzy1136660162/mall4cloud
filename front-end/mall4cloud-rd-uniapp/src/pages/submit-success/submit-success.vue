<template>
  <view class="page">
    <view class="success-icon">
      <view class="circle">
        <text class="check">✓</text>
      </view>
    </view>
    <view class="title">提交成功</view>

    <view class="desc-card">
      <view class="desc">您的需求已成功提交至系统。我们的科研转化专员将尽快进行评估并与您联系。</view>
      <view class="demand-box">
        <view class="demand-label">需求编号</view>
        <view class="demand-no">{{ demandNo }}</view>
        <view class="warn"><text class="warn-icon">!</text> 请保存编号用于查询</view>
      </view>
      <view class="service">
        <text class="svc-icon">📞</text>
        <text class="svc-text">客服咨询：</text>
        <text class="svc-phone">400-123-4567</text>
      </view>
    </view>

    <view class="actions">
      <view class="btn-outline" @tap="onBackHome">返回首页</view>
      <view class="btn-primary" @tap="onQuery">查询进度</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      demandNo: 'RD-20231024-001'
    }
  },
  methods: {
    onBackHome() {
      uni.switchTab({ url: '/pages/achievement/achievement' })
    },
    onQuery() {
      uni.redirectTo({ url: '/pages/progress/progress' })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8f9ff;
  padding: 80rpx 48rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-icon {
  width: 320rpx;
  height: 320rpx;
  background: #e5eeff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24rpx;
}
.circle {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: #6cf8bb;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(108, 248, 187, 0.3);
}
.check {
  font-size: 80rpx;
  color: #006c49;
  font-weight: 700;
}
.title {
  font-size: 40rpx;
  font-weight: 700;
  color: #0058be;
  margin-bottom: 32rpx;
}
.desc-card {
  width: 100%;
  background: #ffffff;
  border-radius: 24rpx;
  border: 2rpx solid #c2c6d6;
  padding: 40rpx 32rpx;
  margin-bottom: 60rpx;
}
.desc {
  font-size: 28rpx;
  color: #0b1c30;
  line-height: 1.7;
  text-align: center;
  margin-bottom: 32rpx;
}
.demand-box {
  background: #e5eeff;
  border-radius: 16rpx;
  padding: 24rpx;
  text-align: center;
  margin-bottom: 32rpx;
}
.demand-label {
  font-size: 24rpx;
  color: #424754;
  margin-bottom: 12rpx;
}
.demand-no {
  font-size: 32rpx;
  font-weight: 700;
  color: #0058be;
  font-family: 'Courier New', monospace;
  letter-spacing: 2rpx;
  background: #ffffff;
  border: 2rpx solid #0058be;
  display: inline-block;
  padding: 8rpx 24rpx;
  border-radius: 8rpx;
  margin-bottom: 16rpx;
}
.warn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 22rpx;
  color: #ba1a1a;
}
.warn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  border: 2rpx solid #ba1a1a;
  font-weight: 700;
  font-size: 20rpx;
}
.service {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-size: 26rpx;
}
.svc-icon {
  font-size: 28rpx;
}
.svc-text {
  color: #424754;
}
.svc-phone {
  color: #0058be;
  font-weight: 600;
}
.actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.btn-outline {
  height: 88rpx;
  border: 2rpx solid #0058be;
  border-radius: 999rpx;
  color: #0058be;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
}
.btn-primary {
  height: 88rpx;
  background: #0058be;
  border-radius: 999rpx;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
