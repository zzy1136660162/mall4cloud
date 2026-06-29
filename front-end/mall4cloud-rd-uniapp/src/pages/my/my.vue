<template>
  <view class="page">
    <view class="top-bg"></view>

    <view class="container">
      <!-- 用户信息 -->
      <view class="user-card">
        <view class="user-row">
          <view class="avatar">
            <text class="avatar-text">我</text>
          </view>
          <view class="user-info">
            <view class="user-name">{{ userInfo.name }}</view>
            <view class="user-title">{{ userInfo.title }}</view>
            <view class="user-cert">证书编号：{{ userInfo.certNo }}</view>
          </view>
          <view class="edit" @tap="onEdit">编辑</view>
        </view>
        <view class="stats-row">
          <view class="stat">
            <view class="stat-value">{{ userInfo.patentCount }}</view>
            <view class="stat-label">专利</view>
          </view>
          <view class="stat">
            <view class="stat-value">{{ userInfo.paperCount }}</view>
            <view class="stat-label">论文</view>
          </view>
          <view class="stat">
            <view class="stat-value">12</view>
            <view class="stat-label">在研项目</view>
          </view>
          <view class="stat">
            <view class="stat-value">5</view>
            <view class="stat-label">已转化</view>
          </view>
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="rounded-card menu">
        <view class="menu-item" v-for="(m, idx) in menus" :key="idx" @tap="onMenuTap(m)">
          <view class="menu-icon" :style="{ background: m.bg }">{{ m.icon }}</view>
          <view class="menu-info">
            <view class="menu-name">{{ m.name }}</view>
            <view class="menu-desc">{{ m.desc }}</view>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>

      <!-- 设置 -->
      <view class="rounded-card settings">
        <view class="menu-item" v-for="(s, idx) in settings" :key="idx" @tap="onSettingTap(s)">
          <view class="menu-icon" :style="{ background: s.bg }">{{ s.icon }}</view>
          <view class="menu-info">
            <view class="menu-name">{{ s.name }}</view>
          </view>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { userInfo } from '@/utils/data.js'

export default {
  data() {
    return {
      userInfo,
      menus: [
        { name: '我的需求', desc: '查看我提交的研发立项申请', icon: '📝', bg: '#d8e2ff' },
        { name: '我的成果', desc: '查看专利、论文、转化成果', icon: '🏆', bg: '#d6f5e7' },
        { name: '联系专家', desc: '联系已对接的领域专家', icon: '👥', bg: '#e1e0ff' },
        { name: '消息通知', desc: '查看项目进度、审核消息', icon: '🔔', bg: '#fde4d2' }
      ],
      settings: [
        { name: '账号与安全', icon: '🔒', bg: '#e0e7ff' },
        { name: '帮助与反馈', icon: '💬', bg: '#d8e2ff' },
        { name: '关于我们', icon: 'ℹ️', bg: '#e5eeff' }
      ]
    }
  },
  methods: {
    onEdit() {
      uni.showToast({ title: '编辑资料', icon: 'none' })
    },
    onMenuTap(m) {
      uni.showToast({ title: m.name, icon: 'none' })
    },
    onSettingTap(s) {
      uni.showToast({ title: s.name, icon: 'none' })
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
  padding-bottom: 200rpx;
}

.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 320rpx;
  background: linear-gradient(180deg, #d8e2ff 0%, #f8f9ff 100%);
  z-index: 0;
}

.container {
  position: relative;
  z-index: 1;
  padding: 60rpx 32rpx 180rpx;
}

.user-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.06);
}

.user-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 28rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #d3e4fe 0%, #adc6ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  color: #0058be;
  font-size: 32rpx;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 4rpx;
}

.user-title {
  font-size: 24rpx;
  color: var(--on-surface-variant);
  margin-bottom: 6rpx;
}

.user-cert {
  font-size: 22rpx;
  color: var(--on-surface-variant);
}

.edit {
  padding: 8rpx 24rpx;
  background: var(--primary-light);
  color: var(--primary);
  border-radius: 999rpx;
  font-size: 24rpx;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  padding: 24rpx 0;
  border-top: 1rpx solid var(--outline-variant);
}

.stat {
  text-align: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 22rpx;
  color: var(--on-surface-variant);
}

.rounded-card {
  background: #ffffff;
  border-radius: 24rpx;
  border: 2rpx solid var(--outline-variant);
  padding: 8rpx 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(11, 28, 48, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 0;
  border-bottom: 1rpx solid var(--outline-variant);
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:first-child {
  padding-top: 16rpx;
}

.menu-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}

.menu-info {
  flex: 1;
}

.menu-name {
  font-size: 28rpx;
  color: var(--on-surface);
  font-weight: 500;
}

.menu-desc {
  font-size: 22rpx;
  color: var(--on-surface-variant);
  margin-top: 4rpx;
}

.menu-arrow {
  font-size: 32rpx;
  color: var(--on-surface-variant);
}
</style>
