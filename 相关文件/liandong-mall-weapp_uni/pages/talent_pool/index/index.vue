<template>
    <view class="container">
        <!-- 搜索栏 -->
        <view class="search-bar">
            <view class="search-input-wrapper">
                <text class="search-icon">🔍</text>
                <input class="search-input" type="text" placeholder="搜索人才姓名、专长..." :value="searchKeyword" @confirm="onSearchConfirm" @input="onSearch" />
                <text class="clear-btn" v-if="searchKeyword" @tap="clearSearch">✕</text>
            </view>
        </view>

        <!-- 领域筛选 -->
        <view class="filter-bar">
            <scroll-view class="filter-scroll" :scroll-x="true">
                <view :class="'filter-item ' + (currentArea === '' ? 'active' : '')" @tap="filterByArea" data-area="">全部</view>
                <view :class="'filter-item ' + (currentArea === item ? 'active' : '')" @tap="filterByArea" :data-area="item" v-for="(item, index) in areas" :key="index">
                    {{ item }}
                </view>
            </scroll-view>
        </view>

        <!-- 人才列表 -->
        <view class="talent-list" v-if="talentList.length > 0">
            <view class="talent-card" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in talentList" :key="index">
                <view class="card-left">
                    <image class="talent-avatar" :src="item.avatar" mode="aspectFill"></image>
                </view>

                <view class="card-right">
                    <view class="card-header">
                        <text class="talent-name">{{ item.name }}</text>
                        <text class="talent-experience">{{ item.experienceYears }}年</text>
                    </view>
                    <view class="talent-title">{{ item.title }}</view>
                    <view class="talent-region" v-if="item.region">
                        <text class="region-icon">📍</text>
                        <text class="region-text">{{ item.region }}</text>
                    </view>
                    <view class="talent-tags">
                        <text class="tag" v-for="(tag, index1) in item.expertiseAreas" :key="index1">{{ tag }}</text>
                    </view>
                </view>

                <text class="arrow">></text>
            </view>

            <!-- 加载更多 -->
            <view class="load-more" v-if="hasMore">
                <text @tap="loadMore">点击加载更多</text>
            </view>
            <view class="no-more" v-else>
                <text>没有更多了</text>
            </view>
        </view>

        <!-- 空状态 -->
        <view class="empty-state" v-if="!loading && talentList.length === 0">
            <image class="empty-icon" src="/static/images/empty.png" mode="aspectFit" v-if="false"></image>
            <view class="empty-content">
                <text class="empty-title">暂无人才信息</text>
                <text class="empty-desc">敬请期待更多优秀人才加入</text>
            </view>
        </view>

        <!-- 加载中 -->
        <view class="loading-state" v-if="loading && talentList.length === 0">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            talentList: [],
            page: 1,
            pageSize: 10,
            hasMore: true,
            loading: false,
            keyword: '',
            currentArea: '',
            areas: ['全部', '化妆品研发', '功能性食品', '天然原料', '项目管理', '功效评测', '包装研发', '品质控制'],
            searchKeyword: '',
            tag: ''
        };
    },
    onLoad() {
        this.loadTalentList();
    },
    onShow() {
        // 每次显示页面时刷新列表
        this.setData({
            page: 1,
            hasMore: true
        });
        this.loadTalentList();
    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true
        });
        this.loadTalentList(() => {
            uni.stopPullDownRefresh();
        });
    },
    onReachBottom() {
        if (this.hasMore && !this.loading) {
            this.loadMore();
        }
    },
    methods: {
        loadTalentList(callback) {
            const { page, pageSize, currentArea, searchKeyword } = this;
            if (this.loading) {
                return;
            }
            this.setData({
                loading: true
            });
            let url = `/api/talent_pool/list?page=${page}&pageSize=${pageSize}`;
            if (currentArea && currentArea !== '全部') {
                url += `&area=${encodeURIComponent(currentArea)}`;
            }
            if (searchKeyword) {
                url += `&keyword=${encodeURIComponent(searchKeyword)}`;
            }
            app.globalData.request({
                url,
                success: (res) => {
                    const { list, total, currentPage, totalPages } = res.data;
                    this.setData({
                        talentList: page === 1 ? list : [...this.talentList, ...list],
                        hasMore: currentPage < totalPages,
                        loading: false
                    });
                    if (callback) {
                        callback();
                    }
                },
                fail: () => {
                    this.setData({
                        loading: false
                    });
                    if (callback) {
                        callback();
                    }
                }
            });
        },

        loadMore() {
            this.setData({
                page: this.page + 1
            });
            this.loadTalentList();
        },

        onSearch(e) {
            const keyword = e.detail.value || '';
            this.setData({
                searchKeyword: keyword,
                page: 1,
                hasMore: true
            });
            this.loadTalentList();
        },

        onSearchConfirm(e) {
            const keyword = e.detail.value || '';
            this.setData({
                searchKeyword: keyword,
                page: 1,
                hasMore: true
            });
            this.loadTalentList();
        },

        clearSearch() {
            this.setData({
                searchKeyword: '',
                page: 1,
                hasMore: true
            });
            this.loadTalentList();
        },

        filterByArea(e) {
            const area = e.currentTarget.dataset.area;
            this.setData({
                currentArea: area,
                page: 1,
                hasMore: true
            });
            this.loadTalentList();
        },

        goToDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/talent_pool/detail/detail?id=${id}`
            });
        }
    }
};
</script>
<style>
/* 搜索栏 */
.search-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 24rpx;
    background: #fff;
}

.search-input-wrapper {
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
    height: 44rpx;
}

.search-input::placeholder {
    color: #999;
}

.clear-btn {
    width: 40rpx;
    height: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ccc;
    border-radius: 50%;
    margin-left: 12rpx;
}

.clear-btn text {
    color: #fff;
    font-size: 24rpx;
}

/* 筛选栏 */
.filter-bar {
    background: #fff;
    padding: 16rpx 0 24rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.filter-scroll {
    white-space: nowrap;
    padding: 0 24rpx;
}

.filter-item {
    display: inline-block;
    padding: 14rpx 28rpx;
    margin-right: 16rpx;
    font-size: 26rpx;
    color: #666;
    background: #f5f5f5;
    border-radius: 32rpx;
    transition: all 0.3s;
    font-weight: 500;
}

.filter-item:last-child {
    margin-right: 0;
}

.filter-item.active {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    color: #fff;
}

/* 人才列表 */
.talent-list {
    padding: 20rpx 24rpx 40rpx;
}

.talent-card {
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    position: relative;
}

.talent-card:active {
    transform: translateY(-2rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    background: #fffef5;
}

.card-left {
    flex-shrink: 0;
    margin-right: 24rpx;
}

.talent-avatar {
    width: 110rpx;
    height: 110rpx;
    border-radius: 55rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    border: 3rpx solid #fff;
    box-shadow: 0 4rpx 12rpx rgba(255, 193, 7, 0.3);
}

.card-right {
    flex: 1;
    min-width: 0;
}

.card-header {
    display: flex;
    align-items: center;
    margin-bottom: 8rpx;
}

.talent-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-right: 16rpx;
}

.talent-experience {
    font-size: 22rpx;
    color: #fff;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    font-weight: 500;
}

.talent-title {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;
    font-weight: 500;
}

.talent-region {
    display: flex;
    align-items: center;
    margin-bottom: 14rpx;
}

.region-icon {
    font-size: 24rpx;
    margin-right: 8rpx;
}

.region-text {
    font-size: 24rpx;
    color: #999;
}

.talent-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
}

.tag {
    font-size: 22rpx;
    color: #b8860b;
    background: rgba(255, 193, 7, 0.1);
    padding: 6rpx 18rpx;
    border-radius: 20rpx;
}

.arrow {
    position: absolute;
    right: 24rpx;
    top: 50%;
    transform: translateY(-50%);
    font-size: 26rpx;
    color: #ccc;
    font-weight: bold;
}

/* 加载更多 */
.load-more {
    text-align: center;
    padding: 32rpx;
}

.load-more text {
    font-size: 26rpx;
    color: #999;
    display: inline-block;
}

.load-more text:active {
    color: #666;
}

.no-more {
    text-align: center;
    padding: 32rpx;
}

.no-more text {
    font-size: 24rpx;
    color: #ccc;
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 48rpx;
}

.empty-icon {
    font-size: 100rpx;
    margin-bottom: 32rpx;
    opacity: 0.5;
}

.empty-text {
    font-size: 28rpx;
    color: #999;
}

/* 加载状态 */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 200rpx 48rpx;
}

.loading-spinner {
    width: 56rpx;
    height: 56rpx;
    border: 3rpx solid rgba(255, 193, 7, 0.2);
    border-top-color: #ffc107;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

.loading-text {
    font-size: 26rpx;
    color: #999;
    margin-top: 24rpx;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
