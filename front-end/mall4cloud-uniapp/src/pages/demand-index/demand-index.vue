<template>
  <view class="page-demand-index">
    <view class="banner">
      <view class="banner-title">电商选品研发需求平台</view>
      <view class="banner-subtitle">提交您的研发需求，我们为您定制专属产品</view>
    </view>

    <view class="card">
      <view class="section-title">快捷入口</view>
      <view class="quick-actions">
        <view class="action-item" @tap="goToSubmit">
          <view class="action-icon submit-icon">+</view>
          <text class="action-text">提交需求</text>
        </view>
        <view class="action-item" @tap="goToList">
          <view class="action-icon list-icon">📋</view>
          <text class="action-text">我的需求</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="section-title">服务流程</view>
      <view class="process-list">
        <view class="process-item">
          <view class="process-step">1</view>
          <view class="process-content">
            <text class="process-title">提交需求</text>
            <text class="process-desc">填写您的研发需求信息</text>
          </view>
        </view>
        <view class="process-item">
          <view class="process-step">2</view>
          <view class="process-content">
            <text class="process-title">需求确认</text>
            <text class="process-desc">专业团队评估需求可行性</text>
          </view>
        </view>
        <view class="process-item">
          <view class="process-step">3</view>
          <view class="process-content">
            <text class="process-title">研发制作</text>
            <text class="process-desc">进入产品研发阶段</text>
          </view>
        </view>
        <view class="process-item">
          <view class="process-step">4</view>
          <view class="process-content">
            <text class="process-title">进度跟踪</text>
            <text class="process-desc">实时查看研发进度</text>
          </view>
        </view>
      </view>
    </view>

    <view class="card" v-if="recentDemands.length > 0">
      <view class="section-title flex-between">
        <text>最近需求</text>
        <text class="link-text" @tap="goToList">查看全部 ></text>
      </view>
      <view class="demand-list">
        <view class="demand-item" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in recentDemands" :key="index">
          <view class="demand-header">
            <text class="demand-title">{{ item.title }}</text>
            <text :class="'status-tag status-' + item.statusClass">{{ item.statusText }}</text>
          </view>
          <view class="demand-info">
            <text>提交时间：{{ item.submitTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-text">
      <text>专业定制 · 品质保障 · 全程跟踪</text>
    </view>
  </view>

  <!-- 自定义tabbar -->
  <diy-tabbar :current-index="1" />
</template>

<script setup>
import { reactive } from 'vue'

const Data = reactive({
  recentDemands: []
})
const { recentDemands } = toRefs(Data)

onShow(() => {
  loadRecentDemands()
})

onLoad(() => {
  loadRecentDemands()
})

const loadRecentDemands = () => {
  const token = uni.getStorageSync('cloudToken')
  if (!token) {
    return
  }
  uni.showLoading()
  http.request({
    url: '/mall4cloud_platform/demand/list',
    method: 'GET',
    data: {
      page: 1,
      pageSize: 3
    }
  }).then((res) => {
    uni.hideLoading()
    if (res && res.list) {
      Data.recentDemands = res.list.map(item => ({
        ...item,
        statusClass: getStatusClass(item.status),
        statusText: getStatusText(item.status)
      }))
    }
  }).catch(() => {
    uni.hideLoading()
  })
}

const getStatusClass = (status) => {
  const classMap = {
    0: 'pending',
    1: 'confirming',
    2: 'developing',
    3: 'sampling',
    4: 'completed',
    5: 'cancelled'
  }
  return classMap[status] || 'pending'
}

const getStatusText = (status) => {
  const textMap = {
    0: '待处理',
    1: '确认中',
    2: '研发中',
    3: '采样中',
    4: '已完成',
    5: '已取消'
  }
  return textMap[status] || '待处理'
}

const goToSubmit = () => {
  const token = uni.getStorageSync('cloudToken')
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/demand-submit/demand-submit'
  })
}

const goToList = () => {
  const token = uni.getStorageSync('cloudToken')
  if (!token) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
    return
  }
  uni.navigateTo({
    url: '/pages/demand-index/demand-index'
  })
}

const goToDetail = (e) => {
  const { id } = e.currentTarget.dataset
  uni.navigateTo({
    url: '/pages/demand-detail/demand-detail?id=' + id
  })
}
</script>

<style lang="scss" scoped>
@use "demand-index";
</style>
