<template>
    <view class="product-list-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-top">
                    <view class="brand-section">
                        <view class="brand-name">商城</view>
                        <view class="brand-line"></view>
                    </view>

                    <view class="search-container" @tap="goToSearchPage">
                        <view class="search-wrapper">
                            <text class="search-icon">✦</text>
                            <text class="search-text">探索好物</text>
                        </view>
                    </view>

                    <view class="header-actions">
                        <view class="action-btn" @tap="goToCart">
                            <text class="action-icon">🛒</text>
                            <view class="badge" v-if="cartCount > 0">{{ cartCount }}</view>
                        </view>
                    </view>
                </view>

                <view class="header-desc">精选优质商品，满足您的需求</view>
            </view>
        </view>

        <view class="banner-section">
            <view class="banner-wrapper" v-if="banners.length > 0">
                <swiper
                    class="banner-swiper"
                    :indicator-dots="true"
                    :autoplay="bannerAutoplay"
                    :circular="bannerCircular"
                    :interval="bannerInterval"
                    :duration="bannerDuration"
                    indicator-color="rgba(255, 255, 255, 0.4)"
                    indicator-active-color="#FFFFFF"
                    @change="onBannerChange"
                >
                    <swiper-item @tap="onBannerTap" :data-index="index" v-for="(item, index) in banners" :key="index">
                        <view class="banner-item-wrapper">
                            <image
                                :class="'banner-image ' + (item.isLoaded ? 'loaded' : '')"
                                :src="item.image"
                                mode="aspectFill"
                                :lazy-load="true"
                                @load="onBannerImageLoad"
                                @error="onBannerImageError"
                                :data-index="index"
                            />
                            <view class="banner-overlay" v-if="item.title || item.subtitle">
                                <view class="banner-content">
                                    <text class="banner-title" v-if="item.title">{{ item.title }}</text>
                                    <text class="banner-subtitle" v-if="item.subtitle">{{ item.subtitle }}</text>
                                </view>
                            </view>
                        </view>
                    </swiper-item>
                </swiper>

                <view class="banner-indicator" v-if="banners.length > 1">
                    <view class="indicator-dots">
                        <view :class="'indicator-dot ' + (bannerCurrent === index ? 'active' : '')" v-for="(item, index) in banners" :key="index"></view>
                    </view>
                    <text class="indicator-text">{{ bannerCurrent + 1 }} / {{ banners.length }}</text>
                </view>

                <view class="banner-loading" v-if="bannerLoading">
                    <view class="loading-spinner"></view>
                    <text class="loading-text">加载中...</text>
                </view>
            </view>

            <view class="banner-placeholder" v-else>
                <image class="placeholder-image" src="https://picsum.photos/750/400?random=placeholder" mode="aspectFill" />
                <view class="placeholder-overlay">
                    <text class="placeholder-text">暂无轮播图</text>
                </view>
            </view>
        </view>

        <view class="filter-section">
            <view class="filter-tabs">
                <view :class="'filter-tab ' + (currentFilter === item.id ? 'active' : '')" @tap="switchFilter" :data-id="item.id" v-for="(item, index) in filterTabs" :key="index">
                    <text class="filter-text">{{ item.name }}</text>

                    <view class="filter-indicator" v-if="currentFilter === item.id"></view>
                </view>
            </view>
        </view>

        <view class="main-container">
            <scroll-view
                class="product-scroll"
                :scroll-y="true"
                :scroll-top="productScrollTop"
                @scrolltolower="loadMore"
                @scroll="onProductScroll"
                :enhanced="true"
                :show-scrollbar="false"
                :refresher-enabled="true"
                :refresher-triggered="refreshing"
                @refresherrefresh="onPullDownRefresh"
                refresher-background="#FAFAFA"
            >
                <view class="product-grid">
                    <view class="product-card" @tap="goToDetail" :data-id="item.productId" v-for="(item, index) in products" :key="index">
                        <view class="card-visual">
                            <view class="image-container">
                                <image class="product-image" :src="item.mainImage" mode="aspectFill" :lazy-load="true" />
                                <view class="image-overlay">
                                    <view class="overlay-badges">
                                        <view class="badge hot" v-if="item.isHot">热门</view>
                                        <view class="badge new" v-if="item.isNew">新品</view>
                                    </view>
                                    <view class="overlay-actions">
                                        <view class="action-favorite" @tap="toggleFavorite" :data-id="item.productId" @tap.stop.prevent="trueFun">
                                            <text :class="'favorite-icon ' + (item.favorite ? 'active' : '')">{{ item.favorite ? '♥' : '♡' }}</text>
                                        </view>
                                    </view>
                                </view>
                            </view>
                        </view>

                        <view class="card-content">
                            <view class="product-name">{{ item.productName }}</view>
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
                                <view
                                    :class="'add-btn ' + (cartProductIds.includes(item.productId) ? 'in-cart' : '')"
                                    @tap="addToCart"
                                    :data-id="item.productId"
                                    @tap.stop.prevent="trueFun"
                                >
                                    <text class="add-icon">{{ cartProductIds.includes(item.productId) ? '✓' : '＋' }}</text>
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
            </scroll-view>
        </view>
    </view>
</template>

<script>
import customTab from '@/components/custom-tab/custom-tab';
const { productApi, cartApi, favoriteApi } = require('../../utils/sp_api.js');
const bannerService = require('../../services/bannerService.js');
export default {
    components: {
        customTab
    },
    data() {
        return {
            filterTabs: [],
            currentFilter: 0,
            products: [],
            loading: false,
            noMore: false,
            page: 1,
            pageSize: 10,
            cartCount: 0,
            searchKeyword: '',
            productScrollTop: 0,
            refreshing: false,
            banners: [],
            bannerCurrent: 0,
            bannerAutoplay: true,
            bannerInterval: 3000,
            bannerDuration: 500,
            bannerCircular: true,
            bannerIndicatorDots: true,
            bannerLoading: true,
            bannerError: false,
            cartProductIds: [],
            lastScrollTime: 0,
            scrollThrottle: 50
        };
    },
    async onLoad(options) {
        await this.loadFilterCategories();
        this.loadBanners();
        this.loadProducts();
        this.loadCartInfo();
    },
    onShow() {
        this.loadCartInfo();
    },
    onPullDownRefresh() {
        this.setData({
            refreshing: true
        });
        this.setData({
            products: [],
            page: 1,
            noMore: false
        });
        this.loadProducts().then(() => {
            this.setData({
                refreshing: false
            });
        });
    },
    onReachBottom() {
        if (!this.noMore && !this.loading) {
            this.loadProducts();
        }
    },
    onShareAppMessage() {
        return {
            title: '精选好物，等你来选',
            path: '/pages/Product_list_page/Product_list_page',
            imageUrl: ''
        };
    },
    onShareTimeline() {
        return {
            title: '精选好物，等你来选',
            imageUrl: ''
        };
    },
    methods: {
        async loadFilterCategories() {
            try {
                const categories = await productApi.getFilterCategories();
                if (categories && categories.length > 0) {
                    const filterTabs = [
                        {
                            id: 0,
                            name: '全部',
                            code: 'all'
                        },
                        ...categories.map((cat) => ({
                            id: cat.id,
                            name: cat.name,
                            code: cat.code
                        }))
                    ];
                    this.setData({
                        filterTabs
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载筛选类别失败:', error);
                this.setData({
                    filterTabs: [
                        {
                            id: 0,
                            name: '全部',
                            code: 'all'
                        }
                    ]
                });
            }
        },

        async loadBanners() {
            this.setData({
                bannerLoading: true,
                bannerError: false
            });
            try {
                const banners = await bannerService.getMallBanners(true);
                if (banners && banners.length > 0) {
                    this.setData({
                        banners: banners,
                        bannerLoading: false,
                        bannerAutoplay: banners.length > 1
                    });
                    bannerService.preloadImages(banners);
                } else {
                    const defaultBanners = bannerService.getDefaultBanners();
                    this.setData({
                        banners: defaultBanners,
                        bannerLoading: false,
                        bannerAutoplay: true
                    });
                    bannerService.preloadImages(defaultBanners);
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载轮播图失败:', error);
                const defaultBanners = bannerService.getDefaultBanners();
                this.setData({
                    banners: defaultBanners,
                    bannerLoading: false,
                    bannerError: true,
                    bannerAutoplay: true
                });
                uni.showToast({
                    title: '轮播图加载失败，已使用默认图',
                    icon: 'none',
                    duration: 2000
                });
            }
        },

        onBannerImageLoad(e) {
            const index = e.currentTarget.dataset.index;
            const banners = this.banners;
            if (banners[index]) {
                banners[index].isLoaded = true;
                this.setData({
                    banners
                });
            }
        },

        onBannerImageError(e) {
            const index = e.currentTarget.dataset.index;
            const banners = this.banners;
            if (banners[index]) {
                banners[index].loadFailed = true;
                banners[index].image = 'https://picsum.photos/750/400?random=error';
                this.setData({
                    banners
                });
            }
        },

        onBannerChange(e) {
            if (e.detail.source) {
                this.setData({
                    bannerCurrent: e.detail.current
                });
            }
        },

        onBannerTap(e) {
            const index = e.currentTarget.dataset.index;
            const banner = this.banners[index];
            if (!banner) {
                return;
            }
            bannerService.handleBannerClick(banner, getApp());
        },

        refreshBanners() {
            bannerService.clearCache();
            this.loadBanners();
        },

        async loadProducts() {
            if (this.loading || this.noMore) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                let result;
                const { currentFilter, page, pageSize, searchKeyword } = this;
                if (searchKeyword) {
                    result = await productApi.searchProducts(searchKeyword, page, pageSize);
                } else if (currentFilter === 0) {
                    result = await productApi.getProducts({
                        page,
                        pageSize
                    });
                } else {
                    result = await productApi.getProducts({
                        categoryId: currentFilter,
                        page,
                        pageSize
                    });
                }
                const products = result.list || [];
                if (products.length === 0) {
                    this.setData({
                        noMore: true
                    });
                } else {
                    const newProducts = [...this.products, ...products];
                    this.setData({
                        products: newProducts,
                        page: this.page + 1
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none',
                    duration: 2000
                });
            } finally {
                this.setData({
                    loading: false
                });
            }
        },

        switchFilter(e) {
            const filterId = e.currentTarget.dataset.id;
            if (filterId === this.currentFilter) {
                return;
            }
            this.setData({
                currentFilter: filterId,
                products: [],
                page: 1,
                noMore: false
            });
            this.loadProducts();
        },

        loadMore() {
            if (this.loading || this.noMore) {
                return;
            }
            this.loadProducts();
        },

        // 跳转到搜索页面
        goToSearchPage() {
            uni.navigateTo({
                url: '/pages/sp_SearchPage/sp_SearchPage',
                success: () => {
                    console.log('跳转到搜索页成功');
                },
                fail: (err) => {
                    console.error('跳转搜索页失败:', err);
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        goToDetail(e) {
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${productId}`,
                success: () => {
                    console.log('跳转到商品详情页成功');
                },
                fail: (err) => {
                    console.error('跳转失败:', err);
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none',
                        duration: 2000
                    });
                }
            });
        },

        async toggleFavorite(e) {
            const productId = e.currentTarget.dataset.id;
            try {
                const product = this.products.find((p) => p.productId === productId);
                if (product.favorite) {
                    await favoriteApi.removeFavorite(productId);
                } else {
                    await favoriteApi.addFavorite(productId);
                }
                const products = this.products.map((p) => {
                    if (p.productId === productId) {
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
                const updatedProduct = products.find((p) => p.productId === productId);
                uni.showToast({
                    title: updatedProduct.favorite ? '已收藏' : '已取消收藏',
                    icon: updatedProduct.favorite ? 'success' : 'none',
                    duration: 1500
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('收藏操作失败:', error);
                uni.showToast({
                    title: '操作失败',
                    icon: 'none',
                    duration: 1500
                });
            }
        },

        async addToCart(e) {
            const productId = e.currentTarget.dataset.id;
            try {
                await cartApi.addToCart(productId, null, 1);
                uni.showToast({
                    title: '已加入购物车',
                    icon: 'success',
                    duration: 1500
                });
                this.loadCartCount();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加入购物车失败:', error);
            }
        },

        async loadCartInfo() {
            try {
                const cartList = await cartApi.getCartList();
                const cartCount = cartList ? cartList.length : 0;
                const cartProductIds = cartList ? cartList.map((item) => item.productId) : [];
                this.setData({
                    cartCount,
                    cartProductIds
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('获取购物车信息失败:', error);
            }
        },

        async addToCart(e) {
            const productId = e.currentTarget.dataset.id;
            if (this.cartProductIds.includes(productId)) {
                uni.showToast({
                    title: '已在购物车中',
                    icon: 'none',
                    duration: 1500
                });
                return;
            }
            try {
                await cartApi.addToCart(productId, null, 1);
                const cartProductIds = [...this.cartProductIds, productId];
                this.setData({
                    cartProductIds
                });
                uni.showToast({
                    title: '已加入购物车',
                    icon: 'success',
                    duration: 1500
                });
                this.loadCartInfo();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加入购物车失败:', error);
                uni.showToast({
                    title: '加入失败',
                    icon: 'none',
                    duration: 2000
                });
            }
        },

        goToCart() {
            uni.navigateTo({
                url: '/pages/sp_Cart_page/sp_Cart_page'
            });
        },

        onSearch(e) {
            const keyword = e.detail.value;
            this.setData({
                searchKeyword: keyword
            });
        },

        onSearchConfirm() {
            if (!this.searchKeyword.trim()) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none',
                    duration: 2000
                });
                return;
            }
            this.setData({
                products: [],
                page: 1,
                noMore: false
            });
            this.loadProducts();
        },

        onTabChange(e) {
            const { activeTab } = e.detail;
            const tabPaths = ['/pages/index/index', '/pages/Product_list_page/Product_list_page', '/pages/selection/selection', '/pages/rd/rd', '/pages/Profile_page/Profile_page'];
            if (activeTab !== 1) {
                uni.switchTab({
                    url: tabPaths[activeTab]
                });
            }
        },

        onProductScroll() {
            console.log('占位：函数 onProductScroll 未声明');
        },

        onPullDownRefresh() {
            console.log('占位：函数 onPullDownRefresh 未声明');
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

.product-list-page {
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
    background: #fafafa;
    z-index: 0;
}

.page-header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #ffffff;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.header-content {
    padding: 44rpx 32rpx 28rpx;
}

.header-top {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 20rpx;
}

.brand-section {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    flex-shrink: 0;
}

.brand-name {
    font-size: 52rpx;
    color: #2c2c2c;
    font-weight: 300;
    letter-spacing: 4rpx;
}

.brand-line {
    width: 56rpx;
    height: 3rpx;
    background: linear-gradient(90deg, #ffc107 0%, #ffb300 100%);
    border-radius: 2rpx;
}

.search-container {
    flex: 1;
    padding: 0;
    position: relative;
}

.search-wrapper {
    display: flex;
    align-items: center;
    background: #fafafa;
    border-radius: 44rpx;
    padding: 14rpx 20rpx;
    gap: 10rpx;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: 1rpx solid rgba(0, 0, 0, 0.04);
    box-shadow: none;
    position: relative;
    overflow: hidden;
}

.search-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 44rpx;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.06), rgba(255, 193, 7, 0.03));
    opacity: 0;
    transition: opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
}

.search-wrapper:focus-within::before {
    opacity: 1;
}

.search-wrapper:focus-within {
    background: #ffffff;
    border-color: #ffc107;
    box-shadow: 0 4rpx 16rpx rgba(255, 193, 7, 0.15), 0 0 0 1rpx rgba(255, 193, 7, 0.08);
    transform: translateY(-1rpx);
}

.search-icon {
    font-size: 26rpx;
    opacity: 0.4;
    color: #999999;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    z-index: 2;
}

.search-wrapper:focus-within .search-icon {
    opacity: 1;
    color: #ffc107;
    transform: rotate(90deg) scale(1.08);
}

.search-icon::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    background: rgba(255, 193, 7, 0.06);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: -1;
}

.search-wrapper:focus-within .search-icon::after {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.4);
}

.search-input {
    flex: 1;
    font-size: 26rpx;
    color: #333333;
    font-weight: 400;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-input::placeholder {
    color: #999999;
    font-weight: 400;
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.search-wrapper:focus-within .search-input::placeholder {
    opacity: 0.5;
    transform: translateX(10rpx);
}

.search-input:focus {
    outline: none;
}

.search-input:focus::placeholder {
    opacity: 0;
    transform: translateX(20rpx);
}

.search-placeholder {
    color: #999999;
    font-weight: 400;
}

.search-text {
    flex: 1;
    font-size: 26rpx;
    color: #999999;
    font-weight: 400;
}

.search-container:active .search-wrapper {
    background: #f0f0f0;
    transform: scale(0.98);
    opacity: 0.8;
}

.header-actions {
    display: flex;
    gap: 16rpx;
    flex-shrink: 0;
}

.action-btn {
    width: 68rpx;
    height: 68rpx;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 1rpx solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.action-btn:active {
    transform: scale(0.94);
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
}

.action-icon {
    font-size: 30rpx;
    opacity: 0.5;
}

.badge {
    position: absolute;
    top: 2rpx;
    right: 2rpx;
    min-width: 26rpx;
    height: 26rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    color: #ffffff;
    font-size: 17rpx;
    font-weight: 700;
    border-radius: 13rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 7rpx;
    box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.3);
}

.header-desc {
    font-size: 26rpx;
    color: #999999;
    letter-spacing: 1rpx;
    font-weight: 400;
    margin-bottom: 24rpx;
}

.banner-section {
    position: relative;
    width: 100%;
    height: 400rpx;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
    margin-top: 170rpx;
}

.banner-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.banner-swiper {
    width: 100%;
    height: 100%;
}

.banner-item-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

.banner-image {
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.5s ease-in-out, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1.02);
    filter: brightness(1);
}

.banner-image.loaded {
    opacity: 1;
    transform: scale(1);
}

.banner-image:active {
    transform: scale(0.98);
    filter: brightness(0.95);
}

.banner-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 32rpx;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
    opacity: 0;
    animation: overlayFadeIn 0.5s ease-in-out 0.2s forwards;
}

@keyframes overlayFadeIn {
    0% {
        opacity: 0;
        transform: translateY(20rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.banner-content {
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.banner-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.3);
    letter-spacing: 1rpx;
}

.banner-subtitle {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

.banner-indicator {
    position: absolute;
    bottom: 20rpx;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    pointer-events: none;
    z-index: 10;
}

.indicator-dots {
    display: flex;
    gap: 12rpx;
}

.indicator-dot {
    width: 12rpx;
    height: 12rpx;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50%;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1);
}

.indicator-dot.active {
    width: 32rpx;
    border-radius: 6rpx;
    background: #ffffff;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.2);
    transform: scale(1.1);
}

.indicator-text {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
    font-weight: 500;
    background: rgba(0, 0, 0, 0.2);
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
}

.banner-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    z-index: 20;
}

.loading-spinner {
    width: 48rpx;
    height: 48rpx;
    border: 4rpx solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.loading-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.3);
}

.banner-placeholder {
    position: relative;
    width: 100%;
    height: 100%;
}

.placeholder-image {
    width: 100%;
    height: 100%;
    filter: grayscale(0.3);
}

.placeholder-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0.5);
    padding: 20rpx 40rpx;
    border-radius: 12rpx;
}

.placeholder-text {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
}

@media (max-width: 375px) {
    .banner-section {
        height: 320rpx;
    }

    .banner-title {
        font-size: 28rpx;
    }

    .banner-subtitle {
        font-size: 22rpx;
    }
}

@media (min-width: 768px) {
    .banner-section {
        height: 480rpx;
        max-width: 750rpx;
        margin-left: auto;
        margin-right: auto;
        border-radius: 0 0 24rpx 24rpx;
    }

    .banner-indicator {
        bottom: 32rpx;
    }
}

.main-container {
    height: 100vh;
    padding-top: 0;
    position: relative;
    z-index: 1;
}

.filter-section {
    position: relative;
    background: #ffffff;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.04);
    padding: 0 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.03);
}

.filter-tabs {
    display: flex;
    gap: 12rpx;
    overflow-x: auto;
    padding: 20rpx 0;
    scrollbar-width: none;
}

.filter-tabs::-webkit-scrollbar {
    display: none;
}

.filter-tab {
    position: relative;
    padding: 14rpx 28rpx;
    background: #fafafa;
    border-radius: 40rpx;
    white-space: nowrap;
    border: 1rpx solid rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: none;
}

.filter-tab:active {
    transform: scale(0.96);
}

.filter-tab.active {
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-color: #ffc107;
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.25);
    transform: translateY(-2rpx);
}

.filter-text {
    font-size: 26rpx;
    color: #666666;
    font-weight: 400;
    letter-spacing: 0.5rpx;
    transition: all 0.3s ease;
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
    animation: indicatorSlide 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes indicatorSlide {
    0% {
        opacity: 0;
        transform: translateX(-50%) scaleX(0);
    }
    100% {
        opacity: 1;
        transform: translateX(-50%) scaleX(1);
    }
}

.product-scroll {
    height: 100%;
    background: #fafafa;
}

.product-grid {
    padding: 20rpx 16rpx;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12rpx;
}

.product-card {
    background: #ffffff;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    animation: cardFadeIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
}

.product-card:nth-child(1) {
    animation-delay: 0s;
}

.product-card:nth-child(2) {
    animation-delay: 0.06s;
}

.product-card:nth-child(3) {
    animation-delay: 0.12s;
}

.product-card:nth-child(4) {
    animation-delay: 0.18s;
}

.product-card:nth-child(5) {
    animation-delay: 0.24s;
}

.product-card:nth-child(6) {
    animation-delay: 0.3s;
}

.product-card:nth-child(7) {
    animation-delay: 0.36s;
}

.product-card:nth-child(8) {
    animation-delay: 0.42s;
}

.product-card:nth-child(9) {
    animation-delay: 0.48s;
}

.product-card:nth-child(10) {
    animation-delay: 0.54s;
}

.product-card:active {
    transform: scale(0.97) translateY(-2rpx);
    box-shadow: 0 6rpx 20rpx rgba(255, 179, 0, 0.15);
}

@keyframes cardFadeIn {
    0% {
        opacity: 0;
        transform: translateY(20rpx);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.card-visual {
    position: relative;
    width: 100%;
    height: 320rpx;
    overflow: hidden;
    background: #fafafa;
}

.image-container {
    width: 100%;
    height: 100%;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #ffffff;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:active .product-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 12rpx;
}

.overlay-badges {
    display: flex;
    gap: 8rpx;
}

.badge {
    padding: 6rpx 12rpx;
    border-radius: 4rpx;
    font-size: 18rpx;
    font-weight: 500;
    color: #ffffff;
    letter-spacing: 0.3rpx;
}

.badge.hot {
    background: #ffc107;
}

.badge.new {
    background: #ffe082;
}

.overlay-actions {
    display: flex;
    justify-content: flex-end;
}

.action-favorite {
    width: 48rpx;
    height: 48rpx;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-favorite:active {
    transform: scale(0.88);
    box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.06);
}

.favorite-icon {
    font-size: 24rpx;
    color: #999999;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.favorite-icon.active {
    color: #ffc107;
    transform: scale(1.2);
}

.card-content {
    padding: 14rpx;
    display: flex;
    flex-direction: column;
}

.product-name {
    font-size: 26rpx;
    color: #333333;
    font-weight: 500;
    line-height: 1.4;
    margin-bottom: 10rpx;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    letter-spacing: 0.3rpx;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 6rpx;
    margin-bottom: 14rpx;
}

.meta-item {
    font-size: 20rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.2rpx;
}

.meta-item.stock {
    color: #ffc107;
    font-weight: 500;
}

.meta-divider {
    font-size: 20rpx;
    color: #dddddd;
}

.card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10rpx;
}

.price-section {
    display: flex;
    align-items: baseline;
    gap: 2rpx;
}

.currency {
    font-size: 22rpx;
    color: #ffc107;
    font-weight: 600;
}

.price {
    font-size: 34rpx;
    color: #ffc107;
    font-weight: 700;
    letter-spacing: -0.3rpx;
}

.add-btn {
    width: 52rpx;
    height: 52rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 3rpx 10rpx rgba(255, 193, 7, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.add-btn.in-cart {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
    box-shadow: 0 3rpx 10rpx rgba(76, 175, 80, 0.25);
}

.add-btn:active {
    transform: scale(0.9);
    box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.2);
}

.add-icon {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 300;
    line-height: 1;
    transition: transform 0.3s ease;
}

.add-btn:active .add-icon {
    transform: rotate(90deg);
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80rpx 0;
}

.loading-dots {
    display: flex;
    gap: 10rpx;
}

.dot {
    width: 10rpx;
    height: 10rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 50%;
    animation: pulse 1.2s ease-in-out infinite;
    box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.2);
}

.dot:nth-child(1) {
    animation-delay: 0s;
}

.dot:nth-child(2) {
    animation-delay: 0.15s;
}

.dot:nth-child(3) {
    animation-delay: 0.3s;
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
    gap: 20rpx;
    padding: 80rpx 0;
}

.end-line {
    width: 60rpx;
    height: 1rpx;
    background: linear-gradient(90deg, transparent 0%, rgba(0, 0, 0, 0.08) 50%, transparent 100%);
}

.end-text {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 2rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 200rpx 0;
}

.empty-emoji {
    font-size: 100rpx;
    margin-bottom: 28rpx;
    opacity: 0.25;
    filter: grayscale(0.3);
}

.empty-title {
    font-size: 32rpx;
    color: #333333;
    font-weight: 500;
    margin-bottom: 12rpx;
    letter-spacing: 1rpx;
}

.empty-desc {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}
</style>
