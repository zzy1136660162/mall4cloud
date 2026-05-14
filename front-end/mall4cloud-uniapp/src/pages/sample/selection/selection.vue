<template>
  <view class="page">
    <scroll-view class="content-scroll" scroll-y @scrolltolower="onReachBottom">
      <view class="header">
        <view class="search-bar" @tap="goToSearch">
          <view class="search-input-box">
            <text class="search-icon">🔍</text>
            <input class="search-input" placeholder="搜索商品" placeholder-class="placeholder" disabled />
          </view>
        </view>

        <scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
          <view class="category-list">
            <view
              :class="['category-item', { active: currentCategory === 0 }]"
              @tap="switchCategory(0)"
            >
              <text class="category-text">首页</text>
            </view>
            <view
              v-for="cat in categories"
              :key="cat.categoryId"
              :class="['category-item', { active: currentCategory === cat.categoryId }]"
              @tap="switchCategory(cat.categoryId)"
            >
              <text class="category-text">{{ cat.name }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="banner-section">
        <swiper
          class="banner-swiper"
          indicator-dots
          autoplay
          circular
          :interval="3500"
          :duration="500"
          indicator-color="rgba(255,255,255,0.5)"
          indicator-active-color="#ff5000"
        >
          <swiper-item v-for="(item, index) in banners" :key="index" @tap="onBannerTap(item)">
            <image class="banner-image" :src="item.image" mode="aspectFill" />
          </swiper-item>
        </swiper>
      </view>

      <view class="filter-section">
        <view class="filter-bar">
          <view
            :class="['filter-item', { active: currentFilter === 'all' }]"
            @tap="switchFilter('all')"
          >
            <text>精选</text>
          </view>
          <view
            :class="['filter-item', { active: currentFilter === 'hot' }]"
            @tap="switchFilter('hot')"
          >
            <text>热销</text>
          </view>
          <view
            :class="['filter-item', { active: currentFilter === 'new' }]"
            @tap="switchFilter('new')"
          >
            <text>新品</text>
          </view>
          <view
            :class="['filter-item', { active: currentFilter === 'commission' }]"
            @tap="switchFilter('commission')"
          >
            <text>高佣</text>
          </view>
        </view>
        <view class="filter-more" @tap="toggleFilterPanel">
          <text>筛选</text>
          <text class="arrow">▼</text>
        </view>
      </view>

      <view v-if="showFilterPanel" class="sub-filter-panel">
        <view class="sub-filter-section">
          <text class="sub-filter-title">佣金比例</text>
          <view class="sub-filter-options">
            <view
              v-for="item in filterOptions.commission"
              :key="item.value"
              :class="['sub-filter-item', { active: currentFilters.commission === item.value }]"
              @tap="selectSubFilter('commission', item.value)"
            >
              {{ item.label }}
            </view>
          </view>
        </view>

        <view class="sub-filter-section">
          <text class="sub-filter-title">价格区间</text>
          <view class="sub-filter-options">
            <view
              v-for="item in filterOptions.price"
              :key="item.value"
              :class="['sub-filter-item', { active: currentFilters.price === item.value }]"
              @tap="selectSubFilter('price', item.value)"
            >
              {{ item.label }}
            </view>
          </view>
        </view>
      </view>

      <view class="product-list">
        <view class="product-grid">
          <view
            v-for="item in products"
            :key="item.id"
            class="product-item"
            @tap="onProductTap(item)"
          >
            <view class="product-img-wrap">
              <image class="product-img" :src="item.image" mode="aspectFill" />
              <view v-if="item.tag" class="product-tag">{{ item.tag }}</view>
            </view>

            <view class="product-info">
              <view class="product-title">{{ item.title }}</view>

              <view v-if="item.tags && item.tags.length" class="service-tags">
                <text v-for="(tag, idx) in item.tags" :key="idx" class="service-tag">{{ tag }}</text>
              </view>

              <view v-if="selectMode" class="shop-info">
                <text class="shop-name">{{ item.shop }}</text>
              </view>

              <view class="product-price-wrap">
                <text class="price-symbol">¥</text>
                <text class="product-price">{{ item.price }}</text>
                <text v-if="item.originalPrice" class="product-original">¥{{ item.originalPrice }}</text>
              </view>

              <view class="product-commission-wrap">
                <text class="commission-tag">佣金{{ item.commissionRate }}%</text>
                <text class="commission-amount">预计赚¥{{ item.commissionAmount }}</text>
              </view>
            </view>

            <view v-if="selectMode" class="btn-apply-wrap">
              <view class="btn-select" @tap.stop="selectProduct(item)">选择</view>
            </view>

            <view v-else class="btn-apply-wrap">
              <view class="shop-info">
                <text class="shop-name">{{ item.shop }}</text>
                <text v-if="item.shopScore" class="bottom-score">{{ item.shopScore }}分</text>
              </view>
              <view class="btn-apply" @tap.stop="applySample(item.id)">申请样品</view>
            </view>
          </view>
        </view>

        <view v-if="loading" class="loading-more">
          <text>加载中...</text>
        </view>
        <view v-if="!hasMore && products.length" class="no-more">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
  </view>

  <diy-tabbar v-if="!selectMode" :current-index="2" />
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import selectionApi from '@/utils/api/selection.js'
import util from '@/utils/util.js'

const currentCategory = ref(0)
const currentFilter = ref('all')
const products = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const hasMore = ref(true)
const showFilterPanel = ref(false)
const categories = ref([])
const banners = ref([])
const selectMode = ref(false)

const filterOptions = {
  commission: [
    { label: '不限', value: 'all' },
    { label: '10%以上', value: '10' },
    { label: '20%以上', value: '20' },
    { label: '30%以上', value: '30' }
  ],
  price: [
    { label: '不限', value: 'all' },
    { label: '50元以下', value: '50' },
    { label: '50-100元', value: '50-100' },
    { label: '100-500元', value: '100-500' },
    { label: '500元以上', value: '500' }
  ]
}

const currentFilters = reactive({
  commission: 'all',
  price: 'all',
  priceMin: null,
  priceMax: null
})

onLoad((options) => {
  if (options.mode === 'select') {
    selectMode.value = true
  }

  const selectedProduct = uni.getStorageSync('selectedProductForApply')
  if (selectedProduct) {
    uni.removeStorageSync('selectedProductForApply')
  }
})

onMounted(() => {
  loadCategories()
  loadProducts()
  loadBanners()
})

function isLoggedIn() {
  const token = uni.getStorageSync('cloudToken')
  return !!token
}

function checkLogin() {
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

async function loadCategories() {
  try {
    const res = await selectionApi.getCategories(0, 0)
    if (res && res.length) {
      categories.value = res
    }
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

async function loadBanners() {
  try {
    const res = await selectionApi.getSelectionBanners()
    if (res && res.length) {
      banners.value = res.map((item) => ({
        ...item,
        image: util.getImgUrl(item.imgUrl),
        title: '精选好物',
        type: item.spuId ? 'product' : 'activity'
      }))
    }
  } catch (error) {
    console.error('加载轮播图失败', error)
  }
}

async function loadProducts() {
  if (loading.value) {
    return
  }
  loading.value = true

  try {
    const params = {
      pageNum: page.value,
      pageSize,
      categoryId: currentCategory.value || null
    }

    if (currentFilters.commission !== 'all') {
      params.minCommissionRate = parseFloat(currentFilters.commission)
    }

    if (currentFilters.priceMin) {
      params.minPrice = currentFilters.priceMin * 100
    }
    if (currentFilters.priceMax) {
      params.maxPrice = currentFilters.priceMax * 100
    }

    if (currentFilter.value === 'hot') {
      params.saleNumSort = 0
    } else if (currentFilter.value === 'new') {
      params.createTimeSort = 0
    } else if (currentFilter.value === 'commission') {
      params.commissionSort = 0
    }

    const res = await selectionApi.getSelectionProducts(params)
    if (res && res.list) {
      const formattedProducts = res.list.map((item) => ({
        ...item,
        id: item.spuId,
        image: util.getImgUrl(item.mainImgUrl),
        title: item.name,
        price: ((item.priceFee || 0) / 100).toFixed(2),
        originalPrice: item.marketPriceFee ? (item.marketPriceFee / 100).toFixed(2) : '',
        commissionRate: item.commissionRate ?? 0,
        commissionAmount: item.commissionAmount ? (item.commissionAmount / 100).toFixed(2) : '0.00',
        salesText: formatSales(item.totalSales),
        shop: item.shopName || '评分',
        shopScore: item.rating || '4.9',
        location: item.location || '',
        tag: item.isSelectionBest ? '精选' : ''
      }))

      if (page.value === 1) {
        products.value = formattedProducts
      } else {
        products.value = [...products.value, ...formattedProducts]
      }
      hasMore.value = products.value.length < (res.total || 0)
    } else {
      if (page.value === 1) {
        products.value = []
      }
      hasMore.value = false
    }
  } catch (error) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    console.error('加载商品失败', error)
  } finally {
    loading.value = false
  }
}

function formatSales(totalSales) {
  const sales = Number(totalSales || 0)
  if (sales >= 10000) {
    return `${(sales / 10000).toFixed(1)}万`
  }
  return `${sales}`
}

function switchCategory(categoryId) {
  currentCategory.value = categoryId === 'all' ? 0 : categoryId
  page.value = 1
  loadProducts()
}

function switchFilter(filter) {
  currentFilter.value = filter
  page.value = 1
  loadProducts()
}

function toggleFilterPanel() {
  showFilterPanel.value = !showFilterPanel.value
}

function selectSubFilter(type, value) {
  if (type === 'commission') {
    currentFilters.commission = value
  } else if (type === 'price') {
    currentFilters.price = value
    if (value === 'all') {
      currentFilters.priceMin = null
      currentFilters.priceMax = null
    } else if (value === '50') {
      currentFilters.priceMin = null
      currentFilters.priceMax = 50
    } else if (value === '500') {
      currentFilters.priceMin = 500
      currentFilters.priceMax = null
    } else if (value.includes('-')) {
      const [min, max] = value.split('-')
      currentFilters.priceMin = parseInt(min)
      currentFilters.priceMax = parseInt(max)
    }
  }

  page.value = 1
  loadProducts()
}

function goToSearch() {
  uni.navigateTo({
    url: '/pages/search-page/search-page'
  })
}

function goToProductDetail(spuId) {
  uni.navigateTo({
    url: `/pages/sample/product/product?spuId=${spuId}`
  })
}

function onProductTap(item) {
  if (selectMode.value) {
    selectProduct(item)
  } else {
    goToProductDetail(item.id)
  }
}

function selectProduct(item) {
  const productData = {
    id: item.id,
    image: item.image,
    name: item.title,
    price: item.price,
    commissionRate: item.commissionRate,
    commissionAmount: item.commissionAmount
  }

  uni.setStorageSync('selectedProductForApply', productData)
  uni.switchTab({
    url: '/pages/sample/apply/apply'
  })
}

function applySample(spuId) {
  if (!checkLogin()) {
    return
  }

  uni.setStorageSync('applySpuId', spuId)

  const pages = getCurrentPages()
  const applyPageIndex = pages.findIndex((pageItem) => pageItem.route && pageItem.route.includes('apply/apply'))

  if (applyPageIndex !== -1) {
    uni.navigateBack({
      delta: pages.length - 1 - applyPageIndex
    })
  } else {
    uni.navigateTo({
      url: `/pages/sample/apply/apply?spuId=${spuId}`
    })
  }
}

function onBannerTap(item) {
  if (item.spuId) {
    goToProductDetail(item.spuId)
    return
  }

  uni.showToast({
    title: item.title || '精选好物',
    icon: 'none'
  })
}

function onReachBottom() {
  if (hasMore.value && !loading.value) {
    page.value += 1
    loadProducts()
  }
}
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  background-color: #f5f5f5;
}

.content-scroll {
  height: calc(100vh - 100rpx - env(safe-area-inset-bottom));
}

.header {
  background-color: #fff;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 30rpx;
}

.search-input-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 32rpx;
  padding: 16rpx 24rpx;
}

.search-icon {
  font-size: 28rpx;
  color: #999;
  margin-right: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.placeholder {
  color: #999;
}

.category-scroll {
  white-space: nowrap;
}

.category-list {
  display: flex;
  padding: 0 20rpx 20rpx;
}

.category-item {
  display: inline-flex;
  padding: 16rpx 24rpx;
  margin: 0 8rpx;
  border-radius: 32rpx;
  transition: all 0.3s;
}

.category-item.active {
  background-color: #ff5000;
}

.category-item.active .category-text {
  color: #fff;
}

.category-text {
  font-size: 26rpx;
  color: #666;
}

.banner-section {
  margin: 16rpx 20rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-swiper {
  height: 280rpx;
  border-radius: 16rpx;
}

.banner-image {
  width: 100%;
  height: 100%;
}

.filter-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 20rpx 16rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.filter-bar {
  display: flex;
  flex: 1;
}

.filter-item {
  padding: 12rpx 24rpx;
  margin-right: 16rpx;
  font-size: 26rpx;
  color: #666;
  border-radius: 24rpx;
}

.filter-item.active {
  background-color: #fff5f0;
  color: #ff5000;
  font-weight: 500;
}

.filter-more {
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx;
  font-size: 26rpx;
  color: #666;
}

.filter-more .arrow {
  margin-left: 8rpx;
  font-size: 20rpx;
}

.sub-filter-panel {
  margin: 0 20rpx 16rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.sub-filter-section {
  margin-bottom: 20rpx;
}

.sub-filter-section:last-child {
  margin-bottom: 0;
}

.sub-filter-title {
  display: block;
  margin-bottom: 16rpx;
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
}

.sub-filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.sub-filter-item {
  padding: 12rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 24rpx;
  font-size: 24rpx;
  color: #666;
}

.sub-filter-item.active {
  background-color: #ff5000;
  color: #fff;
}

.product-list {
  padding: 0 20rpx;
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.product-item {
  width: 48.5%;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  display: flex;
  flex-direction: column;
}

.product-img-wrap {
  position: relative;
  width: 100%;
  height: 340rpx;
}

.product-img {
  width: 100%;
  height: 100%;
}

.product-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: linear-gradient(135deg, #ff5000, #ff7b00);
  color: #fff;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}

.product-info {
  padding: 20rpx;
}

.product-title {
  margin-bottom: 12rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: 600;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.service-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 12rpx;
}

.service-tag {
  font-size: 20rpx;
  color: #ff5000;
  border: 1rpx solid #ffd8bf;
  padding: 4rpx 10rpx;
  border-radius: 6rpx;
}

.shop-info {
  display: flex;
  align-items: center;
  min-width: 0;
}

.shop-name {
  font-size: 22rpx;
  color: #999;
  margin-right: 12rpx;
}

.product-price-wrap {
  display: flex;
  align-items: baseline;
  margin-bottom: 8rpx;
}

.price-symbol {
  font-size: 24rpx;
  color: #ff5000;
  font-weight: 600;
}

.product-price {
  font-size: 36rpx;
  color: #ff5000;
  font-weight: 600;
  margin-right: 12rpx;
}

.product-original {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
}

.product-commission-wrap {
  display: flex;
  align-items: center;
}

.commission-tag {
  margin-right: 12rpx;
  background: linear-gradient(135deg, #fff5f0, #ffe8e0);
  color: #ff5000;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
}

.commission-amount {
  font-size: 22rpx;
  color: #ff5000;
}

.btn-apply-wrap {
  padding: 0 20rpx 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
  min-height: 56rpx;
}

.bottom-score {
  font-size: 22rpx;
  color: #ff5000;
  font-weight: 600;
  flex-shrink: 0;
}

.btn-apply {
  background: linear-gradient(135deg, #ff5000, #ff7b00);
  color: #fff;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
  border-radius: 28rpx;
  flex-shrink: 0;
}

.btn-select {
  background: linear-gradient(135deg, #00c853, #00e676);
  color: #fff;
  font-size: 24rpx;
  padding: 12rpx 32rpx;
  border-radius: 28rpx;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 30rpx;
}

.loading-more text,
.no-more text {
  font-size: 26rpx;
  color: #999;
}
</style>
