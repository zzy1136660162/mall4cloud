<template>
  <view class="page">
    <!-- TopBar -->
    <view class="top-bar">
      <view class="search-section">
        <view class="search-box">
          <text class="material-icon search-icon">search</text>
          <input class="search-input" placeholder="搜索专家、成果或关键词" placeholder-class="search-placeholder" v-model="searchQuery" @confirm="onSearch"/>
        </view>
      </view>
    </view>

    <!-- Filter Bar -->
    <view class="filter-bar">
      <view class="filter-tabs">
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'experts' }"
          @click="switchTab('experts')"
        >
          <text class="material-icon tab-icon">person</text>
          专家库
        </view>
        <view 
          class="filter-tab" 
          :class="{ active: activeTab === 'achievements' }"
          @click="switchTab('achievements')"
        >
          <text class="material-icon tab-icon">lightbulb</text>
          成果库
        </view>
      </view>
      <view class="filter-actions">
        <view class="filter-btn" @click="showFilter = !showFilter">
          <text class="material-icon filter-icon">filter_alt</text>
          筛选
        </view>
      </view>
    </view>

    <!-- Filter Drawer -->
    <view class="filter-drawer" v-if="showFilter">
      <view class="filter-mask" @click="showFilter = false"></view>
      <view class="filter-panel">
        <view class="filter-header">
          <text class="filter-title">筛选条件</text>
          <text class="material-icon filter-close" @click="showFilter = false">close</text>
        </view>
        <view class="filter-content">
          <view class="filter-group">
            <h4 class="filter-group-title">技术领域</h4>
            <view class="filter-options">
              <view 
                v-for="opt in techOptions" 
                :key="opt.value"
                class="filter-option"
                :class="{ active: selectedTech === opt.value }"
                @click="selectedTech = opt.value"
              >
                <text class="material-icon check-icon" v-if="selectedTech === opt.value">check</text>
                {{ opt.label }}
              </view>
            </view>
          </view>
          <view class="filter-group">
            <h4 class="filter-group-title">成果类型</h4>
            <view class="filter-options">
              <view 
                v-for="opt in typeOptions" 
                :key="opt.value"
                class="filter-option"
                :class="{ active: selectedType === opt.value }"
                @click="selectedType = opt.value"
              >
                <text class="material-icon check-icon" v-if="selectedType === opt.value">check</text>
                {{ opt.label }}
              </view>
            </view>
          </view>
          <view class="filter-group">
            <h4 class="filter-group-title">转化阶段</h4>
            <view class="filter-options">
              <view 
                v-for="opt in stageOptions" 
                :key="opt.value"
                class="filter-option"
                :class="{ active: selectedStage === opt.value }"
                @click="selectedStage = opt.value"
              >
                <text class="material-icon check-icon" v-if="selectedStage === opt.value">check</text>
                {{ opt.label }}
              </view>
            </view>
          </view>
        </view>
        <view class="filter-footer">
          <view class="reset-btn" @click="resetFilter">重置</view>
          <view class="confirm-btn" @click="applyFilter">确认筛选</view>
        </view>
      </view>
    </view>

    <!-- Content Area -->
    <main class="main-content">
      <!-- Expert List -->
      <view class="list-container" v-if="activeTab === 'experts'">
        <view class="list-header">
          <h3 class="list-title">
            <text class="material-icon title-icon">group</text>
            专家人才库
          </h3>
          <p class="list-count" v-if="!expertLoading">共 {{ expertList.length }} 位专家</p>
        </view>

        <!-- 加载中 -->
        <view v-if="expertLoading" class="state-card">正在加载专家信息...</view>

        <!-- 加载失败 -->
        <view v-else-if="expertError" class="state-card error-state">
          <text>{{ expertError }}</text>
          <view class="retry-btn" @tap="loadExperts(true)">重新加载</view>
        </view>

        <!-- 专家列表 -->
        <view v-else class="card-list">
          <view 
            v-for="item in expertList" 
            :key="item.id" 
            class="expert-card"
            @click="goDetail(item)"
          >
            <view class="card-avatar-wrap">
              <image v-if="item.avatar" class="card-avatar" :src="item.avatar" mode="aspectFill"></image>
              <text v-else class="avatar-placeholder">{{ item.name ? item.name.slice(0, 1) : '专' }}</text>
            </view>
            <view class="card-body">
              <view class="card-header">
                <div class="card-title-wrap">
                  <h4 class="card-name">{{ item.name || '未填写' }}</h4>
                </div>
              </view>
              <p class="card-title">{{ item.title || '未填写' }}</p>
              <p class="card-org">{{ item.org || item.region || '未填写' }}</p>
              <view class="card-tags">
                <text v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</text>
              </view>
              <view class="card-footer">
                <view class="card-stat">
                  <text class="stat-num">{{ item.experienceYears || 0 }}</text>
                  <text class="stat-label">从业年限</text>
                </view>
                <view class="card-stat">
                  <text class="stat-num">{{ item.achievements || 0 }}</text>
                  <text class="stat-label">成果荣誉</text>
                </view>
                <view class="card-stat">
                  <text class="stat-num">{{ item.projects || 0 }}</text>
                  <text class="stat-label">项目经验</text>
                </view>
              </view>
            </view>
          </view>
          <view v-if="expertList.length === 0" class="empty">暂无专家数据</view>
        </view>
      </view>

      <!-- Achievement List -->
      <view class="list-container" v-if="activeTab === 'achievements'">
        <view class="list-header">
          <h3 class="list-title">
            <text class="material-icon title-icon">workspace_premium</text>
            科技成果库
          </h3>
        </view>

        <!-- 加载中 -->
        <view v-if="achieveLoading" class="state-card">正在加载科技成果...</view>

        <!-- 加载失败 -->
        <view v-else-if="achieveError" class="state-card error-state">
          <text>{{ achieveError }}</text>
          <view class="retry-btn" @tap="loadAchievements">重新加载</view>
        </view>

        <!-- 成果列表 -->
        <view v-else class="achievement-grid">
          <view 
            v-for="item in achievementList" 
            :key="item.id" 
            class="achievement-card"
          >
            <view class="achievement-image-wrap">
              <image class="achievement-image" :src="item.image" mode="aspectFill"></image>
              <view class="achievement-badge" :class="item.badgeType">
                {{ item.badge }}
              </view>
            </view>
            <view class="achievement-body">
              <h4 class="achievement-title">{{ item.title }}</h4>
              <p class="achievement-desc">{{ item.desc }}</p>
              <view class="achievement-tags">
                <text v-for="tag in item.tags" :key="tag" class="achievement-tag">{{ tag }}</text>
              </view>
              <view class="achievement-footer">
                <view class="achievement-meta">
                  <text class="material-icon meta-icon">building</text>
                  {{ item.org }}
                </view>
                <view class="achievement-meta">
                  <text class="material-icon meta-icon">calendar_today</text>
                  {{ item.date }}
                </view>
              </view>
            </view>
          </view>
          <view v-if="achievementList.length === 0" class="empty">暂无科技成果数据</view>
        </view>
      </view>
    </main>

    <!-- Tabbar -->
    <rd-tabbar current="library" />
  </view>
</template>

<script>
import { getTalentList } from '@/utils/api/talent-pool.js'

function parseArray(value) {
  if (Array.isArray(value)) return value
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    return String(value).split(/[,，、]/).map(item => item.trim()).filter(Boolean)
  }
}

function normalizeTalent(item) {
  const expertiseAreas = parseArray(item.expertiseAreas)
  const skills = parseArray(item.skills)
  const achievements = parseArray(item.achievements)
  const projects = parseArray(item.projectExperience)
  return {
    ...item,
    org: item.region || '',
    tags: [...new Set([...expertiseAreas, ...skills])].slice(0, 4),
    achievements: achievements.length,
    projects: projects.length
  }
}

export default {
  data() {
    return {
      searchQuery: '',
      activeTab: 'experts',
      showFilter: false,
      selectedTech: '',
      selectedType: '',
      selectedStage: '',
      techOptions: [
        { label: '全部', value: '' },
        { label: '化妆品研发', value: 'cosmetics' },
        { label: '功能性食品', value: 'food' },
        { label: '天然原料', value: 'natural' },
        { label: '生物医药', value: 'biomed' },
        { label: '功效评测', value: 'efficacy' },
        { label: '品质控制', value: 'qc' }
      ],
      typeOptions: [
        { label: '全部', value: '' },
        { label: '专利技术', value: 'patent' },
        { label: '软件著作', value: 'software' },
        { label: '技术方案', value: 'scheme' },
        { label: '标准规范', value: 'standard' }
      ],
      stageOptions: [
        { label: '全部', value: '' },
        { label: '实验室阶段', value: 'lab' },
        { label: '中试阶段', value: 'pilot' },
        { label: '可量产', value: 'mass' },
        { label: '已转化', value: 'converted' }
      ],
      expertList: [],
      expertLoading: false,
      expertError: '',
      achievementList: [],
      achieveLoading: false,
      achieveError: ''
    }
  },
  onLoad() {
    this.loadExperts(true)
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
      if (tab === 'experts' && this.expertList.length === 0) {
        this.loadExperts(true)
      } else if (tab === 'achievements' && this.achievementList.length === 0) {
        this.loadAchievements()
      }
    },
    async loadExperts(reset) {
      if (this.expertLoading) return
      this.expertLoading = true
      this.expertError = ''
      try {
        const list = await getTalentList({ page: 1, pageSize: 20, name: this.searchQuery.trim() })
        this.expertList = list.map(normalizeTalent)
      } catch (error) {
        this.expertError = error && error.message ? error.message : '专家数据加载失败，请稍后重试'
      } finally {
        this.expertLoading = false
      }
    },
    async loadAchievements() {
      if (this.achieveLoading) return
      this.achieveLoading = true
      this.achieveError = ''
      try {
        // TODO: 接入成果库接口后替换
        this.achievementList = []
        this.achieveError = '成果库接口暂未开放，敬请期待'
      } finally {
        this.achieveLoading = false
      }
    },
    onSearch() {
      if (this.activeTab === 'experts') {
        this.loadExperts(true)
      }
    },
    resetFilter() {
      this.selectedTech = ''
      this.selectedType = ''
      this.selectedStage = ''
    },
    applyFilter() {
      this.showFilter = false
      uni.showToast({ title: '筛选已应用', icon: 'success' })
    },
    goDetail(item) {
      if (!item || item.id === undefined || item.id === null) return
      uni.navigateTo({ url: `/pages/expert-detail/expert-detail?id=${encodeURIComponent(item.id)}` })
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
  padding: 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #c2c6d6;
}

.search-section {
  width: 100%;
}

.search-box {
  display: flex;
  align-items: center;
  background: #eff4ff;
  border-radius: 9999rpx;
  padding: 16rpx 24rpx;
  border: 1rpx solid #dce9ff;
}

.search-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
  color: #727785;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #0b1c30;
  background: transparent;
}

.search-placeholder {
  color: #727785;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: #ffffff;
  border-bottom: 1rpx solid #c2c6d6;
}

.filter-tabs {
  display: flex;
  gap: 8rpx;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  border-radius: 9999rpx;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.4;
  color: #424754;
  background: #f8f9ff;
  transition: all 0.2s;
}

.filter-tab.active {
  background: #0058be;
  color: #ffffff;
}

.tab-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}

.filter-actions {
  display: flex;
  gap: 16rpx;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 20rpx;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
  background: #eff4ff;
  border: 1rpx solid #dce9ff;
}

.filter-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
}

/* Filter Drawer */
.filter-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.filter-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.filter-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx;
  border-bottom: 1rpx solid #c2c6d6;
}

.filter-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.filter-close {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 36rpx;
  line-height: 1;
  color: #727785;
}

.filter-content {
  flex: 1;
  overflow-y: auto;
  padding: 24rpx;
}

.filter-group {
  margin-bottom: 24rpx;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
  margin-bottom: 16rpx;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.filter-option {
  padding: 12rpx 24rpx;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
  background: #f8f9ff;
  border: 1rpx solid #dce9ff;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.filter-option.active {
  background: #0058be;
  color: #ffffff;
  border-color: #0058be;
}

.check-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 24rpx;
  line-height: 1;
}

.filter-footer {
  display: flex;
  gap: 16rpx;
  padding: 24rpx;
  border-top: 1rpx solid #c2c6d6;
}

.reset-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #424754;
  background: #f8f9ff;
  border: 1rpx solid #dce9ff;
  text-align: center;
}

.confirm-btn {
  flex: 1;
  padding: 20rpx;
  border-radius: 12rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 28rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #ffffff;
  background: #006c49;
  text-align: center;
}

/* Main Content */
.main-content {
  padding: 24rpx;
  padding-bottom: 0;
}

.list-container {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
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

.list-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

/* State Cards */
.state-card {
  margin-top: 24rpx;
  padding: 80rpx 32rpx;
  background: #ffffff;
  border-radius: 24rpx;
  color: var(--on-surface-variant);
  text-align: center;
  font-size: 26rpx;
}

.error-state {
  color: #ba1a1a;
}

.retry-btn {
  display: inline-flex;
  margin-top: 24rpx;
  padding: 14rpx 30rpx;
  border-radius: 999rpx;
  background: #0058be;
  color: #fff;
}

.empty {
  text-align: center;
  padding: 80rpx 0;
  color: #727785;
  font-size: 26rpx;
}

/* Expert Card List */
.card-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.expert-card {
  display: flex;
  gap: 20rpx;
  background: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.card-avatar-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #e8edf5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.card-avatar {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  color: #8c93a4;
  font-size: 32rpx;
  font-weight: 600;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.card-title-wrap {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.card-name {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.card-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  font-weight: 500;
  line-height: 1.4;
  color: #424754;
}

.card-org {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #727785;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.card-tag {
  font-size: 24rpx;
  background: #d3e4fe;
  color: #0b1c30;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  border: 1rpx solid #c2c6d6;
}

.card-footer {
  display: flex;
  gap: 24rpx;
  margin-top: auto;
}

.card-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.stat-num {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 32rpx;
  font-weight: 700;
  line-height: 1.2;
  color: #006c49;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

/* Achievement Grid */
.achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.achievement-card {
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
  border: 1rpx solid #c2c6d6;
  box-shadow: 0 2rpx 4rpx rgba(26, 54, 93, 0.05);
}

.achievement-image-wrap {
  position: relative;
  height: 240rpx;
}

.achievement-image {
  width: 100%;
  height: 100%;
}

.achievement-badge {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.badge-success {
  background: rgba(108, 248, 187, 0.9);
  color: #00714d;
}

.badge-primary {
  background: rgba(33, 112, 228, 0.9);
  color: #ffffff;
}

.badge-secondary {
  background: rgba(245, 158, 11, 0.9);
  color: #ffffff;
}

.badge-tertiary {
  background: rgba(114, 119, 133, 0.9);
  color: #ffffff;
}

.achievement-body {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.achievement-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.achievement-desc {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
  color: #424754;
}

.achievement-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.achievement-tag {
  font-size: 24rpx;
  background: rgba(108, 248, 187, 0.2);
  color: #00714d;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.achievement-footer {
  display: flex;
  gap: 24rpx;
  margin-top: 8rpx;
}

.achievement-meta {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 24rpx;
  line-height: 1.5;
  color: #727785;
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.meta-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 24rpx;
  line-height: 1;
}
</style>
