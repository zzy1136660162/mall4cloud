<template>
    <view class="sp-taobao-search">
        <!-- 搜索头部 -->
        <view class="search-header">
            <view :class="'search-input-wrap ' + (isFocus ? 'focus' : '')">
                <view class="search-icon-wrap">
                    <text class="icon">🔍</text>
                </view>
                <input
                    class="search-input"
                    type="text"
                    :value="searchKey"
                    :placeholder="placeholder"
                    placeholder-class="placeholder"
                    confirm-type="search"
                    @input="onInput"
                    @focus="onFocus"
                    @blur="onBlur"
                    @confirm="onConfirm"
                />
                <view class="clear-btn" v-if="searchKey" @tap="onClear">
                    <text class="clear-icon">✕</text>
                </view>
            </view>
            <view class="cancel-btn" @tap="onCancel">取消</view>
        </view>

        <!-- 搜索建议列表 -->
        <view class="suggestions-wrap" v-if="showSuggestions">
            <!-- 加载中 -->
            <view class="loading-wrap" v-if="searching">
                <text class="loading-text">搜索中...</text>
            </view>

            <!-- 建议列表 -->
            <view class="suggestion-list" v-if="!searching && suggestions.length > 0">
                <view
                    class="suggestion-item"
                    @tap="onSuggestionTap"
                    :data-id="item.productId || item.id"
                    :data-name="item.productName || item.name"
                    v-for="(item, index) in suggestions"
                    :key="index"
                >
                    <view class="suggestion-left">
                        <text class="suggestion-icon">🔍</text>
                        <text class="suggestion-name">{{ item.productName || item.name }}</text>
                    </view>

                    <text class="suggestion-price">¥{{ item.memberPrice || item.price }}</text>
                </view>
            </view>

            <!-- 空结果 -->
            <view class="empty-wrap" v-if="!searching && suggestions.length === 0 && searchKey">
                <text class="empty-text">未找到相关商品</text>
            </view>
        </view>

        <!-- 搜索页面（历史+热门） -->
        <view class="search-page" v-if="showSearchPage && !searchKey">
            <!-- 历史搜索 -->
            <view class="history-wrap" v-if="showHistory && historyList.length > 0">
                <view class="section-header">
                    <text class="section-title">搜索历史</text>
                    <view class="clear-btn" @tap="onClearHistory">
                        <text class="clear-text">清空</text>
                    </view>
                </view>
                <view class="history-list">
                    <view class="history-item" @tap="onHistoryTap" :data-keyword="item" v-for="(item, index) in historyList" :key="index">
                        <text>{{ item }}</text>

                        <view class="delete-btn" @tap.stop.prevent="onDeleteHistory" :data-keyword="item">
                            <text>✕</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 热门搜索 -->
            <view class="hot-wrap" v-if="showHot">
                <view class="section-header">
                    <text class="section-title">🔥 热门搜索</text>
                </view>
                <view class="hot-list">
                    <view class="hot-item" @tap="onHotTap" :data-keyword="item" v-for="(item, index) in hotList" :key="index">
                        <text>{{ item }}</text>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-wrap" v-if="(!showHistory || historyList.length === 0) && !showHot">
                <text class="empty-text">暂无搜索记录</text>
            </view>
        </view>
    </view>
</template>

<script>
// 商品商城搜索组件 - 淘宝风格
const { productApi } = require('../../utils/sp_api.js');
export default {
    data() {
        return {
            searchKey: '',
            suggestions: [],
            showSuggestions: false,
            showSearchPage: false,
            historyList: [],
            hotList: [],
            searching: false,
            isFocus: false
        };
    },
    props: {
        placeholder: {
            type: String,
            default: '搜索商品'
        },
        showHistory: {
            type: Boolean,
            default: true
        },
        showHot: {
            type: Boolean,
            default: true
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        attached() {
            this.loadHistory();
            this.loadHot();
        },

        // 防抖搜索
        debounce: function (func, wait = 300) {
            let timeout = null;
            return function (...args) {
                if (timeout) {
                    clearTimeout(timeout);
                }
                timeout = setTimeout(() => {
                    func.apply(this, args);
                }, wait);
            };
        },

        // 输入时触发
        onInput: function (e) {
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

            // 防抖搜索
            this.debounceSearch(value);
        },

        // 执行搜索
        debounceSearch: function debounceSearch(value) {
            this.setData({
                showSuggestions: true,
                searching: true
            });
            productApi
                .searchProducts(value.trim(), 1, 10)
                .then((res) => {
                    const list = res.list || [];
                    this.setData({
                        suggestions: list,
                        searching: false
                    });
                })
                .catch((err) => {
                    console.error('搜索失败:', err);
                    this.setData({
                        suggestions: [],
                        searching: false
                    });
                });
        },

        // 获取焦点
        onFocus: function (e) {
            this.setData({
                isFocus: true
            });
            if (this.searchKey.trim()) {
                this.setData({
                    showSuggestions: true
                });
            } else {
                this.setData({
                    showSearchPage: true
                });
            }
        },

        // 失去焦点
        onBlur: function () {
            // 延迟关闭，给点击事件留出时间
            setTimeout(() => {
                this.setData({
                    isFocus: false
                });
            }, 200);
        },

        // 点击取消
        onCancel: function () {
            this.setData({
                searchKey: '',
                suggestions: [],
                showSuggestions: false,
                showSearchPage: false
            });
            this.$emit('cancel');
        },

        // 点击清除
        onClear: function () {
            this.setData({
                searchKey: '',
                suggestions: [],
                showSuggestions: false
            });
        },

        // 确认搜索
        onConfirm: function (e) {
            const keyword = e.detail.value || this.searchKey;
            if (!keyword.trim()) {
                uni.showToast({
                    title: '请输入关键词',
                    icon: 'none'
                });
                return;
            }
            this.saveHistory(keyword);
            this.setData({
                showSuggestions: false,
                showSearchPage: false
            });
            this.$emit('search', {
                detail: {
                    keyword: keyword.trim()
                }
            });
        },

        // 点击搜索按钮
        onSearchTap: function () {
            const keyword = this.searchKey.trim();
            if (!keyword) {
                uni.showToast({
                    title: '请输入关键词',
                    icon: 'none'
                });
                return;
            }
            this.saveHistory(keyword);
            this.setData({
                showSuggestions: false,
                showSearchPage: false
            });
            this.$emit('search', {
                detail: {
                    keyword
                }
            });
        },

        // 点击搜索建议
        onSuggestionTap: function (e) {
            const { id, name } = e.currentTarget.dataset;
            const keyword = name || this.searchKey;
            this.saveHistory(keyword);
            this.setData({
                showSuggestions: false,
                showSearchPage: false
            });
            this.$emit('select', {
                detail: {
                    id,
                    keyword
                }
            });

            // 跳转到商品详情
            uni.navigateTo({
                url: `/pages/sp_Details/sp_Details?id=${id}`
            });
        },

        // 点击热门搜索
        onHotTap: function (e) {
            const { keyword } = e.currentTarget.dataset;
            this.setData({
                searchKey: keyword,
                showSearchPage: false
            });
            this.saveHistory(keyword);
            this.$emit('search', {
                detail: {
                    keyword
                }
            });
        },

        // 点击历史记录
        onHistoryTap: function (e) {
            const { keyword } = e.currentTarget.dataset;
            this.setData({
                searchKey: keyword,
                showSearchPage: false
            });
            this.$emit('search', {
                detail: {
                    keyword
                }
            });
        },

        // 删除单条历史
        onDeleteHistory: function (e) {
            const { keyword } = e.currentTarget.dataset;
            let list = this.historyList;
            list = list.filter((item) => item !== keyword);
            this.setData({
                historyList: list
            });
            uni.setStorageSync('sp_search_history', list);
        },

        // 清空历史
        onClearHistory: function () {
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

        // 保存到历史
        saveHistory: function (keyword) {
            if (!keyword.trim()) {
                return;
            }
            let list = this.historyList;
            // 去重
            list = list.filter((item) => item !== keyword);
            // 头部插入
            list.unshift(keyword);
            // 限制数量
            if (list.length > 20) {
                list = list.slice(0, 20);
            }
            this.setData({
                historyList: list
            });
            uni.setStorageSync('sp_search_history', list);
        },

        // 加载历史
        loadHistory: function () {
            const list = uni.getStorageSync('sp_search_history') || [];
            this.setData({
                historyList: list
            });
        },

        // 加载热门搜索
        loadHot: function () {
            const hotList = ['精华液', '面霜', '口红', '洁面乳', '防晒', '面膜', '眼霜', '化妆水', '气垫', '睫毛膏', '燕麦片', '洗衣液', '纸巾', '洗发水', '沐浴露'];
            this.setData({
                hotList
            });
        },

        // 关闭搜索页
        closeSearchPage: function () {
            this.setData({
                showSearchPage: false,
                showSuggestions: false
            });
        }
    },
    created: function () {}
};
</script>
<style>
/* 淘宝风格搜索组件 */
.sp-taobao-search {
    width: 100%;
    background-color: #f5f5f5;
    min-height: 100vh;
}

/* 搜索头部 */
.search-header {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 999;
}

.search-input-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    padding: 0 24rpx;
    margin-right: 20rpx;
    transition: all 0.3s;
}

.search-input-wrap.focus {
    background-color: #fff;
    border: 2rpx solid #ff5000;
    box-shadow: 0 4rpx 12rpx rgba(255, 80, 0, 0.1);
}

.search-icon-wrap {
    display: flex;
    align-items: center;
    margin-right: 12rpx;
}

.icon {
    font-size: 32rpx;
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
    width: 40rpx;
    height: 40rpx;
    background-color: #ccc;
    border-radius: 50%;
    margin-left: 12rpx;
}

.clear-icon {
    font-size: 20rpx;
    color: #fff;
}

.cancel-btn {
    font-size: 28rpx;
    color: #333;
    padding: 10rpx 0;
}

/* 搜索建议 */
.suggestions-wrap {
    background-color: #fff;
    max-height: 800rpx;
    overflow-y: auto;
}

.loading-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40rpx;
}

.loading-text {
    font-size: 26rpx;
    color: #999;
}

.suggestion-list {
    padding: 0;
}

.suggestion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 24rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.suggestion-left {
    display: flex;
    align-items: center;
    flex: 1;
    overflow: hidden;
}

.suggestion-icon {
    margin-right: 16rpx;
    font-size: 28rpx;
    opacity: 0.6;
}

.suggestion-name {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.suggestion-price {
    font-size: 26rpx;
    color: #ff5000;
    margin-left: 20rpx;
    font-weight: 500;
}

.empty-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
}

/* 搜索页面 */
.search-page {
    background-color: #fff;
    padding: 0 24rpx;
}

.history-wrap,
.hot-wrap {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f5f5f5;
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
    position: relative;
    max-width: 200rpx;
}

.history-item text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.delete-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    margin-left: 8rpx;
    opacity: 0.6;
}

.delete-btn text {
    font-size: 18rpx;
}

.clear-text {
    font-size: 24rpx;
    color: #999;
}

/* 热门搜索 */
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
</style>
