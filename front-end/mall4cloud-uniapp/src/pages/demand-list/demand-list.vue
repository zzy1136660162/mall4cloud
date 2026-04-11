<template>
  <view class="container">
    <view class="filter-bar">
      <scroll-view class="filter-scroll" :scroll-x="true">
        <view
          :class="'filter-item ' + (currentStatus === '' ? 'active' : '')"
          @tap="filterByStatus('')"
        >全部</view>
        <view
          :class="'filter-item ' + (currentStatus === '0' ? 'active' : '')"
          @tap="filterByStatus('0')"
        >待处理</view>
        <view
          :class="'filter-item ' + (currentStatus === '1' ? 'active' : '')"
          @tap="filterByStatus('1')"
        >确认中</view>
        <view
          :class="'filter-item ' + (currentStatus === '2' ? 'active' : '')"
          @tap="filterByStatus('2')"
        >研发中</view>
        <view
          :class="'filter-item ' + (currentStatus === '3' ? 'active' : '')"
          @tap="filterByStatus('3')"
        >样品制作</view>
        <view
          :class="'filter-item ' + (currentStatus === '4' ? 'active' : '')"
          @tap="filterByStatus('4')"
        >已完成</view>
      </scroll-view>
    </view>

    <view class="demand-list" v-if="demandList.length > 0">
      <view
        class="demand-card"
        @tap="goToDetail(item.id)"
        v-for="(item, index) in demandList"
        :key="index"
      >
        <view class="card-header">
          <view class="demand-no">{{ item.demandNo }}</view>
          <view :class="'status-tag status-' + item.statusClass">{{ item.statusText }}</view>
        </view>

        <view class="card-body">
          <view class="demand-title">{{ item.title }}</view>
          <view class="demand-info">
            <view class="info-item">
              <text class="info-label">目标人群：</text>
              <text class="info-value">{{ item.targetAudience }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">预算范围：</text>
              <text class="info-value">{{ item.budgetRange }}</text>
            </view>
            <view class="info-item">
              <text class="info-label">期望交付：</text>
              <text class="info-value">{{ item.expectedDeliveryTime }}</text>
            </view>
          </view>
        </view>

        <view class="card-footer">
          <text class="submit-time">提交时间：{{ item.submitTime }}</text>
          <view class="card-actions">
            <text
              class="action-btn withdraw-btn"
              v-if="item.status === 0"
              @tap.stop.prevent="withdrawDemand(item.id, index)"
            >撤回</text>
            <text
              class="action-btn reapply-btn"
              v-if="item.status === 5"
              @tap.stop.prevent="reapplyDemand(item.id, index)"
            >重新申请</text>
            <text
              class="action-btn delete-btn"
              v-if="item.status === 5"
              @tap.stop.prevent="deleteDemand(item.id, index)"
            >删除</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>

      <view class="load-more" v-if="hasMore">
        <text @tap="loadMore">点击加载更多</text>
      </view>
      <view class="no-more" v-else>
        <text>没有更多了</text>
      </view>
    </view>

    <view class="empty-state" v-else>
      <view class="empty-icon-placeholder">📋</view>
      <text class="empty-text">暂无研发需求</text>
      <button class="btn btn-primary empty-btn" @tap="goToSubmit">立即提交需求</button>
    </view>
  </view>
</template>

<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({
  demandList: [],
  currentStatus: '',
  page: 1,
  pageSize: 10,
  hasMore: true,
  loading: false
})

const { demandList, currentStatus, page, pageSize, hasMore, loading } = toRefs(state)

onLoad(() => {
  loadDemandList()
})

onShow(() => {
  state.page = 1
  state.hasMore = true
  loadDemandList()
})

onPullDownRefresh(() => {
  state.page = 1
  state.hasMore = true
  loadDemandList(() => {
    uni.stopPullDownRefresh()
  })
})

onReachBottom(() => {
  if (state.hasMore && !state.loading) {
    loadMore()
  }
})

const getUserId = () => {
  const userDetails = uni.getStorageSync('cloudUserDetails')
  return userDetails?.userId || ''
}

const loadDemandList = (callback) => {
  const submitterId = getUserId()
  console.log('需求列表页 - submitterId:', submitterId)

  state.loading = true
  let url = '/mall4cloud_platform/demand/list?submitterId=' + submitterId + '&page=' + state.page + '&pageSize=' + state.pageSize
  if (state.currentStatus !== '') {
    url += '&status=' + state.currentStatus
  }

  http.request({
    url,
    method: 'GET'
  }).then((res) => {
    console.log('需求列表页 - 返回数据:', res)

    let list = res
    if (!Array.isArray(res)) {
      list = res.list || []
    }

    console.log('需求列表页 - list:', list)

    const formattedList = list.map((item) => ({
      ...item,
      statusClass: getStatusClass(item.status),
      statusText: getStatusText(item.status)
    }))

    state.demandList = state.page === 1 ? formattedList : [...state.demandList, ...formattedList]
    state.hasMore = list.length >= state.pageSize
    state.loading = false

    console.log('需求列表页 - demandList:', state.demandList)

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
    3: '样品制作',
    4: '已完成',
    5: '已取消'
  }
  return textMap[status] || '待处理'
}

const filterByStatus = (status) => {
  state.currentStatus = status
  state.page = 1
  state.hasMore = true
  state.demandList = []
  loadDemandList()
}

const loadMore = () => {
  state.page = state.page + 1
  loadDemandList()
}

const goToDetail = (id) => {
  uni.navigateTo({
    url: '/pages/demand-detail/demand-detail?id=' + id
  })
}

const goToSubmit = () => {
  uni.navigateTo({
    url: '/pages/demand-submit/demand-submit'
  })
}

const withdrawDemand = (id, index) => {
  uni.showModal({
    title: '确认撤回',
    content: '撤回后该需求将取消，是否确认？',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        doWithdraw(id, index)
      }
    }
  })
}

const doWithdraw = (demandId, index) => {
  const submitterId = getUserId()
  uni.showLoading({
    title: '处理中...'
  })

  http.request({
    url: '/mall4cloud_platform/demand/withdraw',
    method: 'POST',
    data: {
      demandId: parseInt(demandId),
      submitterId
    }
  }).then(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已撤回',
      icon: 'success'
    })

    const demandList = state.demandList
    demandList[index].status = 5
    demandList[index].statusText = '已取消'
    demandList[index].statusClass = 'cancelled'
    state.demandList = demandList

    if (state.currentStatus !== '') {
      loadDemandList()
    }
  }).catch(() => {
    uni.hideLoading()
  })
}

const reapplyDemand = (id, index) => {
  uni.showModal({
    title: '确认重新申请',
    content: '重新申请后将生成新的需求编号，是否确认？',
    confirmColor: '#faad14',
    success: (res) => {
      if (res.confirm) {
        doReapply(id, index)
      }
    }
  })
}

const doReapply = (demandId, index) => {
  const submitterId = getUserId()
  uni.showLoading({
    title: '处理中...'
  })

  http.request({
    url: '/mall4cloud_platform/demand/reapply',
    method: 'POST',
    data: {
      demandId: parseInt(demandId),
      submitterId
    }
  }).then((res) => {
    uni.hideLoading()
    uni.showToast({
      title: '重新申请成功',
      icon: 'success'
    })

    const demandList = state.demandList
    demandList[index].status = 0
    demandList[index].statusText = '待处理'
    demandList[index].statusClass = 'pending'
    demandList[index].demandNo = res.demandNo
    state.demandList = demandList

    if (state.currentStatus !== '' && state.currentStatus !== '5') {
      loadDemandList()
    }
  }).catch(() => {
    uni.hideLoading()
  })
}

const deleteDemand = (id, index) => {
  uni.showModal({
    title: '确认删除',
    content: '删除后数据将无法恢复，是否确认？',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        doDelete(id, index)
      }
    }
  })
}

const doDelete = (demandId, index) => {
  const submitterId = getUserId()
  uni.showLoading({
    title: '处理中...'
  })

  http.request({
    url: '/mall4cloud_platform/demand/delete',
    method: 'POST',
    data: {
      demandId: parseInt(demandId),
      submitterId
    }
  }).then(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已删除',
      icon: 'success'
    })

    const demandList = state.demandList
    demandList.splice(index, 1)
    state.demandList = demandList
    state.hasMore = demandList.length > 0
  }).catch(() => {
    uni.hideLoading()
  })
}
</script>

<style lang="scss" scoped>
@use "demand-list";
</style>
