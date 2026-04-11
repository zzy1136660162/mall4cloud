<template>
  <view class="container">
    <view :class="['status-card', statusClass]">
      <view class="status-icon">
        <text class="icon-text">{{ statusIcon }}</text>
      </view>
      <view class="status-info">
        <text class="status-title">{{ application.statusText }}</text>
        <text class="status-desc">{{ statusDesc }}</text>
      </view>
    </view>

    <view class="content-card" v-if="application.reviewRemark">
      <view class="card-header">
        <view class="card-icon remark">💬</view>
        <text class="card-title">审核备注</text>
      </view>
      <view class="card-body">
        <view class="remark-box">
          <text class="remark-text">{{ application.reviewRemark }}</text>
          <text class="remark-time" v-if="application.reviewTime">审核时间：{{ application.reviewTime }}</text>
        </view>
      </view>
    </view>

    <view class="content-card">
      <view class="card-header">
        <view class="card-icon product">🛍️</view>
        <text class="card-title">申请商品</text>
      </view>
      <view class="card-body">
        <view class="product-list">
          <view class="product-item" v-for="(item, index) in application.products" :key="index">
            <image class="product-image" :src="item.image" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ item.name }}</text>
              <view class="product-meta">
                <text class="product-price">¥{{ item.price }}</text>
                <text class="product-commission" v-if="item.commission">佣金{{ item.commission }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="content-card">
      <view class="card-header">
        <view class="card-icon address">📍</view>
        <text class="card-title">收件信息</text>
      </view>
      <view class="card-body">
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">收件人</text>
            <text class="info-value">{{ application.recipient.name }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">联系电话</text>
            <text class="info-value">{{ application.recipient.phone }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">收货地址</text>
            <text class="info-value">
              {{ application.recipient.province }}{{ application.recipient.city }}{{ application.recipient.district }}{{ application.recipient.address }}
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="content-card" v-if="application.shipStatus !== 'not_shipped'">
      <view class="card-header">
        <view class="card-icon shipping">🚚</view>
        <text class="card-title">物流信息</text>
      </view>
      <view class="card-body">
        <view class="shipping-box">
          <view class="shipping-header">
            <view class="shipping-company">
              <view class="company-icon">📦</view>
              <text class="company-name">{{ application.logisticsCompany || '顺丰速运' }}</text>
            </view>
            <view :class="['shipping-status', application.shipStatus]">{{ application.shipStatusText }}</view>
          </view>
          <view class="tracking-row" v-if="application.trackingNo">
            <text class="tracking-label">物流单号</text>
            <text class="tracking-no">{{ application.trackingNo }}</text>
            <text class="copy-btn" @tap="copyTrackingNo">复制</text>
          </view>
          <view class="timeline" v-if="application.trackingList && application.trackingList.length">
            <view
              :class="['timeline-item', { active: index === 0 }]"
              v-for="(item, index) in application.trackingList"
              :key="index"
            >
              <view class="timeline-dot"></view>
              <view class="timeline-content">
                <text class="timeline-text">{{ item.content }}</text>
                <text class="timeline-time">{{ item.time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="content-card">
      <view class="card-header">
        <view class="card-icon info">📋</view>
        <text class="card-title">申请信息</text>
      </view>
      <view class="card-body">
        <view class="info-grid">
          <view class="info-box">
            <text class="info-box-label">申请编号</text>
            <text class="info-box-value">{{ application.id }}</text>
          </view>
          <view class="info-box">
            <text class="info-box-label">申请时间</text>
            <text class="info-box-value">{{ application.applyTime }}</text>
          </view>
          <view class="info-box" v-if="application.reviewTime">
            <text class="info-box-label">审核时间</text>
            <text class="info-box-value">{{ application.reviewTime }}</text>
          </view>
          <view class="info-box" v-if="application.shipTime">
            <text class="info-box-label">发货时间</text>
            <text class="info-box-value">{{ application.shipTime }}</text>
          </view>
          <view class="info-box" v-if="application.receiveTime">
            <text class="info-box-label">签收时间</text>
            <text class="info-box-value">{{ application.receiveTime }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="footer-bar" v-if="application.shipStatus === 'shipped'">
      <view class="btn btn-secondary" @tap="contactService">联系客服</view>
      <view class="btn btn-primary" @tap="confirmReceive">确认收货</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import selectionApi from '@/utils/api/selection.js'

const application = ref({
  status: '',
  statusText: '',
  reviewRemark: '',
  reviewTime: '',
  products: [],
  recipient: {
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    address: ''
  },
  shipStatus: '',
  logisticsCompany: '',
  shipStatusText: '',
  trackingNo: '',
  trackingList: [],
  id: '',
  applyTime: '',
  shipTime: '',
  receiveTime: ''
})

const loading = ref(false)

const statusIcon = computed(() => {
  const map = {
    pending: '⏳',
    approved: '✓',
    rejected: '✕'
  }
  return map[application.value.status] || '⏳'
})

const statusClass = computed(() => {
  return application.value.status
})

const statusDesc = computed(() => {
  const { status, shipStatus } = application.value
  if (status === 'pending') {
    return '您的申请正在审核中，请耐心等待'
  } else if (status === 'rejected') {
    return '您的申请未通过审核，请查看审核备注'
  } else if (status === 'approved') {
    if (shipStatus === 'not_shipped') {
      return '您的申请已通过审核，样品准备中'
    } else if (shipStatus === 'shipped') {
      return '样品已寄出，请注意查收'
    } else if (shipStatus === 'received') {
      return '样品已签收，请尽快完成测评'
    }
  }
  return ''
})

const statusMap = {
  0: { status: 'pending', statusText: '待审核' },
  1: { status: 'approved', statusText: '审核通过' },
  2: { status: 'rejected', statusText: '已拒绝' },
  3: { status: 'approved', statusText: '已发货' },
  4: { status: 'approved', statusText: '已完成' }
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || currentPage.$page?.options || {}

  const applyId = options.applyId
  if (applyId) {
    loadDetail(applyId)
  }
})

async function loadDetail(applyId) {
  loading.value = true
  try {
    const res = await selectionApi.getApplyDetail(applyId)
    if (res) {
      const statusInfo = statusMap[res.status] || { status: 'pending', statusText: '未知' }
      application.value = {
        id: res.applyId,
        applyTime: res.createTime,
        reviewTime: res.reviewTime || '',
        shipTime: res.shipTime || '',
        receiveTime: res.receiveTime || '',
        status: statusInfo.status,
        statusText: statusInfo.statusText,
        shipStatus: res.status === 3 ? 'shipped' : res.status === 4 ? 'received' : 'not_shipped',
        shipStatusText: res.status === 3 ? '已寄出' : res.status === 4 ? '已签收' : '未寄出',
        logisticsCompany: res.expressCompany || '',
        trackingNo: res.expressNo || '',
        reviewRemark: res.reviewRemark || '',
        recipient: {
          name: res.contactName || '',
          phone: res.contactPhone || '',
          province: '',
          city: '',
          district: '',
          address: res.deliveryAddress || ''
        },
        products: [
          {
            id: res.spuId,
            image: res.spuImg || '',
            name: res.spuName || '',
            price: '0.00',
            commission: '0%'
          }
        ],
        trackingList: res.trackingList || []
      }
    }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    console.error('加载申请详情失败', error)
  } finally {
    loading.value = false
  }
}

function copyTrackingNo() {
  uni.setClipboardData({
    data: application.value.trackingNo,
    success: () => {
      uni.showToast({
        title: '单号已复制',
        icon: 'success'
      })
    }
  })
}

function confirmReceive() {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到样品吗？确认后将开始计算测评期限',
    confirmText: '确认收货',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        application.value.shipStatus = 'received'
        application.value.shipStatusText = '已签收'
        application.value.receiveTime = new Date().toLocaleString()
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
      }
    }
  })
}

function contactService() {
  uni.showModal({
    title: '联系客服',
    content: '客服电话: 400-123-4567',
    confirmText: '拨打',
    success: (res) => {
      if (res.confirm) {
        uni.makePhoneCall({
          phoneNumber: '4001234567'
        })
      }
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.status-card {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  padding: 60rpx 40rpx;
  display: flex;
  align-items: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.status-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300rpx;
  height: 300rpx;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.status-card.pending {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%) !important;
}

.status-card.approved {
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%) !important;
}

.status-card.rejected {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%) !important;
}

.status-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 30rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.icon-text {
  font-size: 56rpx;
}

.status-info {
  flex: 1;
  z-index: 1;
}

.status-title {
  font-size: 44rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 12rpx;
}

.status-desc {
  font-size: 26rpx;
  opacity: 0.95;
  line-height: 1.4;
}

.content-card {
  background-color: #fff;
  margin: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 30rpx 30rpx 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.card-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  font-size: 28rpx;
}

.card-icon.remark {
  background-color: #fff3cd;
}

.card-icon.product {
  background-color: #dbeafe;
}

.card-icon.address {
  background-color: #fce7f3;
}

.card-icon.shipping {
  background-color: #d1fae5;
}

.card-icon.info {
  background-color: #e0e7ff;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.card-body {
  padding: 25rpx 30rpx;
}

.remark-box {
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-radius: 16rpx;
  padding: 25rpx;
  border-left: 6rpx solid #f59e0b;
}

.remark-text {
  font-size: 28rpx;
  color: #92400e;
  line-height: 1.6;
}

.remark-time {
  font-size: 24rpx;
  color: #b45309;
  margin-top: 15rpx;
  display: block;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.product-item {
  display: flex;
  background-color: #f8fafc;
  border-radius: 16rpx;
  padding: 20rpx;
}

.product-image {
  width: 160rpx;
  height: 160rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  background-color: #fff;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15rpx;
  margin-top: 15rpx;
}

.product-price {
  font-size: 32rpx;
  color: #ff4757;
  font-weight: bold;
}

.product-commission {
  font-size: 24rpx;
  color: #10b981;
  background-color: #d1fae5;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.info-item {
  display: flex;
  align-items: flex-start;
}

.info-label {
  width: 160rpx;
  font-size: 28rpx;
  color: #666;
  flex-shrink: 0;
}

.info-value {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
  line-height: 1.5;
}

.shipping-box {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16rpx;
  padding: 25rpx;
  border: 1rpx solid #bae6fd;
}

.shipping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx dashed #bae6fd;
}

.shipping-company {
  display: flex;
  align-items: center;
}

.company-icon {
  width: 60rpx;
  height: 60rpx;
  background-color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15rpx;
  font-size: 32rpx;
}

.company-name {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}

.shipping-status {
  font-size: 26rpx;
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-weight: 500;
}

.shipping-status.shipped {
  background-color: #dbeafe;
  color: #3b82f6;
}

.shipping-status.received {
  background-color: #d1fae5;
  color: #059669;
}

.tracking-row {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.tracking-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 15rpx;
}

.tracking-no {
  flex: 1;
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.copy-btn {
  font-size: 24rpx;
  color: #3b82f6;
  background-color: #eff6ff;
  padding: 10rpx 24rpx;
  border-radius: 24rpx;
  border: 1rpx solid #bfdbfe;
}

.timeline {
  position: relative;
  padding-left: 40rpx;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 12rpx;
  top: 10rpx;
  bottom: 10rpx;
  width: 2rpx;
  background: linear-gradient(to bottom, #3b82f6, #93c5fd);
}

.timeline-item {
  position: relative;
  padding-bottom: 30rpx;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-dot {
  position: absolute;
  left: -34rpx;
  top: 6rpx;
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #93c5fd;
  border: 4rpx solid #fff;
}

.timeline-item.active .timeline-dot {
  background-color: #3b82f6;
  width: 24rpx;
  height: 24rpx;
  left: -36rpx;
  top: 4rpx;
}

.timeline-content {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 20rpx;
}

.timeline-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
  display: block;
  margin-bottom: 10rpx;
}

.timeline-item.active .timeline-text {
  color: #1e40af;
  font-weight: 500;
}

.timeline-time {
  font-size: 24rpx;
  color: #3b82f6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.info-box {
  background-color: #f8fafc;
  border-radius: 12rpx;
  padding: 20rpx;
}

.info-box-label {
  font-size: 24rpx;
  color: #666;
  display: block;
  margin-bottom: 10rpx;
}

.info-box-value {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.footer-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  padding: 20rpx 30rpx calc(20rpx + env(safe-area-inset-bottom));
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30rpx;
  font-weight: 500;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #666;
}

.btn-primary {
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  color: #fff;
}
</style>
