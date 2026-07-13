<template>
  <view class="page">
    <view class="track-hero">
      <image class="hero-image" src="/static/rd-track-hero.jpg" mode="aspectFill" />
      <view class="hero-overlay"></view>
      <view class="hero-copy">
        <view class="page-kicker">DEMAND TRACKING</view>
        <view class="hero-title">研发进度追踪</view>
        <view class="hero-desc">连接每一个转化节点，让项目状态清晰可见。</view>
      </view>
    </view>
    <view class="container">
      <view class="query-card">
        <view class="title">查询项目信息</view>
        <view class="subtitle">输入立项手机号及需求编号，获取当前转化节点状态。</view>

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
            <view class="form-hint">不区分大小写</view>
          </view>
          <view class="form-input number-input">
            <input
              :value="demandNo"
              class="real-input number-value"
              maxlength="50"
              placeholder="例如：RD20260713-A1B2C3D4"
              placeholder-class="ph"
              confirm-type="search"
              @input="onDemandNoInput"
              @confirm="onQuery"
            />
          </view>
          <view class="number-guide">
            <view class="guide-title">需求编号格式</view>
            <view class="number-parts">
              <view class="number-part">
                <text class="part-value">RD</text>
                <text class="part-label">研发需求</text>
              </view>
              <text class="part-divider">—</text>
              <view class="number-part">
                <text class="part-value">20260713</text>
                <text class="part-label">提交日期</text>
              </view>
              <text class="part-divider">—</text>
              <view class="number-part">
                <text class="part-value">A1B2C3D4</text>
                <text class="part-label">识别码</text>
              </view>
            </view>
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
    onDemandNoInput(event) {
      let value = String(event.detail.value || '').toUpperCase().replace(/\s+/g, '')
      if (/^RD\d{8}[0-9A-Z]{1,8}$/.test(value)) {
        value = `${value.slice(0, 10)}-${value.slice(10)}`
      }
      this.demandNo = value
      return value
    },
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
      const isCurrentNo = /^RD\d{8}-[0-9A-Z]{8}$/.test(demandNo)
      if (!isCurrentNo) {
        return uni.showToast({ title: '需求编号格式不正确，请核对后重试', icon: 'none', duration: 2500 })
      }
      this.demandNo = demandNo
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

.track-hero {
  position: relative;
  height: 460rpx;
  overflow: hidden;
  background: #dce9ff;
}
.hero-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.hero-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(248, 249, 255, 0) 58%, var(--bg-page) 100%),
    linear-gradient(90deg, rgba(244, 249, 255, 0.98) 0%, rgba(244, 249, 255, 0.88) 48%, rgba(244, 249, 255, 0.08) 100%);
}
.hero-copy {
  position: relative;
  z-index: 1;
  width: 68%;
  padding: calc(70rpx + env(safe-area-inset-top)) 34rpx 30rpx;
  box-sizing: border-box;
}
.hero-title {
  margin-top: 14rpx;
  color: var(--on-surface);
  font-size: 44rpx;
  line-height: 1.25;
  font-weight: 750;
}
.hero-desc {
  margin-top: 14rpx;
  color: var(--on-surface-variant);
  font-size: 23rpx;
  line-height: 1.65;
}

.container {
  position: relative;
  z-index: 2;
  margin-top: -90rpx;
  padding: 0 32rpx 160rpx;
}

.query-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: 2rpx solid var(--outline-variant);
  padding: 44rpx 36rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.04);
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  color: var(--on-surface);
  text-align: center;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 42rpx;
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
  font-size: 22rpx;
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

.number-input {
  border: 1rpx solid var(--outline-variant);
  background: #ffffff;
}

.number-value {
  font-family: 'Courier New', monospace;
  font-weight: 700;
  letter-spacing: 1rpx;
  color: var(--primary);
}

.number-guide {
  margin-top: 16rpx;
  padding: 20rpx 22rpx;
  border-radius: 14rpx;
  background: var(--primary-light);
}

.guide-title {
  margin-bottom: 14rpx;
  color: var(--primary);
  font-size: 22rpx;
  font-weight: 600;
}

.number-parts {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8rpx;
}

.number-part {
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rpx;
}

.part-value {
  color: var(--on-surface);
  font-family: 'Courier New', monospace;
  font-size: 22rpx;
  font-weight: 700;
}

.part-label {
  color: var(--on-surface-variant);
  font-size: 19rpx;
}

.part-divider {
  margin-top: 2rpx;
  color: var(--outline);
  font-size: 20rpx;
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
.page-kicker { color: var(--primary); font-size: 19rpx; font-weight: 700; letter-spacing: 2rpx; text-align: left; }
.query-card { box-shadow: 0 14rpx 40rpx rgba(25, 70, 140, 0.11); }
.form-input { background: #ffffff; border: 1rpx solid var(--outline-variant); }
.number-input { border-color: var(--primary); }
.query-btn { border-radius: 16rpx; }
</style>
