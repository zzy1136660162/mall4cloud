<template>
  <view class="page">
    <!-- 搜索 + 标题 -->
    <view class="topbar">
      <view class="page-title">专家与成果库</view>
      <view class="page-sub">智能搜索与筛选前沿科技资源</view>
    </view>

    <!-- 搜索�?-->
    <view class="search-bar surface-card">
      <text class="material-icon search-icon">search</text>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="搜索专家、成果、关键词"
        placeholder-class="ph"
        @confirm="onSearch"
      />
      <text v-if="keyword" class="material-icon search-clear" @click="keyword = ''">close</text>
    </view>

    <!-- 领域筛�?-->
    <view class="filter-section">
      <rd-filter-chips
        v-model="activeField"
        :list="fieldChips"
        @change="onSearch"
      />
    </view>

    <!-- 列表 -->
    <view class="result-list">
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
import RdExpertCard from '../../components/rd/rd-expert-card/rd-expert-card.vue'
import RdFilterChips from '../../components/rd/rd-filter-chips/rd-filter-chips.vue'
import RdTabbar from '../../components/rd/rd-tabbar/rd-tabbar.vue'

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
        { label: 'AI/计算�?, value: 'ai' },
        { label: '生物医药', value: 'bio' },
        { label: '新材�?, value: 'mat' },
        { label: '新能�?, value: 'energy' },
        { label: '智能制�?, value: 'mfg' }
      ],
      experts: [
        {
          name: '张教�?,
          title: '教授 / 博士生导�?,
          org: '清华大学 · 智能产业研究�?,
          tags: ['人工智能', '计算机视�?, '智慧医疗'],
          desc: '长期从事计算机视觉与机器学习研究，承担国家自然科学基金重点项�?5 项，3 项成果已实现产业化转化�?,
          achievements: 12,
          avatarBg: 'avatar-blue',
          avatarIcon: 'person'
        },
        {
          name: '李教�?,
          title: '国家杰青',
          org: '北京大学 · 化学与分子工程学�?,
          tags: ['新材�?, '催化', '储能'],
          desc: '聚焦新型催化材料与储能器件研发，主持国家重点研发计划项目，发�?SCI 论文 200 余篇�?,
          achievements: 18,
          avatarBg: 'avatar-pink',
          avatarIcon: 'science'
        },
        {
          name: '王主�?,
          title: '研究�?/ 博导',
          org: '中国科学�?· 自动化研究所',
          tags: ['机器�?, '智能装备', '工业互联'],
          desc: '致力于工业机器人与智能装备产业化，主持多�?863/重点研发计划，专利转化率行业领先�?,
          achievements: 22,
          avatarBg: 'avatar-green',
          avatarIcon: 'factory'
        },
        {
          name: '陈博�?,
          title: '副教�?,
          org: '上海交通大�?· 生物医学工程学院',
          tags: ['生物医药', '医学影像', 'AI'],
          desc: '从事多模态医学影像分析与AI辅助诊断系统研究，研发产品已�?30+ 医院部署应用�?,
          achievements: 8,
          avatarBg: 'avatar-pink',
          avatarIcon: 'biotech'
        }
      ]
    }
  },
  computed: {
    filteredExperts() {
      const kw = this.keyword.trim()
      return this.experts.filter(e => {
        if (this.activeField && this.activeField !== 'all') {
          // 简化：领域 chip 仅做视觉筛�?        }
        if (!kw) return true
        return [e.name, e.title, e.org, e.desc, ...(e.tags || [])].some(s => (s || '').includes(kw))
      })
    }
  },
  methods: {
    onSearch() {},
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
