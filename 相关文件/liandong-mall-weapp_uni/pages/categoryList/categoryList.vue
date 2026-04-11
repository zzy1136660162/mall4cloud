<template>
    <view class="category-list-page">
        <!-- 搜索栏 -->
        <view class="search-bar">
            <view class="search-input-box">
                <text class="search-icon">🔍</text>
                <input
                    class="search-input"
                    placeholder="搜索当前分类商品"
                    placeholder-class="placeholder"
                    :value="searchKeyword"
                    @input="onSearchInput"
                    confirm-type="search"
                    @confirm="onSearch"
                />
            </view>
            <text class="search-btn" @tap="onSearch">搜索</text>
        </view>

        <!-- 排序栏 -->
        <view class="sort-bar">
            <view :class="'sort-item ' + (sortType === 'rating' ? 'active' : '')" data-type="rating" @tap="onSortChange">
                <text class="sort-text">评价</text>
                <text class="sort-icon" v-if="sortType === 'rating'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</text>
                <text class="sort-icon" v-else>↕</text>
            </view>
            <view :class="'sort-item ' + (sortType === 'sales' ? 'active' : '')" data-type="sales" @tap="onSortChange">
                <text class="sort-text">销量</text>
                <text class="sort-icon" v-if="sortType === 'sales'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</text>
                <text class="sort-icon" v-else>↕</text>
            </view>
            <view :class="'sort-item ' + (sortType === 'price' ? 'active' : '')" data-type="price" @tap="onSortChange">
                <text class="sort-text">价格</text>
                <text class="sort-icon" v-if="sortType === 'price'">{{ sortOrder === 'asc' ? '↑' : '↓' }}</text>
                <text class="sort-icon" v-else>↕</text>
            </view>
            <view class="view-mode">
                <text class="view-icon">☰</text>
            </view>
        </view>

        <!-- 商品列表 -->
        <view class="product-list">
            <view class="product-item" @tap="goToProductDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                <image class="product-image" :src="item.image" mode="aspectFill" />

                <view class="product-info">
                    <text class="product-name">{{ item.name }}</text>
                    <text class="product-price">¥{{ item.price }}</text>
                </view>
            </view>
        </view>

        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading">
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 没有更多 -->
        <view class="no-more" v-if="!hasMore && products.length > 0">
            <text class="no-more-text">没有更多了</text>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="!loading && products.length === 0">
            <text class="empty-text">暂无商品</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            categoryId: '',
            categoryName: '',
            searchKeyword: '',
            sortType: '',
            sortOrder: '',
            products: [],
            loading: false,
            hasMore: true,
            page: 1,
            pageSize: 10
        };
    },
    onLoad(options) {
        const { categoryId, categoryName } = options;
        this.setData({
            categoryId,
            categoryName
        });
        if (categoryName) {
            uni.setNavigationBarTitle({
                title: categoryName
            });
        }
        this.loadProducts();
    },
    onReachBottom() {
        this.loadProducts();
    },
    methods: {
        onSearchInput(e) {
            this.setData({
                searchKeyword: e.detail.value
            });
        },

        onSearch() {
            this.setData({
                page: 1,
                products: []
            });
            this.loadProducts();
        },

        onSortChange(e) {
            const { type } = e.currentTarget.dataset;
            let { sortType, sortOrder } = this;
            if (sortType === type) {
                sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            } else {
                sortType = type;
                sortOrder = 'desc';
            }
            this.setData({
                sortType,
                sortOrder,
                page: 1,
                products: []
            });
            this.loadProducts();
        },

        async loadProducts() {
            if (this.loading || !this.hasMore) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                const result = await this.getCategoryProducts();
                if (result && result.products) {
                    this.setData({
                        products: [...this.products, ...result.products],
                        page: this.page + 1,
                        hasMore: result.products.length === this.pageSize,
                        loading: false
                    });
                } else {
                    this.setData({
                        loading: false,
                        hasMore: false
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                this.setData({
                    loading: false
                });
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            }
        },

        getCategoryProducts() {
            return new Promise((resolve, reject) => {
                uni.request({
                    url: 'http://localhost:5000/api/sp/category/products',
                    method: 'GET',
                    data: {
                        categoryId: this.categoryId,
                        keyword: this.searchKeyword,
                        sortType: this.sortType,
                        sortOrder: this.sortOrder,
                        page: this.page,
                        pageSize: this.pageSize
                    },
                    success: (res) => {
                        if (res.data.code === 200) {
                            resolve(res.data.data);
                        } else {
                            uni.showToast({
                                title: res.data.message || '获取商品失败',
                                icon: 'none'
                            });
                            reject(res.data);
                        }
                    },
                    fail: (err) => {
                        uni.showToast({
                            title: '网络请求失败',
                            icon: 'none'
                        });
                        reject(err);
                    }
                });
            });
        },

        goToProductDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
            });
        },

        goBack() {
            uni.navigateBack();
        }
    }
};
</script>
<style>
.category-list-page {
    min-height: 100vh;
    background: #f5f5f5;
}

/* 搜索栏 */
.search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    background: #ffffff;
    gap: 20rpx;
}

.search-input-box {
    flex: 1;
    display: flex;
    align-items: center;
    background: #f5f5f5;
    border-radius: 32rpx;
    padding: 16rpx 24rpx;
}

.search-icon {
    font-size: 28rpx;
    color: #999;
    margin-right: 12rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.placeholder {
    color: #999;
}

.search-btn {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

/* 排序栏 */
.sort-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 24rpx;
    background: #ffffff;
    border-bottom: 1rpx solid #f0f0f0;
}

.sort-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.sort-text {
    font-size: 28rpx;
    color: #666;
}

.sort-item.active .sort-text {
    color: #ff4757;
}

.sort-icon {
    font-size: 24rpx;
    color: #999;
}

.sort-item.active .sort-icon {
    color: #ff4757;
}

.view-mode {
    padding: 8rpx;
}

.view-icon {
    font-size: 32rpx;
    color: #666;
}

/* 商品列表 */
.product-list {
    display: flex;
    flex-wrap: wrap;
    padding: 20rpx;
    gap: 20rpx;
}

.product-item {
    width: calc((100% - 20rpx) / 2);
    background: #ffffff;
    border-radius: 16rpx;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 340rpx;
    background: #f8f8f8;
}

.product-info {
    padding: 16rpx;
}

.product-name {
    display: block;
    font-size: 26rpx;
    color: #333;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    margin-bottom: 12rpx;
    min-height: 72rpx;
}

.product-price {
    font-size: 32rpx;
    color: #ff4757;
    font-weight: 600;
}

/* 加载状态 */
.loading-state {
    display: flex;
    justify-content: center;
    padding: 40rpx 0;
}

.loading-text {
    font-size: 26rpx;
    color: #999;
}

/* 没有更多 */
.no-more {
    display: flex;
    justify-content: center;
    padding: 40rpx 0;
}

.no-more-text {
    font-size: 24rpx;
    color: #999;
}

/* 空状态 */
.empty-state {
    display: flex;
    justify-content: center;
    padding: 200rpx 0;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
}
</style>
