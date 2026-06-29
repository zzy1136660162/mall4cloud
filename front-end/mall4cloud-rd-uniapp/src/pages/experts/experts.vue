<template>
  <view class="page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-box">
        <text class="search-icon">🔍</text>
        <input
          v-model="keyword"
          class="search-input"
          placeholder="搜索专家姓名、研究方向、技术关键词"
          placeholder-class="ph"
          confirm-type="search"
        />
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

    <scroll-view scroll-y class="content">
      <!-- 专家列表 -->
      <view class="expert-list">
        <view class="expert-card" v-for="e in filteredExperts" :key="e.id" @tap="onCardTap(e)">
          <view class="expert-head">
            <view class="expert-avatar">
              <text class="avatar-text">img</text>
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
              <text class="ach-icon">📋</text>
              <text class="ach-text">转化成果：{{ e.achievements }}项</text>
            </view>
            <view class="contact-btn" @tap="onContact(e)">
              <text>联系专家</text>
              <text class="contact-arrow">→</text>
            </view>
          </view>
        </view>

        <view v-if="filteredExperts.length === 0" class="empty">
          <text>暂无匹配专家</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { domains, experts } from '@/utils/data.js'

export default {
  data() {
    return {
      domains,
      experts,
      activeDomain: '全部领域',
      keyword: ''
    }
  },
  computed: {
    filteredExperts() {
      let list = this.experts
      if (this.activeDomain !== '全部领域') {
        list = list.filter(e => e.tags.some(t => t.includes(this.activeDomain.slice(0, 2))) || e.org.includes(this.activeDomain))
      }
      if (this.keyword) {
        const kw = this.keyword.toLowerCase()
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
    onContact(e) {
      uni.navigateTo({ url: '/pages/expert-detail/expert-detail' })
    },
    onCardTap(e) {
      uni.navigateTo({ url: '/pages/expert-detail/expert-detail' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  width: 100%;
  height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
}

/* 搜索栏 */
.search-bar {
  padding: 24rpx 32rpx 0;
  background: var(--bg-page);
}
.search-box {
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 2rpx solid var(--outline-variant);
  border-radius: 999rpx;
  padding: 0 28rpx;
  height: 80rpx;
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
  border: 2rpx solid transparent;
}
.domain-chip.active {
  background: var(--primary);
  color: #ffffff;
  font-weight: 500;
}

/* 列表 */
.content {
  width: 100%;
  flex: 1;
  height: 0;
  padding: 8rpx 32rpx 220rpx;
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
  border: 2rpx solid var(--outline-variant);
  padding: 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.04);
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
</style>
