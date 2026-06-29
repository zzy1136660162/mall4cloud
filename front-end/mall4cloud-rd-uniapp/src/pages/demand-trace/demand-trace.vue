<template>
  <view class="page">
    <view class="topbar">
      <view class="page-title">需求查�?/view>
      <view class="page-sub">实时追踪研发需求的处理进度</view>
    </view>

    <!-- 搜索�?-->
    <view class="search-bar surface-card">
      <text class="material-icon search-icon">search</text>
      <input
        v-model="keyword"
        class="search-input"
        placeholder="输入需求编号或项目名称"
        placeholder-class="ph"
        @confirm="onSearch"
      />
      <text v-if="keyword" class="material-icon search-clear" @click="clearKeyword">close</text>
      <view class="search-btn" @click="onSearch">查询</view>
    </view>

    <!-- 状态筛�?-->
    <view class="filter-section">
      <rd-filter-chips
        v-model="activeStatus"
        :list="statusChips"
        @change="onSearch"
      />
    </view>

    <!-- 列表 -->
    <view class="demand-list">
      <view
        v-for="(d, idx) in filteredDemands"
        :key="idx"
        class="demand-card surface-card"
        @click="onTap(d)"
      >
        <view class="card-head">
          <view class="d-title">{{ d.title }}</view>
          <view class="d-status" :class="['state-' + d.status]">{{ d.statusLabel }}</view>
        </view>
        <view class="d-no">编号：{{ d.no }}</view>
        <view class="d-meta">
          <view class="meta-item">
            <text class="material-icon meta-icon">track_changes</text>
            <text>{{ d.field }}</text>
          </view>
          <view class="meta-item">
            <text class="material-icon meta-icon">schedule</text>
            <text>{{ d.date }}</text>
          </view>
        </view>
        <view class="d-progress">
          <view class="progress-bar">
            <view class="progress-fill" :style="{ width: d.progress + '%' }"></view>
          </view>
          <text class="progress-text">{{ d.progress }}%</text>
        </view>
      </view>

      <view v-if="filteredDemands.length === 0" class="empty">
        <text class="material-icon empty-icon">inbox</text>
        <text class="empty-text">暂无相关需求记�?/text>
      </view>
    </view>

    <rd-tabbar current="search" />
  </view>
</template>

<script>
import RdFilterChips from '../../components/rd/rd-filter-chips/rd-filter-chips.vue'
import RdTabbar from '../../components/rd/rd-tabbar/rd-tabbar.vue'

export default {
  components: {
    RdFilterChips,
    RdTabbar
  },
  data() {
    return {
      keyword: '',
      activeStatus: 'all',
      statusChips: [
        { label: '全部状�?, value: 'all' },
        { label: '待处�?, value: 'pending' },
        { label: '处理�?, value: 'processing' },
        { label: '已完�?, value: 'done' }
      ],
      demands: [
        {
          no: 'RD202506001',
          title: '面向基层医疗的肺结节智能筛查系统',
          field: 'AI / 医学影像',
          date: '2026-06-10',
          status: 'processing',
          statusLabel: '处理�?,
          progress: 60
        },
        {
          no: 'RD202506002',
          title: '新型高效储能材料研发',
          field: '新材�?/ 储能',
          date: '2026-06-12',
          status: 'pending',
          statusLabel: '待处�?,
          progress: 10
        },
        {
          no: 'RD202506003',
          title: '工业级协作机器人柔性产�?,
          field: '智能制�?,
          date: '2026-06-05',
          status: 'done',
          statusLabel: '已完�?,
          progress: 100
        },
        {
          no: 'RD202506004',
          title: '面向中小企业�?SaaS 化数据中�?,
          field: 'AI / 大数�?,
          date: '2026-06-15',
          status: 'processing',
          statusLabel: '处理�?,
          progress: 35
        }
      ]
    }
  },
  computed: {
    filteredDemands() {
      const kw = this.keyword.trim()
      return this.demands.filter(d => {
        if (this.activeStatus && this.activeStatus !== 'all' && d.status !== this.activeStatus) return false
        if (!kw) return true
        return (d.no || '').includes(kw) || (d.title || '').includes(kw)
      })
    }
  },
  methods: {
    onSearch() {},
    clearKeyword() {
      this.keyword = ''
    },
    onTap(d) {
      uni.showToast({ title: `查看 ${d.no}`, icon: 'none' })
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

.search-btn {
  padding: 12rpx 24rpx;
  background: #0058be;
  color: #ffffff;
  border-radius: 9999rpx;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  font-weight: 600;
  line-height: 1.4;
}

.ph {
  color: #727785;
}

.filter-section {
  padding: 8rpx 0;
}

.demand-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-top: 8rpx;
}

.demand-card {
  padding: 32rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  background: #ffffff;
}

.card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16rpx;
}

.d-title {
  flex: 1;
  font-family: 'Plus Jakarta Sans', 'PingFang SC', sans-serif;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 1.4;
  color: #0b1c30;
}

.d-status {
  padding: 6rpx 16rpx;
  border-radius: 9999rpx;
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  line-height: 1;
  flex-shrink: 0;
}

.state-pending {
  background: rgba(70, 72, 212, 0.1);
  color: #4648d4;
}

.state-processing {
  background: rgba(0, 88, 190, 0.1);
  color: #0058be;
}

.state-done {
  background: rgba(0, 108, 73, 0.1);
  color: #006c49;
}

.d-no {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #727785;
}

.d-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
  color: #424754;
  font-family: 'Work Sans', 'PingFang SC', sans-serif;
  font-size: 26rpx;
  line-height: 1.5;
}

.meta-icon {
  font-family: 'Material Symbols Outlined', sans-serif;
  font-size: 28rpx;
  line-height: 1;
  color: #424754;
}

.d-progress {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-top: 8rpx;
}

.progress-bar {
  flex: 1;
  height: 12rpx;
  background: #d3e4fe;
  border-radius: 9999rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2170e4 0%, #0058be 100%);
  border-radius: 9999rpx;
  transition: width 0.3s;
}

.progress-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 22rpx;
  font-weight: 500;
  letter-spacing: 0.05em;
  color: #0058be;
  flex-shrink: 0;
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
