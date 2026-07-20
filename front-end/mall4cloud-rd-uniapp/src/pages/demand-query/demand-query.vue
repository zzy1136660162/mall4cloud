<template>
  <view class="page">
    <!-- TopBar -->
    <view class="top-bar">
      <view class="back-btn" @click="onBack">
        <text class="material-icon back-icon">arrow_back</text>
        <text class="back-text">返回</text>
      </view>
      <h2 class="page-title">需求查询</h2>
    </view>

    <main class="main-content">
      <!-- Search Form -->
      <section class="search-section">
        <view class="search-card">
          <view class="form-group">
            <label class="form-label">
              <text class="material-icon label-icon">phone</text>
              手机号码
            </label>
            <input 
              class="form-input" 
              placeholder="请输入手机号码" 
              placeholder-class="input-placeholder"
              v-model="phone"
              type="number"
              maxlength="11"
            />
          </view>

          <view class="form-group">
            <label class="form-label">
              <text class="material-icon label-icon">receipt</text>
              申请编号
            </label>
            <input 
              class="form-input" 
              placeholder="请输入申请编号（选填）" 
              placeholder-class="input-placeholder"
              v-model="orderNo"
            />
          </view>

          <view class="form-hint">
            <text class="material-icon hint-icon">info</text>
            请输入申请时填写的手机号码进行查询，申请编号可作为辅助查询条件
          </view>

          <view class="form-actions">
            <button class="btn btn-submit" :disabled="loading" @click="onSearch">
              <text class="material-icon btn-icon">search</text>
              {{ loading ? '查询中...' : '查询进度' }}
            </button>
          </view>
        </view>
      </section>

      <!-- 查询错误 -->
      <section v-if="errorMessage" class="result-section">
        <view class="result-card error-card">
          <text class="material-icon error-icon">error_outline</text>
          <text class="error-text">{{ errorMessage }}</text>
        </view>
      </section>

      <!-- Query Result -->
      <section class="result-section" v-if="result">
        <view class="section-header">
          <h3 class="section-title">查询结果</h3>
        </view>
        <view class="result-card">
          <view class="result-header">
            <div class="result-title-wrap">
              <text class="result-status" :class="resultStatusClass">{{ resultStatusText }}</text>
              <h4 class="result-title">{{ result.title || '未填写需求标题' }}</h4>
            </div>
          </view>
          
          <view class="result-info">
            <view class="info-row">
              <text class="info-label">申请编号</text>
              <text class="info-value">{{ result.demandNo }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">提交时间</text>
              <text class="info-value">{{ formatDateTime(result.submitTime || result.createTime) }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">产品品类</text>
              <text class="info-value">{{ productCategoryText }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">预算范围</text>
              <text class="info-value">{{ result.budgetRange || '未填写' }}</text>
            </view>
          </view>

          <!-- Actions -->
          <view class="result-actions">
            <view class="action-btn action-primary" @click="onDetail">
              <text>查看详情</text>
              <text class="material-icon action-icon">arrow_forward</text>
            </view>
          </view>
        </view>
      </section>

      <!-- Recent Searches -->
      <section class="recent-section" v-if="recentSearches.length > 0 && !result">
        <view class="section-header">
          <h3 class="section-title">
            <text class="material-icon title-icon">history</text>
            最近查询
          </h3>
          <text class="clear-btn" @click="clearRecent">清空</text>
        </view>
        <view class="recent-list">
          <view 
            v-for="item in recentSearches" 
            :key="item.orderNo" 
            class="recent-item"
            @click="searchByRecent(item)"
          >
            <view class="recent-info">
              <p class="recent-no">{{ item.orderNo }}</p>
              <p class="recent-date">{{ item.date }}</p>
            </view>
            <text class="material-icon recent-arrow">chevron_right</text>
          </view>
        </view>
      </section>
    </main>

    <!-- Tabbar -->
    <rd-tabbar current="query" />
  </view>
</template>

<script>
import { queryDemand } from '@/utils/api/demand-query.js'
import { PRODUCT_CATEGORY_OPTIONS } from '@/utils/dict.js'

const RECENT_KEY = 'rd_query_recent'

export default {
  data() {
    return {
      phone: '',
      orderNo: '',
      result: null,
      errorMessage: '',
      loading: false,
      recentSearches: []
    }
  },
  computed: {
    resultStatusText() {
      if (!this.result) return ''
      const map = { 0: '待处理', 1: '确认中', 2: '研发中', 3: '样品制作', 4: '已完成', 5: '已取消' }
      return this.result.statusText || map[this.result.status] || '状态未知'
    },
    resultStatusClass() {
      if (!this.result) return ''
      const status = Number(this.result.status)
      if (status === 4) return 'approved'
      if (status === 5) return 'rejected'
      return 'processing'
    },
    productCategoryText() {
      if (!this.result) return ''
      const item = PRODUCT_CATEGORY_OPTIONS.find(opt => Number(opt.value) === Number(this.result.productCategory))
      return item ? item.label : '未填写'
    }
  },
  onLoad() {
    this.loadRecent()
  },
  methods: {
    loadRecent() {
      try {
        const stored = uni.getStorageSync(RECENT_KEY)
        this.recentSearches = Array.isArray(stored) ? stored.slice(0, 5) : []
      } catch (e) {
        this.recentSearches = []
      }
    },
    saveRecent(orderNo) {
      if (!orderNo) return
      const existing = this.recentSearches.find(s => s.orderNo === orderNo)
      if (!existing) {
        this.recentSearches.unshift({
          orderNo,
          date: new Date().toLocaleString('zh-CN')
        })
        if (this.recentSearches.length > 5) {
          this.recentSearches.pop()
        }
        uni.setStorageSync(RECENT_KEY, this.recentSearches)
      }
    },
    async onSearch() {
      this.errorMessage = ''
      this.result = null
      if (!this.phone || this.phone.length !== 11) {
        this.errorMessage = '请输入正确的手机号码'
        return
      }
      this.loading = true
      try {
        const data = await queryDemand(this.orderNo.trim(), this.phone.trim())
        if (!data) {
          this.errorMessage = '未查询到需求，请核对手机号和申请编号'
          return
        }
        this.result = { ...data, demandNo: this.orderNo.trim() || data.demandNo }
        this.saveRecent(this.orderNo.trim() || data.demandNo)
      } catch (error) {
        this.errorMessage = error && error.message ? error.message : '查询失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    searchByRecent(item) {
      this.orderNo = item.orderNo
      this.onSearch()
    },
    clearRecent() {
      uni.showModal({
        title: '确认清空',
        content: '确定要清空最近查询记录吗？',
        success: (res) => {
          if (res.confirm) {
            this.recentSearches = []
            uni.removeStorageSync(RECENT_KEY)
            uni.showToast({ title: '已清空', icon: 'success' })
          }
        }
      })
    },
    onBack() {
      uni.navigateBack({ delta: 1, fail: () => uni.reLaunch({ url: '/pages/index/index' }) })
    },
    onDetail() {
      if (!this.result) return
      uni.navigateTo({
        url: `/pages/demand-detail/demand-detail?demandNo=${encodeURIComponent(this.result.demandNo)}&submitterPhone=${encodeURIComponent(this.phone)}`
      })
    },
    formatDateTime(value) {
      if (!value) return '未填写'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return String(value)
      const pad = n => String(n).padStart(2, '0')
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f8f9ff;
  color: #0b1c30;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
}

.top-bar {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #c2c6d6;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #424754;
  margin-right: 24rpx;
}

.back-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 40rpx;
  line-height: 1;
}

.back-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.page-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 36rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
}

.main-content {
  padding: 24rpx;
  padding-bottom: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 24rpx;
}

.search-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.form-group {
  margin-bottom: 24rpx;
}

.form-group:last-of-type {
  margin-bottom: 16rpx;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  margin-bottom: 8rpx;
}

.label-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}

.form-input {
  width: 100%;
  padding: 16rpx 20rpx;
  border-radius: 12rpx;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #0b1c30;
  background: #eff4ff;
  border: 1rpx solid #dce9ff;
  box-sizing: border-box;
}

.input-placeholder {
  color: #727785;
}

.form-hint {
  display: flex;
  align-items: flex-start;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  background: rgba(33, 112, 228, 0.05);
  border-radius: 8rpx;
  margin-bottom: 24rpx;
  color: #424754;
  font-size: 24rpx;
}

.hint-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
  color: #0058be;
  flex-shrink: 0;
}

.form-actions {
  display: flex;
  gap: 16rpx;
}

.btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.btn-submit {
  background: #006c49;
  color: #ffffff;
}

.btn:disabled {
  opacity: 0.6;
}

.btn-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
}

/* Error Card */
.error-card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 40rpx 24rpx;
}

.error-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 40rpx;
  color: #ba1a1a;
}

.error-text {
  color: #ba1a1a;
  font-size: 26rpx;
}

/* Recent Section */
.recent-section {
  margin-bottom: 24rpx;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.section-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 30rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.title-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
}

.clear-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

.recent-list {
  background: #ffffff;
  border-radius: 16rpx;
  border: 1rpx solid #c2c6d6;
  overflow: hidden;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  border-bottom: 1rpx solid #c2c6d6;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.recent-no {
  font-family: 'JetBrains Mono', monospace;
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #0b1c30;
}

.recent-date {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 24rpx;
  line-height: 1.5;
  color: #727785;
}

.recent-arrow {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
  color: #c2c6d6;
}

/* Result Section */
.result-section {
  margin-bottom: 24rpx;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.result-card {
  background: #ffffff;
  border-radius: 16rpx;
  padding: 24rpx;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}

.result-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.result-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  width: fit-content;
}

.result-status.processing {
  background: rgba(33, 112, 228, 0.15);
  color: #0058be;
}

.result-status.approved {
  background: rgba(108, 248, 187, 0.3);
  color: #00714d;
}

.result-status.rejected {
  background: rgba(254, 109, 115, 0.15);
  color: #c91a23;
}

.result-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

/* Result Info */
.result-info {
  background: #f8f9ff;
  border-radius: 12rpx;
  padding: 16rpx;
  margin-bottom: 20rpx;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
  border-bottom: 1rpx solid #dce9ff;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

.info-value {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 24rpx;
  line-height: 1.5;
  color: #0b1c30;
}

/* Result Actions */
.result-actions {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  flex: 1;
  padding: 16rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 26rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.action-primary {
  background: #006c49;
  color: #ffffff;
}

.action-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}
</style>
