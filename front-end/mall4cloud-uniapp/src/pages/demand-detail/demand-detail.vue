<template>
  <view class="page-demand-detail">
    <view class="status-card">
      <view class="status-info">
        <text class="status-label">当前状态</text>
        <text :class="'status-value status-' + statusClass">{{ detail.statusText }}</text>
      </view>
      <view class="demand-no">需求编号：{{ detail.demandNo }}</view>
    </view>

    <view class="card">
      <view class="section-title">需求信息</view>
      <view class="info-row">
        <text class="info-label">需求标题</text>
        <text class="info-value">{{ detail.title }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">功能诉求</text>
        <text class="info-value">{{ detail.functionalAppeal }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">目标人群</text>
        <text class="info-value">{{ detail.targetAudience }}</text>
      </view>
      <view class="info-row" v-if="detail.dosageFormPreference">
        <text class="info-label">剂型偏好</text>
        <text class="info-value">{{ detail.dosageFormPreference }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">预算范围</text>
        <text class="info-value">{{ detail.budgetRange }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">期望交付</text>
        <text class="info-value">{{ detail.expectedDeliveryTime }}</text>
      </view>
      <view class="info-row" v-if="detail.remark">
        <text class="info-label">备注</text>
        <text class="info-value">{{ detail.remark }}</text>
      </view>
    </view>

    <view class="card" v-if="detail.adminRemark || detail.handlerName">
      <view class="section-title">处理信息</view>
      <view class="info-row" v-if="detail.handlerName">
        <text class="info-label">处理人</text>
        <text class="info-value">{{ detail.handlerName }}</text>
      </view>
      <view class="info-row" v-if="detail.adminRemark">
        <text class="info-label">处理备注</text>
        <text class="info-value highlight">{{ detail.adminRemark }}</text>
      </view>
    </view>

    <view class="card">
      <view class="section-title">提交信息</view>
      <view class="info-row">
        <text class="info-label">联系人</text>
        <text class="info-value">{{ detail.submitterName || '未填写' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">联系电话</text>
        <text class="info-value">{{ detail.submitterPhone || '未填写' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">提交时间</text>
        <text class="info-value">{{ detail.submitTime }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">更新时间</text>
        <text class="info-value">{{ detail.updateTime }}</text>
      </view>
    </view>

    <view class="action-section">
      <button class="btn btn-primary" @tap="viewProgress">查看进度</button>
      <button class="btn btn-danger" @tap="withdrawDemand" v-if="detail.status === 0">撤回需求</button>
      <button class="btn btn-warning" @tap="reapplyDemand" v-if="detail.status === 5">重新申请</button>
      <button class="btn btn-secondary" @tap="deleteDemand" v-if="detail.status === 5">删除需求</button>
    </view>
  </view>
</template>

<script setup>
import { reactive } from 'vue'

const Data = reactive({
  demandId: null,
  detail: {
    statusText: '',
    demandNo: '',
    title: '',
    functionalAppeal: '',
    targetAudience: '',
    dosageFormPreference: '',
    budgetRange: '',
    expectedDeliveryTime: '',
    remark: '',
    adminRemark: '',
    handlerName: '',
    submitterName: '',
    submitterPhone: '',
    submitTime: '',
    updateTime: '',
    status: 0
  },
  statusClass: ''
})
const { demandId, detail, statusClass } = toRefs(Data)

onLoad((options) => {
  const { id } = options
  if (!id) {
    uni.showToast({
      title: '参数错误',
      icon: 'none'
    })
    uni.navigateBack()
    return
  }
  Data.demandId = id
  loadDetail()
})

const loadDetail = () => {
  const token = uni.getStorageSync('cloudToken')
  uni.showLoading()
  http.request({
    url: `/mall4cloud_platform/demand/detail/${Data.demandId}?submitterId=${token}`,
    method: 'GET'
  }).then((res) => {
    uni.hideLoading()
    Data.detail = res
    Data.statusClass = getStatusClass(res.status)
    Data.detail.statusText = getStatusText(res.status)
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

const viewProgress = () => {
  uni.navigateTo({
    url: '/pages/demand-detail/demand-detail?id=' + Data.demandId
  })
}

const withdrawDemand = () => {
  if (Data.detail.status !== 0) {
    uni.showToast({
      title: '该需求状态不允许撤回',
      icon: 'none'
    })
    return
  }
  uni.showModal({
    title: '确认撤回',
    content: '撤回后该需求将取消，是否确认？',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        doWithdraw()
      }
    }
  })
}

const doWithdraw = () => {
  const token = uni.getStorageSync('cloudToken')
  uni.showLoading()
  http.request({
    url: '/mall4cloud_platform/demand/withdraw',
    method: 'POST',
    data: {
      demandId: parseInt(Data.demandId),
      submitterId: token
    }
  }).then(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已撤回',
      icon: 'success'
    })
    loadDetail()
  }).catch(() => {
    uni.hideLoading()
  })
}

const reapplyDemand = () => {
  if (Data.detail.status !== 5) {
    uni.showToast({
      title: '该需求状态不允许重新申请',
      icon: 'none'
    })
    return
  }
  uni.showModal({
    title: '确认重新申请',
    content: '重新申请后将生成新的需求编号，是否确认？',
    confirmColor: '#faad14',
    success: (res) => {
      if (res.confirm) {
        doReapply()
      }
    }
  })
}

const doReapply = () => {
  const token = uni.getStorageSync('cloudToken')
  uni.showLoading()
  http.request({
    url: '/mall4cloud_platform/demand/reapply',
    method: 'POST',
    data: {
      demandId: parseInt(Data.demandId),
      submitterId: token
    }
  }).then(() => {
    uni.hideLoading()
    uni.showToast({
      title: '重新申请成功',
      icon: 'success'
    })
    loadDetail()
  }).catch(() => {
    uni.hideLoading()
  })
}

const deleteDemand = () => {
  if (Data.detail.status !== 5) {
    uni.showToast({
      title: '该需求状态不允许删除',
      icon: 'none'
    })
    return
  }
  uni.showModal({
    title: '确认删除',
    content: '删除后数据将无法恢复，是否确认？',
    confirmColor: '#ff4d4f',
    success: (res) => {
      if (res.confirm) {
        doDelete()
      }
    }
  })
}

const doDelete = () => {
  const token = uni.getStorageSync('cloudToken')
  uni.showLoading()
  http.request({
    url: '/mall4cloud_platform/demand/delete',
    method: 'POST',
    data: {
      demandId: parseInt(Data.demandId),
      submitterId: token
    }
  }).then(() => {
    uni.hideLoading()
    uni.showToast({
      title: '已删除',
      icon: 'success'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  }).catch(() => {
    uni.hideLoading()
  })
}
</script>

<style lang="scss" scoped>
@use "demand-detail";
</style>
