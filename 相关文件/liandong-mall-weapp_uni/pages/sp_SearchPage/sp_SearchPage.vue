<template>
    <view class="sp-search-page">
        <!-- 搜索头部 -->
        <view class="search-header">
            <view class="search-box">
                <icon type="search" size="16" color="#999" class="search-icon" />
                <input
                    class="search-input"
                    type="text"
                    :value="searchKey"
                    placeholder="搜索商品"
                    placeholder-class="placeholder"
                    confirm-type="search"
                    @input="onInput"
                    @confirm="onConfirm"
                    :focus="true"
                />
                <view class="clear-btn" v-if="searchKey" @tap="onClear">
                    <icon type="clear" size="14" color="#999" />
                </view>
            </view>
            <view class="search-btn" @tap="onSearch">搜索</view>
        </view>

        <!-- 搜索建议 -->
        <view class="suggestions-wrap" v-if="showSuggestions">
            <view class="loading" v-if="searching">
                <text>搜索中...</text>
            </view>
            <view class="suggestion-list" v-if="!searching && suggestions.length > 0">
                <view
                    class="suggestion-item"
                    @tap="onSuggestionTap"
                    :data-id="item.productId || item.id"
                    :data-name="item.productName || item.name"
                    v-for="(item, index) in suggestions"
                    :key="index"
                >
                    <icon type="search" size="14" color="#999" class="item-icon" />

                    <text class="item-name">{{ item.productName || item.name }}</text>

                    <text class="item-price">¥{{ item.memberPrice || item.price }}</text>
                </view>
            </view>
            <view class="empty" v-if="!searching && suggestions.length === 0 && searchKey">
                <text>未找到相关商品</text>
            </view>
        </view>

        <!-- 搜索内容区 -->
        <view class="search-content" v-if="!showSuggestions">
            <!-- 历史搜索 -->
            <view class="history-section" v-if="historyList.length > 0">
                <view class="section-header">
                    <text class="section-title">搜索历史</text>
                    <view class="clear-btn" @tap="onClearHistory">
                        <text>清空</text>
                    </view>
                </view>
                <view class="history-list">
                    <view class="history-item" @tap="onHistoryTap" :data-keyword="item" v-for="(item, index) in historyList" :key="index">
                        <text>{{ item }}</text>

                        <view class="delete-icon" @tap.stop.prevent="onDeleteHistory" :data-keyword="item">
                            <icon type="clear" size="10" color="#999" />
                        </view>
                    </view>
                </view>
            </view>

            <!-- 热门搜索 -->
            <view class="hot-section">
                <view class="section-header">
                    <text class="section-title">热门搜索</text>
                </view>
                <view class="hot-list">
                    <view :class="'hot-item ' + (item.hot ? 'hot' : '')" @tap="onHotTap" :data-keyword="item.keyword" v-for="(item, index) in hotList" :key="index">
                        <text>{{ item.keyword }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// 搜索页面 - sp_SearchPage
const { productApi } = require('../../utils/sp_api.js');
export default {
    data() {
        return {
            searchKey: '',
            historyList: [],
            hotList: [],
            suggestions: [],
            showSuggestions: false,
            searching: false
        };
    },
    onLoad() {
        this.loadHistory();
        this.loadHot();
    },
    methods: {
        // 加载历史记录
        loadHistory() {
            const history = uni.getStorageSync('sp_search_history') || [];
            this.setData({
                historyList: history
            });
        },

        // 加载热门搜索
        loadHot() {
            const hotList = [
                {
                    keyword: '精华液',
                    hot: true
                },
                {
                    keyword: '面霜',
                    hot: true
                },
                {
                    keyword: '口红',
                    hot: true
                },
                {
                    keyword: '洁面乳',
                    hot: true
                },
                {
                    keyword: '防晒',
                    hot: true
                },
                {
                    keyword: '面膜',
                    hot: true
                },
                {
                    keyword: '眼霜',
                    hot: true
                },
                {
                    keyword: '化妆水',
                    hot: true
                },
                {
                    keyword: '气垫',
                    hot: true
                },
                {
                    keyword: '燕麦片',
                    hot: false
                },
                {
                    keyword: '洗衣液',
                    hot: false
                },
                {
                    keyword: '纸巾',
                    hot: false
                },
                {
                    keyword: '洗发水',
                    hot: false
                }
            ];
            this.setData({
                hotList
            });
        },

        // 输入框输入
        onInput(e) {
            const value = e.detail.value;
            this.setData({
                searchKey: value
            });
            if (!value.trim()) {
                this.setData({
                    suggestions: [],
                    showSuggestions: false
                });
                return;
            }

            // 防抖搜索建议
            clearTimeout(this.searchTimer);
            this.searchTimer = setTimeout(() => {
                this.loadSuggestions(value);
            }, 300);
        },

        // 加载搜索建议
        loadSuggestions(keyword) {
            if (!keyword.trim()) {
                return;
            }
            this.setData({
                searching: true
            });
            productApi
                .searchProducts(keyword.trim(), 1, 10)
                .then((res) => {
                    const list = res.list || [];
                    this.setData({
                        suggestions: list,
                        showSuggestions: true,
                        searching: false
                    });
                })
                .catch((err) => {
                    console.error('搜索建议失败:', err);
                    this.setData({
                        suggestions: [],
                        searching: false
                    });
                });
        },

        // 点击搜索按钮
        onSearch() {
            const keyword = this.searchKey.trim();
            if (!keyword) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none'
                });
                return;
            }
            this.saveHistory(keyword);
            this.navigateToResult(keyword);
        },

        // 键盘确认搜索
        onConfirm(e) {
            const keyword = e.detail.value.trim();
            if (!keyword) {
                uni.showToast({
                    title: '请输入搜索关键词',
                    icon: 'none'
                });
                return;
            }
            this.saveHistory(keyword);
            this.navigateToResult(keyword);
        },

        // 点击建议项
        onSuggestionTap(e) {
            const { id, name } = e.currentTarget.dataset;
            const keyword = name || this.searchKey;
            this.saveHistory(keyword);
            this.navigateToResult(keyword);
        },

        // 点击热门搜索
        onHotTap(e) {
            const { keyword } = e.currentTarget.dataset;
            this.setData({
                searchKey: keyword
            });
            this.saveHistory(keyword);
            this.navigateToResult(keyword);
        },

        // 点击历史记录
        onHistoryTap(e) {
            const { keyword } = e.currentTarget.dataset;
            this.setData({
                searchKey: keyword
            });
            this.navigateToResult(keyword);
        },

        // 删除单条历史
        onDeleteHistory(e) {
            const { keyword } = e.currentTarget.dataset;
            let list = this.historyList;
            list = list.filter((item) => item !== keyword);
            this.setData({
                historyList: list
            });
            uni.setStorageSync('sp_search_history', list);
        },

        // 清空历史
        onClearHistory() {
            uni.showModal({
                title: '提示',
                content: '确定清空搜索历史？',
                success: (res) => {
                    if (res.confirm) {
                        this.setData({
                            historyList: []
                        });
                        uni.removeStorageSync('sp_search_history');
                    }
                }
            });
        },

        // 保存搜索历史
        saveHistory(keyword) {
            if (!keyword.trim()) {
                return;
            }
            let list = this.historyList;
            list = list.filter((item) => item !== keyword);
            list.unshift(keyword);
            if (list.length > 20) {
                list = list.slice(0, 20);
            }
            this.setData({
                historyList: list
            });
            uni.setStorageSync('sp_search_history', list);
        },

        // 跳转到搜索结果
        navigateToResult(keyword) {
            uni.navigateTo({
                url: `/pages/sp_SearchResult/sp_SearchResult?keyword=${encodeURIComponent(keyword)}`
            });
        },

        onClear() {
            console.log('占位：函数 onClear 未声明');
        }
    }
};
</script>
<style>
.sp-search-page {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 搜索头部 */
.search-header {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.search-box {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 24rpx;
    margin-right: 20rpx;
}

.search-icon {
    margin-right: 12rpx;
}

.search-input {
    flex: 1;
    height: 72rpx;
    font-size: 28rpx;
    color: #333;
}

.placeholder {
    color: #999;
    font-size: 28rpx;
}

.clear-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36rpx;
    height: 36rpx;
    margin-left: 12rpx;
}

.search-btn {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    padding: 10rpx 0;
}

/* 搜索建议 */
.suggestions-wrap {
    background-color: #fff;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
    color: #999;
    font-size: 26rpx;
}

.suggestion-list {
    padding: 0;
}

.suggestion-item {
    display: flex;
    align-items: center;
    padding: 28rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.item-icon {
    margin-right: 16rpx;
}

.item-name {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.item-price {
    font-size: 26rpx;
    color: #ff5000;
    margin-left: 20rpx;
}

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    color: #999;
    font-size: 28rpx;
}

/* 搜索内容区 */
.search-content {
    padding: 24rpx;
}

/* 历史搜索 */
.history-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 24rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.section-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
}

.history-section .clear-btn text {
    font-size: 24rpx;
    color: #999;
}

.history-list {
    display: flex;
    flex-wrap: wrap;
}

.history-item {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    padding: 12rpx 20rpx;
    border-radius: 32rpx;
    margin-right: 20rpx;
    margin-bottom: 16rpx;
    font-size: 26rpx;
    color: #666;
    max-width: 200rpx;
}

.history-item text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 8rpx;
    opacity: 0.6;
}

/* 热门搜索 */
.hot-section {
    background-color: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
}

.hot-list {
    display: flex;
    flex-wrap: wrap;
}

.hot-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 140rpx;
    padding: 16rpx 24rpx;
    background: linear-gradient(135deg, #ff5000 0%, #ff8c00 100%);
    color: #fff;
    font-size: 26rpx;
    border-radius: 8rpx;
    margin-right: 16rpx;
    margin-bottom: 16rpx;
}

.hot-item text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hot-item.hot {
    background: linear-gradient(135deg, #ff5000 0%, #ff8c00 100%);
}
</style>
