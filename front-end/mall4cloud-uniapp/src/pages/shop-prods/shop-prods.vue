<template>
  <view class="shop-prods-page">
    <DiyTabbar :current-index="3" @change="handleTabChange" />

    <scroll-view class="category-scroll" scroll-x :show-scrollbar="false">
      <view class="category-list">
        <view
          :class="['category-item', { active: currentCategoryId === 0 }]"
          @tap="onCategoryChange(0)"
        >
          <text class="category-name">全部</text>
        </view>
        <view
          v-for="cat in categories"
          :key="cat.categoryId"
          :class="['category-item', { active: currentCategoryId === cat.categoryId }]"
          @tap="onCategoryChange(cat.categoryId)"
        >
          <text class="category-name">{{ cat.name }}</text>
        </view>
      </view>
    </scroll-view>

    <view class="filter-bar">
      <view class="filter-list">
        <view
          v-for="filter in filters"
          :key="filter.id"
          :class="['filter-item', { active: currentFilterId === filter.id }]"
          @tap="onFilterChange(filter.id)"
        >
          <text>{{ filter.name }}</text>
          <text class="filter-arrow" v-if="currentFilterId === filter.id">↓</text>
        </view>
      </view>
      <view class="filter-right">
        <text class="product-count">共{{ prodList.length }}件商品</text>
      </view>
    </view>

    <scroll-view class="product-scroll" scroll-y @scrolltolower="onScrollToLower" :enable-back-to-top="true">
      <view class="product-grid" v-if="prodList.length > 0">
        <view
          class="product-card"
          v-for="(item, index) in prodList"
          :key="index"
          @tap="detail(item.spuId)"
        >
          <view class="product-image-wrapper">
            <image class="product-image" :src="util.getImgUrl(item.mainImgUrl)" mode="aspectFill" :lazy-load="true" />
            <view class="product-tag" v-if="item.isNew || item.isHot">
              <text v-if="item.isNew">新品</text>
              <text v-if="item.isHot">热销</text>
            </view>
          </view>

          <view class="product-info">
            <text class="product-name">{{ item.spuName }}</text>
            <view class="product-price-row">
              <text class="product-price">￥{{ price(item.priceFee) }}</text>
              <text class="product-original-price" v-if="item.marketPriceFee">￥{{ price(item.marketPriceFee) }}</text>
            </view>
            <view class="product-bottom">
              <text class="product-sales">已售{{ item.totalSales || 0 }}</text>
              <view class="add-cart-btn" @tap.stop.prevent="addToCart(item)">
                <text>加购</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="loading-state" v-if="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <view class="empty-state" v-if="!loading && prodList.length === 0">
        <text class="empty-text">暂无商品，看看别的吧</text>
      </view>

      <view class="no-more-state" v-if="!hasMore && prodList.length > 0">
        <text class="no-more-text">没有更多了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import util from '@/utils/util.js'
import DiyTabbar from '@/components/diy-tabbar/diy-tabbar.vue'

const Data = reactive({
  shopId: null,
  shopInfo: {},
  shopSecondaryCategoryId: null,
  keyword: '',
  pageNum: 1,
  pageSize: 20,
  total: 1,
  pages: 1,
  prodList: [],
  loading: false,
  hasMore: true,
  categories: [],
  currentCategoryId: null,
  currentFilterId: 0,
  filters: [
    { id: 0, name: '综合' },
    { id: 1, name: '销量' },
    { id: 2, name: '价格升' },
    { id: 3, name: '价格降' }
  ]
})

const {
  shopId,
  shopInfo,
  prodList,
  loading,
  hasMore,
  categories,
  currentCategoryId,
  currentFilterId,
  filters
} = toRefs(Data)

const cartCount = ref(0)

const handleTabChange = ({ item, index }) => {
  console.log('Tab切换到:', item.text, index)
}

onReachBottom(() => {
  if (Data.hasMore && !Data.loading) {
    Data.pageNum++
    getProd()
  }
})

onPullDownRefresh(() => {
  Data.pageNum = 1
  Data.hasMore = true
  getProd().finally(() => {
    uni.stopPullDownRefresh()
  })
})

onLoad((options) => {
  if (options.shopId) {
    Data.shopId = Number(options.shopId)
  }
  if (options.shopSecondaryCategoryId) {
    Data.shopSecondaryCategoryId = Number(options.shopSecondaryCategoryId)
  }
  if (options.keyword) {
    Data.keyword = options.keyword
  }
  Data.shopInfo = uni.getStorageSync('cloudShopInfo')
  loadCategories()
  getProd()
})

onShow(() => {
  loadCartCount()
})

const price = (value) => {
  return (value / 100).toFixed(2)
}

async function loadCategories() {
  try {
    const res = await http.request({
      url: '/mall4cloud_product/ua/category/category_list',
      method: 'GET',
      data: { parentId: 0, shopId: 0 }
    })
    if (res && res.length) {
      Data.categories = res
    }
  } catch (error) {
    console.error('加载分类失败', error)
  }
}

function onCategoryChange(categoryId) {
  if (categoryId === Data.currentCategoryId) return
  Data.currentCategoryId = categoryId
  Data.shopSecondaryCategoryId = categoryId || null
  Data.pageNum = 1
  Data.prodList = []
  Data.hasMore = true
  getProd()
}

function onFilterChange(filterId) {
  if (filterId === Data.currentFilterId) return
  Data.currentFilterId = filterId
  Data.pageNum = 1
  Data.hasMore = true
  applyFilters()
}

function applyFilters() {
  if (Data.pageNum === 1) {
    let sortedList = [...Data.prodList]
    if (Data.currentFilterId === 1) {
      sortedList.sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
    } else if (Data.currentFilterId === 2) {
      sortedList.sort((a, b) => (a.priceFee || 0) - (b.priceFee || 0))
    } else if (Data.currentFilterId === 3) {
      sortedList.sort((a, b) => (b.priceFee || 0) - (a.priceFee || 0))
    }
    Data.prodList = sortedList
  }
}

const detail = (spuId) => {
  uni.navigateTo({
    url: '/pages/detail/detail?spuId=' + spuId
  })
}

const getProd = () => {
  Data.loading = true

  const data = {
    shopId: 0,
    pageNum: Data.pageNum,
    pageSize: Data.pageSize
  }

  if (Data.shopSecondaryCategoryId) {
    data.shopSecondaryCategoryId = Data.shopSecondaryCategoryId
  }
  if (Data.keyword) {
    data.keyword = Data.keyword
  }

  const params = {
    url: '/mall4cloud_search/ua/search/simple_page',
    method: 'GET',
    data: data
  }

  return http.request(params).then(res => {
    if (res && res.list && res.list.length > 0) {
      let newProducts = res.list[0].spus || []

      if (Data.currentFilterId === 1) {
        newProducts.sort((a, b) => (b.totalSales || 0) - (a.totalSales || 0))
      } else if (Data.currentFilterId === 2) {
        newProducts.sort((a, b) => (a.priceFee || 0) - (b.priceFee || 0))
      } else if (Data.currentFilterId === 3) {
        newProducts.sort((a, b) => (b.priceFee || 0) - (a.priceFee || 0))
      }

      if (Data.pageNum !== 1) {
        Data.prodList = Data.prodList.concat(newProducts)
      } else {
        Data.prodList = newProducts
      }
      Data.total = res.total
      Data.pages = res.pages
      Data.hasMore = Data.prodList.length < res.total
    } else {
      if (Data.pageNum === 1) {
        Data.prodList = []
      }
      Data.hasMore = false
    }
    Data.loading = false
  }).catch(err => {
    Data.loading = false
    console.error('加载商品失败', err)
  })
}

async function loadCartCount() {
  try {
    const res = await http.request({
      url: '/mall4cloud_product/a/shop_cart/info',
      method: 'GET',
      data: {}
    })

    let totalCount = 0
    if (res && res.shopCarts) {
      res.shopCarts.forEach(shopItem => {
        if (shopItem.shopCartItem) {
          shopItem.shopCartItem.forEach(prodItem => {
            totalCount += prodItem.count || 0
          })
        }
      })
    }
    cartCount.value = totalCount
  } catch (error) {
    console.error('加载购物车失败', error)
    cartCount.value = 0
  }
}

function addToCart(item) {
  uni.showToast({
    title: '已加入购物车',
    icon: 'success'
  })

  http.request({
    url: '/mall4cloud_product/a/shop_cart/add_item',
    method: 'POST',
    data: {
      spuId: item.spuId,
      skuId: 0,
      count: 1
    }
  }).then(() => {
    loadCartCount()
    uni.showToast({
      title: '加入成功',
      icon: 'success'
    })
  }).catch(err => {
    console.error('加入购物车失败', err)
    uni.showToast({
      title: '加入失败',
      icon: 'none'
    })
  })
}

function onScrollToLower() {
  if (Data.hasMore && !Data.loading) {
    Data.pageNum++
    getProd()
  }
}
</script>

<style lang="scss" scoped>
.shop-prods-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 120rpx;
}

.shop-prods-page :deep(.diy-tabbar) {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.category-scroll {
  width: 100%;
  height: 80rpx;
  background-color: #fff;
  white-space: nowrap;
}

.category-list {
  display: inline-flex;
  padding: 0 20rpx;
}

.category-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
  height: 80rpx;
  padding: 0 30rpx;
  font-size: 28rpx;
  color: #666;
  position: relative;
}

.category-item.active {
  color: #ff4d4f;
  font-weight: 500;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #ff4d4f;
  border-radius: 2rpx;
}

.filter-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 30rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #eee;
}

.filter-list {
  display: flex;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #666;
  margin-right: 40rpx;
}

.filter-item.active {
  color: #ff4d4f;
  font-weight: 500;
}

.filter-arrow {
  margin-left: 8rpx;
  font-size: 20rpx;
}

.filter-right {
  display: flex;
  align-items: center;
}

.product-count {
  font-size: 24rpx;
  color: #999;
}

.product-scroll {
  height: calc(100vh - 160rpx - env(safe-area-inset-bottom));
}

.product-grid {
  display: flex;
  flex-wrap: wrap;
  padding: 20rpx;
}

.product-card {
  width: calc(50% - 10rpx);
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
}

.product-card:nth-child(2n) {
  margin-right: 0;
}

.product-image-wrapper {
  position: relative;
  width: 100%;
  height: 340rpx;
  background-color: #f8f8f8;
}

.product-image {
  width: 100%;
  height: 100%;
}

.product-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  display: flex;
  flex-direction: column;
}

.product-tag text {
  padding: 4rpx 12rpx;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 20rpx;
  border-radius: 4rpx;
  margin-bottom: 8rpx;
}

.product-tag text:last-child {
  background-color: #ffa500;
}

.product-info {
  padding: 20rpx;
}

.product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  margin-bottom: 12rpx;
}

.product-price-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 12rpx;
}

.product-price {
  font-size: 32rpx;
  color: #ff4d4f;
  font-weight: 500;
}

.product-original-price {
  font-size: 24rpx;
  color: #999;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.product-sales {
  font-size: 24rpx;
  color: #999;
}

.add-cart-btn {
  padding: 8rpx 16rpx;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 24rpx;
  border-radius: 8rpx;
}

.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.no-more-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.no-more-text {
  font-size: 26rpx;
  color: #999;
}
</style>
