<template>
  <view class="container">
    <view class="filter-bar">
      <view
        v-for="filter in filters"
        :key="filter.value"
        :class="['filter-item', { active: currentFilter === filter.value }]"
        @tap="switchFilter(filter.value)"
      >
        <text class="filter-text">{{ filter.label }}</text>
      </view>
    </view>

    <view class="sample-list">
      <view class="sample-card" v-for="item in filteredList" :key="item.id" @tap="goToDetail(item.id)">
        <view class="sample-header">
          <view class="header-left">
            <text class="apply-id">申请编号: {{ item.id }}</text>
            <text class="apply-time">申请时间: {{ item.applyTime }}</text>
          </view>
          <view :class="['status-badge', item.status]">
            <text class="status-text">{{ item.statusText }}</text>
          </view>
        </view>

        <view class="product-list">
          <view class="product-item" v-for="(product, idx) in item.products" :key="idx">
            <image class="product-image" :src="product.image" mode="aspectFill" />
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <view class="product-meta">
                <text class="product-price">¥{{ product.price }}</text>
                <text class="product-commission" v-if="product.commission">佣金{{ product.commission }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="shipping-section">
          <view class="shipping-header">
            <text class="section-label">📦 物流状态</text>
            <view :class="['ship-status-badge', item.shipStatus]">
              <text class="ship-status-text">{{ item.shipStatusText }}</text>
            </view>
          </view>

          <view class="shipping-detail" v-if="item.shipStatus !== 'not_shipped'">
            <view class="shipping-row" v-if="item.logisticsCompany">
              <text class="shipping-label">物流公司:</text>
              <text class="shipping-company">{{ item.logisticsCompany }}</text>
            </view>
            <view class="shipping-row" v-if="item.trackingNo">
              <text class="shipping-label">物流单号:</text>
              <text class="tracking-no">{{ item.trackingNo }}</text>
              <text class="copy-btn" @tap.stop="copyTrackingNo(item.trackingNo)">复制</text>
            </view>
            <view class="shipping-row" v-if="item.receiveTime">
              <text class="shipping-label">签收时间:</text>
              <text class="receive-time">{{ item.receiveTime }}</text>
            </view>
            <view class="shipping-progress" v-if="item.shipStatus === 'shipped'">
              <view class="progress-dot active"></view>
              <view class="progress-line"></view>
              <view class="progress-dot"></view>
              <view class="progress-line"></view>
              <view class="progress-dot"></view>
            </view>
            <view class="shipping-progress" v-if="item.shipStatus === 'received'">
              <view class="progress-dot active"></view>
              <view class="progress-line active"></view>
              <view class="progress-dot active"></view>
              <view class="progress-line active"></view>
              <view class="progress-dot active"></view>
            </view>
            <view class="progress-labels">
              <text class="progress-label">已发货</text>
              <text class="progress-label">运输中</text>
              <text :class="['progress-label', { active: item.shipStatus === 'received' }]">已签收</text>
            </view>
          </view>

          <view class="shipping-empty" v-if="item.shipStatus === 'not_shipped'">
            <text class="empty-hint" v-if="item.status === 'pending'">审核通过后将安排发货</text>
            <text class="empty-hint" v-if="item.status === 'approved'">商家正在准备发货</text>
            <text class="empty-hint" v-if="item.status === 'rejected'">申请未通过，无需发货</text>
          </view>
        </view>

        <view class="sample-footer">
          <view class="action-btns">
            <view class="btn-detail" @tap.stop="goToDetail(item.id)">查看详情</view>
            <view class="btn-confirm" v-if="item.shipStatus === 'shipped'" @tap.stop="confirmReceive(item.id)">确认收货</view>
          </view>
        </view>
      </view>

      <view class="empty-state" v-if="filteredList.length === 0">
        <view class="empty-icon">📦</view>
        <text class="empty-text">暂无{{ currentFilterText }}的样品申请记录</text>
        <text class="empty-subtext">去选品申请样品，开启带货之旅</text>
        <button class="btn-go-apply" @tap="goToApply">去选品申请样品</button>
      </view>
    </view>

    <view class="no-more" v-if="filteredList.length > 0 && !hasMore">
      <text>没有更多了</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import selectionApi from '@/utils/api/selection.js'

const currentFilter = ref('all')
const sampleList = ref([])
const hasMore = ref(false)
const page = ref(1)
const pageSize = 10
const loading = ref(false)

const filters = [
  { label: '全部', value: 'all' },
  { label: '待审核', value: 'pending' },
  { label: '审核通过', value: 'approved' },
  { label: '已寄出', value: 'shipped' },
  { label: '已拒绝', value: 'rejected' }
]

const filterMap = {
  all: '',
  pending: '待审核',
  approved: '审核通过',
  shipped: '已寄出',
  rejected: '已拒绝'
}

const currentFilterText = computed(() => filterMap[currentFilter.value])

const filteredList = computed(() => {
  if (currentFilter.value === 'all') {
    return sampleList.value
  }
  if (currentFilter.value === 'shipped') {
    return sampleList.value.filter(item => item.shipStatus === 'shipped' || item.shipStatus === 'received')
  }
  return sampleList.value.filter(item => item.status === currentFilter.value)
})

const statusMap = {
  1: '待审核',
  2: '已通过',
  3: '已拒绝'
}

onMounted(() => {
  loadApplies()
})

async function loadApplies() {
  if (loading.value) return
  loading.value = true

  try {
    const res = await selectionApi.getMySelectionApplies({
      pageNum: page.value,
      pageSize: pageSize
    })

    if (res && res.list) {
      const formattedList = res.list.map(item => ({
        id: item.applyId,
        applyId: item.applyId,
        applyTime: item.applyTime,
        status: item.auditStatus === 1 ? 'pending' : item.auditStatus === 2 ? 'approved' : item.auditStatus === 3 ? 'rejected' : 'pending',
        statusText: item.auditStatusText || statusMap[item.auditStatus] || '未知',
        shipStatus: item.auditStatus === 4 ? 'shipped' : item.auditStatus === 5 ? 'received' : 'not_shipped',
        shipStatusText: item.auditStatus === 4 ? '已寄出' : item.auditStatus === 5 ? '已签收' : '未寄出',
        logisticsCompany: item.expressCompany,
        trackingNo: item.expressNo,
        products: [
          {
            id: item.spuId,
            image: item.mainImgUrl,
            name: item.spuName,
            price: (item.priceFee / 100).toFixed(2),
            commission: '0%',
            commissionRate: 0
          }
        ]
      }))

      // 获取每个商品的佣金率
      for (let i = 0; i < formattedList.length; i++) {
        const item = formattedList[i]
        const spuId = item.products[0].id
        if (spuId) {
          try {
            const spuRes = await selectionApi.getProductDetail(spuId)
            if (spuRes && spuRes.commissionRate !== undefined && spuRes.commissionRate !== null) {
              const commissionRate = parseFloat(spuRes.commissionRate)
              item.products[0].commissionRate = commissionRate
              item.products[0].commission = commissionRate.toFixed(0) + '%'
            }
          } catch (e) {
            console.error('获取商品佣金率失败', e)
          }
        }
      }

      if (page.value === 1) {
        sampleList.value = formattedList
      } else {
        sampleList.value = [...sampleList.value, ...formattedList]
      }
      hasMore.value = sampleList.value.length < res.total
    } else {
      if (page.value === 1) {
        sampleList.value = []
      }
      hasMore.value = false
    }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    console.error('加载申请列表失败', error)
  } finally {
    loading.value = false
  }
}

function switchFilter(filter) {
  currentFilter.value = filter
}

function goToDetail(applyId) {
  uni.navigateTo({
    url: `/pages/sample/detail/detail?applyId=${applyId}`
  })
}

function copyTrackingNo(no) {
  uni.setClipboardData({
    data: no,
    success: () => {
      uni.showToast({
        title: '单号已复制',
        icon: 'success'
      })
    }
  })
}

function confirmReceive(id) {
  uni.showModal({
    title: '确认收货',
    content: '确认已收到样品吗？',
    success: (res) => {
      if (res.confirm) {
        const item = sampleList.value.find(i => i.id === id)
        if (item) {
          item.shipStatus = 'received'
          item.shipStatusText = '已签收'
          item.receiveTime = new Date().toLocaleString()
        }
        uni.showToast({
          title: '确认收货成功',
          icon: 'success'
        })
      }
    }
  })
}

function goToApply() {
  uni.switchTab({
    url: '/pages/sample/selection/selection'
  })
}

function onPullDownRefresh() {
  page.value = 1
  loadApplies().finally(() => {
    uni.stopPullDownRefresh()
  })
}

function onReachBottom() {
  if (hasMore.value && !loading.value) {
    page.value++
    loadApplies()
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.filter-bar {
  display: flex;
  background-color: #fff;
  padding: 0 20rpx;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.filter-item {
  flex: 1;
  text-align: center;
  padding: 25rpx 0;
  position: relative;
}

.filter-text {
  font-size: 28rpx;
  color: #666;
}

.filter-item.active .filter-text {
  color: #ff4757;
  font-weight: bold;
}

.filter-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60rpx;
  height: 4rpx;
  background-color: #ff4757;
  border-radius: 2rpx;
}

.sample-list {
  padding: 20rpx;
}

.sample-card {
  background-color: #fff;
  border-radius: 15rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.sample-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20rpx 25rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.apply-id {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.apply-time {
  font-size: 24rpx;
  color: #999;
}

.status-badge {
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.status-badge.pending {
  background-color: #fff3cd;
}

.status-badge.pending .status-text {
  color: #f59e0b;
}

.status-badge.approved {
  background-color: #d4edda;
}

.status-badge.approved .status-text {
  color: #10b981;
}

.status-badge.rejected {
  background-color: #f8d7da;
}

.status-badge.rejected .status-text {
  color: #ef4444;
}

.status-text {
  font-size: 24rpx;
  font-weight: bold;
}

.product-list {
  padding: 20rpx 25rpx;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 15rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.product-item:last-child {
  border-bottom: none;
}

.product-image {
  width: 140rpx;
  height: 140rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10rpx;
}

.product-meta {
  display: flex;
  align-items: center;
  gap: 15rpx;
}

.product-price {
  font-size: 28rpx;
  color: #ff4757;
  font-weight: bold;
}

.product-commission {
  font-size: 24rpx;
  color: #10b981;
  background-color: #d1fae5;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.shipping-section {
  background-color: #f8f8f8;
  margin: 0 25rpx 20rpx;
  padding: 20rpx;
  border-radius: 10rpx;
}

.shipping-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.ship-status-badge {
  padding: 6rpx 20rpx;
  border-radius: 20rpx;
}

.ship-status-badge.not_shipped {
  background-color: #f3f4f6;
}

.ship-status-badge.not_shipped .ship-status-text {
  color: #9ca3af;
}

.ship-status-badge.shipped {
  background-color: #dbeafe;
}

.ship-status-badge.shipped .ship-status-text {
  color: #3b82f6;
}

.ship-status-badge.received {
  background-color: #d1fae5;
}

.ship-status-badge.received .ship-status-text {
  color: #059669;
}

.ship-status-text {
  font-size: 24rpx;
  font-weight: bold;
}

.shipping-detail {
  padding-top: 10rpx;
}

.receive-time {
  font-size: 26rpx;
  color: #059669;
  font-weight: 500;
}

.shipping-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.shipping-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 15rpx;
}

.tracking-no {
  font-size: 26rpx;
  color: #333;
  flex: 1;
  font-weight: 500;
}

.copy-btn {
  font-size: 24rpx;
  color: #ff4757;
  padding: 8rpx 20rpx;
  border: 1rpx solid #ff4757;
  border-radius: 20rpx;
  margin-left: 15rpx;
}

.shipping-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30rpx 0 20rpx;
}

.progress-dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
  background-color: #e0e0e0;
}

.progress-dot.active {
  background-color: #059669;
}

.progress-line {
  width: 120rpx;
  height: 4rpx;
  background-color: #e0e0e0;
  margin: 0 10rpx;
}

.progress-line.active {
  background-color: #059669;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  padding: 0 40rpx;
  margin-bottom: 10rpx;
}

.progress-label {
  font-size: 24rpx;
  color: #999;
}

.progress-label.active {
  color: #059669;
  font-weight: 500;
}

.shipping-empty {
  padding: 30rpx 0;
  text-align: center;
}

.empty-hint {
  font-size: 26rpx;
  color: #999;
}

.sample-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 25rpx;
  border-top: 1rpx solid #f0f0f0;
}

.action-btns {
  display: flex;
  gap: 15rpx;
}

.btn-detail,
.btn-confirm {
  font-size: 24rpx;
  padding: 12rpx 25rpx;
  border-radius: 25rpx;
  border: none;
  line-height: 1.5;
}

.btn-detail {
  background-color: #f5f5f5;
  color: #666;
}

.btn-confirm {
  background-color: #ff4757;
  color: #fff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 40rpx;
}

.empty-icon {
  font-size: 120rpx;
  margin-bottom: 30rpx;
}

.empty-text {
  font-size: 30rpx;
  color: #666;
  margin-bottom: 15rpx;
}

.empty-subtext {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 40rpx;
}

.btn-go-apply {
  background-color: #ff4757;
  color: #fff;
  font-size: 30rpx;
  padding: 20rpx 60rpx;
  border-radius: 40rpx;
  border: none;
}

.no-more {
  text-align: center;
  padding: 30rpx;
}

.no-more text {
  font-size: 26rpx;
  color: #999;
}
</style>
