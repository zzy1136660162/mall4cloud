<template>
  <view class="page">
    <view class="gallery-section">
      <swiper
        class="gallery-swiper"
        indicator-dots
        autoplay
        circular
        :interval="4000"
        :duration="500"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#ff4757"
      >
        <swiper-item v-for="(img, index) in product.images" :key="index" @tap="previewImage(img)">
          <image class="gallery-image" :src="img" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>

    <view class="price-section">
      <view class="price-main">
        <view class="price-tag">补贴价</view>
        <text class="price-symbol">¥</text>
        <text class="price-value">{{ product.price }}</text>
      </view>
      <view class="commission-info">
        <view class="commission-box">
          <text class="commission-label">预计赚</text>
          <text class="commission-value">¥{{ product.commissionAmount }}</text>
          <text class="commission-rate">佣金率{{ product.commissionRate }}%</text>
        </view>
      </view>
    </view>

    <view class="info-section">
      <view class="title-row">
        <text class="product-title">{{ product.title }}</text>
      </view>
      <view class="tag-row">
        <view class="stat-tag">
          <text class="stat-icon">↓</text>
          <text>90天降26%</text>
        </view>
        <view class="stat-tag">
          <text>该商品店内高佣</text>
        </view>
        <view class="stat-tag">
          <text>{{ product.reviewCount }}人评价"质量好"</text>
        </view>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-label">好评率</text>
        <text class="stat-value highlight">{{ product.goodRate }}%</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">累计销量</text>
        <text class="stat-value">{{ product.sales }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">累计上架达人</text>
        <text class="stat-value">{{ product.darenCount }}万</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">库存</text>
        <text class="stat-value">{{ product.stock }}万</text>
      </view>
    </view>

    <view class="sample-section">
      <view class="sample-row">
        <text class="sample-label">样品</text>
        <text class="sample-value">先买样，出单大于6单可返全款</text>
      </view>
      <view class="sample-row">
        <text class="sample-label">保障</text>
        <view class="guarantee-tags">
          <view class="guarantee-tag">
            <text class="guarantee-icon">✓</text>
            <text>信任购</text>
          </view>
          <text class="guarantee-text">品质放心·售后无忧</text>
        </view>
      </view>
      <view class="sample-row" @tap="showLogistics">
        <text class="sample-label">物流</text>
        <text class="sample-value">24小时内从{{ product.location }}发货</text>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="data-section">
      <view class="section-title">近30天推广数据</view>
      <view class="data-stats">
        <view class="data-item">
          <text class="data-value">{{ product.monthSales }}</text>
          <text class="data-label">商品总销量</text>
        </view>
        <view class="data-item">
          <text class="data-value">{{ product.monthViews }}</text>
          <text class="data-label">商品总浏览量</text>
        </view>
        <view class="data-item">
          <text class="data-value">{{ product.monthDaren }}</text>
          <text class="data-label">推广总达人数</text>
        </view>
      </view>
    </view>

    <view class="safe-area"></view>

    <view class="bottom-bar">
      <view class="bottom-actions">
        <view class="action-item" @tap="goToShelf">
          <text class="action-icon">🛒</text>
          <text class="action-text">货架</text>
        </view>
        <view class="action-item" @tap="contactService">
          <text class="action-icon">💬</text>
          <text class="action-text">联系</text>
        </view>
        <view class="action-btn btn-add" @tap="addToShelf">加入货架</view>
        <view class="action-btn btn-buy" @tap="goToSampleApply">申请样品</view>
      </view>
    </view>

    <view class="spec-modal" v-if="specModalVisible">
      <view class="spec-modal-overlay" @tap="closeSpecModal"></view>
      <view class="spec-modal-content">
        <view class="spec-modal-header">
          <text class="close-btn" @tap="closeSpecModal">×</text>
        </view>
        <view class="spec-product-info">
          <image class="spec-product-image" :src="product.images[0]" mode="aspectFill" />
          <view class="spec-product-detail">
            <text class="spec-product-title">{{ product.title }}</text>
            <view class="spec-product-price">
              <text class="spec-price-symbol">¥</text>
              <text class="spec-price-value">{{ selectedSpecs.weight ? selectedSpecs.weight.price : product.price }}</text>
            </view>
          </view>
        </view>
        <view class="spec-selection" v-if="product.specs && product.specs.weight">
          <view class="spec-item">
            <text class="spec-label">规格选择</text>
            <view class="spec-options">
              <view
                v-for="spec in product.specs.weight"
                :key="spec.id"
                :class="['spec-option', { selected: selectedSpecs.weight && selectedSpecs.weight.id === spec.id }]"
                @tap="selectSpec('weight', spec)"
              >
                <text class="spec-option-text">{{ spec.name }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="spec-quantity">
          <text class="spec-label">购买数量</text>
          <view class="quantity-control">
            <view :class="['quantity-btn', 'minus', { disabled: selectedCount <= 1 }]" @tap="changeQuantity('minus')">
              <text class="btn-text">-</text>
            </view>
            <view class="quantity-value">{{ selectedCount }}</view>
            <view class="quantity-btn plus" @tap="changeQuantity('plus')">
              <text class="btn-text">+</text>
            </view>
          </view>
        </view>
        <view class="spec-bottom">
          <view class="spec-total">
            <text class="total-label">合计：</text>
            <text class="total-price-symbol">¥</text>
            <text class="total-price-value">{{ totalPrice }}</text>
          </view>
          <view class="spec-confirm-btn" @tap="confirmSpec">
            <text class="confirm-btn-text">确定</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import selectionApi from '@/utils/api/selection.js'
import util from '@/utils/util.js'

const product = ref({
  spuId: null,
  id: '',
  title: '',
  price: '',
  originalPrice: '',
  commissionRate: 0,
  commissionAmount: '',
  images: [],
  shopName: '',
  sales: '',
  goodRate: '',
  reviewCount: '',
  darenCount: '',
  stock: '',
  location: '',
  monthSales: '',
  monthViews: '',
  monthDaren: '',
  specs: {
    weight: []
  }
})

const specModalVisible = ref(false)
const selectedSpecs = reactive({
  weight: null
})
const selectedCount = ref(1)
const totalPrice = ref(0)
const loading = ref(false)

const isLoggedIn = () => {
  const token = uni.getStorageSync('cloudToken')
  return !!token
}

const checkLogin = () => {
  if (!isLoggedIn()) {
    uni.showModal({
      title: '提示',
      content: '您还未登录，是否立即登录？',
      success: (res) => {
        if (res.confirm) {
          uni.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
    return false
  }
  return true
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const options = currentPage.options || currentPage.$page?.options || {}

  const spuId = options.spuId
  if (spuId) {
    loadDetail(spuId)
  }
})

async function loadDetail(spuId) {
  loading.value = true
  try {
    const res = await selectionApi.getSelectionDetail(spuId)
    if (res) {
      // 处理图片，确保是数组
      let rawImages = []
      if (Array.isArray(res.imgUrls) && res.imgUrls.length > 0) {
        rawImages = res.imgUrls
      } else if (res.mainImgUrl) {
        rawImages = [res.mainImgUrl]
      }

      product.value = {
        spuId: res.spuId,
        id: res.spuId,
        title: res.name,
        price: res.priceFee ? (res.priceFee / 100).toFixed(2) : '0.00',
        originalPrice: res.marketPriceFee ? (res.marketPriceFee / 100).toFixed(2) : '',
        commissionRate: res.commissionRate || 0,
        commissionAmount: res.commissionAmount ? (res.commissionAmount / 100).toFixed(2) : '0.00',
        images: rawImages.map(img => util.getImgUrl(img)),
        shopName: res.shopName || '旗舰店',
        sales: res.totalSales ? `${Math.floor(res.totalSales / 10000)}万+` : '0',
        goodRate: res.rating ? (res.rating * 20).toFixed(0) : 98,
        reviewCount: Math.floor(Math.random() * 10000),
        darenCount: (Math.random() * 5).toFixed(1),
        stock: '100',
        location: res.location || '全国',
        monthSales: res.monthSales ? `${Math.floor(res.monthSales / 10000)}万+` : '0',
        monthViews: res.monthSales ? `${Math.floor(res.monthSales * 5 / 10000)}万+` : '0',
        monthDaren: Math.floor(Math.random() * 5000).toString(),
        specs: res.specs || { weight: [] }
      }
      totalPrice.value = parseFloat(product.value.price)
    }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    console.error('加载商品详情失败', error)
  } finally {
    loading.value = false
  }
}

function previewImage(img) {
  uni.previewImage({
    current: img,
    urls: product.value.images
  })
}

function goToShelf() {
  uni.showToast({
    title: '已加入货架',
    icon: 'success'
  })
}

function addToShelf() {
  uni.showToast({
    title: '已加入货架',
    icon: 'success'
  })
}

function contactService() {
  uni.showModal({
    title: '联系客服',
    content: '客服电话: 400-123-4567',
    showCancel: false,
    confirmText: '知道了'
  })
}

function showLogistics() {
  uni.showToast({
    title: '查看物流信息',
    icon: 'none'
  })
}

function goToSampleApply() {
  if (!checkLogin()) {
    return
  }
  uni.navigateTo({
    url: `/pages/sample/apply/apply?spuId=${product.value.spuId}`
  })
}

function selectSpec(type, spec) {
  selectedSpecs[type] = spec
  calculateTotalPrice()
}

function changeQuantity(type) {
  if (type === 'minus' && selectedCount.value > 1) {
    selectedCount.value--
  } else if (type === 'plus') {
    selectedCount.value++
  }
  calculateTotalPrice()
}

function calculateTotalPrice() {
  let price = parseFloat(product.value.price)
  if (selectedSpecs.weight && selectedSpecs.weight.price) {
    price = parseFloat(selectedSpecs.weight.price)
  }
  totalPrice.value = (price * selectedCount.value).toFixed(2)
}

function confirmSpec() {
  closeSpecModal()
  uni.showToast({
    title: '已加入货架',
    icon: 'success'
  })
}

function closeSpecModal() {
  specModalVisible.value = false
}
</script>

<style lang="scss" scoped>
.page {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 120rpx;
}

.gallery-section {
  position: relative;
}

.gallery-swiper {
  height: 750rpx;
}

.gallery-image {
  width: 100%;
  height: 100%;
}

.price-section {
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.price-main {
  display: flex;
  align-items: baseline;
  margin-bottom: 20rpx;
}

.price-tag {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  margin-right: 16rpx;
}

.price-symbol {
  font-size: 36rpx;
  color: #ff4757;
  font-weight: bold;
}

.price-value {
  font-size: 56rpx;
  color: #ff4757;
  font-weight: bold;
}

.commission-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commission-box {
  display: flex;
  align-items: center;
  background: rgba(255, 71, 87, 0.1);
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
}

.commission-label {
  font-size: 24rpx;
  color: #ff4757;
  margin-right: 8rpx;
}

.commission-value {
  font-size: 28rpx;
  color: #ff4757;
  font-weight: bold;
  margin-right: 12rpx;
}

.commission-rate {
  font-size: 22rpx;
  color: #ff4757;
  background: rgba(255, 71, 87, 0.15);
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.info-section {
  background: #fff;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.product-title {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
  line-height: 1.5;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-top: 16rpx;
}

.stat-tag {
  background: #f5f5f5;
  padding: 8rpx 16rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  color: #666;
  display: flex;
  align-items: center;
}

.stat-icon {
  color: #52c41a;
  margin-right: 4rpx;
}

.stats-section {
  background: #fff;
  display: flex;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.stat-item {
  flex: 1;
  text-align: center;
  border-right: 1rpx solid #f0f0f0;
}

.stat-item:last-child {
  border-right: none;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 8rpx;
}

.stat-value {
  font-size: 32rpx;
  color: #333;
  font-weight: 600;
}

.stat-value.highlight {
  color: #ff4757;
}

.sample-section {
  background: #fff;
  padding: 24rpx 30rpx;
  margin-top: 20rpx;
}

.sample-row {
  display: flex;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.sample-row:last-child {
  border-bottom: none;
}

.sample-label {
  width: 100rpx;
  font-size: 26rpx;
  color: #999;
}

.sample-value {
  flex: 1;
  font-size: 26rpx;
  color: #333;
}

.guarantee-tags {
  display: flex;
  align-items: center;
  flex: 1;
}

.guarantee-tag {
  background: linear-gradient(135deg, #ff9500, #ffb700);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 14rpx;
  border-radius: 6rpx;
  display: flex;
  align-items: center;
  margin-right: 12rpx;
}

.guarantee-icon {
  margin-right: 4rpx;
}

.guarantee-text {
  font-size: 26rpx;
  color: #333;
}

.arrow {
  font-size: 28rpx;
  color: #ccc;
}

.data-section {
  background: #fff;
  margin-top: 20rpx;
  padding: 24rpx 30rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.data-stats {
  display: flex;
  margin-bottom: 24rpx;
}

.data-item {
  flex: 1;
  text-align: center;
}

.data-value {
  font-size: 40rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}

.data-label {
  font-size: 24rpx;
  color: #999;
}

.safe-area {
  height: 40rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
  z-index: 100;
}

.bottom-actions {
  display: flex;
  align-items: center;
  height: 100rpx;
  padding: 0 20rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100rpx;
}

.action-icon {
  font-size: 40rpx;
  margin-bottom: 4rpx;
}

.action-text {
  font-size: 20rpx;
  color: #666;
}

.action-btn {
  color: #fff;
  font-size: 30rpx;
  font-weight: 600;
  padding: 24rpx 48rpx;
  border-radius: 40rpx;
  margin-left: 20rpx;
}

.action-btn.btn-add {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
}

.action-btn.btn-buy {
  background: linear-gradient(135deg, #ff9500, #ffb700);
}

.spec-modal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.spec-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}

.spec-modal-content {
  background: #fff;
  border-radius: 20rpx 20rpx 0 0;
  position: relative;
  z-index: 1001;
  max-height: 80vh;
  overflow-y: auto;
}

.spec-modal-header {
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.close-btn {
  font-size: 48rpx;
  color: #666;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f5f5;
}

.spec-product-info {
  display: flex;
  padding: 30rpx;
  border-bottom: 10rpx solid #f5f5f5;
}

.spec-product-image {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
}

.spec-product-detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.spec-product-title {
  font-size: 30rpx;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.spec-product-price {
  display: flex;
  align-items: baseline;
}

.spec-price-symbol {
  font-size: 24rpx;
  color: #ff4757;
  font-weight: bold;
}

.spec-price-value {
  font-size: 44rpx;
  color: #ff4757;
  font-weight: bold;
}

.spec-selection {
  padding: 30rpx;
  border-bottom: 10rpx solid #f5f5f5;
}

.spec-item {
  margin-bottom: 30rpx;
}

.spec-item:last-child {
  margin-bottom: 0;
}

.spec-label {
  font-size: 28rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 20rpx;
  display: block;
}

.spec-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.spec-option {
  border: 2rpx solid #e0e0e0;
  padding: 16rpx 28rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  background: #fff;
}

.spec-option.selected {
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.spec-quantity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
  overflow: hidden;
}

.quantity-btn {
  width: 80rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.quantity-btn.disabled {
  opacity: 0.5;
}

.btn-text {
  font-size: 40rpx;
  color: #333;
}

.quantity-value {
  width: 120rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #333;
  border-left: 2rpx solid #e0e0e0;
  border-right: 2rpx solid #e0e0e0;
}

.spec-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  background: #fff;
  border-top: 1rpx solid #f0f0f0;
}

.spec-total {
  display: flex;
  align-items: baseline;
}

.total-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 12rpx;
}

.total-price-symbol {
  font-size: 28rpx;
  color: #ff4757;
  font-weight: bold;
}

.total-price-value {
  font-size: 40rpx;
  color: #ff4757;
  font-weight: bold;
}

.spec-confirm-btn {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  padding: 24rpx 56rpx;
  border-radius: 40rpx;
}
</style>
