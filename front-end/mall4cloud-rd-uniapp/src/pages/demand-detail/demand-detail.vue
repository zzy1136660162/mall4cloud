<template>
  <view class="page">
    <view v-if="loading" class="state-panel">正在加载需求详情...</view>
    <view v-else-if="errorMessage" class="state-panel error-state">
      <text>{{ errorMessage }}</text>
      <view class="retry-btn" @tap="loadDemand">重新查询</view>
    </view>
    <scroll-view v-else-if="demand" scroll-y class="content">
      <view class="status-card card" :class="statusClass">
        <view class="status-top">
          <view>
            <view class="demand-no-line" @tap="copyDemandNo">
              <text class="demand-no">{{ demand.demandNo }}</text>
              <text class="copy-action">复制</text>
            </view>
            <view class="title">{{ demand.title || '未填写需求标题' }}</view>
          </view>
          <view class="status-chip">{{ statusText }}</view>
        </view>
        <view class="progress-track">
          <view class="progress-value" :style="{ width: progressPercent + '%' }"></view>
        </view>
        <view class="status-caption">当前处理进度</view>
      </view>

      <view class="card">
        <view class="section-title">申请信息</view>
        <view class="info-row"><text class="label">产品品类</text><text class="value">{{ productCategoryText }}</text></view>
        <view class="info-row"><text class="label">期望服务</text><text class="value">{{ serviceTypeText }}</text></view>
        <view class="info-row"><text class="label">对接领域</text><text class="value">{{ demand.expertiseField || '未填写' }}</text></view>
        <view class="info-row"><text class="label">预算范围</text><text class="value">{{ demand.budgetRange || '未填写' }}</text></view>
        <view class="info-row"><text class="label">期望交付</text><text class="value">{{ formatDate(demand.expectedDeliveryTime) }}</text></view>
        <view class="info-row"><text class="label">产品形态</text><text class="value">{{ demand.dosageFormPreference || '未填写' }}</text></view>
        <view class="info-row"><text class="label">提交时间</text><text class="value">{{ formatDateTime(demand.submitTime || demand.createTime) }}</text></view>
      </view>

      <view class="card">
        <view class="section-title">研发诉求</view>
        <view class="text-label">研发目标与功能诉求</view>
        <view class="paragraph">{{ demand.functionalAppeal || '未填写' }}</view>
        <view class="text-label gap-top">目标用户 / 应用场景</view>
        <view class="paragraph">{{ demand.targetAudience || '未填写' }}</view>
        <template v-if="demand.remark">
          <view class="text-label gap-top">补充说明</view>
          <view class="paragraph">{{ demand.remark }}</view>
        </template>
      </view>

      <view class="card">
        <view class="section-title">联系信息</view>
        <view class="info-row"><text class="label">联系人</text><text class="value">{{ demand.submitterName || '未填写' }}</text></view>
        <view class="info-row"><text class="label">联系电话</text><text class="value">{{ maskedPhone }}</text></view>
      </view>

      <view class="card handle-card">
        <view class="section-title">平台处理信息</view>
        <view class="handle-content">{{ demand.adminRemark || '平台正在评估需求，暂无处理备注。' }}</view>
        <view v-if="demand.handlerName" class="handler">处理人：{{ demand.handlerName }}</view>
        <view v-if="demand.updateTime" class="handler">最近更新：{{ formatDateTime(demand.updateTime) }}</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { queryDemand } from '@/utils/api/demand-query.js'
import { PRODUCT_CATEGORY_OPTIONS, SERVICE_TYPE_OPTIONS } from '@/utils/dict.js'

const STATUS_TEXT = {
  0: '待处理',
  1: '确认中',
  2: '研发中',
  3: '样品制作',
  4: '已完成',
  5: '已取消'
}

function parseServiceTypes(value) {
  if (Array.isArray(value)) return value.map(String)
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.map(String) : []
  } catch (e) {
    return String(value).split(/[,，、]/).map(item => item.trim()).filter(Boolean)
  }
}

export default {
  data() {
    return {
      demandNo: '',
      submitterPhone: '',
      demand: null,
      loading: true,
      errorMessage: ''
    }
  },
  computed: {
    statusText() {
      return this.demand.statusText || STATUS_TEXT[this.demand.status] || '状态未知'
    },
    statusClass() {
      if (Number(this.demand.status) === 4) return 'completed'
      if (Number(this.demand.status) === 5) return 'cancelled'
      return 'processing'
    },
    progressPercent() {
      const status = Number(this.demand.status)
      if (status === 4) return 100
      if (status === 5) return 100
      return [16, 32, 54, 76][status] || 12
    },
    productCategoryText() {
      const item = PRODUCT_CATEGORY_OPTIONS.find(option => Number(option.value) === Number(this.demand.productCategory))
      return item ? item.label : '未填写'
    },
    serviceTypeText() {
      const values = parseServiceTypes(this.demand.serviceType)
      const labels = values.map((value) => {
        const item = SERVICE_TYPE_OPTIONS.find(option => String(option.value) === String(value))
        return item ? item.label : value
      })
      return labels.length ? labels.join('、') : '未填写'
    },
    maskedPhone() {
      const phone = this.demand.submitterPhone || this.submitterPhone
      return /^1[3-9]\d{9}$/.test(phone) ? `${phone.slice(0, 3)}****${phone.slice(7)}` : (phone || '未填写')
    }
  },
  onLoad(options) {
    this.demandNo = options && options.demandNo ? decodeURIComponent(options.demandNo) : ''
    this.submitterPhone = options && options.submitterPhone ? decodeURIComponent(options.submitterPhone) : ''
    this.loadDemand()
  },
  methods: {
    copyDemandNo() {
      if (!this.demand || !this.demand.demandNo) return
      uni.setClipboardData({
        data: this.demand.demandNo,
        success: () => uni.showToast({ title: '需求编号已复制', icon: 'success' })
      })
    },
    async loadDemand() {
      if (!this.demandNo || !this.submitterPhone) {
        this.loading = false
        this.errorMessage = '查询参数不完整，请返回后重新输入手机号和需求编号'
        return
      }
      this.loading = true
      this.errorMessage = ''
      try {
        const result = await queryDemand(this.demandNo, this.submitterPhone)
        if (!result) throw new Error('未查询到需求，请核对手机号和需求编号')
        this.demand = result
      } catch (error) {
        this.errorMessage = error && error.message ? error.message : '需求详情加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    formatDate(value) {
      if (!value) return '未填写'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value).slice(0, 10)
      return `${date.getFullYear()}-${this.pad(date.getMonth() + 1)}-${this.pad(date.getDate())}`
    },
    formatDateTime(value) {
      if (!value) return '未填写'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      return `${this.formatDate(value)} ${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`
    },
    pad(value) {
      return String(value).padStart(2, '0')
    }
  }
}
</script>

<style lang="scss" scoped>
.page { min-height: 100vh; background: var(--bg-page); }
.content { height: 100vh; box-sizing: border-box; padding: 28rpx 28rpx 90rpx; }
.card { background: #fff; border-radius: 24rpx; padding: 30rpx; margin-bottom: 24rpx; box-shadow: 0 6rpx 20rpx rgba(60, 90, 170, 0.08); }
.status-card { border-top: 8rpx solid var(--primary); }
.status-card.completed { border-top-color: var(--secondary); }
.status-card.cancelled { border-top-color: var(--error); }
.status-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 20rpx; }
.demand-no-line { display: flex; align-items: center; gap: 12rpx; max-width: 520rpx; }
.demand-no { min-width: 0; color: var(--primary); font-size: 24rpx; font-family: monospace; font-weight: 700; overflow-wrap: anywhere; }
.copy-action { flex-shrink: 0; padding: 4rpx 10rpx; border-radius: 8rpx; background: var(--primary-light); color: var(--primary); font-size: 20rpx; }
.title { margin-top: 10rpx; color: var(--on-surface); font-size: 32rpx; font-weight: 700; }
.status-chip { flex-shrink: 0; padding: 10rpx 20rpx; border-radius: 999rpx; background: var(--primary-light); color: var(--primary); font-size: 23rpx; font-weight: 600; }
.completed .status-chip { background: var(--secondary-container); color: var(--secondary); }
.cancelled .status-chip { background: #ffdad6; color: var(--error); }
.progress-track { height: 12rpx; margin-top: 30rpx; border-radius: 999rpx; background: var(--surface-container); overflow: hidden; }
.progress-value { height: 100%; background: var(--primary); border-radius: inherit; }
.completed .progress-value { background: var(--secondary); }
.cancelled .progress-value { background: var(--error); }
.status-caption { margin-top: 10rpx; color: var(--on-surface-variant); font-size: 21rpx; }
.section-title { color: var(--primary); font-size: 29rpx; font-weight: 700; padding-bottom: 16rpx; margin-bottom: 8rpx; border-bottom: 1rpx solid var(--outline-variant); }
.info-row { display: flex; justify-content: space-between; gap: 30rpx; padding: 20rpx 0; border-bottom: 1rpx solid var(--outline-variant); font-size: 25rpx; }
.info-row:last-child { border-bottom: 0; }
.label { color: var(--on-surface-variant); flex-shrink: 0; }
.value { color: var(--on-surface); text-align: right; }
.text-label { color: var(--on-surface); font-size: 25rpx; font-weight: 600; margin-top: 20rpx; }
.gap-top { margin-top: 30rpx; }
.paragraph { margin-top: 12rpx; color: var(--on-surface-variant); font-size: 25rpx; line-height: 1.75; white-space: pre-wrap; }
.handle-card { margin-bottom: 90rpx; }
.handle-content { padding: 24rpx; margin-top: 20rpx; border-radius: 16rpx; background: var(--surface-container-low); color: var(--on-surface); font-size: 25rpx; line-height: 1.7; }
.handler { margin-top: 16rpx; color: var(--on-surface-variant); font-size: 23rpx; text-align: right; }
.state-panel { margin: 220rpx 32rpx 0; padding: 70rpx 32rpx; background: #fff; border-radius: 24rpx; text-align: center; color: var(--on-surface-variant); font-size: 26rpx; }
.error-state { color: var(--error); }
.retry-btn { display: inline-flex; margin-top: 24rpx; padding: 14rpx 30rpx; border-radius: 999rpx; background: var(--primary); color: #fff; }
</style>
