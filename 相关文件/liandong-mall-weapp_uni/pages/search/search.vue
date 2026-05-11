<template>
    <view class="page">
        <!-- 搜索头部 -->
        <view class="search-header">
            <view class="search-input-wrap">
                <text class="search-icon">🔍</text>
                <input
                    class="search-input"
                    placeholder="搜索商品"
                    placeholder-class="placeholder"
                    @input="onSearchInput"
                    :value="searchKeyword"
                    confirm-type="search"
                    @confirm="onSearch"
                    auto-focus
                />
                <image
                    class="camera-btn"
                    src="https://www.lslnii.com/upload/NFSImgFile/appl/images/2025/12/20260319090524623_666695127685.png"
                    mode="aspectFit"
                    @tap="goToCamera"
                ></image>
                <view class="search-clear" v-if="searchKeyword" @tap="clearInput">
                    <text>×</text>
                </view>
            </view>
            <view class="search-btn" @tap="onSearch">搜索</view>
        </view>

        <!-- 搜索联想 -->
        <view class="suggestions-panel" v-if="showSuggestions && searchSuggestions.length > 0">
            <view class="suggestion-item" @tap="onSuggestionTap" :data-keyword="item" v-for="(item, index) in searchSuggestions" :key="index">
                <text class="suggestion-text">{{ item }}</text>
            </view>
        </view>

        <!-- 搜索历史 -->
        <view class="search-content" v-if="!searchKeyword && searchHistory.length > 0">
            <view class="section-header">
                <text class="section-title">最近搜索</text>
                <view class="clear-btn" @tap="clearHistory">
                    <text>删除</text>
                </view>
            </view>
            <view class="history-list">
                <view class="history-item" @tap="onHistoryTap" :data-keyword="item" v-for="(item, index) in searchHistory" :key="index">
                    <text>{{ item }}</text>
                </view>
            </view>
        </view>

        <!-- 热门搜索 -->
        <view class="search-content" v-if="!searchKeyword">
            <view class="section-header">
                <text class="section-title">热门推荐</text>
            </view>
            <view class="hot-grid">
                <view :class="'hot-item ' + (index < 3 ? 'highlight' : '')" @tap="onHotSearchTap" :data-keyword="item" v-for="(item, index) in hotSearches" :key="index">
                    <text class="hot-rank" v-if="index < 3">{{ index + 1 }}</text>

                    <text class="hot-text">{{ item }}</text>
                </view>
            </view>
        </view>

        <!-- 搜索结果 -->
        <view class="search-result" v-if="searchStatus === 'result'">
            <view class="result-tabs">
                <view :class="'result-tab ' + (currentSort === 'default' ? 'active' : '')" @tap="onSortChange" data-value="default">精选</view>
                <view :class="'result-tab ' + (currentSort === 'sales' ? 'active' : '')" @tap="onSortChange" data-value="sales">销量</view>
                <view :class="'result-tab ' + (currentSort === 'commission' ? 'active' : '')" @tap="onSortChange" data-value="commission">佣金</view>
                <view :class="'result-tab ' + (currentSort === 'price' ? 'active' : '')" @tap="onSortChange" data-value="price">价格</view>
            </view>

            <scroll-view class="result-list" scroll-y @scrolltolower="loadMore">
                <view class="product-item" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in products" :key="index">
                    <image class="product-img" :src="item.image" mode="aspectFill" />

                    <view class="product-info">
                        <view class="product-title">{{ item.title }}</view>
                        <view class="product-price">
                            <text class="price">¥{{ item.price }}</text>
                            <text class="original" v-if="item.originalPrice">¥{{ item.originalPrice }}</text>
                        </view>
                        <view class="product-bottom">
                            <text class="sales">销量 {{ item.sales }}</text>
                            <text class="commission">赚 ¥{{ item.commissionAmount }}</text>
                        </view>
                    </view>
                </view>

                <view class="loading-more" v-if="loading">
                    <text>加载中...</text>
                </view>
                <view class="no-more" v-if="!hasMore && products.length > 0">
                    <text>没有更多了</text>
                </view>
                <view class="no-result" v-if="products.length === 0 && !loading">
                    <text>未找到相关商品</text>
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script>
const productService = require('../../services/productService');
export default {
    data() {
        return {
            searchKeyword: '',
            searchStatus: 'home',
            // home-首页, result-搜索结果
            searchHistory: [],
            searchSuggestions: [],
            showSuggestions: false,
            products: [],
            page: 1,
            pageSize: 10,
            loading: false,
            hasMore: true,
            currentSort: 'default',
            hotSearches: ['洗衣液', '抽纸', '面膜', '口红', '零食', '手机', '奶粉', '耳机', '水果', '猪肉', '饮料', '床品']
        };
    },
    onLoad() {
        this.loadSearchHistory();
    },
    methods: {
        loadSearchHistory() {
            const history = uni.getStorageSync('searchHistory') || [];
            this.setData({
                searchHistory: history
            });
        },

        onSearchInput(e) {
            const keyword = e.detail.value;
            this.setData({
                searchKeyword: keyword,
                showSuggestions: keyword.length > 0
            });
            if (keyword.length > 0) {
                this.getSearchSuggestions(keyword);
            } else {
                this.setData({
                    searchSuggestions: []
                });
            }
        },

        getSearchSuggestions(keyword) {
            const allKeywords = [
                '洗衣液',
                '洗衣粉',
                '洗衣凝珠',
                '洗衣皂',
                '抽纸',
                '卷纸',
                '湿巾',
                '厨房纸',
                '面膜',
                '面霜',
                '乳液',
                '精华',
                '口红',
                '唇膏',
                '零食',
                '坚果',
                '饼干',
                '糖果',
                '巧克力',
                '饮料',
                '矿泉水',
                '果汁',
                '奶茶',
                '咖啡',
                '手机',
                '耳机',
                '充电宝',
                '数据线',
                '手机壳',
                '奶粉',
                '尿不湿',
                '奶瓶',
                '婴儿油',
                '儿童玩具',
                '猪肉',
                '牛肉',
                '鸡肉',
                '海鲜',
                '水果',
                '蔬菜',
                '床品',
                '四件套',
                '被子',
                '枕头',
                '凉席'
            ];
            const suggestions = allKeywords.filter((k) => k.includes(keyword)).slice(0, 6);
            this.setData({
                searchSuggestions: suggestions
            });
        },

        clearInput() {
            this.setData({
                searchKeyword: '',
                showSuggestions: false,
                searchSuggestions: []
            });
        },

        goToCamera() {
            uni.showActionSheet({
                itemList: ['拍照识别', '扫码识别'],
                success: (res) => {
                    if (res.tapIndex === 0) {
                        uni.chooseMedia({
                            count: 1,
                            mediaType: ['image'],
                            sourceType: ['camera'],
                            success: (photoRes) => {
                                const tempFilePath = photoRes.tempFiles[0].tempFilePath;
                                this.processImage(tempFilePath);
                            }
                        });
                    } else {
                        uni.scanCode({
                            success: (scanRes) => {
                                if (scanRes.result) {
                                    this.processScanResult(scanRes.result);
                                }
                            }
                        });
                    }
                }
            });
        },

        processImage(imagePath) {
            uni.showLoading({
                title: '识别中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                uni.showToast({
                    title: '图片已选择',
                    icon: 'none'
                });
            }, 1000);
        },

        processScanResult(result) {
            uni.showLoading({
                title: '识别中...'
            });
            setTimeout(() => {
                uni.hideLoading();
                this.setData({
                    searchKeyword: result
                });
                this.doSearch(result);
            }, 1000);
        },

        onSuggestionTap(e) {
            const keyword = e.currentTarget.dataset.keyword;
            this.setData({
                searchKeyword: keyword,
                showSuggestions: false,
                searchSuggestions: []
            });
            this.doSearch(keyword);
        },

        onHistoryTap(e) {
            const keyword = e.currentTarget.dataset.keyword;
            this.setData({
                searchKeyword: keyword
            });
            this.doSearch(keyword);
        },

        onHotSearchTap(e) {
            const keyword = e.currentTarget.dataset.keyword;
            this.setData({
                searchKeyword: keyword
            });
            this.doSearch(keyword);
        },

        clearHistory() {
            uni.removeStorageSync('searchHistory');
            this.setData({
                searchHistory: []
            });
        },

        saveSearchHistory(keyword) {
            if (!keyword.trim()) {
                return;
            }
            let history = this.searchHistory;
            history = history.filter((item) => item !== keyword);
            history.unshift(keyword);
            history = history.slice(0, 10);
            this.setData({
                searchHistory: history
            });
            uni.setStorageSync('searchHistory', history);
        },

        onSearch() {
            const keyword = this.searchKeyword.trim();
            if (!keyword) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none'
                });
                return;
            }
            this.doSearch(keyword);
        },

        async doSearch(keyword, sort = 'default') {
            if (!keyword) {
                return;
            }
            this.setData({
                searchStatus: 'result',
                showSuggestions: false,
                products: [],
                page: 1,
                loading: true
            });
            this.saveSearchHistory(keyword);
            try {
                const res = await productService.searchProducts(keyword, {
                    page: 1,
                    pageSize: this.pageSize,
                    sort: sort
                });
                if (res.code === 200) {
                    const products = res.data.list.map((item) => ({
                        id: item.id,
                        image: item.image,
                        title: item.name,
                        price: item.price.toString(),
                        originalPrice: item.originalPrice ? item.originalPrice.toString() : '',
                        commissionRate: item.commissionRate,
                        commissionAmount: item.commissionAmount ? item.commissionAmount.toString() : '0',
                        sales: item.sales || 0
                    }));
                    this.setData({
                        products: products,
                        page: 2,
                        hasMore: products.length === this.pageSize,
                        loading: false,
                        currentSort: sort
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('搜索失败:', error);
                uni.showToast({
                    title: '搜索失败',
                    icon: 'none'
                });
                this.setData({
                    loading: false
                });
            }
        },

        async loadMore() {
            if (this.loading || !this.hasMore) {
                return;
            }
            const keyword = this.searchKeyword;
            if (!keyword) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                const res = await productService.searchProducts(keyword, {
                    page: this.page,
                    pageSize: this.pageSize,
                    sort: this.currentSort
                });
                if (res.code === 200) {
                    const newProducts = res.data.list.map((item) => ({
                        id: item.id,
                        image: item.image,
                        title: item.name,
                        price: item.price.toString(),
                        originalPrice: item.originalPrice ? item.originalPrice.toString() : '',
                        commissionRate: item.commissionRate,
                        commissionAmount: item.commissionAmount ? item.commissionAmount.toString() : '0',
                        sales: item.sales || 0
                    }));
                    this.setData({
                        products: [...this.products, ...newProducts],
                        page: this.page + 1,
                        hasMore: newProducts.length === this.pageSize,
                        loading: false
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载更多失败:', error);
                this.setData({
                    loading: false
                });
            }
        },

        onSortChange(e) {
            const sort = e.currentTarget.dataset.value;
            this.setData({
                currentSort: sort
            });
            this.doSearch(this.searchKeyword, sort);
        },

        goToDetail(e) {
            const productId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: '/pages/product-detail/product-detail?id=' + productId
            });
        }
    }
};
</script>
<style>
.page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 搜索头部 */
.search-header {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.camera-btn {
    width: 56rpx;
    height: 56rpx;
    margin-left: 16rpx;
}

.search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 40rpx;
    padding: 16rpx 24rpx;
    margin-right: 20rpx;
}

.search-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.placeholder {
    color: #999;
}

.search-clear {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ccc;
    border-radius: 50%;
}

.search-clear text {
    color: #fff;
    font-size: 24rpx;
    line-height: 1;
}

.search-btn {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

/* 搜索联想 */
.suggestions-panel {
    background-color: #fff;
    padding: 0 30rpx;
}

.suggestion-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
    font-size: 28rpx;
    color: #333;
}

/* 搜索内容区域 */
.search-content {
    padding: 30rpx;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
}

.clear-btn text {
    font-size: 26rpx;
    color: #999;
}

/* 历史搜索 */
.history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.history-item {
    padding: 16rpx 32rpx;
    background-color: #fff;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;
}

/* 热门搜索 */
.hot-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.hot-item {
    display: flex;
    align-items: center;
    padding: 16rpx 32rpx;
    background-color: #fff;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;
}

.hot-item.highlight {
    background-color: #fff5f0;
    color: #ff5000;
}

.hot-rank {
    width: 32rpx;
    height: 32rpx;
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    color: #fff;
    font-size: 22rpx;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8rpx;
}

.hot-text {
    color: inherit;
}

/* 搜索结果 */
.search-result {
    height: calc(100vh - 120rpx);
    display: flex;
    flex-direction: column;
}

.result-tabs {
    display: flex;
    background-color: #fff;
    padding: 20rpx 0;
    position: sticky;
    top: 120rpx;
    z-index: 99;
}

.result-tab {
    flex: 1;
    text-align: center;
    font-size: 28rpx;
    color: #666;
    position: relative;
}

.result-tab.active {
    color: #ff5000;
    font-weight: 600;
}

.result-tab.active::after {
    content: '';
    position: absolute;
    bottom: -20rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 6rpx;
    background: linear-gradient(135deg, #ff5000, #ff7b00);
    border-radius: 3rpx;
}

.result-list {
    flex: 1;
    padding: 20rpx;
}

.product-item {
    display: flex;
    background-color: #fff;
    border-radius: 16rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
}

.product-img {
    width: 240rpx;
    height: 240rpx;
    background-color: #f5f5f5;
}

.product-info {
    flex: 1;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-title {
    font-size: 28rpx;
    color: #333;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-price {
    display: flex;
    align-items: baseline;
    margin-top: 10rpx;
}

.price {
    font-size: 32rpx;
    color: #ff5000;
    font-weight: 600;
}

.original {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
    margin-left: 12rpx;
}

.product-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10rpx;
}

.sales {
    font-size: 22rpx;
    color: #999;
}

.commission {
    font-size: 22rpx;
    color: #ff5000;
}

.loading-more,
.no-more,
.no-result {
    text-align: center;
    padding: 30rpx;
    font-size: 24rpx;
    color: #999;
}
</style>
