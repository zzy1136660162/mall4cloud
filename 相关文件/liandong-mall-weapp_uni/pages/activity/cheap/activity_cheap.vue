<template>
    <view class="activity-container">
        <!-- 活动头部 -->
        <view class="activity-header">
            <view class="back-btn" @tap="goBack">
                <text class="iconfont icon-arrow-left"></text>
            </view>
            <text class="header-title">低价好卖</text>
        </view>

        <!-- 活动Banner -->
        <view class="activity-banner">
            <image class="banner-bg" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142240238_666195763220.png" mode="aspectFill" />
            <view class="banner-content">
                <text class="banner-title">低价好卖</text>
                <text class="banner-desc">50元以下超值商品，低价高佣好出单</text>
            </view>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <image class="product-image" :src="item.image" mode="aspectFill" />

                <view class="product-info">
                    <view class="product-title">{{ item.name }}</view>
                    <view class="product-tags">
                        <text class="tag cheap">低价</text>
                        <text class="tag">{{ item.commissionRate }}%佣</text>
                    </view>
                    <view class="product-price">
                        <text class="price">¥{{ item.price }}</text>
                        <text class="sales">{{ item.sales }}</text>
                    </view>
                    <view class="commission-info">
                        <text class="commission">赚¥{{ item.commission }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-status" v-if="loading">
            <text>加载中...</text>
        </view>
        <view class="loading-status" v-if="!hasMore && products.length > 0">
            <text>没有更多商品了</text>
        </view>
        <view class="empty-status" v-if="!loading && products.length === 0">
            <text>暂无商品</text>
        </view>
    </view>
</template>

<script>
const productService = require('../../../services/productService');
export default {
    data() {
        return {
            products: [],
            page: 1,
            pageSize: 10,
            loading: false,
            hasMore: true,
            title: '低价好卖'
        };
    },
    onLoad(options) {
        this.loadProducts();
    },
    onPullDownRefresh() {
        this.setData(
            {
                page: 1,
                products: [],
                hasMore: true
            },
            () => {
                this.loadProducts();
            }
        );
    },
    onReachBottom() {
        if (this.hasMore && !this.loading) {
            this.loadProducts();
        }
    },
    methods: {
        async loadProducts() {
            if (this.loading || !this.hasMore) {
                return;
            }
            this.setData({
                loading: true
            });
            uni.showLoading({
                title: '加载中...'
            });
            try {
                const res = await productService.getActivityProducts('cheap', this.page, this.pageSize);
                uni.hideLoading();
                if (res && res.code === 200 && res.data) {
                    const newProducts = res.data.products || [];
                    this.setData({
                        products: this.page === 1 ? newProducts : [...this.products, ...newProducts],
                        hasMore: newProducts.length >= this.pageSize,
                        page: this.page + 1
                    });
                }
            } catch (err) {
                console.log('CatchClause', err);
                console.log('CatchClause', err);
                uni.hideLoading();
                console.error('加载商品失败:', err);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            } finally {
                this.setData({
                    loading: false
                });
                uni.stopPullDownRefresh();
            }
        },

        goToProductDetail(e) {
            const id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/product/detail/detail?id=${id}`
            });
        },

        goBack() {
            uni.navigateBack();
        }
    }
};
</script>
<style>
/* pages/activity/cheap/activity_cheap.wxss */
</style>
