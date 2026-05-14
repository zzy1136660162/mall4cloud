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
        <view class="price-tag">选品价</view>
        <text class="price-symbol">¥</text>
        <text class="price-value">{{ product.price }}</text>
        <text v-if="product.originalPrice" class="price-original">¥{{ product.originalPrice }}</text>
      </view>
      <view class="commission-info">
        <view class="commission-box">
          <text class="commission-label">预计佣金</text>
          <text class="commission-value">¥{{ product.commissionAmount }}</text>
          <text class="commission-rate">佣金率 {{ product.commissionRate }}%</text>
        </view>
      </view>
    </view>

    <view class="info-section">
      <view class="title-row">
        <text class="product-title">{{ product.title }}</text>
      </view>
      <view class="tag-row">
        <view class="stat-tag">
          <text class="stat-icon">✓</text>
          <text>店内高佣</text>
        </view>
        <view class="stat-tag">
          <text>可申请样品</text>
        </view>
      </view>
    </view>

    <view class="stats-section">
      <view class="stat-item">
        <text class="stat-label">评分</text>
        <text class="stat-value highlight">{{ product.goodRate }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">累计销量</text>
        <text class="stat-value">{{ product.sales }}</text>
      </view>
      <view class="stat-item">
        <text class="stat-label">月销量</text>
        <text class="stat-value">{{ product.monthSales }}</text>
      </view>
    </view>

    <view class="sample-section">
      <view class="sample-row">
        <text class="sample-label">样品</text>
        <text class="sample-value">先买样品，出单大于 6 单可返全款</text>
      </view>
      <view class="sample-row">
        <text class="sample-label">保障</text>
        <view class="guarantee-tags">
          <view class="guarantee-tag">
            <text class="guarantee-icon">✓</text>
            <text>平台保障</text>
          </view>
          <text class="guarantee-text">品质放心，售后无忧</text>
        </view>
      </view>
      <view v-if="hasSpecs" class="sample-row spec-row" @tap="openSpecModal">
        <text class="sample-label">规格</text>
        <text class="sample-value spec-summary">{{ selectedSpecSummary }}</text>
        <text class="arrow">></text>
      </view>
    </view>

    <view class="detail-section">
      <view class="section-title">商品详情</view>
      <view v-if="productDetail" class="detail-content">
        <rich-text :nodes="productDetail" />
      </view>
      <view v-else class="detail-empty">
        暂无商品详情
      </view>
    </view>

    <view class="safe-area"></view>

    <view class="bottom-bar">
      <view class="bottom-actions">
        <view class="action-item" @tap="goToShelf">
          <text class="action-icon">📦</text>
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

    <view v-if="specModalVisible" class="spec-modal">
      <view class="spec-modal-overlay" @tap="closeSpecModal"></view>
      <view class="spec-modal-content">
        <view class="spec-modal-header">
          <text class="spec-modal-title">选择规格</text>
          <text class="close-btn" @tap="closeSpecModal">×</text>
        </view>
        <view class="spec-product-info">
          <image class="spec-product-image" :src="product.images[0]" mode="aspectFill" />
          <view class="spec-product-detail">
            <text class="spec-product-title">{{ product.title }}</text>
            <view class="spec-product-price">
              <text class="spec-price-symbol">¥</text>
              <text class="spec-price-value">{{ product.price }}</text>
            </view>
            <text class="spec-selected-text">{{ selectedSpecSummary }}</text>
          </view>
        </view>

        <view v-if="hasSpecs" class="spec-selection">
          <view v-for="group in specGroups" :key="group.attrId" class="spec-item">
            <text class="spec-label">{{ group.attrName }}</text>
            <view class="spec-options">
              <view
                v-for="option in group.options"
                :key="`${group.attrId}-${option.attrValueId}`"
                :class="[
                  'spec-option',
                  { selected: isOptionSelected(group.attrName, option.attrValueName) },
                  { disabled: !isOptionEnabled(group.attrName, option.attrValueName) }
                ]"
                @tap="toggleSpec(group.attrName, option.attrValueName)"
              >
                <text class="spec-option-text">{{ option.attrValueName }}</text>
              </view>
            </view>
          </view>
        </view>

        <view class="spec-bottom">
          <text class="spec-bottom-text">
            {{ matchedSku ? '已匹配到可选规格组合' : specSelectionHint }}
          </text>
          <view class="spec-confirm-btn" @tap="confirmSpec">
            <text class="confirm-btn-text">确定</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import selectionApi from '@/utils/api/selection.js'
import util from '@/utils/util.js'

const product = ref({
  spuId: null,
  id: '',
  title: '',
  price: '0.00',
  originalPrice: '',
  commissionRate: '0.00',
  commissionAmount: '0.00',
  images: [],
  sales: '0',
  goodRate: '0.0',
  monthSales: '0'
})

const specModalVisible = ref(false)
const loading = ref(false)
const productDetail = ref('')
const specGroups = ref([])
const skuList = ref([])
const matchedSku = ref(null)
const selectedSpecMap = reactive({})

const hasSpecs = computed(() => specGroups.value.length > 0)

const selectedSpecSummary = computed(() => {
  if (!hasSpecs.value) {
    return '无规格'
  }
  const values = specGroups.value
    .map((group) => selectedSpecMap[group.attrName])
    .filter(Boolean)
  return values.length ? values.join(' / ') : '请选择规格'
})

const specSelectionHint = computed(() => {
  if (!hasSpecs.value) {
    return '当前商品无可选规格'
  }
  const selectedCount = specGroups.value.filter((group) => selectedSpecMap[group.attrName]).length
  return selectedCount === specGroups.value.length ? '请选择有效规格组合' : '请选择完整规格'
})

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
  enableShareMenu()
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
    if (!res) {
      return
    }

    const rawImages = normalizeImageList(res.imgUrls, res.mainImgUrl)
    const normalizedSpuAttrValues = Array.isArray(res.spuAttrValues) ? res.spuAttrValues : []
    const normalizedSkus = buildSkuList(Array.isArray(res.skus) ? res.skus : [])

    product.value = {
      spuId: res.spuId,
      id: res.spuId,
      title: res.name || '',
      price: formatMoney(res.priceFee),
      originalPrice: res.marketPriceFee ? formatMoney(res.marketPriceFee) : '',
      commissionRate: formatDecimal(res.commissionRate),
      commissionAmount: formatCommissionAmount(res),
      images: rawImages.map((img) => util.getImgUrl(img)),
      sales: formatCount(res.totalSales),
      goodRate: formatRating(res.rating),
      monthSales: formatCount(res.monthSales)
    }

    productDetail.value = normalizeDetail(res.detail)
    specGroups.value = buildSpecGroups(normalizedSpuAttrValues)
    skuList.value = normalizedSkus
    resetSelectedSpecs()
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    console.error('加载商品详情失败', error)
  } finally {
    loading.value = false
  }
}

function normalizeImageList(imgUrls, mainImgUrl) {
  if (Array.isArray(imgUrls) && imgUrls.length > 0) {
    return imgUrls
  }
  if (typeof imgUrls === 'string' && imgUrls.trim()) {
    return imgUrls.split(',').map((img) => img.trim()).filter(Boolean)
  }
  if (mainImgUrl) {
    return [mainImgUrl]
  }
  return ['']
}

function buildSpecGroups(spuAttrValues) {
  const groupMap = new Map()

  spuAttrValues.forEach((item) => {
    if (!item?.attrId || !item?.attrName || !item?.attrValueId || !item?.attrValueName) {
      return
    }
    if (!groupMap.has(item.attrId)) {
      groupMap.set(item.attrId, {
        attrId: item.attrId,
        attrName: item.attrName,
        options: []
      })
    }
    const group = groupMap.get(item.attrId)
    if (!group.options.some((option) => option.attrValueId === item.attrValueId)) {
      group.options.push({
        attrValueId: item.attrValueId,
        attrValueName: item.attrValueName
      })
    }
  })

  return Array.from(groupMap.values())
}

function buildSkuList(skus) {
  return skus.map((sku) => {
    const propertyMap = parseSkuProperties(sku.properties)
    return {
      ...sku,
      propertyMap
    }
  })
}

function parseSkuProperties(properties) {
  const propertyMap = {}
  if (!properties) {
    return propertyMap
  }

  properties.split(';').forEach((item) => {
    const [attrName, attrValueName] = item.split(':')
    if (attrName && attrValueName) {
      propertyMap[attrName.trim()] = attrValueName.trim()
    }
  })

  return propertyMap
}

function resetSelectedSpecs() {
  Object.keys(selectedSpecMap).forEach((key) => {
    delete selectedSpecMap[key]
  })
  matchedSku.value = null
}

function previewImage(img) {
  uni.previewImage({
    current: img,
    urls: product.value.images.filter(Boolean)
  })
}

function goToShelf() {
  uni.showToast({
    title: '已加入货架',
    icon: 'success'
  })
}

function addToShelf() {
  if (hasSpecs.value) {
    openSpecModal()
    return
  }
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

function goToSampleApply() {
  if (!checkLogin()) {
    return
  }
  uni.navigateTo({
    url: `/pages/sample/apply/apply?spuId=${product.value.spuId}`
  })
}

function openSpecModal() {
  specModalVisible.value = true
}

function closeSpecModal() {
  specModalVisible.value = false
}

function isOptionSelected(attrName, attrValueName) {
  return selectedSpecMap[attrName] === attrValueName
}

function isOptionEnabled(attrName, attrValueName) {
  if (!skuList.value.length) {
    return true
  }

  return skuList.value.some((sku) => {
    if (sku.propertyMap[attrName] !== attrValueName) {
      return false
    }
    return specGroups.value.every((group) => {
      const selectedValue = group.attrName === attrName ? attrValueName : selectedSpecMap[group.attrName]
      return !selectedValue || sku.propertyMap[group.attrName] === selectedValue
    })
  })
}

function toggleSpec(attrName, attrValueName) {
  if (!isOptionEnabled(attrName, attrValueName)) {
    return
  }

  if (selectedSpecMap[attrName] === attrValueName) {
    delete selectedSpecMap[attrName]
  } else {
    selectedSpecMap[attrName] = attrValueName
  }

  updateMatchedSku()
}

function updateMatchedSku() {
  const isFullySelected = specGroups.value.every((group) => selectedSpecMap[group.attrName])
  if (!isFullySelected) {
    matchedSku.value = null
    return
  }

  matchedSku.value = skuList.value.find((sku) => {
    return specGroups.value.every((group) => sku.propertyMap[group.attrName] === selectedSpecMap[group.attrName])
  }) || null
}

function confirmSpec() {
  closeSpecModal()
  if (matchedSku.value) {
    uni.showToast({
      title: '规格已选',
      icon: 'success'
    })
    return
  }
  uni.showToast({
    title: hasSpecs.value ? '已更新规格选择' : '当前商品无规格',
    icon: 'none'
  })
}

function normalizeDetail(detail) {
  if (!detail) {
    return ''
  }
  return detail.replace(/<img\b([^>]*)>/gi, '<img$1 style="max-width:100%;height:auto;display:block;" />')
}

function formatMoney(fee) {
  if (fee === null || fee === undefined || fee === '') {
    return '0.00'
  }
  return (Number(fee) / 100).toFixed(2)
}

function formatCommissionAmount(res) {
  const priceFee = Number(res.priceFee || 0)
  const commissionRate = Number(res.commissionRate || 0)
  if (!priceFee || !commissionRate) {
    return '0.00'
  }
  return ((priceFee * commissionRate) / 10000).toFixed(2)
}

function formatCount(value) {
  const count = Number(value || 0)
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万`
  }
  return `${count}`
}

function formatRating(value) {
  const rating = Number(value || 0)
  return rating ? rating.toFixed(1) : '0.0'
}

function formatDecimal(value) {
  const decimal = Number(value || 0)
  return decimal.toFixed(2)
}

function enableShareMenu() {
  // #ifdef MP-WEIXIN
  wx.showShareMenu({
    menus: ['shareAppMessage', 'shareTimeline']
  })
  // #endif
}

function getSelectionProductShareInfo() {
  return {
    title: product.value.title || '选品详情',
    path: `/pages/sample/product/product?spuId=${product.value.spuId || ''}`,
    imageUrl: product.value.images[0] || ''
  }
}

onShareAppMessage(() => {
  return getSelectionProductShareInfo()
})

onShareTimeline(() => {
  const shareInfo = getSelectionProductShareInfo()
  return {
    title: shareInfo.title,
    query: `spuId=${product.value.spuId || ''}`,
    imageUrl: shareInfo.imageUrl
  }
})
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
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.price-tag {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
  margin-right: 8rpx;
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

.price-original {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.commission-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.commission-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10rpx;
  background: rgba(255, 71, 87, 0.1);
  padding: 12rpx 20rpx;
  border-radius: 8rpx;
}

.commission-label {
  font-size: 24rpx;
  color: #ff4757;
}

.commission-value {
  font-size: 28rpx;
  color: #ff4757;
  font-weight: bold;
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
  line-height: 1.5;
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

.spec-row {
  cursor: pointer;
}

.spec-summary {
  color: #666;
}

.arrow {
  font-size: 28rpx;
  color: #ccc;
}

.detail-section {
  background: #fff;
  margin-top: 20rpx;
  padding: 24rpx 30rpx 30rpx;
}

.section-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 24rpx;
}

.detail-content {
  overflow: hidden;
  color: #333;
  font-size: 28rpx;
  line-height: 1.7;
}

.detail-empty {
  padding: 40rpx 0;
  text-align: center;
  color: #999;
  font-size: 26rpx;
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
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.spec-modal-overlay {
  position: absolute;
  inset: 0;
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
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.spec-modal-title {
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
}

.close-btn {
  font-size: 42rpx;
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
  gap: 16rpx;
  justify-content: center;
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

.spec-selected-text {
  font-size: 24rpx;
  color: #666;
}

.spec-selection {
  padding: 30rpx;
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
  min-width: 120rpx;
  border: 2rpx solid #e0e0e0;
  padding: 16rpx 28rpx;
  border-radius: 8rpx;
  font-size: 26rpx;
  color: #333;
  background: #fff;
  text-align: center;
}

.spec-option.selected {
  border-color: #ff4757;
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
}

.spec-option.disabled {
  opacity: 0.45;
}

.spec-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
  padding: 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.spec-bottom-text {
  flex: 1;
  font-size: 24rpx;
  color: #666;
  line-height: 1.5;
}

.spec-confirm-btn {
  background: linear-gradient(135deg, #ff4757, #ff6b81);
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
  padding: 24rpx 56rpx;
  border-radius: 40rpx;
}

.confirm-btn-text {
  color: #fff;
}
</style>
