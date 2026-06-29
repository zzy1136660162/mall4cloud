<template>
  <view class="page">
    <!-- 顶部蓝色渐变背景 -->
    <view class="top-bg"></view>

    <scroll-view scroll-y class="content" :style="{ paddingBottom: '180rpx' }">
      <!-- 用户卡片 -->
      <view class="user-card">
        <view class="avatar">
          <text class="avatar-text">科学家</text>
        </view>
        <view class="user-info">
          <view class="name">{{ userInfo.name }}</view>
          <view class="title">{{ userInfo.title }}</view>
          <view class="org">就职于 {{ userInfo.org }}</view>
        </view>
        <view class="cert-no">证书编号 {{ userInfo.certNo }}</view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-row">
        <view class="action-btn primary" @tap="goTrack">
          <text class="action-icon">📝</text>
          <text>查看需求</text>
        </view>
        <view class="action-btn outline" @tap="goSubmit">
          <text class="action-icon">＋</text>
          <text>提交研发立项</text>
        </view>
      </view>

      <!-- 核心概览 -->
      <view class="rounded-card stats">
        <view class="section-title">
          <view class="section-title-bar"></view>
          <text>核心概览</text>
        </view>
        <view class="stats-grid">
          <view class="stat-item">
            <view class="stat-label">本领域硬科技</view>
            <view class="stat-value primary">{{ userInfo.projectCount }}<text class="stat-unit">项</text></view>
          </view>
          <view class="stat-item">
            <view class="stat-label">产研经费</view>
            <view class="stat-value primary">¥ <text>{{ userInfo.researchFund }}</text><text class="stat-unit">万</text></view>
          </view>
          <view class="stat-item">
            <view class="stat-label">服务专利</view>
            <view class="stat-value tertiary">{{ userInfo.patentCount }}<text class="stat-unit">件</text></view>
          </view>
          <view class="stat-item">
            <view class="stat-label">发表论文</view>
            <view class="stat-value tertiary">{{ userInfo.paperCount }}<text class="stat-unit">篇</text></view>
          </view>
        </view>
      </view>

      <!-- 能力评估 -->
      <view class="rounded-card ability">
        <view class="section-title">
          <view class="section-title-bar"></view>
          <text>能力评估</text>
        </view>
        <view class="ability-list">
          <view class="ability-item" v-for="(item, idx) in abilityList" :key="idx">
            <view class="ability-row">
              <text class="ability-label">{{ item.label }}</text>
              <text class="ability-score">{{ item.score }}%</text>
            </view>
            <view class="ability-bar-bg">
              <view class="ability-bar-fg" :style="{ width: item.score + '%', background: item.color }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 个人简介 -->
      <view class="rounded-card profile">
        <view class="section-title">
          <view class="section-title-bar"></view>
          <text>个人简介</text>
        </view>
        <view class="profile-text">
          材料化学与人工智能算法交叉领域融合创新的青年学者，长期致力于应用导向的基础研究与应用系统设计。致力于新材料计算、高通量合成与智能分析，曾在多项重大横向课题中担任技术负责人，主导 5 项国家级研究专项的可行性论证与产业化路径规划，为多家行业头部企业提供技术服务。已发表论文 60 余篇，授权发明专利 30 余项。
        </view>
      </view>

      <!-- 重点项目经验 -->
      <view class="rounded-card projects">
        <view class="section-title">
          <view class="section-title-bar"></view>
          <text>重点项目经验</text>
          <view class="more" @tap="goSubmit">查看全部</view>
        </view>
        <view class="project-item" v-for="(p, idx) in projects" :key="p.id">
          <view class="project-head">
            <view class="project-bullet"></view>
            <view class="project-title">{{ p.title }}</view>
          </view>
          <view class="project-period">{{ p.period }}</view>
          <view class="project-desc">{{ p.desc }}</view>
          <view class="project-tags">
            <view
              class="project-tag"
              v-for="(t, tidx) in p.tags"
              :key="tidx"
              :style="{ background: p.tagColors[tidx], color: p.tagTextColors[tidx] }"
            >{{ t }}</view>
          </view>
        </view>
      </view>

      <!-- 成果与荣誉 -->
      <view class="rounded-card honors">
        <view class="section-title">
          <view class="section-title-bar"></view>
          <text>成果与荣誉</text>
        </view>
        <view class="honor-item" v-for="(h, idx) in achievements" :key="h.id">
          <view class="honor-badge">
            <text class="honor-badge-text">🏆</text>
          </view>
          <view class="honor-info">
            <view class="honor-title">{{ h.title }}</view>
            <view class="honor-desc">{{ h.desc }}</view>
            <view class="honor-date">{{ h.date }}</view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { userInfo, abilityList, projects, achievements } from '@/utils/data.js'

export default {
  data() {
    return {
      userInfo,
      abilityList,
      projects,
      achievements
    }
  },
  methods: {
    goSubmit() {
      uni.navigateTo({ url: '/pages/demand-submit/demand-submit' })
    },
    goTrack() {
      uni.switchTab({ url: '/pages/track/track' })
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

.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 360rpx;
  background: linear-gradient(180deg, #d8e2ff 0%, #eaf1ff 60%, #f8f9ff 100%);
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  flex: 1;
  height: 0;
  padding: 60rpx 32rpx 220rpx;
  box-sizing: border-box;
}

/* 用户卡片 */
.user-card {
  background: #ffffff;
  border-radius: 28rpx;
  padding: 40rpx 32rpx;
  margin-bottom: 28rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6rpx 18rpx rgba(11, 28, 48, 0.06);
  position: relative;
}

.avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #d3e4fe 0%, #adc6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -100rpx;
  border: 6rpx solid #ffffff;
}

.avatar-text {
  color: #0058be;
  font-size: 28rpx;
  font-weight: 600;
}

.user-info {
  text-align: center;
  margin-top: 16rpx;
}

.name {
  font-size: 44rpx;
  font-weight: 700;
  color: var(--on-surface);
}

.title {
  font-size: 28rpx;
  color: var(--on-surface-variant);
  margin-top: 8rpx;
}

.org {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  margin-top: 6rpx;
}

.cert-no {
  font-size: 22rpx;
  color: var(--on-surface-variant);
  margin-top: 12rpx;
}

/* 操作按钮 */
.action-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  height: 80rpx;
  border-radius: 999rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.action-btn.primary {
  background: var(--primary);
  color: #ffffff;
}

.action-btn.outline {
  background: #ffffff;
  color: var(--primary);
  border: 2rpx solid var(--primary);
}

.action-icon {
  font-size: 28rpx;
}

/* 通用卡片 */
.rounded-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: 2rpx solid var(--outline-variant);
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.04);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 24rpx;
}

.section-title-bar {
  width: 8rpx;
  height: 28rpx;
  background: var(--primary);
  border-radius: 4rpx;
}

.more {
  margin-left: auto;
  font-size: 24rpx;
  color: var(--on-surface-variant);
  font-weight: 400;
}

/* 概览数据 */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32rpx 24rpx;
}

.stat-item {
  text-align: left;
}

.stat-label {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 44rpx;
  font-weight: 700;
  display: flex;
  align-items: baseline;
  gap: 4rpx;
}

.stat-value.primary {
  color: var(--primary);
}

.stat-value.tertiary {
  color: var(--tertiary);
}

.stat-unit {
  font-size: 24rpx;
  font-weight: 400;
  color: var(--on-surface-variant);
  margin-left: 4rpx;
}

/* 能力评估 */
.ability-list {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.ability-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.ability-label {
  font-size: 28rpx;
  color: var(--on-surface);
}

.ability-score {
  font-size: 26rpx;
  color: var(--primary);
  font-weight: 600;
}

.ability-bar-bg {
  height: 12rpx;
  background: var(--surface-container);
  border-radius: 6rpx;
  overflow: hidden;
}

.ability-bar-fg {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.3s ease;
}

/* 个人简介 */
.profile-text {
  font-size: 26rpx;
  line-height: 1.7;
  color: var(--on-surface-variant);
}

/* 重点项目 */
.project-item {
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--outline-variant);
}
.project-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.project-item:first-child {
  padding-top: 0;
}

.project-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 8rpx;
}

.project-bullet {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
}

.project-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--on-surface);
  flex: 1;
}

.project-period {
  font-size: 22rpx;
  color: var(--on-surface-variant);
  margin-bottom: 12rpx;
  margin-left: 24rpx;
}

.project-desc {
  font-size: 24rpx;
  line-height: 1.65;
  color: var(--on-surface-variant);
  margin-bottom: 16rpx;
  margin-left: 24rpx;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-left: 24rpx;
}

.project-tag {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

/* 成果与荣誉 */
.honor-item {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid var(--outline-variant);
}
.honor-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.honor-item:first-child {
  padding-top: 0;
}

.honor-badge {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: var(--primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.honor-badge-text {
  font-size: 36rpx;
}

.honor-info {
  flex: 1;
}

.honor-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 6rpx;
}

.honor-desc {
  font-size: 24rpx;
  line-height: 1.6;
  color: var(--on-surface-variant);
  margin-bottom: 8rpx;
}

.honor-date {
  font-size: 22rpx;
  color: var(--on-surface-variant);
  text-align: right;
}
</style>
