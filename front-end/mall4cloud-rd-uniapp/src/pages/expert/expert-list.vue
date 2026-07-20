<template>
  <view class="page">
    <!-- 搜索 + 标题 -->
    <view class="topbar">
      <view class="page-title">专家与成果库</view>
      <view class="page-sub">智能搜索与筛选大健康科技资源</view>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar surface-card">
      <text class="material-icon search-icon">search</text>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="搜索专家、成果、关键词"
        placeholder-class="ph"
        @confirm="onSearch"
      />
      <text v-if="keyword" class="material-icon search-clear" @click="clearKeyword">close</text>
    </view>

    <!-- 领域筛选 -->
    <view class="filter-section">
      <rd-filter-chips
        v-model="activeField"
        :list="fieldChips"
        @change="onSearch"
      />
    </view>

    <!-- 加载中 -->
    <view v-if="loading" class="state-card">正在加载专家信息...</view>

    <!-- 加载失败 -->
    <view v-else-if="errorMessage" class="state-card error-state">
      <text>{{ errorMessage }}</text>
      <view class="retry-btn" @tap="loadExperts(true)">重新加载</view>
    </view>

    <!-- 列表 -->
    <view v-else class="result-list">
      <rd-expert-card
        v-for="(e, idx) in filteredExperts"
        :key="idx"
        v-bind="e"
        @tap="onCardTap"
      />
      <view v-if="filteredExperts.length === 0" class="empty">
        <text class="material-icon empty-icon">inbox</text>
        <text class="empty-text">暂无相关专家</text>
      </view>
    </view>

    <rd-tabbar current="database" />
  </view>
</template>

<script>
import { getTalentList } from '@/utils/api/talent-pool.js'
import RdExpertCard from '../../components/rd/rd-expert-card/rd-expert-card.vue'
import RdFilterChips from '../../components/rd/rd-filter-chips/rd-filter-chips.vue'
import RdTabbar from '../../components/rd/rd-tabbar/rd-tabbar.vue'

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

function normalizeExpert(item) {
  const expertiseAreas = parseArray(item.expertiseAreas)
  const skills = parseArray(item.skills)
  const achievements = parseArray(item.achievements)
  return {
    name: item.name || '未填写',
    title: item.title || '未填写',
    org: item.region || '未填写',
    tags: [...new Set([...expertiseAreas, ...skills])].slice(0, 4),
    desc: item.intro || '该专家暂未填写个人简介',
    achievements: achievements.length,
    avatarBg: 'avatar-blue',
    avatarIcon: 'person',
    id: item.id
  }
}

export default {
  components: {
    RdExpertCard,
    RdFilterChips,
    RdTabbar
  },
  data() {
    return {
      keyword: '',
      activeField: 'all',
      fieldChips: [
        { label: '全部领域', value: 'all' },
        { label: '化妆品研发', value: 'cosmetics' },
        { label: '功能性食品', value: 'food' },
        { label: '天然原料', value: 'natural' },
        { label: '生物医药', value: 'biomed' },
        { label: '功效评测', value: 'efficacy' }
      ],
      experts: [],
      loading: false,
      errorMessage: ''
    }
  },
  onLoad() {
    this.loadExperts(true)
  },
  computed: {
    filteredExperts() {
      const kw = this.keyword.trim()
      return this.experts.filter(e => {
        if (!kw) return true
        return [e.name, e.title, e.org, e.desc, ...(e.tags || [])].some(s => (s || '').includes(kw))
      })
    }
  },
  methods: {
    async loadExperts(reset) {
      if (this.loading) return
      this.loading = true
      this.errorMessage = ''
      try {
        const list = await getTalentList({ page: 1, pageSize: 20, name: this.keyword.trim() })
        this.experts = list.map(normalizeExpert)
      } catch (error) {
        this.errorMessage = error && error.message ? error.message : '专家数据加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.loadExperts(true)
    },
    clearKeyword() {
      this.keyword = ''
      this.loadExperts(true)
    },
    onCardTap() {
      uni.navigateTo({ url: '/pages/expert-detail/expert-detail' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: #f8f9ff;
  padding: 24rpx 24rpx 200rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.topbar {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  padding: 8rpx 8rpx 0;
}

.page-title {
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 40rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0058be;
}

.page-sub {
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #424754;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background: #ffffff;
  border-radius: 12rpx;
}

.search-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
  color: #424754;
}

.search-input {
  flex: 1;
  height: 60rpx;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 28rpx;
  line-height: 1.5;
  color: #0b1c30;
}

.search-clear {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 32rpx;
  line-height: 1;
  color: #727785;
}

.ph {
  color: #727785;
}

.filter-section {
  padding: 8rpx 0;
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 8rpx;
}

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 80rpx 0;
  color: #727785;
}

.empty-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 80rpx;
  line-height: 1;
  color: #c2c6d6;
}

.empty-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
}
</style>
