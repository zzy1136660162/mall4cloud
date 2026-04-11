<template>
    <view class="sp-product-list">
        <!-- 搜索组件 -->
        <sp-searchbar placeholder="搜索商品" historyKey="spProductSearchHistory" @searchtap="onSearch" @confirm="onSearchConfirm" />

        <!-- 分类选择 -->
        <scroll-view class="category-scroll" :scroll-x="true" :enhanced="true" :show-scrollbar="false">
            <view class="category-list">
                <view
                    :class="'category-item ' + (currentCategoryId === item.id ? 'active' : '')"
                    @tap="onCategoryChange"
                    :data-id="item.id"
                    v-for="(item, index) in categories"
                    :key="index"
                >
                    <text class="category-name">{{ item.name }}</text>
                </view>
            </view>
        </scroll-view>

        <!-- 筛选排序 -->
        <view class="filter-bar">
            <view class="filter-list">
                <view
                    :class="'filter-item ' + (currentFilterId === item.id ? 'active' : '')"
                    @tap="onFilterChange"
                    :data-id="item.id"
                    v-for="(item, index) in filters"
                    :key="index"
                >
                    <text>{{ item.name }}</text>

                    <text class="filter-arrow" v-if="currentFilterId === item.id">↓</text>
                </view>
            </view>
            <view class="filter-right">
                <text class="product-count">共{{ products.length }}件商品</text>
            </view>
        </view>

        <!-- 商品列表 -->
        <scroll-view class="product-scroll" :scroll-y="true" @scrolltolower="onScrollToLower" :enable-back-to-top="true">
            <!-- 商品网格 -->
            <view class="product-grid" v-if="products.length > 0">
                <view class="product-card" @tap="goToDetail" :data-id="item.productId || item.id" v-for="(item, index) in products" :key="index">
                    <view class="product-image-wrapper">
                        <image class="product-image" :src="item.mainImage || item.image" mode="aspectFill" :lazy-load="true" />
                        <view class="product-tag" v-if="item.isNew || item.isHot">
                            <text v-if="item.isNew">新品</text>
                            <text v-if="item.isHot">热销</text>
                        </view>
                    </view>

                    <view class="product-info">
                        <text class="product-name">{{ item.productName || item.name }}</text>
                        <view class="product-price-row">
                            <text class="product-price">¥{{ item.memberPrice || item.price }}</text>
                            <text class="product-original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        </view>
                        <view class="product-bottom">
                            <text class="product-sales">已售{{ item.sales || 0 }}</text>
                            <view class="add-cart-btn" @tap.stop.prevent="addToCart" :data-id="item.productId || item.id">
                                <text>加入购物车</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 加载状态 -->
            <view class="loading-state" v-if="loading && products.length > 0">
                <text class="loading-text">加载中...</text>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="!loading && products.length === 0">
                <text class="empty-text">暂无商品</text>
            </view>

            <!-- 没有更多 -->
            <view class="no-more-state" v-if="!hasMore && products.length > 0">
                <text class="no-more-text">没有更多了</text>
            </view>
        </scroll-view>

        <!-- 底部购物车入口 -->
        <view class="cart-tab" @tap="goToCart">
            <view class="cart-icon-wrapper">
                <text class="cart-icon">🛒</text>
                <view class="cart-badge" v-if="cartCount > 0">
                    <text>{{ cartCount > 99 ? '99+' : cartCount }}</text>
                </view>
            </view>
            <text class="cart-text">购物车</text>
        </view>
    </view>
</template>

<script>
import spSearchbar from '@/components/sp_SearchBar/sp_SearchBar';
// 商品商城页面 - 淘宝风格搜索
const { productApi, cartApi } = require('../../utils/sp_api.js');
const { getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    components: {
        spSearchbar
    },
    data() {
        return {
            // 搜索相关
            searchKeyword: '',
            // 分类
            categories: [],
            currentCategoryId: 0,
            // 筛选排序
            filters: [
                {
                    id: 0,
                    name: '综合'
                },
                {
                    id: 1,
                    name: '销量'
                },
                {
                    id: 2,
                    name: '价格升'
                },
                {
                    id: 3,
                    name: '价格降'
                }
            ],
            currentFilterId: 0,
            // 商品列表
            products: [],
            page: 1,
            pageSize: 20,
            hasMore: true,
            loading: false,
            // 购物车
            cartCount: 0,
            // 登录状态
            isLoggedIn: false,
            // 搜索页面
            showSearch: false
        };
    },
    onLoad(options) {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });

        // 如果有搜索关键词
        if (options.keyword) {
            this.setData({
                searchKeyword: options.keyword
            });
            this.searchProducts(options.keyword);
        } else {
            this.loadCategories();
            this.loadProducts();
        }
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
        // 搜索处理
        onSearch(e) {
            const keyword = e.detail.keyword;
            if (!keyword) {
                return;
            }
            this.setData({
                searchKeyword: keyword,
                showSearch: false,
                products: [],
                page: 1,
                hasMore: true
            });
            this.searchProducts(keyword);
        },

        // 搜索商品
        searchProducts(keyword) {
            if (!keyword) {
                return;
            }
            this.setData({
                loading: true
            });
            productApi
                .searchProducts(keyword, this.page, this.pageSize)
                .then((res) => {
                    const products = res.list || [];

                    // 应用筛选排序
                    const sortedProducts = this.applyFilters(products);
                    this.setData({
                        products: this.page === 1 ? sortedProducts : [...this.products, ...sortedProducts],
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

        // 加载分类
        async loadCategories() {
            try {
                const categories = await productApi.getCategories();
                const formattedCategories = [
                    {
                        id: 0,
                        name: '全部'
                    },
                    ...(categories || []).map((cat) => ({
                        id: cat.categoryId,
                        name: cat.categoryName
                    }))
                ];
                this.setData({
                    categories: formattedCategories
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载分类失败:', error);
            }
        },

        // 加载商品
        async loadProducts() {
            if (this.loading) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                const { currentCategoryId, currentFilterId, page, pageSize } = this;
                let result;
                if (currentCategoryId === 0) {
                    result = await productApi.getProducts({
                        page,
                        pageSize
                    });
                } else {
                    result = await productApi.getProducts({
                        categoryId: currentCategoryId,
                        page,
                        pageSize
                    });
                }
                let products = result.list || [];
                const sortedProducts = this.applyFilters(products);
                this.setData({
                    products: page === 1 ? sortedProducts : [...this.products, ...sortedProducts],
                    hasMore: products.length >= pageSize,
                    loading: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
                this.setData({
                    loading: false
                });
            }
        },

        // 应用筛选排序
        applyFilters(products) {
            const { currentFilterId } = this;
            if (currentFilterId === 1) {
                // 销量优先
                return [...products].sort((a, b) => (b.sales || 0) - (a.sales || 0));
            } else if (currentFilterId === 2) {
                // 价格升
                return [...products].sort((a, b) => (a.memberPrice || a.price) - (b.memberPrice || b.price));
            } else if (currentFilterId === 3) {
                // 价格降
                return [...products].sort((a, b) => (b.memberPrice || b.price) - (a.memberPrice || a.price));
            }
            return products;
        },

        // 加载更多
        loadMoreProducts() {
            if (!this.hasMore || this.loading) {
                return;
            }
            this.setData({
                page: this.page + 1
            });
            if (this.searchKeyword) {
                this.searchProducts(this.searchKeyword);
            } else {
                this.loadProducts();
            }
        },

        // 刷新
        refreshProducts() {
            this.setData({
                page: 1,
                hasMore: true
            });
            if (this.searchKeyword) {
                this.searchProducts(this.searchKeyword);
            } else {
                this.loadProducts();
            }
        },

        // 选择分类
        onCategoryChange(e) {
            const categoryId = e.currentTarget.dataset.id;
            if (categoryId === this.currentCategoryId) {
                return;
            }
            this.setData({
                currentCategoryId: categoryId,
                products: [],
                page: 1,
                hasMore: true,
                searchKeyword: ''
            });
            this.loadProducts();
        },

        // 选择筛选
        onFilterChange(e) {
            const filterId = e.currentTarget.dataset.id;
            if (filterId === this.currentFilterId) {
                return;
            }
            this.setData({
                currentFilterId: filterId,
                products: [],
                page: 1,
                hasMore: true
            });
            if (this.searchKeyword) {
                this.searchProducts(this.searchKeyword);
            } else {
                this.loadProducts();
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

        // 打开搜索
        openSearch() {
            this.setData({
                showSearch: true
            });
        },

        // 关闭搜索
        closeSearch() {
            this.setData({
                showSearch: false
            });
        },

        // 跳转购物车
        goToCart() {
            uni.switchTab({
                url: '/pages/sp_Cart_page/sp_Cart_page'
            });
        },

        onSearchConfirm() {
            console.log('占位：函数 onSearchConfirm 未声明');
        },

        onScrollToLower() {
            console.log('占位：函数 onScrollToLower 未声明');
        }
    }
};
</script>
<style>
.sp-product-list {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 120rpx;
}

/* 分类滚动条 */
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

/* 筛选栏 */
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

/* 商品列表 */
.product-scroll {
    height: calc(100vh - 280rpx);
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

/* 加载状态 */
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

/* 空状态 */
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

/* 没有更多 */
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

/* 购物车入口 */
.cart-tab {
    position: fixed;
    bottom: 40rpx;
    right: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100rpx;
    height: 100rpx;
    background-color: #ff4d4f;
    border-radius: 50%;
    box-shadow: 0 4rpx 12rpx rgba(255, 77, 79, 0.4);
}

.cart-icon-wrapper {
    position: relative;
}

.cart-icon {
    font-size: 40rpx;
}

.cart-badge {
    position: absolute;
    top: -12rpx;
    right: -16rpx;
    min-width: 32rpx;
    height: 32rpx;
    padding: 0 8rpx;
    background-color: #fff;
    color: #ff4d4f;
    font-size: 20rpx;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.cart-text {
    font-size: 20rpx;
    color: #fff;
    margin-top: 4rpx;
}
</style>
