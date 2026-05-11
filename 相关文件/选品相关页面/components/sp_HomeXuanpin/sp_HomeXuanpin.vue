<template>
    <view class="sp-home-xuanpin">
        <view class="section-header">
            <view class="header-left">
                <text class="section-icon">📦</text>
                <text class="section-title">{{ title }}</text>
            </view>
            <view class="header-right" @tap="goToXuanpin" v-if="showMore">
                <text class="more-text">查看更多</text>
                <text class="arrow">></text>
            </view>
        </view>

        <view class="product-list" v-if="!loading && !error && products.length > 0">
            <view class="product-item" @tap="goToProduct" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <image class="product-image" :src="item.image" mode="aspectFill" :lazy-load="true" />

                <view class="product-content">
                    <text class="product-name">{{ item.title }}</text>
                    <view class="product-tags" v-if="item.tags && item.tags.length > 0">
                        <text class="tag" v-for="(tag, index1) in item.tags" :key="index1">{{ tag }}</text>
                    </view>
                    <view class="product-bottom">
                        <view class="price-info">
                            <text class="product-price">¥{{ item.price }}</text>
                            <text class="product-original-price" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        </view>
                        <view class="commission-info" v-if="item.commissionRate">
                            <text class="commission-text">佣金 {{ item.commissionRate }}%</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <view class="loading-state" v-if="loading">
            <text class="loading-text">加载中...</text>
        </view>

        <view class="error-state" v-if="error">
            <text class="error-text">{{ error }}</text>
            <text class="retry-btn" @tap="refresh">点击重试</text>
        </view>

        <view class="empty-state" v-if="!loading && !error && products.length === 0">
            <text class="empty-text">暂无选品商品</text>
        </view>
    </view>
</template>

<script>
const productService = require('../../services/productService');
export default {
    data() {
        return {
            products: [],
            loading: true,
            error: null,
            tag: ''
        };
    },
    props: {
        title: {
            type: String,
            default: '选品推荐'
        },
        showMore: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 3
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        handlePageShow() {
            if (!this.products.length) {
                this.loadProducts();
            }
        },

        attached() {
            this.loadProducts();
        },

        async loadProducts() {
            this.setData({
                loading: true,
                error: null
            });
            try {
                const res = await productService.getProducts({
                    page: 1,
                    pageSize: this.limit
                });
                const list = res.list || [];
                const products = list.map((item) => ({
                    id: item.id,
                    image: item.image,
                    title: item.name || item.title,
                    price: typeof item.price === 'number' ? item.price.toString() : item.price,
                    originalPrice: item.originalPrice ? item.originalPrice.toString() : '',
                    commissionRate: item.commissionRate || 0,
                    commissionAmount: item.commissionAmount,
                    tags: item.tags || []
                }));
                this.setData({
                    products: products || [],
                    loading: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载选品商品失败:', error);
                this.setData({
                    error: '加载失败',
                    loading: false
                });
            }
        },

        goToProduct(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/product-detail/product-detail?id=${id}`
            });
        },

        goToXuanpin() {
            uni.switchTab({
                url: '/pages/xuanpinindex/xuanpinindex'
            });
        },

        refresh() {
            this.loadProducts();
        }
    },
    created: function () {}
};
</script>
<style>
.sp-home-xuanpin {
    background: #ffffff;
    padding: 24rpx;
    margin-bottom: 20rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.section-icon {
    font-size: 44rpx;
}

.section-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333333;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 10rpx 18rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
}

.more-text {
    font-size: 28rpx;
    color: #666666;
}

.arrow {
    font-size: 28rpx;
    color: #999999;
}

.product-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.product-item {
    display: flex;
    background: #fafafa;
    border-radius: 12rpx;
    overflow: hidden;
}

.product-image {
    width: 200rpx;
    height: 200rpx;
    background: #f5f5f5;
    flex-shrink: 0;
}

.product-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 16rpx;
}

.product-name {
    font-size: 28rpx;
    color: #333333;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.product-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
    margin-top: 8rpx;
}

.tag {
    padding: 4rpx 12rpx;
    font-size: 20rpx;
    color: #ff6b6b;
    background: #fff0f0;
    border-radius: 4rpx;
}

.product-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
}

.price-info {
    display: flex;
    align-items: baseline;
    gap: 8rpx;
}

.product-price {
    font-size: 32rpx;
    font-weight: 600;
    color: #ff4757;
}

.product-original-price {
    font-size: 22rpx;
    color: #999999;
    text-decoration: line-through;
}

.commission-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8rpx 16rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 20rpx;
    height: 48rpx;
    box-sizing: border-box;
}

.commission-text {
    font-size: 22rpx;
    color: #ffffff;
    font-weight: 500;
    line-height: 1;
}

.loading-state,
.error-state,
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60rpx 0;
    gap: 20rpx;
}

.loading-text,
.empty-text {
    font-size: 26rpx;
    color: #999999;
}

.error-text {
    font-size: 26rpx;
    color: #ff4757;
}

.retry-btn {
    padding: 12rpx 32rpx;
    font-size: 24rpx;
    color: #ffffff;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 24rpx;
}
</style>
