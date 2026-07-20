<template>
  <view class="page">
    <view class="expert-hero">
    <image class="hero-image" src="/static/rd-experts-hero.jpg" mode="aspectFill" />
    <view class="hero-overlay"></view>
    <view class="page-head">
      <view class="page-kicker">EXPERT NETWORK</view>
      <view class="page-title">专家与成果库</view>
      <view class="page-desc">汇聚研发、验证与产业转化专家，快速找到适配项目需求的专业能力。</view>
    </view>
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索专家姓名、研究方向、技术关键词"
          placeholder-class="ph"
          confirm-type="search"
          @confirm="onSearch"
        />
        <view class="search-action" @tap="onSearch">搜索</view>
      </view>
    </view>
    </view>

    <!-- 领域筛选 -->
    <view class="domain-filter">
      <scroll-view scroll-x class="domain-scroll" :show-scrollbar="false">
        <view class="domain-list">
          <view
            v-for="d in domains"
            :key="d"
            class="domain-chip"
            :class="{ active: activeDomain === d }"
            @tap="activeDomain = d"
          >{{ d }}</view>
        </view>
      </scroll-view>
    </view>

    <view class="content">
      <view v-if="!loading || experts.length" class="list-head">
        <text class="list-title">专家资源</text>
        <text class="list-count">当前展示 {{ filteredExperts.length }} 位</text>
      </view>
      <!-- 专家列表 -->
      <view v-if="loading && experts.length === 0" class="state-card">
        <text>正在加载专家信息...</text>
      </view>
      <view v-else-if="errorMessage && experts.length === 0" class="state-card error-state">
        <text>{{ errorMessage }}</text>
        <view class="retry-btn" @tap="loadExperts(true)">重新加载</view>
      </view>
      <view v-else class="expert-list">
        <view class="expert-card" v-for="e in filteredExperts" :key="e.id" @tap="onCardTap(e)">
          <view class="expert-head">
            <view class="expert-avatar">
              <image v-if="e.avatar" class="avatar-image" :src="e.avatar" mode="aspectFill" />
              <text v-else class="avatar-text">{{ e.name ? e.name.slice(0, 1) : '专' }}</text>
            </view>
            <view class="expert-main">
              <view class="expert-name">{{ e.name }}</view>
              <view class="expert-title">{{ e.title }}</view>
              <view class="expert-org">{{ e.org }}</view>
              <view class="expert-tags">
                <view
                  class="expert-tag"
                  v-for="t in e.tags"
                  :key="t"
                >{{ t }}</view>
              </view>
            </view>
          </view>
          <view class="expert-desc">{{ e.desc }}</view>
          <view class="expert-footer">
            <view class="ach-row">
              <text class="ach-text">转化成果：{{ e.achievements }}项</text>
            </view>
            <view class="contact-btn" @tap.stop="onContact(e)">
              <text>查看专家详情</text>
            </view>
          </view>
        </view>

        <view v-if="filteredExperts.length === 0" class="empty">
          <text>暂无匹配专家</text>
        </view>
        <view v-else-if="loading" class="list-tip">加载中...</view>
        <view v-else-if="!hasMore" class="list-tip">没有更多了</view>
      </view>
    </view>
  </view>
</template>

<script>
import { getTalentList } from '@/utils/api/talent-pool.js'

const domains = ['全部领域', '化妆品研发', '功能性食品', '天然原料', '项目管理', '功效评测', '包装研发', '品质控制']

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
  return {
    ...item,
    org: item.region || '地区暂未填写',
    tags: [...new Set([...expertiseAreas, ...skills])].slice(0, 4),
    desc: item.intro || '该专家暂未填写个人简介',
    achievements: achievements.length,
    expertiseAreas,
    skills
  }
}

export default {
  data() {
    return {
      domains,
      experts: [],
      activeDomain: '全部领域',
      keyword: '',
      page: 1,
      pageSize: 10,
      hasMore: true,
      loading: false,
      errorMessage: ''
    }
  },
  onLoad() {
    this.loadExperts(true)
  },
  onReachBottom() {
    this.loadExperts(false)
  },
  computed: {
    filteredExperts() {
      let list = this.experts
      if (this.activeDomain !== '全部领域') {
        list = list.filter(e => e.tags.some(t => String(t).includes(this.activeDomain)) || e.org.includes(this.activeDomain))
      }
      if (this.keyword) {
        list = list.filter(e =>
          e.name.includes(this.keyword) ||
          e.title.includes(this.keyword) ||
          e.org.includes(this.keyword) ||
          e.tags.some(t => t.includes(this.keyword))
        )
      }
      return list
    }
  },
  methods: {
    async loadExperts(reset) {
      if (this.loading || (!reset && !this.hasMore)) return
      if (reset) {
        this.page = 1
        this.hasMore = true
        this.errorMessage = ''
      }
      this.loading = true
      try {
        const list = await getTalentList({
          page: this.page,
          pageSize: this.pageSize,
          name: this.keyword.trim()
        })
        const normalized = list.map(normalizeTalent)
        this.experts = reset ? normalized : this.experts.concat(normalized)
        this.hasMore = list.length >= this.pageSize
        if (this.hasMore) this.page += 1
      } catch (error) {
        this.errorMessage = error && error.message ? error.message : '专家信息加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    onSearch() {
      this.loadExperts(true)
    },
    onContact(e) {
      this.openDetail(e)
    },
    onCardTap(e) {
      this.openDetail(e)
    },
    openDetail(e) {
      if (!e || e.id === undefined || e.id === null) return
      uni.navigateTo({ url: `/pages/expert-detail/expert-detail?id=${encodeURIComponent(e.id)}` })
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
  display: flex;
  flex-direction: column;
  padding-top: 40rpx;
  padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
}
.page-head { padding: 20rpx 32rpx 10rpx; }
.page-kicker { color: var(--primary); font-size: 19rpx; font-weight: 700; letter-spacing: 2rpx; }
.page-title { margin-top: 8rpx; color: var(--on-surface); font-size: 40rpx; font-weight: 750; }
.page-desc { max-width: 650rpx; margin-top: 10rpx; color: var(--on-surface-variant); font-size: 23rpx; line-height: 1.6; }

/* 搜索栏 */
.search-bar {
  padding: 24rpx 32rpx 0;
  background: var(--bg-page);
}
.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1rpx solid var(--outline-variant);
  border-radius: 16rpx;
  padding: 0 28rpx;
  height: 80rpx;
  box-shadow: 0 5rpx 16rpx rgba(60, 90, 170, 0.06);
}
.search-icon {
  font-size: 28rpx;
  color: var(--on-surface-variant);
  margin-right: 12rpx;
}
.search-input {
  flex: 1;
  font-size: 26rpx;
  color: var(--on-surface);
}
.ph {
  color: #9aa0b0;
}

/* 领域筛选 */
.domain-filter {
  padding: 24rpx 0 16rpx;
  background: var(--bg-page);
}
.domain-scroll {
  white-space: nowrap;
  width: 100%;
}
.domain-list {
  display: inline-flex;
  padding: 0 32rpx;
  gap: 16rpx;
}
.domain-chip {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 28rpx;
  background: #ffffff;
  color: var(--on-surface-variant);
  border-radius: 999rpx;
  font-size: 26rpx;
  border: 1rpx solid var(--outline-variant);
}
.domain-chip.active {
  background: var(--primary);
  color: #ffffff;
  font-weight: 500;
}

/* 列表 */
.content {
  width: 100%;
  padding: 8rpx 32rpx 0;
  box-sizing: border-box;
}
.expert-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.expert-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: 1rpx solid var(--outline-variant);
  padding: 30rpx;
  box-shadow: 0 8rpx 22rpx rgba(60, 90, 170, 0.07);
}
.expert-head {
  display: flex;
  gap: 20rpx;
  margin-bottom: 16rpx;
}
.expert-avatar {
  width: 100rpx;
  height: 100rpx;
  background: #e8edf5;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}
.avatar-text {
  color: #8c93a4;
  font-size: 22rpx;
}
.expert-main {
  flex: 1;
}
.expert-name {
  font-size: 30rpx;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 4rpx;
}
.expert-title {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  margin-bottom: 4rpx;
}
.expert-org {
  font-size: 22rpx;
  color: var(--primary);
  margin-bottom: 12rpx;
}
.expert-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.expert-tag {
  display: inline-flex;
  align-items: center;
  padding: 4rpx 16rpx;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 8rpx;
  font-size: 22rpx;
}
.expert-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--on-surface-variant);
  margin-bottom: 20rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.expert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16rpx;
  border-top: 1rpx solid var(--outline-variant);
}
.ach-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.ach-icon {
  font-size: 24rpx;
}
.ach-text {
  font-size: 24rpx;
  color: var(--on-surface-variant);
}
.contact-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 24rpx;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 999rpx;
  font-size: 24rpx;
  font-weight: 500;
}
.contact-arrow {
  font-size: 22rpx;
}
.empty {
  text-align: center;
  color: var(--on-surface-variant);
  padding: 80rpx 0;
  font-size: 26rpx;
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
  color: var(--error);
}
.retry-btn {
  display: inline-flex;
  margin-top: 24rpx;
  padding: 14rpx 30rpx;
  border-radius: 999rpx;
  background: var(--primary);
  color: #ffffff;
}
.list-tip {
  padding: 24rpx;
  text-align: center;
  color: var(--on-surface-variant);
  font-size: 24rpx;
}
.page { padding-top: 0; }
.expert-hero { position: relative; overflow: visible; margin-bottom: 35px; padding-top: 40rpx; padding-bottom: 26rpx; background: #dce9ff; box-shadow: 0 10rpx 30rpx rgba(25, 70, 140, 0.06); }
.hero-image { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(248, 249, 255, 0) 46%, var(--bg-page) 100%), linear-gradient(90deg, rgba(244, 249, 255, 0.98) 0%, rgba(244, 249, 255, 0.9) 48%, rgba(244, 249, 255, 0.1) 100%); }
.page-head { position: relative; z-index: 1; width: 70%; padding-bottom: 8rpx; box-sizing: border-box; }
.search-bar { position: relative; z-index: 1; padding-top: 22rpx; background: transparent; }
.page-head, .search-bar { transform: translateY(35px); }
.search-box { padding: 0 10rpx 0 26rpx; }
.search-action { height: 62rpx; padding: 0 24rpx; border-radius: 12rpx; background: var(--primary); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 23rpx; font-weight: 700; }
.domain-filter { padding-top: 28rpx; }
.content { padding-left: 24rpx; padding-right: 24rpx; }
.list-head { display: flex; align-items: center; justify-content: space-between; margin: 4rpx 4rpx 18rpx; }
.list-title { color: var(--on-surface); font-size: 28rpx; font-weight: 750; }
.list-count { color: var(--on-surface-variant); font-size: 21rpx; }
.expert-card:active { transform: scale(0.995); background: #fbfdff; }
.expert-avatar { width: 112rpx; height: 112rpx; border: 4rpx solid #ffffff; border-radius: 18rpx; box-shadow: 0 6rpx 18rpx rgba(0, 88, 190, 0.12); }
.avatar-image { border-radius: 14rpx; }
.expert-title { color: var(--primary); font-weight: 600; }
.ach-row { padding: 8rpx 14rpx; border-radius: 10rpx; background: var(--surface-container-low); }
.contact-btn { background: var(--primary); color: #ffffff; border-radius: 12rpx; font-weight: 700; }
</style>
