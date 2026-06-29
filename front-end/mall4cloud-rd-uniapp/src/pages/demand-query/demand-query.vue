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
            <button class="btn btn-submit" @click="onSearch">
              <text class="material-icon btn-icon">search</text>
              查询进度
            </button>
          </view>
        </view>
      </section>

      <!-- Recent Searches -->
      <section class="recent-section" v-if="recentSearches.length > 0">
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

      <!-- Sample Results -->
      <section class="result-section" v-if="showResults">
        <view class="section-header">
          <h3 class="section-title">查询结果</h3>
        </view>
        <view class="result-card">
          <view class="result-header">
            <div class="result-title-wrap">
              <text class="result-status" :class="result.status">{{ result.statusText }}</text>
              <h4 class="result-title">{{ result.title }}</h4>
            </div>
            <view class="result-badge" :class="result.badgeType">
              <text class="material-icon badge-icon">{{ result.badgeIcon }}</text>
            </view>
          </view>
          
          <view class="result-info">
            <view class="info-row">
              <text class="info-label">申请编号</text>
              <text class="info-value">{{ result.orderNo }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">提交时间</text>
              <text class="info-value">{{ result.submitTime }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">预计完成</text>
              <text class="info-value">{{ result.expectedTime }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">负责人</text>
              <text class="info-value">{{ result.manager }}</text>
            </view>
          </view>

          <!-- Timeline -->
          <view class="timeline">
            <view 
              v-for="(step, idx) in result.timeline" 
              :key="idx" 
              class="timeline-item"
              :class="{ active: step.active, completed: step.completed }"
            >
              <view class="timeline-dot">
                <text class="material-icon dot-icon" v-if="step.completed">check</text>
              </view>
              <view class="timeline-content">
                <h5 class="timeline-title">{{ step.title }}</h5>
                <p class="timeline-desc">{{ step.desc }}</p>
                <p class="timeline-time">{{ step.time }}</p>
              </view>
            </view>
          </view>

          <!-- Actions -->
          <view class="result-actions">
            <view class="action-btn action-outline" @click="onContact">
              <text class="material-icon action-icon">phone</text>
              联系客服
            </view>
            <view class="action-btn action-primary" @click="onDetail">
              <text>查看详情</text>
              <text class="material-icon action-icon">arrow_forward</text>
            </view>
          </view>
        </view>
      </section>
    </main>

    <!-- Tabbar -->
    <rd-tabbar current="query" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      phone: '',
      orderNo: '',
      showResults: false,
      recentSearches: [
        { orderNo: 'RD2024010001', date: '2024-01-15 10:30' },
        { orderNo: 'RD2024010002', date: '2024-01-14 14:20' },
        { orderNo: 'RD2024010003', date: '2024-01-13 09:45' }
      ],
      result: {
        orderNo: 'RD2024010001',
        title: '新型固态电池材料研发立项申请',
        status: 'processing',
        statusText: '审核中',
        badgeType: 'badge-processing',
        badgeIcon: 'schedule',
        submitTime: '2024-01-15 10:30',
        expectedTime: '2024-01-25 18:00',
        manager: '张工 (138****8888)',
        timeline: [
          { title: '申请已提交', desc: '您的研发立项申请已成功提交', time: '2024-01-15 10:30', completed: true, active: false },
          { title: '材料审核', desc: '正在审核申请材料的完整性', time: '2024-01-15 14:00', completed: true, active: false },
          { title: '专家评审', desc: '专家正在评估技术可行性和产业化前景', time: '2024-01-16 09:00', completed: false, active: true },
          { title: '立项决策', desc: '等待立项委员会最终决策', time: '', completed: false, active: false },
          { title: '任务分配', desc: '匹配专家资源并启动研发工作', time: '', completed: false, active: false }
        ]
      }
    }
  },
  methods: {
    onBack() {
      uni.navigateBack({ delta: 1, fail: () => uni.reLaunch({ url: '/pages/index/index' }) })
    },
    onSearch() {
      if (!this.phone || this.phone.length !== 11) {
        uni.showToast({ title: '请输入正确的手机号码', icon: 'none' })
        return
      }
      uni.showToast({ title: '查询中...', icon: 'loading' })
      setTimeout(() => {
        uni.hideToast()
        this.showResults = true
        if (!this.recentSearches.find(s => s.orderNo === this.orderNo)) {
          this.recentSearches.unshift({
            orderNo: this.orderNo || 'RD' + Date.now().toString().slice(-8),
            date: new Date().toLocaleString('zh-CN')
          })
          if (this.recentSearches.length > 5) {
            this.recentSearches.pop()
          }
        }
      }, 800)
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
            uni.showToast({ title: '已清空', icon: 'success' })
          }
        }
      })
    },
    onContact() {
      uni.showToast({ title: '客服电话：400-888-8888', icon: 'none' })
    },
    onDetail() {
      uni.showToast({ title: '详情页开发中', icon: 'none' })
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
  padding-bottom: 160rpx;
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
}

.hint-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
  color: #0058be;
  flex-shrink: 0;
}

.form-hint text:last-child {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 24rpx;
  line-height: 1.5;
  color: #424754;
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

.btn-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
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

.result-badge {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-processing {
  background: rgba(33, 112, 228, 0.15);
}

.badge-processing .badge-icon {
  color: #0058be;
}

.badge-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 36rpx;
  line-height: 1;
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

/* Timeline */
.timeline {
  margin-bottom: 20rpx;
}

.timeline-item {
  display: flex;
  gap: 16rpx;
  padding-bottom: 20rpx;
  position: relative;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item:not(:last-child)::after {
  content: '';
  position: absolute;
  left: 11rpx;
  top: 36rpx;
  width: 4rpx;
  height: calc(100% - 36rpx);
  background: #dce9ff;
}

.timeline-item.active::after {
  background: linear-gradient(to bottom, #0058be, #dce9ff);
}

.timeline-dot {
  width: 28rpx;
  height: 28rpx;
  border-radius: 50%;
  background: #ffffff;
  border: 4rpx solid #c2c6d6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.timeline-item.completed .timeline-dot {
  background: #006c49;
  border-color: #006c49;
}

.timeline-item.active .timeline-dot {
  background: #0058be;
  border-color: #0058be;
}

.dot-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 16rpx;
  line-height: 1;
  color: #ffffff;
}

.timeline-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.timeline-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.timeline-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 24rpx;
  line-height: 1.5;
  color: #424754;
}

.timeline-time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
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

.action-outline {
  border: 1rpx solid #0058be;
  color: #0058be;
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
