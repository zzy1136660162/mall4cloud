<template>
    <view class="selection-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-top">
                    <view class="brand-section">
                        <view class="brand-name">选品中心</view>
                        <view class="brand-line"></view>
                    </view>
                    <view class="header-actions">
                        <view class="action-btn">
                            <text class="action-icon">🔍</text>
                        </view>
                        <view class="action-btn">
                            <text class="action-icon">⚙️</text>
                        </view>
                    </view>
                </view>
                <view class="header-desc">精选优质商品，满足您的需求</view>
            </view>
        </view>

        <view class="page-content">
            <view class="filter-section">
                <view class="filter-tabs">
                    <view
                        :class="'filter-tab ' + (currentFilter === item.id ? 'active' : '')"
                        @tap="switchFilter"
                        :data-id="item.id"
                        v-for="(item, index) in filterTabs"
                        :key="index"
                    >
                        <text class="filter-text">{{ item.name }}</text>

                        <view class="filter-indicator" v-if="currentFilter === item.id"></view>
                    </view>
                </view>
            </view>

            <view class="section-header">
                <view class="section-title">
                    <text class="title-text">{{ currentFilterName }}</text>
                    <view class="title-decoration"></view>
                </view>
                <view class="section-more" @tap="viewMore">
                    <text class="more-text">查看全部</text>
                    <text class="more-arrow">→</text>
                </view>
            </view>

            <view class="product-grid">
                <view class="product-card" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                    <view class="card-visual">
                        <view class="image-container">
                            <image class="product-image" :src="item.image" mode="aspectFill" :lazy-load="true" />
                            <view class="image-overlay">
                                <view class="overlay-badges">
                                    <view class="badge hot" v-if="item.isHot">热门</view>
                                    <view class="badge new" v-if="item.isNew">新品</view>
                                </view>
                                <view class="overlay-actions">
                                    <view class="action-favorite" @tap="toggleFavorite" :data-id="item.id" @tap.stop.prevent="trueFun">
                                        <text :class="'favorite-icon ' + (item.favorite ? 'active' : '')">{{ item.favorite ? '♥' : '♡' }}</text>
                                    </view>
                                </view>
                            </view>
                        </view>
                    </view>

                    <view class="card-content">
                        <view class="product-name">{{ item.name }}</view>
                        <view class="product-meta">
                            <text class="meta-item" v-if="item.sales">已售 {{ item.sales }}</text>
                            <text class="meta-divider" v-if="item.sales && item.stock < 50">·</text>
                            <text class="meta-item stock" v-if="item.stock < 50">仅剩 {{ item.stock }}</text>
                        </view>

                        <view class="card-footer">
                            <view class="price-section">
                                <text class="currency">¥</text>
                                <text class="price">{{ item.price }}</text>
                            </view>
                            <view class="add-btn" @tap="addToCart" :data-id="item.id" @tap.stop.prevent="trueFun">
                                <text class="add-icon">＋</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="loading-state" v-if="loading">
                <view class="loading-dots">
                    <view class="dot"></view>
                    <view class="dot"></view>
                    <view class="dot"></view>
                </view>
            </view>

            <view class="end-state" v-if="noMore && products.length > 0">
                <view class="end-line"></view>
                <text class="end-text">已加载全部</text>
                <view class="end-line"></view>
            </view>

            <view class="empty-state" v-if="products.length === 0 && !loading">
                <text class="empty-emoji">✨</text>
                <text class="empty-title">暂无商品</text>
                <text class="empty-desc">探索更多精彩好物</text>
            </view>
        </view>
    </view>
</template>

<script>
import customTab from '@/components/custom-tab/custom-tab';
export default {
    components: {
        customTab
    },
    data() {
        return {
            currentFilter: 0,
            filterTabs: [
                {
                    id: 0,
                    name: '全部'
                },
                {
                    id: 1,
                    name: '热门'
                },
                {
                    id: 2,
                    name: '新品'
                },
                {
                    id: 3,
                    name: '推荐'
                }
            ],
            currentFilterName: '全部',
            products: [],
            loading: false,
            noMore: false,
            page: 1,
            pageSize: 10
        };
    },
    onLoad(options) {
        this.loadProducts();
    },
    onReachBottom() {
        if (!this.noMore && !this.loading) {
            this.loadProducts();
        }
    },
    methods: {
        switchFilter(e) {
            const filterId = e.currentTarget.dataset.id;
            if (filterId === this.currentFilter) {
                return;
            }
            const filterName = this.filterTabs.find((tab) => tab.id === filterId).name;
            this.setData({
                currentFilter: filterId,
                currentFilterName: filterName,
                products: [],
                page: 1,
                noMore: false
            });
            this.loadProducts();
        },

        async loadProducts() {
            if (this.loading || this.noMore) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                const mockProducts = this.getMockProducts();
                if (mockProducts.length === 0) {
                    this.setData({
                        noMore: true
                    });
                } else {
                    const newProducts = [...this.products, ...mockProducts];
                    this.setData({
                        products: newProducts,
                        page: this.page + 1
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品失败:', error);
            } finally {
                this.setData({
                    loading: false
                });
            }
        },

        getMockProducts() {
            const products = [];
            for (let i = 0; i < 10; i++) {
                products.push({
                    id: Date.now() + i,
                    name: `精选优质商品示例 ${this.products.length + i + 1}`,
                    price: (Math.random() * 500 + 50).toFixed(2),
                    image: '/images/placeholder.png',
                    sales: Math.floor(Math.random() * 1000),
                    stock: Math.floor(Math.random() * 100),
                    isHot: Math.random() > 0.7,
                    isNew: Math.random() > 0.8,
                    favorite: false
                });
            }
            return products;
        },

        goToDetail(e) {
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${productId}`,
                fail: () => {
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                    });
                }
            });
        },

        toggleFavorite(e) {
            const productId = e.currentTarget.dataset.id;
            const products = this.products.map((p) => {
                if (p.id === productId) {
                    return {
                        ...p,
                        favorite: !p.favorite
                    };
                }
                return p;
            });
            this.setData({
                products
            });
            const product = products.find((p) => p.id === productId);
            uni.showToast({
                title: product.favorite ? '已收藏' : '已取消收藏',
                icon: product.favorite ? 'success' : 'none',
                duration: 1500
            });
        },

        addToCart(e) {
            const productId = e.currentTarget.dataset.id;
            uni.showToast({
                title: '已加入购物车',
                icon: 'success',
                duration: 1500
            });
        },

        viewMore() {
            uni.showToast({
                title: '查看全部',
                icon: 'none'
            });
        },

        onTabChange(e) {
            const { activeTab } = e.detail;
            const tabPaths = ['/pages/index/index', '/pages/Product_list_page/Product_list_page', '/pages/selection/selection', '/pages/rd/rd', '/pages/Profile_page/Profile_page'];
            if (activeTab !== 2) {
                uni.switchTab({
                    url: tabPaths[activeTab]
                });
            }
        },

        trueFun() {
            console.log('占位：函数 true 未声明');
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.selection-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

.page-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 0;
}

.page-header {
    position: relative;
    z-index: 10;
    background: #ffffff;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.header-content {
    padding: 48rpx 40rpx 32rpx;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.brand-section {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.brand-name {
    font-size: 56rpx;
    color: #1a1a1a;
    font-weight: 300;
    letter-spacing: 4rpx;
}

.brand-line {
    width: 60rpx;
    height: 4rpx;
    background: #1a1a1a;
    border-radius: 2rpx;
}

.header-actions {
    display: flex;
    gap: 16rpx;
}

.action-btn {
    width: 72rpx;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-icon {
    font-size: 32rpx;
    opacity: 0.6;
}

.header-desc {
    font-size: 26rpx;
    color: #999999;
    letter-spacing: 1rpx;
    font-weight: 400;
}

.page-content {
    position: relative;
    z-index: 1;
    padding: 32rpx 24rpx 120rpx;
}

.filter-section {
    margin-bottom: 32rpx;
}

.filter-tabs {
    display: flex;
    gap: 16rpx;
    overflow-x: auto;
    padding: 8rpx 0;
}

.filter-tab {
    position: relative;
    padding: 16rpx 32rpx;
    background: #f5f5f5;
    border-radius: 48rpx;
    white-space: nowrap;
}

.filter-tab.active {
    background: #1a1a1a;
}

.filter-text {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.filter-tab.active .filter-text {
    color: #ffffff;
    font-weight: 600;
}

.filter-indicator {
    position: absolute;
    bottom: 4rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 20rpx;
    height: 4rpx;
    background: #ffffff;
    border-radius: 2rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    padding: 0 8rpx;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.title-text {
    font-size: 36rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 1rpx;
}

.title-decoration {
    width: 40rpx;
    height: 4rpx;
    background: #1a1a1a;
    border-radius: 2rpx;
}

.section-more {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.more-text {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.more-arrow {
    font-size: 24rpx;
    color: #1a1a1a;
    font-weight: 300;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24rpx;
}

.product-card {
    background: #ffffff;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.card-visual {
    position: relative;
    width: 100%;
    height: 320rpx;
    overflow: hidden;
}

.image-container {
    width: 100%;
    height: 100%;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, transparent 40%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16rpx;
}

.overlay-badges {
    display: flex;
    gap: 8rpx;
}

.badge {
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.5rpx;
}

.badge.hot {
    background: #1a1a1a;
}

.badge.new {
    background: #ff6b6b;
}

.overlay-actions {
    display: flex;
    justify-content: flex-end;
}

.action-favorite {
    width: 56rpx;
    height: 56rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.favorite-icon {
    font-size: 28rpx;
    color: #cccccc;
}

.favorite-icon.active {
    color: #ff6b6b;
}

.card-content {
    padding: 24rpx;
}

.product-name {
    font-size: 28rpx;
    color: #1a1a1a;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 12rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    letter-spacing: 0.5rpx;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 16rpx;
}

.meta-item {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.meta-item.stock {
    color: #ff6b6b;
}

.meta-divider {
    font-size: 22rpx;
    color: #dddddd;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16rpx;
}

.price-section {
    display: flex;
    align-items: baseline;
    gap: 4rpx;
}

.currency {
    font-size: 24rpx;
    color: #1a1a1a;
    font-weight: 600;
}

.price {
    font-size: 40rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: -0.5rpx;
}

.add-btn {
    width: 64rpx;
    height: 64rpx;
    background: #1a1a1a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.add-icon {
    font-size: 40rpx;
    color: #ffffff;
    font-weight: 300;
    line-height: 1;
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60rpx 0;
}

.loading-dots {
    display: flex;
    gap: 12rpx;
}

.dot {
    width: 12rpx;
    height: 12rpx;
    background: #1a1a1a;
    border-radius: 50%;
    animation: pulse 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
    animation-delay: 0s;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes pulse {
    0%,
    80%,
    100% {
        opacity: 0.3;
        transform: scale(0.8);
    }
    40% {
        opacity: 1;
        transform: scale(1);
    }
}

.end-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24rpx;
    padding: 60rpx 0;
}

.end-line {
    width: 80rpx;
    height: 1rpx;
    background: rgba(0, 0, 0, 0.1);
}

.end-text {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 2rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 160rpx 0;
}

.empty-emoji {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.3;
}

.empty-title {
    font-size: 36rpx;
    color: #1a1a1a;
    font-weight: 500;
    margin-bottom: 16rpx;
    letter-spacing: 1rpx;
}

.empty-desc {
    font-size: 26rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}
</style>
