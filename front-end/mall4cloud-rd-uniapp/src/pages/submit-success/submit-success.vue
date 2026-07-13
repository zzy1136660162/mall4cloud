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
        <view class="demand-no-row" @tap="copyDemandNo">
          <text class="demand-no">{{ demandNo }}</text>
          <text class="copy-action">复制</text>
        </view>
        <view class="warn"><text class="warn-icon">!</text> 请保存编号用于查询</view>
      </view>
      <view class="service">
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
      demandNo: '',
      phone: ''
    }
  },
  onLoad(options) {
    this.demandNo = options.demandNo ? decodeURIComponent(options.demandNo) : ''
    this.phone = options.phone || ''
  },
  methods: {
    copyDemandNo() {
      if (!this.demandNo) return
      uni.setClipboardData({
        data: this.demandNo,
        success: () => uni.showToast({ title: '需求编号已复制', icon: 'success' })
      })
    },
    onBackHome() {
      uni.switchTab({ url: '/pages/achievement/achievement' })
    },
    onQuery() {
      uni.setStorageSync('rd_query_prefill', {
        demandNo: this.demandNo,
        phone: this.phone
      })
      uni.switchTab({ url: '/pages/track/track' })
    }
  }
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(180deg, #dce9ff 0%, #f8f9ff 46%);
  padding: 70rpx 32rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.success-icon {
  width: 168rpx;
  height: 168rpx;
  background: rgba(255, 255, 255, 0.92);
  border: 2rpx solid rgba(0, 108, 73, 0.22);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  box-shadow: 0 10rpx 28rpx rgba(0, 108, 73, 0.11);
}
.circle {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: #006c49;
  border: 6rpx solid #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2rpx rgba(0, 108, 73, 0.24), 0 6rpx 16rpx rgba(0, 108, 73, 0.2);
}
.check {
  color: #ffffff;
  font-family: Arial, sans-serif;
  font-size: 62rpx;
  font-weight: 600;
  line-height: 1;
}
.title {
  font-size: 40rpx;
  font-weight: 750;
  color: #0b1c30;
  margin-bottom: 32rpx;
}
.desc-card {
  width: 100%;
  background: #ffffff;
  border-radius: 24rpx;
  border: 1rpx solid #c2c6d6;
  padding: 40rpx 32rpx;
  margin-bottom: 36rpx;
  box-shadow: 0 10rpx 30rpx rgba(60, 90, 170, 0.09);
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
.demand-no-row {
  width: 100%;
  min-height: 72rpx;
  padding: 10rpx 16rpx;
  margin-bottom: 16rpx;
  border: 2rpx solid #0058be;
  border-radius: 10rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14rpx;
  box-sizing: border-box;
}
.demand-no {
  min-width: 0;
  font-size: 32rpx;
  font-weight: 700;
  color: #0058be;
  font-family: 'Courier New', monospace;
  letter-spacing: 1rpx;
  overflow-wrap: anywhere;
}
.copy-action {
  flex-shrink: 0;
  padding-left: 14rpx;
  border-left: 1rpx solid #c2c6d6;
  color: #0058be;
  font-size: 23rpx;
  font-weight: 600;
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
  border-radius: 16rpx;
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
  border-radius: 16rpx;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 7rpx 18rpx rgba(0, 88, 190, 0.22);
}
</style>
