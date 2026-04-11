<template>
    <view class="sp-home-recommend">
        <!-- 标题栏 -->
        <view class="section-header">
            <view class="header-left">
                <text class="section-icon">🔥</text>
                <text class="section-title">{{ title }}</text>
            </view>
            <view class="header-right" @tap="goToProductList" v-if="showMore">
                <text class="more-text">查看更多</text>
                <text class="arrow">></text>
            </view>
        </view>

        <!-- 商品网格列表 -->
        <view class="product-grid" v-if="!loading && !error && products.length > 0">
            <view class="product-card" @tap="goToProduct" :data-id="item.productId" v-for="(item, index) in products" :key="index">
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
                </view>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading">
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 错误状态 -->
        <view class="error-state" v-if="error">
            <text class="error-text">{{ error }}</text>
            <text class="retry-btn" @tap="refresh">点击重试</text>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="!loading && !error && products.length === 0">
            <text class="empty-text">暂无推荐商品</text>
        </view>
    </view>
</template>

<script>
// 首页商品推荐组件
const { productApi } = require('../../utils/sp_api.js');
export default {
    data() {
        return {
            products: [],
            loading: true,
            error: null
        };
    },
    props: {
        title: {
            type: String,
            default: '热门推荐'
        },
        showMore: {
            type: Boolean,
            default: true
        },
        productType: {
            type: String,
            default: 'recommend' // recommend: 推荐, hot: 热销, new: 新品
        },

        limit: {
            type: Number,
            default: 6
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
                let products = [];
                switch (this.productType) {
                    case 'hot':
                        products = await productApi.getHotProducts(this.limit);
                        break;
                    case 'new':
                        products = await productApi.getNewProducts(this.limit);
                        break;
                    case 'recommend':
                    default:
                        products = await productApi.getRecommendProducts(this.limit);
                        break;
                }
                this.setData({
                    products: products || [],
                    loading: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载推荐商品失败:', error);
                this.setData({
                    error: '加载失败',
                    loading: false
                });
            }
        },

        goToProduct(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
            });
        },

        goToProductList() {
            const urlMap = {
                recommend: '/pages/Product_list_page/Product_list_page?type=recommend',
                hot: '/pages/Product_list_page/Product_list_page?type=hot',
                new: '/pages/Product_list_page/Product_list_page?type=new'
            };
            uni.switchTab({
                url: urlMap[this.productType] || '/pages/Product_list_page/Product_list_page'
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
.sp-home-recommend {
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

.product-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
}

.product-card {
    width: calc((100% - 16rpx) / 2);
    background: #ffffff;
    border-radius: 12rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}

.product-image-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
}

.product-image {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #f5f5f5;
}

.product-tag {
    position: absolute;
    top: 8rpx;
    left: 8rpx;
    display: flex;
    gap: 4rpx;
}

.product-tag text {
    padding: 2rpx 8rpx;
    font-size: 18rpx;
    color: #ffffff;
    background: linear-gradient(135deg, #ff6b6b 0%, #ff4757 100%);
    border-radius: 6rpx;
}

.product-info {
    padding: 12rpx;
}

.product-name {
    display: block;
    font-size: 28rpx;
    color: #333333;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 8rpx;
    height: 78rpx;
}

.product-price-row {
    display: flex;
    align-items: baseline;
    gap: 8rpx;
}

.product-price {
    font-size: 30rpx;
    font-weight: 600;
    color: #ff4757;
}

.product-original-price {
    font-size: 22rpx;
    color: #999999;
    text-decoration: line-through;
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
