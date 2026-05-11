<template>
    <view class="sp-mall">
        <!-- 搜索框 -->
        <view class="search-bar" @tap="goToSearch">
            <view class="search-box">
                <icon type="search" size="16" color="#999" />
                <text class="search-text">搜索商品</text>
            </view>
        </view>

        <!-- 内容区域 -->
        <scroll-view class="content" :scroll-y="true" :refresher-enabled="true" @refresherrefresh="loadData">
            <!-- 加载状态 -->
            <view class="loading" v-if="loading">
                <text>加载中...</text>
            </view>

            <!-- 商品区域 -->
            <view class="product-section" v-if="!loading">
                <!-- 热销商品 -->
                <view class="section" v-if="hotProducts.length > 0">
                    <view class="section-header">
                        <text class="section-title">🔥 热销爆款</text>
                        <view class="more-btn" @tap="goToProductList" data-type="hot">
                            <text>查看更多</text>
                            <text class="arrow">></text>
                        </view>
                    </view>
                    <scroll-view class="product-scroll" :scroll-x="true" :enhanced="true" :show-scrollbar="false">
                        <view class="product-row">
                            <view class="product-card" @tap="goToDetail" :data-id="item.productId || item.id" v-for="(item, index) in hotProducts" :key="index">
                                <view class="card-image">
                                    <image :src="item.mainImage || item.image" mode="aspectFill" :lazy-load="true" />
                                    <view class="hot-tag">热销</view>
                                </view>

                                <view class="card-info">
                                    <text class="product-name">{{ item.productName || item.name }}</text>
                                    <view class="price-row">
                                        <text class="price">¥{{ item.memberPrice || item.price }}</text>
                                    </view>
                                    <view class="add-btn" @tap.stop.prevent="addToCart" :data-id="item.productId || item.id">+</view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <!-- 新品上市 -->
                <view class="section" v-if="newProducts.length > 0">
                    <view class="section-header">
                        <text class="section-title">✨ 新品上市</text>
                        <view class="more-btn" @tap="goToProductList" data-type="new">
                            <text>查看更多</text>
                            <text class="arrow">></text>
                        </view>
                    </view>
                    <scroll-view class="product-scroll" :scroll-x="true" :enhanced="true" :show-scrollbar="false">
                        <view class="product-row">
                            <view class="product-card" @tap="goToDetail" :data-id="item.productId || item.id" v-for="(item, index) in newProducts" :key="index">
                                <view class="card-image">
                                    <image :src="item.mainImage || item.image" mode="aspectFill" :lazy-load="true" />
                                    <view class="new-tag">新品</view>
                                </view>

                                <view class="card-info">
                                    <text class="product-name">{{ item.productName || item.name }}</text>
                                    <view class="price-row">
                                        <text class="price">¥{{ item.memberPrice || item.price }}</text>
                                    </view>
                                    <view class="add-btn" @tap.stop.prevent="addToCart" :data-id="item.productId || item.id">+</view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>

                <!-- 推荐商品 -->
                <view class="section" v-if="recommendProducts.length > 0">
                    <view class="section-header">
                        <text class="section-title">💝 为你推荐</text>
                        <view class="more-btn" @tap="goToProductList" data-type="recommend">
                            <text>查看更多</text>
                            <text class="arrow">></text>
                        </view>
                    </view>
                    <scroll-view class="product-scroll" :scroll-x="true" :enhanced="true" :show-scrollbar="false">
                        <view class="product-row">
                            <view class="product-card" @tap="goToDetail" :data-id="item.productId || item.id" v-for="(item, index) in recommendProducts" :key="index">
                                <view class="card-image">
                                    <image :src="item.mainImage || item.image" mode="aspectFill" :lazy-load="true" />
                                </view>

                                <view class="card-info">
                                    <text class="product-name">{{ item.productName || item.name }}</text>
                                    <view class="price-row">
                                        <text class="price">¥{{ item.memberPrice || item.price }}</text>
                                    </view>
                                    <view class="add-btn" @tap.stop.prevent="addToCart" :data-id="item.productId || item.id">+</view>
                                </view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
            </view>
        </scroll-view>

        <!-- 购物车悬浮按钮 -->
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
// 商城首页 - sp_Mall（整合搜索框）
const { productApi, cartApi } = require('../../utils/sp_api.js');
const { getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    data() {
        return {
            isLoggedIn: false,
            cartCount: 0,
            categories: [],
            hotProducts: [],
            newProducts: [],
            recommendProducts: [],
            loading: true
        };
    },
    onLoad() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        this.loadData();
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
    methods: {
        // 加载数据
        async loadData() {
            this.setData({
                loading: true
            });
            try {
                await Promise.all([this.loadCategories(), this.loadHotProducts(), this.loadNewProducts(), this.loadRecommendProducts()]);
                if (this.isLoggedIn) {
                    await this.loadCartCount();
                }
                this.setData({
                    loading: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载数据失败:', error);
                this.setData({
                    loading: false
                });
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            }
        },

        // 加载分类
        async loadCategories() {
            try {
                const categories = await productApi.getCategories();
                this.setData({
                    categories
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载分类失败:', error);
            }
        },

        // 加载热销商品
        async loadHotProducts() {
            try {
                const products = await productApi.getHotProducts(10);
                this.setData({
                    hotProducts: products
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载热销商品失败:', error);
            }
        },

        // 加载新品
        async loadNewProducts() {
            try {
                const products = await productApi.getNewProducts(10);
                this.setData({
                    newProducts: products
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载新品失败:', error);
            }
        },

        // 加载推荐商品
        async loadRecommendProducts() {
            try {
                const products = await productApi.getRecommendProducts(10);
                this.setData({
                    recommendProducts: products
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载推荐商品失败:', error);
            }
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

        // 跳转搜索页面
        goToSearch() {
            uni.navigateTo({
                url: '/pages/sp_SearchPage/sp_SearchPage'
            });
        },

        // 跳转商品详情
        goToDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
            });
        },

        // 跳转商品列表
        goToProductList(e) {
            const { type } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Product_list/sp_Product_list?type=${type || 'all'}`
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

        // 跳转购物车
        goToCart() {
            uni.switchTab({
                url: '/pages/sp_Cart_page/sp_Cart_page'
            });
        }
    }
};
</script>
<style>
.sp-mall {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 搜索框 */
.search-bar {
    padding: 20rpx 24rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.search-box {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
}

.search-text {
    font-size: 28rpx;
    color: #999;
    margin-left: 12rpx;
}

/* 内容区域 */
.content {
    height: calc(100vh - 112rpx);
    padding: 0;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 200rpx;
}

.loading text {
    font-size: 28rpx;
    color: #999;
}

/* 商品区域 */
.product-section {
    padding: 24rpx;
}

/* 商品区块 */
.section {
    margin-bottom: 48rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.section-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

.more-btn {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #999;
}

.arrow {
    margin-left: 8rpx;
}

/* 商品横向滚动 */
.product-scroll {
    width: 100%;
    height: auto;
    white-space: nowrap;
}

.product-row {
    display: inline-flex;
    padding-bottom: 20rpx;
}

/* 商品卡片 */
.product-card {
    width: 280rpx;
    margin-right: 20rpx;
    background-color: #fff;
    border-radius: 16rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-image {
    position: relative;
    width: 280rpx;
    height: 280rpx;
    background-color: #f8f8f8;
}

.card-image image {
    width: 100%;
    height: 100%;
}

.hot-tag {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    padding: 4rpx 12rpx;
    background: linear-gradient(135deg, #ff5000 0%, #ff8c00 100%);
    color: #fff;
    font-size: 22rpx;
    border-radius: 6rpx;
}

.new-tag {
    position: absolute;
    top: 12rpx;
    left: 12rpx;
    padding: 4rpx 12rpx;
    background: linear-gradient(135deg, #00c853 0%, #69f0ae 100%);
    color: #fff;
    font-size: 22rpx;
    border-radius: 6rpx;
}

.card-info {
    padding: 16rpx;
    position: relative;
}

.product-name {
    font-size: 26rpx;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 12rpx;
}

.price-row {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.price {
    font-size: 32rpx;
    color: #ff5000;
    font-weight: bold;
}

.add-btn {
    position: absolute;
    bottom: 16rpx;
    right: 16rpx;
    width: 48rpx;
    height: 48rpx;
    background: linear-gradient(135deg, #ff5000 0%, #ff8c00 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 8rpx rgba(255, 80, 0, 0.3);
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
