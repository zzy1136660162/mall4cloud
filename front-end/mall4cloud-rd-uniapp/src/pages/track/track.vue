<template>
  <view class="page">
    <view class="hero-bg"></view>
    <view class="container">
      <view class="query-card">
        <view class="title">进度追踪查询</view>
        <view class="subtitle">输入立项手机号及需求编号，实时获取转化节点状态。</view>

        <view class="form-block">
          <view class="form-label">联系手机号</view>
          <view class="form-input">
            <input
              v-model="phone"
              class="real-input"
              type="number"
              maxlength="11"
              placeholder="请输入11位手机号码"
              placeholder-class="ph"
            />
          </view>
        </view>

        <view class="form-block">
          <view class="form-row">
            <view class="form-label">需求编号</view>
            <view class="form-hint">D开头编号</view>
          </view>
          <view class="form-input">
            <input
              v-model="demandNo"
              class="real-input"
              placeholder="例如：RD20260713-A1B2C3D4"
              placeholder-class="ph"
              @confirm="onQuery"
            />
          </view>
        </view>

        <view class="query-btn" :class="{ disabled: loading }" @tap="onQuery">
          <text>立即查询</text>
        </view>

        <view class="forgot" @tap="onForgot">忘记编号？联系专属技术经理</view>
      </view>
    </view>
  </view>
</template>

<script>
import { queryDemand } from '@/utils/api/demand-query.js'

export default {
  data() {
    return {
      phone: '',
      demandNo: '',
      loading: false
    }
  },
  onLoad(options) {
    if (options && options.demandNo) this.demandNo = decodeURIComponent(options.demandNo)
  },
  onShow() {
    const prefill = uni.getStorageSync('rd_query_prefill')
    if (prefill && typeof prefill === 'object') {
      this.demandNo = prefill.demandNo || this.demandNo
      this.phone = prefill.phone || this.phone
      uni.removeStorageSync('rd_query_prefill')
    }
  },
  methods: {
    async onQuery() {
      const phone = this.phone.trim()
      const demandNo = this.demandNo.trim().toUpperCase().replace(/\s+/g, '')
      if (this.loading) return
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        return uni.showToast({ title: '请输入正确的11位手机号', icon: 'none' })
      }
      if (!demandNo) {
        return uni.showToast({ title: '请输入需求编号', icon: 'none' })
      }
      this.loading = true
      uni.showLoading({ title: '查询中...' })
      try {
        const result = await queryDemand(demandNo, phone)
        uni.hideLoading()
        if (!result) {
          uni.showToast({ title: '未查询到需求，请核对手机号和需求编号', icon: 'none', duration: 2500 })
          return
        }
        uni.navigateTo({
          url: `/pages/demand-detail/demand-detail?demandNo=${encodeURIComponent(demandNo)}&submitterPhone=${encodeURIComponent(phone)}`
        })
      } catch (error) {
        uni.hideLoading()
        uni.showToast({ title: error && error.message ? error.message : '查询失败，请稍后重试', icon: 'none' })
      } finally {
        this.loading = false
      }
    },
    onForgot() {
      uni.showModal({
        title: '联系专属技术经理',
        content: '客服电话：400-123-4567\n服务时间：9:00-18:00',
        showCancel: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: var(--bg-page);
  padding-bottom: 0;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background: linear-gradient(180deg, #eaf1ff 0%, #f8f9ff 100%);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  padding: 120rpx 48rpx 200rpx;
}

.query-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: 2rpx solid var(--outline-variant);
  padding: 56rpx 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.04);
}

.title {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--on-surface);
  text-align: center;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 26rpx;
  color: var(--on-surface-variant);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 56rpx;
}

.form-block {
  margin-bottom: 32rpx;
}

.form-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label {
  font-size: 26rpx;
  color: var(--on-surface);
  font-weight: 500;
  margin-bottom: 12rpx;
}

.form-hint {
  font-size: 24rpx;
  color: var(--on-surface-variant);
}

.form-input {
  display: flex;
  align-items: center;
  background: var(--surface-container-low);
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 96rpx;
}

.input-icon {
  font-size: 32rpx;
  margin-right: 16rpx;
  color: var(--on-surface-variant);
}

.real-input {
  flex: 1;
  font-size: 28rpx;
  color: var(--on-surface);
}

.ph {
  color: #9aa0b0;
}

.query-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  background: var(--primary);
  color: #ffffff;
  height: 96rpx;
  border-radius: 999rpx;
  font-size: 32rpx;
  font-weight: 600;
  margin-top: 56rpx;
  box-shadow: 0 6rpx 16rpx rgba(0, 88, 190, 0.25);
}
.query-btn.disabled {
  opacity: 0.65;
}

.query-icon {
  font-size: 30rpx;
}

.forgot {
  text-align: center;
  font-size: 26rpx;
  color: var(--primary);
  margin-top: 32rpx;
  text-decoration: underline;
}
</style>
