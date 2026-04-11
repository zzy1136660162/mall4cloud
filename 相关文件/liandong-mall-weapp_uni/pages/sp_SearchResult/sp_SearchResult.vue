<template>
    <view class="sp-search-result">
        <!-- 搜索头部 -->
        <view class="result-header">
            <view class="search-box" @tap="goBack">
                <icon type="search" size="16" color="#999" class="search-icon" />
                <text class="search-keyword">{{ keyword }}</text>
            </view>
            <view class="back-btn" @tap="goBack">取消</view>
        </view>

        <!-- 搜索结果统计 -->
        <view class="result-count" v-if="products.length > 0">
            <text>共找到 {{ products.length }} 件相关商品</text>
        </view>

        <!-- 商品列表 - 单列卡片布局 -->
        <scroll-view class="product-list" :scroll-y="true" @scrolltolower="onReachBottom" :enable-back-to-top="true">
            <!-- 商品卡片 -->
            <view class="product-card" @tap="goToDetail" :data-id="item.productId || item.id" v-for="(item, index) in products" :key="index">
                <!-- 商品图片 -->

                <view class="card-image">
                    <image :src="item.mainImage || item.image" mode="aspectFill" :lazy-load="true" />
                    <view class="product-tag" v-if="item.isNew || item.isHot">
                        <text v-if="item.isNew">新品</text>
                        <text v-if="item.isHot">热销</text>
                    </view>
                </view>

                <!-- 商品信息 -->

                <view class="card-info">
                    <!-- 商品名称 -->
                    <view class="product-name">
                        <text>{{ item.productName || item.name }}</text>
                    </view>

                    <!-- 商品简介 -->
                    <view class="product-brief" v-if="item.brief">
                        <text>{{ item.brief }}</text>
                    </view>

                    <!-- 价格和销量 -->
                    <view class="product-meta">
                        <view class="price-row">
                            <text class="current-price">¥{{ item.memberPrice || item.price }}</text>
                            <text class="original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        </view>
                        <view class="sales-info">
                            <text class="sales">已售{{ item.sales || 0 }}</text>
                            <text class="stock" v-if="item.stock">库存{{ item.stock }}</text>
                        </view>
                    </view>

                    <!-- 标签 -->
                    <view class="product-tags" v-if="item.tags && item.tags.length > 0">
                        <text class="tag" v-for="(tag, index1) in item.tags" :key="index1">{{ tag }}</text>
                    </view>

                    <!-- 操作按钮 -->
                    <view class="card-actions">
                        <view class="action-btn add-cart" @tap.stop.prevent="addToCart" :data-id="item.productId || item.id">
                            <text>加入购物车</text>
                        </view>
                        <view class="action-btn buy-now" @tap.stop.prevent="goToDetail" :data-id="item.productId || item.id">
                            <text>立即购买</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 加载状态 -->
            <view class="loading-state" v-if="loading">
                <text>加载中...</text>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="!loading && products.length === 0">
                <text class="empty-icon">🔍</text>
                <text class="empty-text">未找到相关商品</text>
                <text class="empty-hint">换个关键词试试吧</text>
            </view>

            <!-- 没有更多 -->
            <view class="no-more" v-if="!hasMore && products.length > 0">
                <text>没有更多了</text>
            </view>
        </scroll-view>

        <!-- 购物车入口 -->
        <view class="cart-float" @tap="goToCart" v-if="cartCount > 0">
            <view class="cart-icon-wrapper">
                <text class="cart-icon">🛒</text>
                <view class="cart-badge">
                    <text>{{ cartCount > 99 ? '99+' : cartCount }}</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// 搜索结果页面 - sp_SearchResult（单列卡片布局）
const { productApi, cartApi } = require('../../utils/sp_api.js');
const { getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    data() {
        return {
            keyword: '',
            products: [],
            page: 1,
            pageSize: 10,
            hasMore: true,
            loading: false,
            isLoggedIn: false,
            cartCount: 0,
            tag: ''
        };
    },
    onLoad(options) {
        const keyword = decodeURIComponent(options.keyword || '');
        this.setData({
            keyword
        });
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        this.searchProducts();
        this.loadCartCount();
    },
    onShow() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (loginStatus.isLoggedIn) {
            this.loadCartCount();
        }
    },
    onPullDownRefresh() {
        this.refreshProducts();
    },
    onReachBottom() {
        if (this.hasMore && !this.loading) {
            this.loadMoreProducts();
        }
    },
    methods: {
        // 搜索商品
        searchProducts() {
            if (!this.keyword) {
                return;
            }
            this.setData({
                loading: true
            });
            productApi
                .searchProducts(this.keyword, this.page, this.pageSize)
                .then((res) => {
                    const products = res.list || [];
                    this.setData({
                        products: this.page === 1 ? products : [...this.products, ...products],
                        hasMore: products.length >= this.pageSize,
                        loading: false
                    });
                })
                .catch((err) => {
                    console.error('搜索失败:', err);
                    uni.showToast({
                        title: '搜索失败',
                        icon: 'none'
                    });
                    this.setData({
                        loading: false
                    });
                });
        },

        // 加载更多
        loadMoreProducts() {
            if (!this.hasMore || this.loading) {
                return;
            }
            this.setData({
                page: this.page + 1
            });
            this.searchProducts();
        },

        // 刷新
        refreshProducts() {
            this.setData({
                products: [],
                page: 1,
                hasMore: true
            });
            this.searchProducts();
            uni.stopPullDownRefresh();
        },

        // 二次搜索
        onSearch(e) {
            const keyword = e.detail.value.trim();
            if (!keyword) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none'
                });
                return;
            }
            this.setData({
                keyword,
                products: [],
                page: 1,
                hasMore: true
            });
            this.searchProducts();
        },

        // 加载购物车数量
        async loadCartCount() {
            try {
                const cartList = await cartApi.getCartList();
                this.setData({
                    cartCount: (cartList || []).length
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载购物车失败:', error);
            }
        },

        // 跳转商品详情
        goToDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
            });
        },

        // 加入购物车
        async addToCart(e) {
            if (!this.isLoggedIn) {
                uni.showModal({
                    title: '提示',
                    content: '请先登录',
                    confirmText: '去登录',
                    success: (res) => {
                        if (res.confirm) {
                            uni.navigateTo({
                                url: '/pages/login/index'
                            });
                        }
                    }
                });
                return;
            }
            const { id } = e.currentTarget.dataset;
            try {
                await cartApi.addToCart(id, null, 1);
                uni.showToast({
                    title: '加入成功',
                    icon: 'success'
                });
                this.loadCartCount();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加入购物车失败:', error);
                uni.showToast({
                    title: '加入失败',
                    icon: 'none'
                });
            }
        },

        // 返回搜索页
        goBack() {
            uni.navigateBack();
        },

        onReachBottom() {
            console.log('占位：函数 onReachBottom 未声明');
        },

        goToCart() {
            console.log('占位：函数 goToCart 未声明');
        }
    }
};
</script>
<style>
.sp-search-result {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 搜索头部 */
.result-header {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 24rpx;
    margin-right: 20rpx;
}

.search-icon {
    margin-right: 12rpx;
}

.search-keyword {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.back-btn {
    font-size: 28rpx;
    color: #666;
    padding: 10rpx 0;
}

/* 搜索结果统计 */
.result-count {
    padding: 20rpx 24rpx;
    background-color: #fff;
    border-bottom: 1rpx solid #f0f0f0;
}

.result-count text {
    font-size: 26rpx;
    color: #999;
}

/* 商品列表 - 单列布局 */
.product-list {
    height: calc(100vh - 140rpx);
    padding: 24rpx;
}

/* 商品卡片 */
.product-card {
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

/* 商品图片 */
.card-image {
    position: relative;
    width: 100%;
    height: 600rpx;
    background-color: #f8f8f8;
}

.card-image image {
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
    padding: 6rpx 12rpx;
    background-color: #ff5000;
    color: #fff;
    font-size: 22rpx;
    border-radius: 6rpx;
    margin-bottom: 8rpx;
}

.product-tag text:last-child {
    background-color: #ffa500;
}

/* 商品信息 */
.card-info {
    padding: 24rpx;
}

.product-name {
    margin-bottom: 12rpx;
}

.product-name text {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-brief {
    margin-bottom: 16rpx;
}

.product-brief text {
    font-size: 26rpx;
    color: #999;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* 价格和销量 */
.product-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
}

.price-row {
    display: flex;
    align-items: baseline;
}

.current-price {
    font-size: 36rpx;
    color: #ff5000;
    font-weight: bold;
}

.original-price {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
    margin-left: 12rpx;
}

.sales-info {
    display: flex;
    align-items: center;
}

.sales {
    font-size: 24rpx;
    color: #999;
    margin-right: 16rpx;
}

.stock {
    font-size: 24rpx;
    color: #999;
}

/* 标签 */
.product-tags {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 16rpx;
}

.tag {
    padding: 4rpx 12rpx;
    background-color: #fff0e6;
    color: #ff5000;
    font-size: 22rpx;
    border-radius: 4rpx;
    margin-right: 12rpx;
    margin-bottom: 8rpx;
}

/* 操作按钮 */
.card-actions {
    display: flex;
    gap: 20rpx;
    margin-top: 16rpx;
}

.action-btn {
    flex: 1;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 36rpx;
    font-size: 28rpx;
    font-weight: 500;
}

.action-btn.add-cart {
    background-color: #fff;
    border: 2rpx solid #ff5000;
    color: #ff5000;
}

.action-btn.buy-now {
    background: linear-gradient(135deg, #ff5000 0%, #ff8c00 100%);
    color: #fff;
}

/* 加载状态 */
.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
}

.loading-state text {
    font-size: 28rpx;
    color: #999;
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
}

.empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
}

.empty-text {
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 16rpx;
}

.empty-hint {
    font-size: 26rpx;
    color: #999;
}

/* 没有更多 */
.no-more {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
}

.no-more text {
    font-size: 26rpx;
    color: #999;
}

/* 购物车悬浮按钮 */
.cart-float {
    position: fixed;
    bottom: 40rpx;
    right: 40rpx;
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(135deg, #ff5000 0%, #ff8c00 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(255, 80, 0, 0.4);
    z-index: 99;
}

.cart-icon-wrapper {
    position: relative;
}

.cart-icon {
    font-size: 48rpx;
}

.cart-badge {
    position: absolute;
    top: -12rpx;
    right: -16rpx;
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 8rpx;
    background-color: #fff;
    color: #ff5000;
    font-size: 20rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
