<template>
    <view class="sp-details-page">
        <view class="page-background"></view>

        <scroll-view class="page-content" :scroll-y="true" :enhanced="true" :show-scrollbar="false">
            <view class="product-gallery">
                <swiper
                    class="gallery-swiper"
                    indicator-dots
                    autoplay
                    circular
                    interval="4000"
                    duration="500"
                    indicator-color="rgba(255, 193, 7, 0.3)"
                    indicator-active-color="#FFC107"
                >
                    <swiper-item v-for="(item, index) in product.images" :key="index">
                        <image class="gallery-image" :src="item" mode="aspectFill" @tap="previewImage" :data-url="item" :lazy-load="true" />
                    </swiper-item>
                </swiper>
                <view class="gallery-dots">
                    <view class="dot" v-if="index === currentIndex" v-for="(item, index) in product.images" :key="index"></view>
                </view>
            </view>

            <view class="product-info">
                <view class="product-title">{{ product.name }}</view>
                <view class="product-subtitle">{{ product.subtitle }}</view>

                <view class="price-section">
                    <view class="price-main">
                        <text class="currency">¥</text>
                        <text class="price">{{ product.price }}</text>
                    </view>
                    <view class="price-original" v-if="product.originalPrice">
                        <text class="original-price">¥{{ product.originalPrice }}</text>
                        <text class="discount-tag">{{ product.discount }}折</text>
                    </view>
                </view>

                <view class="member-price" v-if="product.memberPrice">
                    <text class="member-label">会员价</text>
                    <text class="member-price-value">¥{{ product.memberPrice }}</text>
                    <text class="member-save">省¥{{ product.saveAmount }}</text>
                </view>

                <view class="product-meta">
                    <view class="meta-item">
                        <text class="meta-label">库存</text>
                        <text class="meta-value stock">{{ product.stock }}</text>
                    </view>
                    <view class="meta-divider">·</view>
                    <view class="meta-item">
                        <text class="meta-label">销量</text>
                        <text class="meta-value">{{ product.sales }}</text>
                    </view>
                    <view class="meta-divider">·</view>
                    <view class="meta-item">
                        <text class="meta-label">评价</text>
                        <text class="meta-value">{{ product.reviews }}</text>
                    </view>
                </view>

                <view class="product-tags">
                    <view class="tag" v-for="(item, index) in product.tags" :key="index">{{ item }}</view>
                </view>
            </view>

            <view class="product-specs">
                <view class="section-header">
                    <text class="section-title">商品规格</text>
                </view>
                <view class="specs-list">
                    <view class="spec-item" v-for="(item, index) in product.specs" :key="index">
                        <view class="spec-name">{{ item.name }}</view>

                        <view class="spec-values">
                            <view
                                :class="'spec-value ' + (selectedSpecs[item.name] === value ? 'active' : '')"
                                @tap="selectSpec"
                                :data-name="item.name"
                                :data-value="value"
                                v-for="(value, index1) in item.values"
                                :key="index1"
                            >
                                {{ value }}
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="product-description">
                <view class="section-header">
                    <text class="section-title">商品详情</text>
                </view>
                <view class="description-content">
                    <rich-text :nodes="product.description"></rich-text>
                </view>
            </view>

            <view class="product-reviews" v-if="product.reviews > 0">
                <view class="section-header">
                    <text class="section-title">用户评价</text>
                    <text class="section-more" @tap="viewAllReviews">查看全部</text>
                </view>
                <view class="reviews-list">
                    <view class="review-item" v-for="(item, index) in product.reviewList" :key="index">
                        <view class="review-header">
                            <image class="review-avatar" :src="item.avatar" mode="aspectFill" />
                            <view class="review-info">
                                <text class="review-name">{{ item.name }}</text>
                                <view class="review-rating">
                                    <text class="star" v-for="(item, index1) in item.rating" :key="index1">★</text>
                                </view>
                            </view>
                        </view>

                        <text class="review-date">{{ item.date }}</text>

                        <view class="review-content">{{ item.content }}</view>
                    </view>
                </view>
            </view>

            <view class="product-recommendations" v-if="product.recommendations && product.recommendations.length > 0">
                <view class="section-header">
                    <text class="section-title">同类商品推荐</text>
                    <text class="section-subtitle">根据销量和收藏量精选</text>
                </view>
                <view class="recommendation-grid">
                    <view class="recommendation-card" @tap="goToRecommendation" :data-id="item.id" v-for="(item, index) in product.recommendations" :key="index">
                        <image class="recommendation-image" :src="item.image" mode="aspectFill" :lazy-load="true" />

                        <view class="recommendation-info">
                            <text class="recommendation-name">{{ item.name }}</text>
                            <view class="recommendation-bottom">
                                <text class="recommendation-price">¥{{ item.price }}</text>
                                <text class="recommendation-sales">{{ item.sales }}人买</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </scroll-view>

        <view class="bottom-bar">
            <view class="bar-content">
                <view class="cart-info" @tap="goToCart">
                    <text class="cart-icon">🛒</text>
                    <view class="cart-badge" v-if="cartCount > 0">{{ cartCount }}</view>
                </view>
                <view class="action-buttons">
                    <view :class="'btn-secondary ' + (isInCart ? 'in-cart' : '')" @tap="addToCart">
                        <text class="btn-text">{{ isInCart ? '已加入购物车' : '加入购物车' }}</text>
                    </view>
                    <view class="btn-primary" @tap="buyNow">
                        <text class="btn-text">立即购买</text>
                    </view>
                </view>
            </view>

            <sp-spec-selector :show="showSpecSelector" :product="product" @close="onSpecSelectorClose" @addtocart="onSpecSelectorAddToCart" @buynow="onSpecSelectorBuyNow" />
        </view>
    </view>
</template>

<script>
import spSpecSelector from '../../components/sp_SpecSelector/sp_SpecSelector';
const cartApi = require('../../utils/sp_api.js').cartApi;
const { checkLogin, getLoginStatus } = require('../../utils/sp_auth.js');
export default {
    components: {
        spSpecSelector
    },
    data() {
        return {
            productId: '',

            product: {
                id: '',
                name: '',
                subtitle: '',
                price: '0',
                originalPrice: '',
                discount: '',
                memberPrice: '',
                saveAmount: '',
                stock: 0,
                sales: 0,
                reviews: 0,
                tags: [],
                images: [],
                specs: [],
                description: '',
                reviewList: [],
                recommendations: []
            },

            currentIndex: 0,
            selectedSpecs: {},
            isFavorite: false,
            isInCart: false,
            currentCartId: null,
            cartCount: 0,
            loading: false,
            addingToCart: false,
            showSpecSelector: false,
            isLoggedIn: false,
            value: ''
        };
    },
    onLoad(options) {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (options.id) {
            this.setData({
                productId: options.id
            });
            this.loadProductDetail();
        }
    },
    onShow() {
        const loginStatus = getLoginStatus();
        this.setData({
            isLoggedIn: loginStatus.isLoggedIn
        });
        if (loginStatus.isLoggedIn) {
            this.loadCartCount();
            this.checkInCart();
            this.checkFavoriteStatus();
        }
    },
    onShareAppMessage() {
        return {
            title: this.product.name,
            path: `/pages/sp_Details/sp_Details?id=${this.productId}`,
            imageUrl: this.product.images[0]
        };
    },
    methods: {
        async loadProductDetail() {
            this.setData({
                loading: true
            });
            try {
                const product = await this.getProductDetail(this.productId);

                // 确保至少有一张图片显示
                if (!product.images || product.images.length === 0) {
                    if (product.mainImage) {
                        product.images = [product.mainImage];
                    } else if (product.image) {
                        product.images = [product.image];
                    } else {
                        product.images = ['/images/default-product.png'];
                    }
                }

                // 确保所有图片URL都是完整的
                product.images = product.images.filter((img) => img && img.length > 0);
                this.setData({
                    product: product,
                    currentIndex: 0
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载商品详情失败:', error);
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

        getProductDetail(productId) {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: `http://localhost:5000/api/sp/product/${productId}`,
                    method: 'GET',
                    success: (res) => {
                        if (res.data.code === 200) {
                            resolve(res.data.data);
                        } else {
                            reject(new Error(res.data.message));
                        }
                    },
                    fail: (err) => {
                        reject(err);
                    }
                });
            });
        },

        onSwiperChange(e) {
            this.setData({
                currentIndex: e.detail.current
            });
        },

        previewImage(e) {
            const url = e.currentTarget.dataset.url;
            const images = this.product.images;
            uni.previewImage({
                current: url,
                urls: images
            });
        },

        selectSpec(e) {
            const name = e.currentTarget.dataset.name;
            const value = e.currentTarget.dataset.value;
            const selectedSpecs = {
                ...this.selectedSpecs
            };
            selectedSpecs[name] = value;
            this.setData({
                selectedSpecs
            });
        },

        toggleFavorite() {
            if (
                !checkLogin({
                    showToast: false
                })
            ) {
                checkLogin({
                    showToast: true
                });
                return;
            }
            const isFavorite = !this.isFavorite;
            this.setData({
                isFavorite
            });
            if (isFavorite) {
                this.addToFavorites();
                uni.showToast({
                    title: '已收藏',
                    icon: 'success',
                    duration: 1500
                });
            } else {
                this.removeFromFavorites();
                uni.showToast({
                    title: '已取消收藏',
                    icon: 'none',
                    duration: 1500
                });
            }
        },

        addToFavorites() {
            uni.request({
                url: 'http://localhost:5000/api/sp_product_detail/favorite/add',
                method: 'POST',
                data: {
                    productId: this.productId
                },
                success: (res) => {
                    console.log('添加收藏成功');
                },
                fail: (err) => {
                    console.error('添加收藏失败:', err);
                }
            });
        },

        removeFromFavorites() {
            uni.request({
                url: 'http://localhost:5000/api/sp_product_detail/favorite/remove',
                method: 'POST',
                data: {
                    productId: this.productId
                },
                success: (res) => {
                    console.log('取消收藏成功');
                },
                fail: (err) => {
                    console.error('取消收藏失败:', err);
                }
            });
        },

        checkFavoriteStatus() {
            uni.request({
                url: 'http://localhost:5000/api/sp_product_detail/favorite/check',
                method: 'GET',
                data: {
                    productId: this.productId
                },
                success: (res) => {
                    if (res.data.code === 200) {
                        this.setData({
                            isFavorite: res.data.data.isFavorite
                        });
                    }
                },
                fail: (err) => {
                    console.error('检查收藏状态失败:', err);
                }
            });
        },

        shareProduct() {
            uni.showShareMenu({
                withShareTicket: true
            });
        },

        async addToCart() {
            if (
                !checkLogin({
                    showToast: false
                })
            ) {
                checkLogin({
                    showToast: true
                });
                return;
            }
            if (this.addingToCart) {
                return;
            }
            this.setData({
                addingToCart: true
            });
            try {
                const { isInCart, currentCartId, productId, skuId } = this;
                if (isInCart && currentCartId) {
                    await cartApi.deleteCartItem(currentCartId);
                    this.setData({
                        isInCart: false,
                        currentCartId: null
                    });
                    uni.showToast({
                        title: '已从购物车中移除',
                        icon: 'success',
                        duration: 1500
                    });
                } else {
                    await cartApi.addToCart(productId, skuId, 1);
                    const cartList = await cartApi.getCartList();
                    const cartItem = cartList && cartList.find((item) => item.productId === parseInt(productId));
                    this.setData({
                        isInCart: true,
                        currentCartId: cartItem ? cartItem.cartId : null
                    });
                    uni.showToast({
                        title: '已加入购物车',
                        icon: 'success',
                        duration: 1500
                    });
                }
                this.loadCartCount();
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('操作购物车失败:', error);
                uni.showToast({
                    title: '操作失败',
                    icon: 'none',
                    duration: 2000
                });
            } finally {
                setTimeout(() => {
                    this.setData({
                        addingToCart: false
                    });
                }, 500);
            }
        },

        buyNow() {
            if (
                !checkLogin({
                    showToast: false
                })
            ) {
                checkLogin({
                    showToast: true
                });
                return;
            }
            this.setData({
                showSpecSelector: true
            });
        },

        onSpecSelectorClose() {
            this.setData({
                showSpecSelector: false
            });
        },

        onSpecSelectorAddToCart(e) {
            const { productId, skuId, quantity, specs } = e.detail;
            this.setData({
                showSpecSelector: false
            });
            cartApi
                .addToCart(productId, skuId, quantity)
                .then(async () => {
                    const cartList = await cartApi.getCartList();
                    const cartItem = cartList && cartList.find((item) => item.productId === parseInt(productId) && (!skuId || item.skuId === skuId));
                    this.setData({
                        isInCart: true,
                        currentCartId: cartItem ? cartItem.cartId : null
                    });
                    this.loadCartCount();
                    uni.showToast({
                        title: '已加入购物车',
                        icon: 'success',
                        duration: 1500
                    });
                })
                .catch((error) => {
                    console.error('加入购物车失败:', error);
                    uni.showToast({
                        title: '加入失败',
                        icon: 'none',
                        duration: 2000
                    });
                });
        },

        onSpecSelectorBuyNow(e) {
            const { productId, skuId, quantity, specs, price, totalPrice } = e.detail;
            this.setData({
                showSpecSelector: false
            });
            uni.navigateTo({
                url: `/pages/sp_Payment/sp_Payment?productId=${productId}&skuId=${skuId}&quantity=${quantity}&price=${price}&totalPrice=${totalPrice}`
            });
        },

        goToCart() {
            uni.navigateTo({
                url: '/pages/sp_Cart_page/sp_Cart_page'
            });
        },

        async loadCartCount() {
            try {
                const cartList = await cartApi.getCartList();
                const cartCount = cartList ? cartList.length : 0;
                this.setData({
                    cartCount
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('获取购物车数量失败:', error);
            }
        },

        async checkInCart() {
            try {
                const cartList = await cartApi.getCartList();
                const productId = parseInt(this.productId);
                const cartItem = cartList && cartList.find((item) => item.productId === productId);
                const isInCart = !!cartItem;
                const currentCartId = cartItem ? cartItem.cartId : null;
                this.setData({
                    isInCart,
                    currentCartId
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('检查购物车状态失败:', error);
            }
        },

        viewAllReviews() {
            uni.showToast({
                title: '查看全部评价',
                icon: 'none',
                duration: 1500
            });
        },

        goToRecommendation(e) {
            const productId = e.currentTarget.dataset.id;
            uni.redirectTo({
                url: `/pages/sp_Details/sp_Details?id=${productId}`
            });
        },

        goBack() {
            uni.navigateBack({
                delta: 1
            });
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
    padding-bottom: 120rpx;
}

.sp-details-page {
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
}

.header-content {
    padding: 24rpx 32rpx;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.back-btn {
    width: 64rpx;
    height: 64rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.back-btn:active {
    transform: scale(0.92);
    background: #e8e8e8;
}

.back-icon {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 300;
}

.header-actions {
    display: flex;
    gap: 16rpx;
}

.action-btn {
    width: 64rpx;
    height: 64rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.action-btn:active {
    transform: scale(0.92);
    background: #e8e8e8;
}

.action-icon {
    font-size: 28rpx;
    color: #2c2c2c;
}

.page-content {
    height: 100vh;
    padding-bottom: 120rpx;
    box-sizing: border-box;
}

.product-gallery {
    position: relative;
    width: 100%;
    height: 750rpx;
    background: #ffffff;
}

.gallery-swiper {
    width: 100%;
    height: 100%;
}

.gallery-image {
    width: 100%;
    height: 100%;
}

.gallery-dots {
    position: absolute;
    bottom: 32rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 12rpx;
}

.dot {
    width: 12rpx;
    height: 12rpx;
    background: rgba(255, 193, 7, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;
}

.product-info {
    background: #ffffff;
    padding: 40rpx 32rpx;
    margin-bottom: 16rpx;
}

.product-title {
    font-size: 40rpx;
    color: #2c2c2c;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: 12rpx;
}

.product-subtitle {
    font-size: 26rpx;
    color: #999999;
    line-height: 1.5;
    margin-bottom: 32rpx;
}

.price-section {
    display: flex;
    align-items: flex-end;
    gap: 24rpx;
    margin-bottom: 24rpx;
}

.price-main {
    display: flex;
    align-items: baseline;
}

.currency {
    font-size: 24rpx;
    color: #ffc107;
    font-weight: 600;
}

.price {
    font-size: 48rpx;
    color: #ffc107;
    font-weight: 600;
    letter-spacing: -0.5rpx;
}

.price-original {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.original-price {
    font-size: 28rpx;
    color: #999999;
    text-decoration: line-through;
}

.discount-tag {
    padding: 4rpx 12rpx;
    background: rgba(255, 193, 7, 0.1);
    color: #ffc107;
    font-size: 20rpx;
    border-radius: 4rpx;
}

.member-price {
    display: flex;
    align-items: center;
    gap: 16rpx;
    padding: 20rpx;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.08), rgba(255, 193, 7, 0.04));
    border-radius: 12rpx;
    margin-bottom: 32rpx;
}

.member-label {
    font-size: 22rpx;
    color: #ffc107;
    font-weight: 500;
}

.member-price-value {
    font-size: 32rpx;
    color: #ffc107;
    font-weight: 600;
}

.member-save {
    font-size: 20rpx;
    color: #999999;
}

.product-meta {
    display: flex;
    align-items: center;
    gap: 24rpx;
    margin-bottom: 32rpx;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.meta-label {
    font-size: 24rpx;
    color: #999999;
}

.meta-value {
    font-size: 24rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.meta-value.stock {
    color: #ffc107;
}

.meta-divider {
    font-size: 24rpx;
    color: #e0e0e0;
}

.product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-bottom: 32rpx;
}

.tag {
    padding: 8rpx 20rpx;
    background: #f5f5f5;
    color: #666666;
    font-size: 22rpx;
    border-radius: 8rpx;
}

.product-specs {
    background: #ffffff;
    padding: 40rpx 32rpx;
    margin-bottom: 16rpx;
}

.section-header {
    margin-bottom: 32rpx;
}

.section-title {
    font-size: 32rpx;
    color: #2c2c2c;
    font-weight: 600;
}

.specs-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.spec-item {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.spec-name {
    font-size: 26rpx;
    color: #666666;
    font-weight: 500;
}

.spec-values {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}

.spec-value {
    padding: 16rpx 28rpx;
    background: #f5f5f5;
    color: #666666;
    font-size: 24rpx;
    border-radius: 8rpx;
    border: 1rpx solid transparent;
    transition: all 0.3s ease;
}

.spec-value.active {
    background: #ffc107;
    color: #ffffff;
    border-color: #ffc107;
}

.spec-value:active {
    transform: scale(0.95);
}

.product-description {
    background: #ffffff;
    padding: 40rpx 32rpx;
    margin-bottom: 16rpx;
    padding-bottom: calc(40rpx + 120rpx);
}

.description-content {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.8;
}

.product-reviews {
    background: #ffffff;
    padding: 40rpx 32rpx;
    margin-bottom: 16rpx;
}

.section-more {
    font-size: 24rpx;
    color: #ffc107;
}

.reviews-list {
    display: flex;
    flex-direction: column;
    gap: 32rpx;
}

.review-item {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
    padding-bottom: 32rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.review-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.review-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
}

.review-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    margin-right: 16rpx;
}

.review-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.review-name {
    font-size: 26rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.review-rating {
    display: flex;
    gap: 4rpx;
}

.star {
    font-size: 20rpx;
    color: #ffc107;
}

.review-date {
    font-size: 22rpx;
    color: #999999;
}

.review-content {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.6;
}

.product-recommendations {
    background: #ffffff;
    padding: 32rpx;
    margin-bottom: 16rpx;
}

.product-recommendations .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.product-recommendations .section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #2c2c2c;
}

.product-recommendations .section-subtitle {
    font-size: 22rpx;
    color: #999999;
    font-weight: normal;
}

.recommendation-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;
}

.recommendation-card {
    background: #fafafa;
    border-radius: 12rpx;
    overflow: hidden;
    transition: all 0.2s ease;
}

.recommendation-card:active {
    opacity: 0.8;
    transform: scale(0.98);
}

.recommendation-image {
    width: 100%;
    height: 180rpx;
    background: #e8e8e8;
}

.recommendation-info {
    padding: 16rpx;
}

.recommendation-name {
    font-size: 24rpx;
    color: #2c2c2c;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
    margin-bottom: 12rpx;
}

.recommendation-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.recommendation-price {
    font-size: 26rpx;
    color: #ff4757;
    font-weight: 600;
}

.recommendation-sales {
    font-size: 20rpx;
    color: #999999;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: #ffffff;
    border-top: 1rpx solid rgba(0, 0, 0, 0.04);
    padding: 16rpx 32rpx;
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
}

.bar-content {
    display: flex;
    align-items: center;
    gap: 24rpx;
}

.cart-info {
    position: relative;
    width: 88rpx;
    height: 88rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.cart-info:active {
    transform: scale(0.92);
    background: #e8e8e8;
}

.cart-icon {
    font-size: 40rpx;
}

.cart-badge {
    position: absolute;
    top: 4rpx;
    right: 4rpx;
    min-width: 32rpx;
    height: 32rpx;
    background: #ffc107;
    color: #ffffff;
    font-size: 18rpx;
    font-weight: 600;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8rpx;
}

.action-buttons {
    flex: 1;
    display: flex;
    gap: 16rpx;
}

.btn-secondary {
    flex: 1;
    height: 88rpx;
    background: #f5f5f5;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.btn-secondary.in-cart {
    background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
}

.btn-secondary.in-cart .btn-text {
    color: #ffffff;
    font-weight: 600;
}

.btn-secondary:active {
    transform: scale(0.98);
    background: #e8e8e8;
}

.btn-primary {
    flex: 1;
    height: 88rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.2);
    transition: all 0.3s ease;
}

.btn-primary:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 6rpx rgba(255, 193, 7, 0.15);
}

.btn-text {
    font-size: 28rpx;
    color: #2c2c2c;
    font-weight: 500;
}

.btn-primary .btn-text {
    color: #ffffff;
}
</style>
