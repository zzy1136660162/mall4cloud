<template>
  <view class="container">
    <view class="search-bar">
      <view class="search-input-wrapper">
        <text class="search-icon">🔍</text>
        <input
          class="search-input"
          type="text"
          placeholder="搜索人才姓名、专长..."
          :value="searchKeyword"
          @confirm="onSearchConfirm"
          @input="onSearch"
        />
        <text class="clear-btn" v-if="searchKeyword" @tap="clearSearch">✕</text>
      </view>
    </view>

    <view class="filter-bar">
      <scroll-view class="filter-scroll" :scroll-x="true">
        <view
          :class="'filter-item ' + (currentArea === '' ? 'active' : '')"
          @tap="filterByArea('')"
        >全部</view>
        <view
          v-for="(item, index) in areas"
          :key="index"
          :class="'filter-item ' + (currentArea === item ? 'active' : '')"
          @tap="filterByArea(item)"
        >{{ item }}</view>
      </scroll-view>
    </view>

    <view class="talent-list" v-if="talentList.length > 0">
      <view
        class="talent-card"
        @tap="goToDetail(item.id)"
        v-for="(item, index) in talentList"
        :key="index"
      >
        <view class="card-left">
          <image class="talent-avatar" :src="item.avatar" mode="aspectFill"></image>
        </view>

        <view class="card-right">
          <view class="card-header">
            <text class="talent-name">{{ item.name }}</text>
            <text class="talent-experience">{{ item.experienceYears }}年</text>
          </view>
          <view class="talent-title">{{ item.title }}</view>
          <view class="talent-region" v-if="item.region">
            <text class="region-icon">📍</text>
            <text class="region-text">{{ item.region }}</text>
          </view>
          <view class="talent-tags">
            <text class="tag" v-for="(tag, index1) in item.expertiseAreas" :key="index1">{{ tag }}</text>
          </view>
        </view>

        <text class="arrow">></text>
      </view>

      <view class="load-more" v-if="hasMore">
        <text @tap="loadMore">点击加载更多</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </view>

    <view class="empty-state" v-if="!loading && talentList.length === 0">
      <view class="empty-content">
        <text class="empty-title">暂无人才信息</text>
        <text class="empty-desc">敬请期待更多优秀人才加入</text>
      </view>
    </view>

    <view class="loading-state" v-if="loading && talentList.length === 0">
      <view class="loading-spinner"></view>
      <text class="loading-text">加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref, toRefs } from 'vue'
import talentPoolApi from '@/utils/api/talent-pool.js'

const state = reactive({
  talentList: [],
  page: 1,
  pageSize: 10,
  hasMore: true,
  loading: false,
  currentArea: '',
  searchKeyword: ''
})

const {
  talentList,
  page,
  pageSize,
  hasMore,
  loading,
  currentArea,
  searchKeyword
} = toRefs(state)

const areas = [
  '化妆品研发',
  '功能性食品',
  '天然原料',
  '项目管理',
  '功效评测',
  '包装研发',
  '品质控制'
]

onLoad(() => {
  loadTalentList()
})

onShow(() => {
  state.page = 1
  state.hasMore = true
  loadTalentList()
})

onPullDownRefresh(() => {
  state.page = 1
  state.hasMore = true
  loadTalentList(() => {
    uni.stopPullDownRefresh()
  })
})

onReachBottom(() => {
  if (state.hasMore && !state.loading) {
    loadMore()
  }
})

const loadTalentList = (callback) => {
  if (state.loading) {
    return
  }
  state.loading = true

  const params = {
    page: state.page,
    pageSize: state.pageSize
  }
  if (state.currentArea) {
    params.area = state.currentArea
  }
  if (state.searchKeyword) {
    params.keyword = state.searchKeyword
  }

  talentPoolApi.getList(params).then((res) => {
    let list = []
    if (Array.isArray(res)) {
      list = res
    } else if (res && res.list) {
      list = res.list
    }

    const formattedList = list.map(item => ({
      ...item,
      expertiseAreas: parseJsonArray(item.expertiseAreas)
    }))

    state.talentList = state.page === 1 ? formattedList : [...state.talentList, ...formattedList]
    state.hasMore = list.length >= state.pageSize
    state.loading = false

    if (callback) {
      callback()
    }
  }).catch(() => {
    state.loading = false
    if (callback) {
      callback()
    }
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

const loadMore = () => {
  state.page = state.page + 1
  loadTalentList()
}

const onSearch = (e) => {
  const keyword = e.detail.value || ''
  state.searchKeyword = keyword
  state.page = 1
  state.hasMore = true
  loadTalentList()
}

const onSearchConfirm = (e) => {
  const keyword = e.detail.value || ''
  state.searchKeyword = keyword
  state.page = 1
  state.hasMore = true
  loadTalentList()
}

const clearSearch = () => {
  state.searchKeyword = ''
  state.page = 1
  state.hasMore = true
  loadTalentList()
}

const filterByArea = (area) => {
  state.currentArea = area
  state.page = 1
  state.hasMore = true
  loadTalentList()
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: `/pages/talent-pool/detail/detail?id=${id}`
  })
}
</script>

<style lang="scss" scoped>
@import './index';
</style>
