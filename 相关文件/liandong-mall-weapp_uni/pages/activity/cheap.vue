<template>
    <view class="page">
        <view class="activity-banner">
            <image class="banner-image" src="https://picsum.photos/750/300?random=500" mode="aspectFill" />
            <view class="banner-overlay">
                <text class="banner-title">低价好卖</text>
                <text class="banner-subtitle">9.9元包邮好物，低价高佣轻松卖</text>
            </view>
        </view>
        <view class="activity-stats">
            <view class="stat-item">
                <text class="stat-number">{{ stats.productCount }}</text>
                <text class="stat-label">低价商品</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.avgPrice }}</text>
                <text class="stat-label">平均价格</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.avgCommission }}%</text>
                <text class="stat-label">平均佣金</text>
            </view>
        </view>
        <!-- <view class="price-filter">
    <view class="price-title">价格区间</view>
    <view class="price-options">
      <view class="price-item {{currentPrice === 'all' ? 'active' : ''}}" bindtap="switchPrice" data-price="all"><text>全部</text></view>
      <view class="price-item {{currentPrice === '9.9' ? 'active' : ''}}" bindtap="switchPrice" data-price="9.9"><text>¥9.9</text></view>
      <view class="price-item {{currentPrice === '19.9' ? 'active' : ''}}" bindtap="switchPrice" data-price="19.9"><text>¥19.9</text></view>
      <view class="price-item {{currentPrice === '29.9' ? 'active' : ''}}" bindtap="switchPrice" data-price="29.9"><text>¥29.9</text></view>
      <view class="price-item {{currentPrice === '49.9' ? 'active' : ''}}" bindtap="switchPrice" data-price="49.9"><text>¥49.9</text></view>
    </view>
  </view> -->
        <!-- <view class="filter-section">
    <scroll-view class="filter-scroll" scroll-x enhanced show-scrollbar="{{false}}">
      <view class="filter-list">
        <view class="filter-item {{currentFilter === 'all' ? 'active' : ''}}" bindtap="switchFilter" data-filter="all"><text>综合</text></view>
        <view class="filter-item {{currentFilter === 'sales' ? 'active' : ''}}" bindtap="switchFilter" data-filter="sales"><text>销量</text></view>
        <view class="filter-item {{currentFilter === 'commission' ? 'active' : ''}}" bindtap="switchFilter" data-filter="commission"><text>佣金</text></view>
        <view class="filter-item {{currentFilter === 'new' ? 'active' : ''}}" bindtap="switchFilter" data-filter="new"><text>新品</text></view>
      </view>
    </scroll-view>
  </view> -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <view class="product-image-wrap">
                    <image class="product-image" :src="item.image" mode="aspectFill" />
                    <view class="price-tag">¥{{ item.price }}</view>
                </view>

                <view class="product-info">
                    <view class="product-title">{{ item.title }}</view>
                    <view class="product-tags">
                        <view class="tag free-shipping" v-if="item.freeShipping">包邮</view>
                        <view class="tag high-commission" v-if="item.highCommission">高佣</view>
                        <view class="tag hot" v-if="item.hot">热销</view>
                    </view>
                    <view class="commission-row">
                        <text class="commission-text">赚¥{{ item.commission }}</text>
                        <text class="commission-rate">{{ item.rate }}佣</text>
                    </view>
                    <view class="price-row">
                        <text class="current-price">¥{{ item.price }}</text>
                        <text class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        <text class="sales-text">{{ item.sales }}</text>
                    </view>
                    <view class="add-btn" @tap.stop.prevent="addToShelf" :data-id="item.id">加入货架</view>
                </view>
            </view>
        </view>
        <view class="safe-area"></view>
    </view>
</template>

<script>
const productService = require('../../services/productService');
export default {
    data() {
        return {
            currentFilter: 'all',
            currentPrice: 'all',
            stats: {
                productCount: '12.8万',
                avgPrice: '¥15.9',
                avgCommission: '25'
            },
            products: []
        };
    },
    onLoad() {
        this.loadProducts();
    },
    methods: {
        async loadProducts() {
            uni.showLoading({
                title: '加载中...'
            });
            try {
                const res = await productService.getProducts({
                    page: 1,
                    pageSize: 20
                });
                const products = (res.list || res || []).map((item) => ({
                    id: item.id,
                    image: item.image || item.main_image || '/images/default.png',
                    title: item.name || item.title || '未知商品',
                    price: item.price || '0',
                    originalPrice: item.originalPrice || '',
                    commission: item.commissionAmount || '0',
                    rate: (item.commissionRate || 0) + '%',
                    sales: item.monthlySales || '0',
                    freeShipping: true,
                    highCommission: (item.commissionRate || 0) > 20,
                    hot: false
                }));
                this.setData({
                    products
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品失败:', error);
            } finally {
                uni.hideLoading();
            }
        },

        switchFilter(e) {
            this.setData({
                currentFilter: e.currentTarget.dataset.filter
            });
        },

        switchPrice(e) {
            this.setData({
                currentPrice: e.currentTarget.dataset.price
            });
        },

        goToProductDetail(e) {
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + e.currentTarget.dataset.id
            });
        },

        addToShelf(e) {
            uni.showToast({
                title: '已加入货架',
                icon: 'success'
            });
        }
    }
};
</script>
<style>
.page {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 40rpx;
}
.status-bar {
    background: #fff;
}
.nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 20rpx;
    background: #fff;
    border-bottom: 1rpx solid #f0f0f0;
}
.nav-back {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
.nav-icon {
    font-size: 36rpx;
    color: #333;
}
.nav-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333;
}
.nav-right {
    width: 60rpx;
}
.activity-banner {
    position: relative;
    width: 100%;
    height: 280rpx;
}
.banner-image {
    width: 100%;
    height: 100%;
}
.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5));
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40rpx;
}
.banner-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
    margin-bottom: 16rpx;
}
.banner-subtitle {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
}
.activity-stats {
    display: flex;
    justify-content: space-around;
    background: #fff;
    padding: 30rpx 0;
    margin-bottom: 20rpx;
}
.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.stat-number {
    font-size: 40rpx;
    font-weight: bold;
    color: #ff4757;
    margin-bottom: 8rpx;
}
.stat-label {
    font-size: 24rpx;
    color: #999;
}
.price-filter {
    background: #fff;
    padding: 20rpx;
    margin-bottom: 20rpx;
}
.price-title {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    font-weight: 500;
}
.price-options {
    display: flex;
    flex-wrap: wrap;
}
.price-item {
    padding: 16rpx 40rpx;
    margin-right: 16rpx;
    margin-bottom: 12rpx;
    background: #f5f5f5;
    border-radius: 32rpx;
    border: 2rpx solid transparent;
}
.price-item text {
    font-size: 28rpx;
    color: #666;
}
.price-item.active {
    background: #ffe4e9;
    border-color: #ff4757;
}
.price-item.active text {
    color: #ff4757;
    font-weight: 500;
}
.filter-section {
    background: #fff;
    padding: 20rpx 0;
    margin-bottom: 20rpx;
}
.filter-scroll {
    white-space: nowrap;
}
.filter-list {
    display: flex;
    padding: 0 20rpx;
}
.filter-item {
    padding: 16rpx 32rpx;
    margin-right: 16rpx;
    background: #f5f5f5;
    border-radius: 32rpx;
}
.filter-item text {
    font-size: 28rpx;
    color: #666;
}
.filter-item.active {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
}
.filter-item.active text {
    color: #fff;
    font-weight: 500;
}
.product-list {
    padding: 0 20rpx;
}
.product-item {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
}
.product-image-wrap {
    width: 240rpx;
    height: 240rpx;
    border-radius: 12rpx;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
}
.product-image {
    width: 100%;
    height: 100%;
}
.price-tag {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(255, 71, 87, 0.9), transparent);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    padding: 20rpx 12rpx 12rpx;
    text-align: center;
}
.product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
}
.product-title {
    font-size: 28rpx;
    color: #333;
    line-height: 1.5;
    margin-bottom: 12rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 12rpx;
}
.tag {
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
    font-size: 22rpx;
    margin-right: 12rpx;
    margin-bottom: 8rpx;
}
.tag.free-shipping {
    background: #e8f5e9;
    color: #2ed573;
}
.tag.high-commission {
    background: #ffe4e9;
    color: #ff4757;
}
.tag.hot {
    background: #fff3e0;
    color: #ffa502;
}
.commission-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}
.commission-text {
    font-size: 32rpx;
    font-weight: bold;
    color: #ff4757;
    margin-right: 16rpx;
}
.commission-rate {
    font-size: 24rpx;
    color: #ff4757;
    background: #ffe4e9;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}
.price-row {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}
.current-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #ff4757;
    margin-right: 16rpx;
}
.original-price {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
    margin-right: 20rpx;
}
.sales-text {
    font-size: 24rpx;
    color: #999;
}
.add-btn {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 0;
    border-radius: 32rpx;
    text-align: center;
    margin-top: auto;
}
.safe-area {
    height: 40rpx;
}
</style>
