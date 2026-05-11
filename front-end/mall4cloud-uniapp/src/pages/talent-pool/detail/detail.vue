<template>
  <view class="container">
    <view class="loading-state" v-if="loading">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>

    <view class="detail-content" v-if="!loading && talentInfo">
      <view class="header-card">
        <view class="header-bg"></view>
        <view class="header-info">
          <image class="avatar" :src="talentInfo.avatar" mode="aspectFill"></image>
          <view class="info-text">
            <text class="name">{{ talentInfo.name }}</text>
            <text class="title">{{ talentInfo.title }}</text>
            <view class="region" v-if="talentInfo.region">
              <text class="region-icon">📍</text>
              <text class="region-text">{{ talentInfo.region }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-icon">📋</text>
          <text class="section-title">基本信息</text>
        </view>
        <view class="section-body">
          <view class="info-grid">
            <view class="info-item">
              <text class="info-label">从业年限</text>
              <text class="info-value">{{ talentInfo.experienceYears }}年</text>
            </view>
            <view class="info-item" v-if="talentInfo.education">
              <text class="info-label">学历</text>
              <text class="info-value">{{ talentInfo.education }}</text>
            </view>
          </view>
          <view class="info-row" v-if="talentInfo.expertiseAreas && talentInfo.expertiseAreas.length > 0">
            <text class="info-label">专注领域</text>
            <view class="tag-list">
              <text class="tag" v-for="(item, index) in talentInfo.expertiseAreas" :key="index">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section" v-if="talentInfo.skills && talentInfo.skills.length > 0">
        <view class="section-header">
          <text class="section-icon">🎯</text>
          <text class="section-title">专业技能</text>
        </view>
        <view class="section-body">
          <view class="skill-list">
            <view class="skill-item" v-for="(item, index) in talentInfo.skills" :key="index">
              <text class="skill-dot">•</text>
              <text class="skill-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="section" v-if="talentInfo.intro">
        <view class="section-header">
          <text class="section-icon">💬</text>
          <text class="section-title">个人简介</text>
        </view>
        <view class="section-body">
          <text class="intro-text">{{ talentInfo.intro }}</text>
        </view>
      </view>

      <view class="section" v-if="talentInfo.projectExperience && talentInfo.projectExperience.length > 0">
        <view class="section-header">
          <text class="section-icon">💼</text>
          <text class="section-title">项目经验</text>
        </view>
        <view class="section-body">
          <view class="project-list">
            <view class="project-item" v-for="(item, index) in talentInfo.projectExperience" :key="index">
              <view class="project-header">
                <text class="project-index">{{ index + 1 }}</text>
                <text class="project-name">{{ item.name }}</text>
              </view>

              <view class="project-desc" v-if="item.description">
                <text class="desc-label">项目描述：</text>
                <text class="desc-text">{{ item.description }}</text>
              </view>

              <view class="project-result" v-if="item.result">
                <text class="result-label">项目成果：</text>
                <text class="result-text">{{ item.result }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="section" v-if="talentInfo.achievements && talentInfo.achievements.length > 0">
        <view class="section-header">
          <text class="section-icon">🏆</text>
          <text class="section-title">成果荣誉</text>
        </view>
        <view class="section-body">
          <view class="achievement-list">
            <view class="achievement-item" v-for="(item, index) in talentInfo.achievements" :key="index">
              <text class="achievement-icon">✦</text>
              <text class="achievement-text">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom-space"></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import talentPoolApi from '@/utils/api/talent-pool.js'

const talentId = ref(null)
const talentInfo = ref(null)
const loading = ref(true)

onLoad((options) => {
  const { id } = options
  if (id) {
    talentId.value = parseInt(id)
    loadTalentDetail()
  } else {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }
})

onShareAppMessage(() => {
  return {
    title: `${talentInfo.value.name} - ${talentInfo.value.title}`,
    path: `/pages/talent-pool/detail/detail?id=${talentId.value}`
  }
})

const loadTalentDetail = () => {
  uni.showLoading({
    title: '加载中...'
  })

  talentPoolApi.getDetail(talentId.value).then((res) => {
    uni.hideLoading()
    if (res) {
      talentInfo.value = {
        ...res,
        expertiseAreas: parseJsonArray(res.expertiseAreas),
        skills: parseJsonArray(res.skills),
        projectExperience: parseProjectExperience(res.projectExperience),
        achievements: parseJsonArray(res.achievements)
      }
      loading.value = false
    } else {
      uni.showToast({
        title: '人才信息不存在',
        icon: 'none'
      })
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    }
  }).catch(() => {
    uni.hideLoading()
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
    loading.value = false
  })
}

const parseJsonArray = (str) => {
  if (!str) return []
  if (Array.isArray(str)) return str
  try {
    return JSON.parse(str)
  } catch (e) {
    return []
  }
}

const parseProjectExperience = (str) => {
  if (!str) return []
  if (Array.isArray(str)) return str
  try {
    return JSON.parse(str)
  } catch (e) {
    return []
  }
}
</script>

<style lang="scss" scoped>
@import './detail';
</style>
