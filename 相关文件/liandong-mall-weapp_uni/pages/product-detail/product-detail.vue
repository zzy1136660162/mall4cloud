<template>
    <view>
        <view class="page">
            <!-- 商品图片轮播 -->
            <view class="gallery-section">
                <swiper
                    class="gallery-swiper"
                    indicator-dots
                    autoplay
                    circular
                    interval="4000"
                    duration="500"
                    indicator-color="rgba(255,255,255,0.5)"
                    indicator-active-color="#ff4757"
                >
                    <swiper-item v-for="(item, index) in product.images" :key="index">
                        <image class="gallery-image" :src="item" mode="aspectFill" @tap="previewImage" :data-url="item" />
                    </swiper-item>
                </swiper>
            </view>

            <!-- 价格佣金区域 -->
            <view class="price-section">
                <view class="price-main">
                    <view class="price-tag">补贴价</view>
                    <text class="price-symbol">¥</text>
                    <text class="price-value">{{ product.price }}</text>
                </view>
                <view class="commission-info">
                    <view class="commission-box">
                        <text class="commission-label">预计赚</text>
                        <text class="commission-value">¥{{ product.commissionAmount }}</text>
                        <text class="commission-rate">佣金率{{ product.commissionRate }}%</text>
                    </view>
                </view>
            </view>

            <!-- 商品信息 -->
            <view class="info-section">
                <view class="title-row">
                    <text class="product-title">{{ product.title }}</text>
                </view>
                <view class="tag-row">
                    <view class="stat-tag">
                        <text class="stat-icon">↓</text>
                        <text>90天降26%</text>
                    </view>
                    <view class="stat-tag">
                        <text>该商品店内高佣</text>
                    </view>
                    <view class="stat-tag">
                        <text>{{ product.reviewCount }}人评价"质量好"</text>
                    </view>
                </view>
            </view>

            <!-- 数据统计 -->
            <view class="stats-section">
                <view class="stat-item">
                    <text class="stat-label">好评率</text>
                    <text class="stat-value highlight">{{ product.goodRate }}%</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">累计销量</text>
                    <text class="stat-value">{{ product.sales }}</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">累计上架达人</text>
                    <text class="stat-value">{{ product.darenCount }}万</text>
                </view>
                <view class="stat-item">
                    <text class="stat-label">库存</text>
                    <text class="stat-value">{{ product.stock }}万</text>
                </view>
            </view>

            <!-- 样品政策 -->
            <view class="sample-section">
                <view class="sample-row">
                    <text class="sample-label">样品</text>
                    <text class="sample-value">先买样，出单大于6单可返全款</text>
                </view>
                <view class="sample-row">
                    <text class="sample-label">保障</text>
                    <view class="guarantee-tags">
                        <view class="guarantee-tag">
                            <text class="guarantee-icon">✓</text>
                            <text>信任购</text>
                        </view>
                        <text class="guarantee-text">品质放心·售后无忧</text>
                    </view>
                </view>
                <view class="sample-row">
                    <text class="sample-label">物流</text>
                    <text class="sample-value">24小时内从{{ product.location }}发货</text>
                    <text class="arrow">></text>
                </view>
            </view>

            <!-- 推广数据 -->
            <view class="data-section">
                <view class="section-title">近30天推广数据</view>
                <view class="data-stats">
                    <view class="data-item">
                        <text class="data-value">{{ product.monthSales }}</text>
                        <text class="data-label">商品总销量</text>
                    </view>
                    <view class="data-item">
                        <text class="data-value">{{ product.monthViews }}</text>
                        <text class="data-label">商品总浏览量</text>
                    </view>
                    <view class="data-item">
                        <text class="data-value">{{ product.monthDaren }}</text>
                        <text class="data-label">推广总达人数</text>
                    </view>
                </view>
                <!-- 趋势图占位 -->
                <view class="trend-chart">
                    <view class="chart-placeholder">
                        <text>📈 销量趋势图</text>
                    </view>
                </view>
            </view>

            <!-- 商品评价 -->
            <view class="review-section">
                <view class="section-header">
                    <text class="section-title">商品评价 ({{ product.reviewCount }}条)</text>
                    <text class="view-all">查看全部 ></text>
                </view>
                <view class="review-summary">
                    <view class="review-rate">
                        <text class="rate-value">{{ product.goodRate }}%</text>
                        <view class="rate-stars">
                            <view class="star" v-for="(item, index) in '[1,2,3,4,5]'" :key="index">★</view>
                        </view>
                    </view>
                    <view class="review-tags">
                        <view class="review-tag" v-for="(item, index) in product.reviewTags" :key="index">
                            <text class="tag-check" v-if="index === 0">✓</text>

                            <text>{{ item }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 底部安全区域 -->
            <view class="safe-area"></view>
        </view>

        <!-- 底部操作栏 -->
        <view class="bottom-bar">
            <view class="bottom-actions">
                <view class="action-item" @tap="goToShelf">
                    <text class="action-icon">🛒</text>
                    <text class="action-text">货架</text>
                </view>
                <view class="action-item" @tap="contactTuanzhang">
                    <text class="action-icon">💬</text>
                    <text class="action-text">联系团长</text>
                </view>
                <view class="action-item" @tap="goToShop">
                    <text class="action-icon">🏪</text>
                    <text class="action-text">进店选品</text>
                </view>
                <view class="action-btn btn-add" @tap="addToShelf">加入货架</view>
                <view class="action-btn btn-buy" @tap="goToSampleApply">申请样品</view>
            </view>
        </view>

        <!-- 商品规格选择弹窗 -->
        <view class="spec-modal" v-if="specModalVisible">
            <view class="spec-modal-overlay" @tap="closeSpecModal"></view>
            <view class="spec-modal-content">
                <!-- 弹窗头部 -->
                <view class="spec-modal-header">
                    <text class="close-btn" @tap="closeSpecModal">×</text>
                </view>

                <!-- 商品基本信息 -->
                <view class="spec-product-info">
                    <image class="spec-product-image" :src="product.images[0]" mode="aspectFill" />
                    <view class="spec-product-detail">
                        <text class="spec-product-title">{{ product.title }}</text>
                        <view class="spec-product-price">
                            <text class="spec-price-symbol">¥</text>
                            <text class="spec-price-value">{{ selectedSpecs.weight ? selectedSpecs.weight.price : product.price }}</text>
                            <text class="spec-original-price">
                                ¥{{ selectedSpecs.weight ? selectedSpecs.weight.originalPrice || product.originalPrice : product.originalPrice }}
                            </text>
                        </view>
                    </view>
                </view>

                <!-- 规格选择区域 -->
                <view class="spec-selection">
                    <view class="spec-item">
                        <text class="spec-label">容量选择</text>
                        <view class="spec-options">
                            <view
                                :class="'spec-option ' + (selectedSpecs.weight && selectedSpecs.weight.id === item.id ? 'selected' : '')"
                                @tap="selectSpec"
                                data-type="weight"
                                :data-spec="item"
                                v-for="(item, index) in product.specs.weight"
                                :key="index"
                            >
                                <text class="spec-option-text">{{ item.name }}</text>
                            </view>
                        </view>
                    </view>

                    <view class="spec-item">
                        <text class="spec-label">香型选择</text>
                        <view class="spec-options">
                            <view
                                :class="'spec-option ' + (selectedSpecs.scent && selectedSpecs.scent.id === item.id ? 'selected' : '')"
                                @tap="selectSpec"
                                data-type="scent"
                                :data-spec="item"
                                v-for="(item, index) in product.specs.scent"
                                :key="index"
                            >
                                <text class="spec-option-text">{{ item.name }}</text>
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 数量选择区域 -->
                <view class="spec-quantity">
                    <text class="spec-label">购买数量</text>
                    <view class="quantity-control">
                        <view class="quantity-btn minus" @tap="changeQuantity" data-type="minus" :disabled="selectedCount <= 1">
                            <text class="btn-text">-</text>
                        </view>
                        <view class="quantity-value">{{ selectedCount }}</view>
                        <view class="quantity-btn plus" @tap="changeQuantity" data-type="plus">
                            <text class="btn-text">+</text>
                        </view>
                    </view>
                </view>

                <!-- 底部操作区域 -->
                <view class="spec-bottom">
                    <view class="spec-total">
                        <text class="total-label">合计：</text>
                        <text class="total-price-symbol">¥</text>
                        <text class="total-price-value">{{ totalPrice }}</text>
                    </view>
                    <view class="spec-confirm-btn" @tap="confirmSpec">
                        <text class="confirm-btn-text">确定</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
const productService = require('../../services/productService');
export default {
    data() {
        return {
            product: {
                id: '',
                title: '',
                price: '',
                originalPrice: '',
                commissionRate: 0,
                commissionAmount: '',
                images: [],
                shopName: '',
                shopLogo: '',
                shopSales: '',
                shopScore: '',
                productScore: '',
                logisticsScore: '',
                serviceScore: '',
                sales: '',
                goodRate: '',
                reviewCount: '',
                darenCount: '',
                stock: '',
                location: '',
                monthSales: '',
                monthViews: '',
                monthDaren: '',
                reviewTags: [],
                tuanzhangName: '',
                tuanzhangAvatar: '',
                tuanzhangDesc: '',
                tags: [],
                specs: {
                    weight: [],
                    scent: []
                }
            },
            specModalVisible: false,
            selectedSpecs: {
                weight: false,

                scent: {
                    id: ''
                }
            },
            selectedCount: 1,
            totalPrice: 0
        };
    },
    onLoad(options) {
        const productId = options.id;
        if (productId) {
            this.loadProductDetail(productId);
        }
    },
    onShareAppMessage() {
        return {
            title: this.product.title,
            path: '/pages/product-detail/product-detail?id=' + this.product.id,
            imageUrl: this.product.images[0]
        };
    },
    methods: {
        loadProductDetail(productId) {
            uni.showLoading({
                title: '加载中...'
            });
            uni.request({
                url: 'http://localhost:5000/api/xp_product/' + productId,
                method: 'GET',
                success: (res) => {
                    console.log('商品详情数据:', res.data);
                    if (res.data.code === 200 && res.data.data) {
                        const product = res.data.data;
                        if (Array.isArray(product.specs) && product.specs.length > 0) {
                            const specsObj = {};
                            product.specs.forEach((spec) => {
                                if (spec.name && Array.isArray(spec.values)) {
                                    specsObj[spec.name] = spec.values.map((val, idx) => ({
                                        id: idx + 1,
                                        name: val,
                                        stock: 100
                                    }));
                                }
                            });
                            product.specs = specsObj;
                        } else {
                            product.specs = {
                                默认: [
                                    {
                                        id: 1,
                                        name: '默认',
                                        stock: product.stock || 0
                                    }
                                ]
                            };
                        }
                        this.setData({
                            product
                        });
                        this.setData({
                            totalPrice: parseFloat(product.price) || 0
                        });
                    } else {
                        uni.showToast({
                            title: res.data.message || '加载失败',
                            icon: 'none'
                        });
                    }
                },
                fail: (err) => {
                    console.error('加载商品详情失败:', err);
                    uni.showToast({
                        title: '网络错误',
                        icon: 'none'
                    });
                },
                complete: () => {
                    uni.hideLoading();
                }
            });
        },

        goBack() {
            uni.navigateBack();
        },

        shareProduct() {
            uni.showShareMenu({
                withShareTicket: true,
                menus: ['shareAppMessage', 'shareTimeline']
            });
        },

        previewImage(e) {
            const url = e.currentTarget.dataset.url;
            uni.previewImage({
                current: url,
                urls: this.product.images
            });
        },

        contactTuanzhang() {
            uni.showModal({
                title: '联系团长',
                content: '团长微信号：feige888\n电话：13888888888',
                showCancel: false,
                confirmText: '复制微信',
                success: (res) => {
                    if (res.confirm) {
                        uni.setClipboardData({
                            data: 'feige888',
                            success: () => {
                                uni.showToast({
                                    title: '已复制',
                                    icon: 'success'
                                });
                            }
                        });
                    }
                }
            });
        },

        showSpecsModal() {
            this.setData({
                specModalVisible: true
            });
        },

        hideSpecsModal() {
            this.setData({
                specModalVisible: false
            });
        },

        selectSpec(e) {
            const { type, id } = e.currentTarget.dataset;
            const specs = this.product.specs;
            const specList = specs[type] || [];
            const spec = specList.find((s) => s.id === id);
            if (spec) {
                const selectedSpecs = this.selectedSpecs;
                selectedSpecs[type] = spec;
                this.setData({
                    selectedSpecs
                });
                this.calculateTotalPrice();
            }
        },

        calculateTotalPrice() {
            const { selectedSpecs } = this;
            let price = parseFloat(this.product.price) || 0;
            Object.values(selectedSpecs).forEach((spec) => {
                if (spec.price) {
                    price = parseFloat(spec.price);
                }
            });
            this.setData({
                totalPrice: price
            });
        },

        addToCart() {
            uni.showToast({
                title: '已加入购物车',
                icon: 'success'
            });
            this.hideSpecsModal();
        },

        addToShelf() {
            uni.showToast({
                title: '已加入货架',
                icon: 'success'
            });
        },

        goToSampleApply() {
            const productId = this.product.id;
            uni.navigateTo({
                url: '/pages/sample-apply/sample-apply?productId=' + productId
            });
        },

        goToShop() {
            uni.switchTab({
                url: '/pages/xuanpinindex/xuanpinindex'
            });
        },

        buyNow() {
            uni.showToast({
                title: '正在下单...',
                icon: 'loading'
            });
            setTimeout(() => {
                uni.showToast({
                    title: '功能开发中',
                    icon: 'none'
                });
            }, 1000);
        },

        goToShelf() {
            console.log('占位：函数 goToShelf 未声明');
        },

        closeSpecModal() {
            console.log('占位：函数 closeSpecModal 未声明');
        },

        changeQuantity() {
            console.log('占位：函数 changeQuantity 未声明');
        },

        confirmSpec() {
            console.log('占位：函数 confirmSpec 未声明');
        }
    }
};
</script>
<style>
.page {
    background: #f5f5f5;
    min-height: 100vh;
    padding-bottom: 120rpx;
}

/* 顶部导航栏 */
.nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20rpx;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10rpx);
    z-index: 100;
}

.nav-back,
.nav-share {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 50%;
}

.nav-icon {
    font-size: 32rpx;
    color: #fff;
}

.nav-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
}

/* 商品图片轮播 */
.gallery-section {
    position: relative;
}

.gallery-swiper {
    height: 750rpx;
}

.gallery-image {
    width: 100%;
    height: 100%;
}

/* 价格佣金区域 */
.price-section {
    background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.price-main {
    display: flex;
    align-items: baseline;
    margin-bottom: 20rpx;
}

.price-tag {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 22rpx;
    padding: 6rpx 16rpx;
    border-radius: 8rpx;
    margin-right: 16rpx;
}

.price-symbol {
    font-size: 36rpx;
    color: #ff4757;
    font-weight: bold;
}

.price-value {
    font-size: 56rpx;
    color: #ff4757;
    font-weight: bold;
}

.commission-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.commission-box {
    display: flex;
    align-items: center;
    background: rgba(255, 71, 87, 0.1);
    padding: 12rpx 20rpx;
    border-radius: 8rpx;
}

.commission-label {
    font-size: 24rpx;
    color: #ff4757;
    margin-right: 8rpx;
}

.commission-value {
    font-size: 28rpx;
    color: #ff4757;
    font-weight: bold;
    margin-right: 12rpx;
}

.commission-rate {
    font-size: 22rpx;
    color: #ff4757;
    background: rgba(255, 71, 87, 0.15);
    padding: 4rpx 12rpx;
    border-radius: 6rpx;
}

/* 商品信息 */
.info-section {
    background: #fff;
    padding: 24rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.title-row {
    margin-bottom: 16rpx;
}

.product-title {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
    line-height: 1.5;
}

.tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
}

.stat-tag {
    background: #f5f5f5;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #666;
    display: flex;
    align-items: center;
}

.stat-icon {
    color: #52c41a;
    margin-right: 4rpx;
}

/* 数据统计 */
.stats-section {
    background: #fff;
    display: flex;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.stat-item {
    flex: 1;
    text-align: center;
    border-right: 1rpx solid #f0f0f0;
}

.stat-item:last-child {
    border-right: none;
}

.stat-label {
    font-size: 24rpx;
    color: #999;
    display: block;
    margin-bottom: 8rpx;
}

.stat-value {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
}

.stat-value.highlight {
    color: #ff4757;
}

/* 样品政策 */
.sample-section {
    background: #fff;
    padding: 24rpx 30rpx;
    margin-top: 20rpx;
}

.sample-row {
    display: flex;
    align-items: center;
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
}

.sample-row:last-child {
    border-bottom: none;
}

.sample-label {
    width: 100rpx;
    font-size: 26rpx;
    color: #999;
}

.sample-value {
    flex: 1;
    font-size: 26rpx;
    color: #333;
}

.guarantee-tags {
    display: flex;
    align-items: center;
    flex: 1;
}

.guarantee-tag {
    background: linear-gradient(135deg, #ff9500, #ffb700);
    color: #fff;
    font-size: 22rpx;
    padding: 6rpx 14rpx;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    margin-right: 12rpx;
}

.guarantee-icon {
    margin-right: 4rpx;
}

.guarantee-text {
    font-size: 26rpx;
    color: #333;
}

.arrow {
    font-size: 28rpx;
    color: #ccc;
}

/* 团长信息 */
.tuanzhang-section {
    background: #fff;
    margin-top: 20rpx;
    padding: 24rpx 30rpx;
}

.tz-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.tz-info {
    display: flex;
    align-items: center;
    flex: 1;
}

.tz-avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin-right: 20rpx;
}

.tz-detail {
    flex: 1;
}

.tz-name {
    font-size: 30rpx;
    color: #333;
    font-weight: 600;
    display: block;
    margin-bottom: 8rpx;
}

.tz-desc {
    font-size: 24rpx;
    color: #999;
}

.tz-contact {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 26rpx;
    padding: 16rpx 32rpx;
    border-radius: 32rpx;
}

/* 推广数据 */
.data-section {
    background: #fff;
    margin-top: 20rpx;
    padding: 24rpx 30rpx;
}

.section-title {
    font-size: 30rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 24rpx;
}

.data-stats {
    display: flex;
    margin-bottom: 24rpx;
}

.data-item {
    flex: 1;
    text-align: center;
}

.data-value {
    font-size: 40rpx;
    color: #333;
    font-weight: bold;
    display: block;
    margin-bottom: 8rpx;
}

.data-label {
    font-size: 24rpx;
    color: #999;
}

.trend-chart {
    background: #fafafa;
    border-radius: 16rpx;
    padding: 40rpx;
}

.chart-placeholder {
    text-align: center;
    color: #999;
    font-size: 28rpx;
}

/* 商品评价 */
.review-section {
    background: #fff;
    margin-top: 20rpx;
    padding: 24rpx 30rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.view-all {
    font-size: 26rpx;
    color: #999;
}

.review-summary {
    display: flex;
    align-items: center;
}

.review-rate {
    margin-right: 40rpx;
}

.rate-value {
    font-size: 48rpx;
    color: #ff4757;
    font-weight: bold;
    display: block;
    margin-bottom: 8rpx;
}

.rate-stars {
    display: flex;
}

.star {
    width: 24rpx;
    height: 24rpx;
    background: #ffb700;
    clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
    margin-right: 6rpx;
}

.tag-check {
    color: #ff4757;
    font-weight: bold;
    margin-right: 8rpx;
}

.review-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    flex: 1;
}

.review-tag {
    background: #f5f5f5;
    padding: 12rpx 24rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    color: #666;
}

/* 底部安全区域 */
.safe-area {
    height: 40rpx;
}

/* 底部操作栏 */
.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    border-top: 1rpx solid #f0f0f0;
    z-index: 100;
}

.bottom-actions {
    display: flex;
    align-items: center;
    height: 100rpx;
    padding: 0 20rpx;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100rpx;
}

.action-icon {
    font-size: 40rpx;
    margin-bottom: 4rpx;
}

.action-text {
    font-size: 20rpx;
    color: #666;
}

.action-btn {
    color: #fff;
    font-size: 30rpx;
    font-weight: 600;
    padding: 24rpx 48rpx;
    border-radius: 40rpx;
    margin-left: 20rpx;
}

.action-btn.btn-add {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
}

.action-btn.btn-buy {
    background: linear-gradient(135deg, #ff9500, #ffb700);
}

/* 商品规格选择弹窗样式 */
.spec-modal {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

.spec-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
}

.spec-modal-content {
    background: #fff;
    border-radius: 20rpx 20rpx 0 0;
    position: relative;
    z-index: 1001;
    max-height: 80vh;
    overflow-y: auto;
}

.spec-modal-header {
    display: flex;
    justify-content: flex-end;
    padding: 20rpx 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.close-btn {
    font-size: 48rpx;
    color: #666;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f5f5f5;
}

.spec-product-info {
    display: flex;
    padding: 30rpx;
    border-bottom: 10rpx solid #f5f5f5;
}

.spec-product-image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
}

.spec-product-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.spec-product-title {
    font-size: 30rpx;
    color: #333;
    line-height: 1.5;
    margin-bottom: 16rpx;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.spec-product-price {
    display: flex;
    align-items: baseline;
}

.spec-price-symbol {
    font-size: 24rpx;
    color: #ff4757;
    font-weight: bold;
}

.spec-price-value {
    font-size: 44rpx;
    color: #ff4757;
    font-weight: bold;
    margin-right: 16rpx;
}

.spec-original-price {
    font-size: 28rpx;
    color: #999;
    text-decoration: line-through;
}

.spec-selection {
    padding: 30rpx;
    border-bottom: 10rpx solid #f5f5f5;
}

.spec-item {
    margin-bottom: 30rpx;
}

.spec-label {
    font-size: 28rpx;
    color: #333;
    font-weight: 600;
    margin-bottom: 20rpx;
    display: block;
}

.spec-options {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.spec-option {
    border: 2rpx solid #e0e0e0;
    padding: 16rpx 28rpx;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #333;
    background: #fff;
}

.spec-option.selected {
    border-color: #ff4757;
    background: rgba(255, 71, 87, 0.1);
    color: #ff4757;
}

.spec-option-text {
    display: block;
}

.spec-quantity {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.quantity-control {
    display: flex;
    align-items: center;
    border: 2rpx solid #e0e0e0;
    border-radius: 8rpx;
    overflow: hidden;
}

.quantity-btn {
    width: 80rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
}

.quantity-btn.disabled {
    opacity: 0.5;
}

.quantity-btn.minus.disabled {
    background: #f5f5f5;
}

.btn-text {
    font-size: 40rpx;
    color: #333;
}

.quantity-value {
    width: 120rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    color: #333;
    border-left: 2rpx solid #e0e0e0;
    border-right: 2rpx solid #e0e0e0;
}

.spec-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    background: #fff;
    border-top: 1rpx solid #f0f0f0;
    position: sticky;
    bottom: 0;
}

.spec-total {
    display: flex;
    align-items: baseline;
}

.total-label {
    font-size: 28rpx;
    color: #666;
    margin-right: 12rpx;
}

.total-price-symbol {
    font-size: 28rpx;
    color: #ff4757;
    font-weight: bold;
}

.total-price-value {
    font-size: 40rpx;
    color: #ff4757;
    font-weight: bold;
}

.spec-confirm-btn {
    background: linear-gradient(135deg, #ff4757, #ff6b81);
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    padding: 24rpx 56rpx;
    border-radius: 40rpx;
}

.confirm-btn-text {
    display: block;
}
</style>
