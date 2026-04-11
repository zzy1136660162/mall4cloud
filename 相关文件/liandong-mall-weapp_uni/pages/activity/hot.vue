<template>
    <view class="page">
        <!-- 活动Banner -->
        <view class="activity-banner">
            <image class="banner-image" src="https://picsum.photos/750/300?random=100" mode="aspectFill" />
            <view class="banner-overlay">
                <text class="banner-title">超级爆品</text>
                <text class="banner-subtitle">精选全网热销爆款，佣金高转化好</text>
            </view>
        </view>

        <!-- 活动数据 -->
        <view class="activity-stats">
            <view class="stat-item">
                <text class="stat-number">{{ stats.productCount }}</text>
                <text class="stat-label">爆品数量</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.avgCommission }}%</text>
                <text class="stat-label">平均佣金</text>
            </view>
            <view class="stat-item">
                <text class="stat-number">{{ stats.totalSales }}</text>
                <text class="stat-label">累计销量</text>
            </view>
        </view>

        <!-- 筛选标签 -->
        <view class="filter-section">
            <scroll-view class="filter-scroll" scroll-x enhanced :show-scrollbar="false">
                <view class="filter-list">
                    <view :class="'filter-item ' + (currentFilter === 'all' ? 'active' : '')" @tap="switchFilter" data-filter="all">
                        <text>全部</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'today' ? 'active' : '')" @tap="switchFilter" data-filter="today">
                        <text>今日爆款</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'week' ? 'active' : '')" @tap="switchFilter" data-filter="week">
                        <text>本周热销</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'month' ? 'active' : '')" @tap="switchFilter" data-filter="month">
                        <text>月度冠军</text>
                    </view>
                    <view :class="'filter-item ' + (currentFilter === 'high' ? 'active' : '')" @tap="switchFilter" data-filter="high">
                        <text>高佣爆款</text>
                    </view>
                </view>
            </scroll-view>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <!-- 排名 -->

                <view :class="'rank-badge ' + (index < 3 ? 'top' : '')">
                    <text class="rank-number">{{ index + 1 }}</text>
                </view>

                <view class="product-image-wrap">
                    <image class="product-image" :src="item.image" mode="aspectFill" />
                    <view class="product-tag" v-if="item.tag">{{ item.tag }}</view>
                </view>

                <view class="product-info">
                    <!-- 榜单标签 -->
                    <view class="rank-tag" v-if="item.rankTag">
                        <text class="rank-icon">🏆</text>
                        <text>{{ item.rankTag }}</text>
                    </view>

                    <!-- 标签 -->
                    <view class="product-tags">
                        <view class="tag cashback" v-if="item.cashback">单单返现</view>
                        <view class="tag trust" v-if="item.trust">信任购</view>
                        <view class="tag brand" v-if="item.isBrand">品牌</view>
                    </view>

                    <!-- 标题 -->
                    <view class="product-title">{{ item.title }}</view>

                    <!-- 佣金信息 -->
                    <view class="commission-row">
                        <text class="commission-text">赚¥{{ item.commission }}</text>
                        <text class="commission-rate">{{ item.rate }}佣</text>
                    </view>

                    <!-- 价格销量 -->
                    <view class="price-row">
                        <text class="price-label">售价¥{{ item.price }}</text>
                        <text class="sales-text">{{ item.sales }}</text>
                    </view>

                    <!-- 数据展示 -->
                    <view class="data-row" v-if="item.dailySales">
                        <text class="data-text">24小时销量 {{ item.dailySales }}</text>
                    </view>

                    <!-- 加入货架按钮 -->
                    <view class="add-btn" @tap.stop.prevent="addToShelf" :data-id="item.id">加入货架</view>
                </view>
            </view>
        </view>

        <!-- 底部安全区域 -->
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
                productCount: '2,580',
                avgCommission: '25',
                totalSales: '1.2亿'
            },
            products: []
        };
    },
    onLoad() {
        this.loadProducts();
    },
    methods: {
        // 加载商品数据
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
                    dailySales: item.dailySales || '0',
                    tag: item.tag || '',
                    cashback: item.hasCashback || false,
                    trust: true,
                    isBrand: item.isBrand || false,
                    rankTag: ''
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

        // 切换筛选
        switchFilter(e) {
            const filter = e.currentTarget.dataset.filter;
            this.setData({
                currentFilter: filter
            });
            this.loadProducts();
        },

        // 返回
        goBack() {
            uni.navigateBack();
        },

        // 去商品详情
        goToProductDetail(e) {
            const id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + id
            });
        },

        // 加入货架
        addToShelf(e) {
            const id = e.currentTarget.dataset.id;
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

/* 状态栏占位 */
.status-bar {
    background: #fff;
}

/* 顶部导航栏 */
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

/* 活动Banner */
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

/* 活动数据 */
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

/* 筛选标签 */
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

/* 商品列表 */
.product-list {
    padding: 0 20rpx;
}

.product-item {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    padding: 20rpx;
    position: relative;
}

/* 排名标识 */
.rank-badge {
    position: absolute;
    top: 20rpx;
    left: 20rpx;
    width: 48rpx;
    height: 48rpx;
    background: #999;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.rank-badge.top {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
}

.rank-number {
    font-size: 28rpx;
    font-weight: bold;
    color: #fff;
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

.product-tag {
    position: absolute;
    top: 8rpx;
    right: 8rpx;
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 22rpx;
    padding: 4rpx 12rpx;
    border-radius: 8rpx;
}

.product-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
}

/* 榜单标签 */
.rank-tag {
    display: flex;
    align-items: center;
    background: linear-gradient(90deg, #fff5f0, #fff);
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    margin-bottom: 12rpx;
    width: fit-content;
}

.rank-icon {
    font-size: 24rpx;
    margin-right: 8rpx;
}

.rank-tag text {
    font-size: 22rpx;
    color: #ff6b35;
}

/* 商品标签 */
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

.tag.cashback {
    background: #ffe4e9;
    color: #ff4757;
}

.tag.trust {
    background: #e8f5e9;
    color: #2ed573;
}

.tag.brand {
    background: #fff3e0;
    color: #ffa502;
}

/* 标题 */
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

/* 佣金信息 */
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

/* 价格销量 */
.price-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
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

/* 数据展示 */
.data-row {
    margin-bottom: 12rpx;
}

.data-text {
    font-size: 22rpx;
    color: #ff6b35;
}

/* 加入货架按钮 */
.add-btn {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 28rpx;
    padding: 16rpx 0;
    border-radius: 32rpx;
    text-align: center;
    margin-top: auto;
}

/* 底部安全区域 */
.safe-area {
    height: 40rpx;
}
</style>
