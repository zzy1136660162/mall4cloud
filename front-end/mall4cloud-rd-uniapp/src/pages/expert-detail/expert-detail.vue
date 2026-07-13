<template>
  <view class="page">
    <view v-if="loading" class="state-panel">正在加载专家信息...</view>
    <view v-else-if="errorMessage" class="state-panel error-state">
      <text>{{ errorMessage }}</text>
      <view class="retry-btn" @tap="loadDetail">重新加载</view>
    </view>
    <scroll-view v-else-if="talent" scroll-y class="content">
      <view class="profile-card card">
        <view class="profile-head">
          <view class="avatar">
            <image v-if="talent.avatar" class="avatar-image" :src="talent.avatar" mode="aspectFill" />
            <text v-else>{{ talent.name ? talent.name.slice(0, 1) : '专' }}</text>
          </view>
          <view class="profile-main">
            <view class="name">{{ talent.name || '姓名暂未填写' }}</view>
            <view class="title">{{ talent.title || '职称暂未填写' }}</view>
            <view class="region">{{ talent.region || '地区暂未填写' }}</view>
          </view>
        </view>
        <view class="tags">
          <view v-for="tag in expertiseAreas" :key="tag" class="tag">{{ tag }}</view>
          <text v-if="expertiseAreas.length === 0" class="empty-inline">暂无能力标签</text>
        </view>
        <view class="action-row">
          <view class="action-btn primary" @tap="goSubmit">提交研发需求</view>
          <view class="action-btn outline" @tap="goTrack">查询需求进度</view>
        </view>
      </view>

      <view class="summary-grid">
        <view class="summary-item">
          <text class="summary-value">{{ talent.experienceYears || 0 }}</text>
          <text class="summary-label">从业年限</text>
        </view>
        <view class="summary-item">
          <text class="summary-value">{{ projects.length }}</text>
          <text class="summary-label">项目经验</text>
        </view>
        <view class="summary-item">
          <text class="summary-value">{{ achievements.length }}</text>
          <text class="summary-label">成果荣誉</text>
        </view>
      </view>

      <view class="card">
        <view class="section-title">专业技能</view>
        <view class="tags">
          <view v-for="skill in skills" :key="skill" class="tag skill-tag">{{ skill }}</view>
          <text v-if="skills.length === 0" class="empty-inline">暂无专业技能信息</text>
        </view>
      </view>

      <view class="card">
        <view class="section-title">个人简介</view>
        <view class="paragraph">{{ talent.intro || '该专家暂未填写个人简介。' }}</view>
        <view v-if="talent.education" class="education">学历：{{ talent.education }}</view>
      </view>

      <view class="card">
        <view class="section-title">重点项目经验</view>
        <view v-for="(project, index) in projects" :key="index" class="record-item">
          <view class="record-dot"></view>
          <view class="record-main">
            <view class="record-title">{{ itemTitle(project, `项目经验 ${index + 1}`) }}</view>
            <view v-if="itemPeriod(project)" class="record-period">{{ itemPeriod(project) }}</view>
            <view class="record-desc">{{ itemDescription(project) }}</view>
          </view>
        </view>
        <view v-if="projects.length === 0" class="empty-block">暂无项目经验</view>
      </view>

      <view class="card last-card">
        <view class="section-title">成果与荣誉</view>
        <view v-for="(achievement, index) in achievements" :key="index" class="achievement-item">
          <view class="record-main">
            <view class="record-title">{{ itemTitle(achievement, `成果荣誉 ${index + 1}`) }}</view>
            <view class="record-desc">{{ itemDescription(achievement) }}</view>
            <view v-if="itemPeriod(achievement)" class="record-period">{{ itemPeriod(achievement) }}</view>
          </view>
        </view>
        <view v-if="achievements.length === 0" class="empty-block">暂无成果荣誉</view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import { getTalentDetail } from '@/utils/api/talent-pool.js'

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

export default {
  data() {
    return {
      id: '',
      talent: null,
      loading: true,
      errorMessage: ''
    }
  },
  computed: {
    expertiseAreas() {
      return parseArray(this.talent && this.talent.expertiseAreas).map(item => this.itemText(item)).filter(Boolean)
    },
    skills() {
      return parseArray(this.talent && this.talent.skills).map(item => this.itemText(item)).filter(Boolean)
    },
    projects() {
      return parseArray(this.talent && this.talent.projectExperience)
    },
    achievements() {
      return parseArray(this.talent && this.talent.achievements)
    }
  },
  onLoad(options) {
    this.id = options && options.id ? decodeURIComponent(options.id) : ''
    this.loadDetail()
  },
  methods: {
    async loadDetail() {
      if (!this.id) {
        this.loading = false
        this.errorMessage = '缺少专家编号，无法加载详情'
        return
      }
      this.loading = true
      this.errorMessage = ''
      try {
        this.talent = await getTalentDetail(this.id)
      } catch (error) {
        this.errorMessage = error && error.message ? error.message : '专家信息加载失败，请稍后重试'
      } finally {
        this.loading = false
      }
    },
    itemText(item) {
      if (item === null || item === undefined) return ''
      if (typeof item !== 'object') return String(item)
      return item.name || item.label || item.title || item.skill || item.area || ''
    },
    itemTitle(item, fallback) {
      if (typeof item !== 'object' || item === null) return String(item || fallback)
      return item.title || item.name || item.projectName || item.achievementName || fallback
    },
    itemDescription(item) {
      if (typeof item !== 'object' || item === null) return String(item || '')
      return item.desc || item.description || item.content || item.detail || '暂无详细说明'
    },
    itemPeriod(item) {
      if (typeof item !== 'object' || item === null) return ''
      return item.period || item.date || item.time || item.year || ''
    },
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
.page { min-height: 100vh; background: var(--bg-page); }
.content { height: 100vh; box-sizing: border-box; padding: 28rpx 28rpx 80rpx; }
.card { background: #fff; border-radius: 24rpx; padding: 30rpx; margin-bottom: 24rpx; box-shadow: 0 6rpx 20rpx rgba(60, 90, 170, 0.08); }
.profile-head { display: flex; align-items: center; gap: 24rpx; }
.avatar { width: 132rpx; height: 132rpx; border-radius: 50%; overflow: hidden; background: var(--surface-variant); color: var(--primary); font-size: 38rpx; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.avatar-image { width: 100%; height: 100%; }
.profile-main { flex: 1; min-width: 0; }
.name { color: var(--primary); font-size: 38rpx; font-weight: 700; }
.title { margin-top: 8rpx; color: var(--on-surface); font-size: 27rpx; }
.region { margin-top: 6rpx; color: var(--on-surface-variant); font-size: 23rpx; }
.tags { display: flex; flex-wrap: wrap; gap: 12rpx; margin-top: 24rpx; }
.tag { padding: 8rpx 18rpx; border-radius: 999rpx; background: var(--secondary-container); color: var(--secondary); font-size: 22rpx; }
.skill-tag { background: var(--primary-light); color: var(--primary); }
.action-row { display: flex; gap: 18rpx; margin-top: 28rpx; }
.action-btn { flex: 1; height: 76rpx; border-radius: 999rpx; display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 600; }
.action-btn.primary { background: var(--primary); color: #fff; }
.action-btn.outline { color: var(--secondary); border: 2rpx solid var(--secondary); }
.summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16rpx; margin-bottom: 24rpx; }
.summary-item { background: #fff; border-radius: 20rpx; padding: 24rpx 8rpx; text-align: center; }
.summary-value { display: block; color: var(--primary); font-size: 36rpx; font-weight: 700; }
.summary-label { display: block; margin-top: 6rpx; color: var(--on-surface-variant); font-size: 21rpx; }
.section-title { color: var(--primary); font-size: 30rpx; font-weight: 700; padding-bottom: 16rpx; margin-bottom: 20rpx; border-bottom: 1rpx solid var(--outline-variant); }
.paragraph, .record-desc { color: var(--on-surface-variant); font-size: 25rpx; line-height: 1.75; }
.education { margin-top: 20rpx; color: var(--primary); font-size: 24rpx; }
.record-item, .achievement-item { display: flex; gap: 18rpx; padding: 18rpx 0; border-bottom: 1rpx solid var(--outline-variant); }
.record-item:last-child, .achievement-item:last-child { border-bottom: 0; }
.record-dot { width: 18rpx; height: 18rpx; border-radius: 50%; background: var(--secondary); margin-top: 10rpx; flex-shrink: 0; }
.award-icon { width: 52rpx; height: 52rpx; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.record-main { flex: 1; min-width: 0; }
.record-title { color: var(--on-surface); font-size: 27rpx; font-weight: 600; }
.record-period { display: inline-block; margin: 10rpx 0; padding: 4rpx 12rpx; background: var(--surface-container); color: var(--on-surface-variant); font-size: 21rpx; }
.empty-inline, .empty-block { color: var(--on-surface-variant); font-size: 24rpx; }
.empty-block { padding: 40rpx 0; text-align: center; }
.last-card { margin-bottom: 80rpx; }
.state-panel { margin: 220rpx 32rpx 0; padding: 70rpx 32rpx; background: #fff; border-radius: 24rpx; text-align: center; color: var(--on-surface-variant); font-size: 26rpx; }
.error-state { color: var(--error); }
.retry-btn { display: inline-flex; margin-top: 24rpx; padding: 14rpx 30rpx; border-radius: 999rpx; background: var(--primary); color: #fff; }
</style>
