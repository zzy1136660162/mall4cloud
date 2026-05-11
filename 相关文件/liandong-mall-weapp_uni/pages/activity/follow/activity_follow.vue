<template>
    <!-- pages/activity/follow/activity_follow.wxml -->
    <view class="page">
        <view class="header">
            <view class="nav-bar">
                <view class="back-btn" @tap="goBack">
                    <text class="back-icon">←</text>
                </view>
                <text class="page-title">{{ title }}</text>
            </view>
        </view>

        <view class="activity-banner">
            <image class="banner-bg" src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260313142240238_666195763220.png" mode="aspectFill" />
            <view class="banner-content">
                <text class="banner-title">同行跟选</text>
                <text class="banner-desc">精选同行热销商品，跟卖更省心</text>
            </view>
        </view>

        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <image class="product-image" :src="item.image" mode="aspectFill" />

                <view class="product-info">
                    <view class="product-title">{{ item.name }}</view>
                    <view class="product-tags">
                        <text class="tag follow">跟选</text>
                        <text class="tag">{{ item.commissionRate }}%佣</text>
                    </view>
                    <view class="product-price">
                        <text class="price">¥{{ item.price }}</text>
                        <text class="sales">{{ item.sales }}</text>
                    </view>
                    <view class="commission-info">
                        <text class="commission">赚¥{{ item.commissionAmount }}</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="load-more" v-if="loading">
            <text>加载中...</text>
        </view>
        <view class="no-more" v-if="!hasMore && products.length > 0">
            <text>没有更多了</text>
        </view>
        <view class="empty" v-if="!loading && products.length === 0">
            <text>暂无商品</text>
        </view>
    </view>
</template>

<script>
// pages/activity/follow/activity_follow.js
const productService = require('../../../services/productService.js');
export default {
    data() {
        return {
            products: [],
            page: 1,
            pageSize: 10,
            loading: false,
            hasMore: true,
            title: '同行跟选'
        };
    },
    onLoad(options) {
        this.loadProducts();
    },
    onReachBottom() {
        this.loadProducts();
    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true,
            products: []
        });
        this.loadProducts().then(() => {
            uni.stopPullDownRefresh();
        });
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
                const res = await productService.getActivityProducts('follow', this.page, this.pageSize);
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
            }
        },

        goToProductDetail(e) {
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + productId
            });
        },

        goBack() {
            uni.navigateBack();
        }
    }
};
</script>
<style>
/* pages/activity/follow/activity_follow.wxss */
</style>
