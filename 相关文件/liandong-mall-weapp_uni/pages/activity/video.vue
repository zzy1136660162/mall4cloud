<template>
    <view class="page">
        <view class="activity-banner">
            <image class="banner-image" src="https://picsum.photos/750/300?random=300" mode="aspectFill" />
            <view class="banner-overlay">
                <text class="banner-title">视频热卖</text>
                <text class="banner-subtitle">短视频带货爆款，视频转化率超高</text>
            </view>
        </view>
        <view class="activity-stats">
            <view class="stat-item">
                <text class="stat-number">{{ stats.videoCount }}</text>
                <text class="stat-label">视频商品</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.playCount }}</text>
                <text class="stat-label">总播放量</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.conversion }}%</text>
                <text class="stat-label">转化率</text>
            </view>
        </view>
        <view class="filter-section">
            <scroll-view class="filter-scroll" scroll-x enhanced :show-scrollbar="false">
                <view class="filter-list">
                    <view :class="'filter-item ' + (currentFilter === 'all' ? 'active' : '')" @tap="switchFilter" data-filter="all"><text>全部</text></view>
                    <view :class="'filter-item ' + (currentFilter === 'hot' ? 'active' : '')" @tap="switchFilter" data-filter="hot"><text>热门视频</text></view>
                    <view :class="'filter-item ' + (currentFilter === 'new' ? 'active' : '')" @tap="switchFilter" data-filter="new"><text>最新发布</text></view>
                    <view :class="'filter-item ' + (currentFilter === 'high' ? 'active' : '')" @tap="switchFilter" data-filter="high"><text>高转化</text></view>
                </view>
            </scroll-view>
        </view>
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <view class="video-wrap">
                    <image class="product-image" :src="item.image" mode="aspectFill" />
                    <view class="play-btn">▶</view>
                    <view class="video-info">
                        <text class="play-count">▶ {{ item.playCount }}</text>
                        <text class="video-duration">{{ item.duration }}</text>
                    </view>
                </view>

                <view class="product-info">
                    <view class="author-info">
                        <image class="author-avatar" :src="item.authorAvatar" mode="aspectFill" />
                        <text class="author-name">{{ item.authorName }}</text>
                    </view>
                    <view class="product-title">{{ item.title }}</view>
                    <view class="commission-row">
                        <text class="commission-text">赚¥{{ item.commission }}</text>
                        <text class="commission-rate">{{ item.rate }}佣</text>
                    </view>
                    <view class="price-row">
                        <text class="price-label">售价¥{{ item.price }}</text>
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
            stats: {
                videoCount: '8.6万',
                playCount: '28亿',
                conversion: '3.2'
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
                    commission: item.commissionAmount || '0',
                    rate: (item.commissionRate || 0) + '%',
                    sales: item.monthlySales || '0',
                    playCount: '0',
                    duration: '00:30',
                    authorAvatar: '/images/default-avatar.png',
                    authorName: '达人推荐'
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
.video-wrap {
    width: 240rpx;
    height: 320rpx;
    border-radius: 12rpx;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
}
.product-image {
    width: 100%;
    height: 100%;
}
.play-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80rpx;
    height: 80rpx;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
}
.video-info {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 12rpx;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    display: flex;
    justify-content: space-between;
}
.play-count,
.video-duration {
    font-size: 22rpx;
    color: #fff;
}
.product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
}
.author-info {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
}
.author-avatar {
    width: 48rpx;
    height: 48rpx;
    border-radius: 50%;
    margin-right: 12rpx;
}
.author-name {
    font-size: 26rpx;
    color: #666;
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
.price-label {
    font-size: 24rpx;
    color: #999;
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
