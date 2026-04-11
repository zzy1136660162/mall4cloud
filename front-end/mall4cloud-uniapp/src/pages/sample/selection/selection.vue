<template>
  <view class="page">
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
            :class="['category-item', { active: currentCategory === 'all' }]"
            @tap="switchCategory('all')"
          >
            <text class="category-text">首页</text>
          </view>
          <view
            v-for="cat in categories"
            :key="cat"
            :class="['category-item', { active: currentCategory === cat }]"
            @tap="switchCategory(cat)"
          >
            <text class="category-text">{{ cat }}</text>
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

    <view class="quick-entry">
      <view class="entry-list">
        <view class="entry-item" @tap="onEntryTap('hot')">
          <image
            class="entry-icon"
            src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142047334_666195650315.png"
            mode="aspectFit"
          />
          <text class="entry-name">超级爆品</text>
        </view>
        <view class="entry-item" @tap="onEntryTap('video')">
          <image
            class="entry-icon"
            src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142605000_666195967983.png"
            mode="aspectFit"
          />
          <text class="entry-name">视频热卖</text>
        </view>
        <view class="entry-item" @tap="onEntryTap('merchant')">
          <image
            class="entry-icon"
            src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142853275_666196136259.png"
            mode="aspectFit"
          />
          <text class="entry-name">商家优选</text>
        </view>
        <view class="entry-item" @tap="onEntryTap('cheap')">
          <image
            class="entry-icon"
            src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313145940320_666197983305.png"
            mode="aspectFit"
          />
          <text class="entry-name">低价好卖</text>
        </view>
      </view>
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

    <view class="sub-filter-panel" v-if="showFilterPanel">
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
      <view
        class="product-item"
        v-for="item in products"
        :key="item.id"
        @tap="goToProductDetail(item.id)"
      >
        <view class="product-img-wrap">
          <image class="product-img" :src="item.image" mode="aspectFill" />
          <view class="product-tag" v-if="item.tag">{{ item.tag }}</view>
        </view>
        <view class="product-info">
          <view class="product-title">{{ item.title }}</view>
          <view class="service-tags" v-if="item.tags && item.tags.length">
            <text class="service-tag" v-for="(tag, idx) in item.tags" :key="idx">{{ tag }}</text>
          </view>
          <view class="shop-info">
            <text class="shop-name">{{ item.shop }}</text>
            <text class="shop-score" v-if="item.shopScore">{{ item.shopScore }}分</text>
          </view>
          <view class="product-price-wrap">
            <text class="price-symbol">¥</text>
            <text class="product-price">{{ item.price }}</text>
            <text class="product-original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
          </view>
          <view class="product-commission-wrap">
            <text class="commission-tag">佣金{{ item.commissionRate }}%</text>
            <text class="commission-amount">预计赚¥{{ item.commissionAmount }}</text>
          </view>
          <view class="product-bottom">
            <view class="sales-info">
              <text class="sales-text">已售{{ item.salesText }}</text>
              <text class="location" v-if="item.location">{{ item.location }}</text>
            </view>
          </view>
        </view>
        <view class="btn-apply-wrap">
          <view class="btn-apply" @tap.stop="applySample(item.id)">申请样品</view>
        </view>
      </view>
    </view>

    <view class="loading-more" v-if="loading">
      <text>加载中...</text>
    </view>
    <view class="no-more" v-if="!hasMore && products.length">
      <text>没有更多了</text>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const currentCategory = ref('all')
const currentFilter = ref('all')
const products = ref([])
const page = ref(1)
const pageSize = 10
const loading = ref(false)
const hasMore = ref(true)
const showFilterPanel = ref(false)

const categories = [
  '疼痛舒缓', '鼻部护理', '眼部护理', '皮肤护理', '女性调理', '男性养护',
  '小儿护理', '纤体瘦身', '养发护发', '泡浴养生', '人参滋补', '阿胶膏滋',
  '草本茶饮', '固体饮料', '压片糖果', '营养颗粒', '植物饮品', '配制酒'
]

const banners = ref([
  {
    id: 1,
    image: 'https://picsum.photos/750/300?random=1',
    title: '精选好物',
    type: 'activity'
  },
  {
    id: 2,
    image: 'https://picsum.photos/750/300?random=2',
    title: '爆款推荐',
    type: 'activity'
  }
])

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
  price: 'all'
})

onMounted(() => {
  loadProducts()
})

function loadProducts() {
  if (loading.value) return
  loading.value = true
  
  const mockProducts = generateMockProducts(page.value, pageSize)
  if (page.value === 1) {
    products.value = mockProducts
  } else {
    products.value = [...products.value, ...mockProducts]
  }
  
  hasMore.value = mockProducts.length === pageSize
  page.value++
  loading.value = false
}

function generateMockProducts(pageNum, size) {
  const startId = (pageNum - 1) * size
  return Array.from({ length: size }, (_, i) => ({
    id: startId + i + 1,
    image: `https://picsum.photos/350/350?random=${startId + i + 10}`,
    title: `精选商品 ${startId + i + 1} 限时特惠品质保证`,
    price: (Math.random() * 200 + 9.9).toFixed(2),
    originalPrice: (Math.random() * 300 + 50).toFixed(2),
    commissionRate: Math.floor(Math.random() * 30 + 5),
    commissionAmount: (Math.random() * 30 + 1).toFixed(2),
    sales: Math.floor(Math.random() * 10000),
    salesText: `${Math.floor(Math.random() * 5 + 0.1)}万+`,
    tags: ['七天退货', '极速发货'],
    shop: '旗舰店',
    shopScore: '4.9',
    location: '广州',
    tag: Math.random() > 0.7 ? '精选' : ''
  }))
}

function switchCategory(category) {
  currentCategory.value = category
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
  currentFilters[type] = value
  page.value = 1
  loadProducts()
}

function goToSearch() {
  uni.navigateTo({
    url: '/pages/search-page/search-page'
  })
}

function goToProductDetail(id) {
  uni.navigateTo({
    url: `/pages/sample/product/product?id=${id}`
  })
}

function applySample(id) {
  uni.navigateTo({
    url: `/pages/sample/apply/apply?productId=${id}`
  })
}

function onBannerTap(item) {
  uni.showToast({
    title: item.title,
    icon: 'none'
  })
}

function onEntryTap(type) {
  uni.showToast({
    title: `快捷入口: ${type}`,
    icon: 'none'
  })
}

function onPullDownRefresh() {
  page.value = 1
  loadProducts()
  uni.stopPullDownRefresh()
}

function onReachBottom() {
  if (hasMore.value && !loading.value) {
    loadProducts()
  }
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.header {
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
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

.quick-entry {
  margin: 16rpx 20rpx;
  padding: 20rpx 30rpx;
  background-color: #fff;
  border-radius: 16rpx;
}

.entry-list {
  display: flex;
  justify-content: space-around;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20%;
}

.entry-icon {
  width: 70rpx;
  height: 70rpx;
  margin-bottom: 8rpx;
}

.entry-name {
  font-size: 22rpx;
  color: #333;
  text-align: center;
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
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  margin-bottom: 16rpx;
  display: block;
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
  font-size: 26rpx;
  color: #333;
  line-height: 1.4;
  height: 72rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 12rpx;
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
  margin-bottom: 12rpx;
}

.shop-name {
  font-size: 22rpx;
  color: #999;
  margin-right: 12rpx;
}

.shop-score {
  font-size: 22rpx;
  color: #ff5000;
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
  margin-bottom: 16rpx;
}

.commission-tag {
  background: linear-gradient(135deg, #fff5f0, #ffe8e0);
  color: #ff5000;
  font-size: 22rpx;
  padding: 6rpx 12rpx;
  border-radius: 8rpx;
  margin-right: 12rpx;
}

.commission-amount {
  font-size: 22rpx;
  color: #ff5000;
}

.product-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sales-info {
  display: flex;
  align-items: center;
}

.sales-text {
  font-size: 22rpx;
  color: #999;
  margin-right: 12rpx;
}

.location {
  font-size: 22rpx;
  color: #999;
}

.btn-apply-wrap {
  padding: 0 20rpx 20rpx;
  display: flex;
  justify-content: flex-end;
}

.btn-apply {
  background: linear-gradient(135deg, #ff5000, #ff7b00);
  color: #fff;
  font-size: 24rpx;
  padding: 12rpx 24rpx;
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
