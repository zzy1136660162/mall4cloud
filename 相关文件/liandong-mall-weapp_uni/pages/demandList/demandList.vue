<template>
    <view class="container">
        <!-- 状态筛选 -->
        <view class="filter-bar">
            <scroll-view class="filter-scroll" :scroll-x="true">
                <view :class="'filter-item ' + (currentStatus === '' ? 'active' : '')" @tap="filterByStatus" data-status="">全部</view>
                <view :class="'filter-item ' + (currentStatus === '0' ? 'active' : '')" @tap="filterByStatus" data-status="0">待处理</view>
                <view :class="'filter-item ' + (currentStatus === '1' ? 'active' : '')" @tap="filterByStatus" data-status="1">确认中</view>
                <view :class="'filter-item ' + (currentStatus === '2' ? 'active' : '')" @tap="filterByStatus" data-status="2">研发中</view>
                <view :class="'filter-item ' + (currentStatus === '3' ? 'active' : '')" @tap="filterByStatus" data-status="3">样品制作</view>
                <view :class="'filter-item ' + (currentStatus === '4' ? 'active' : '')" @tap="filterByStatus" data-status="4">已完成</view>
            </scroll-view>
        </view>

        <!-- 需求列表 -->
        <view class="demand-list" v-if="demandList.length > 0">
            <view class="demand-card" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in demandList" :key="index">
                <view class="card-header">
                    <view class="demand-no">{{ item.demandNo }}</view>
                    <view :class="'status-tag status-' + item.statusClass">{{ item.statusText }}</view>
                </view>

                <view class="card-body">
                    <view class="demand-title">{{ item.title }}</view>
                    <view class="demand-info">
                        <view class="info-item">
                            <text class="info-label">目标人群：</text>
                            <text class="info-value">{{ item.targetAudience }}</text>
                        </view>
                        <view class="info-item">
                            <text class="info-label">预算范围：</text>
                            <text class="info-value">{{ item.budgetRange }}</text>
                        </view>
                        <view class="info-item">
                            <text class="info-label">期望交付：</text>
                            <text class="info-value">{{ item.expectedDeliveryTime }}</text>
                        </view>
                    </view>
                </view>

                <view class="card-footer">
                    <text class="submit-time">提交时间：{{ item.submitTime }}</text>
                    <view class="card-actions">
                        <text class="action-btn withdraw-btn" v-if="item.status === 0" @tap.stop.prevent="withdrawDemand" :data-id="item.id" :data-index="index">撤回</text>
                        <text class="action-btn reapply-btn" v-if="item.status === 5" @tap.stop.prevent="reapplyDemand" :data-id="item.id" :data-index="index">重新申请</text>
                        <text class="action-btn delete-btn" v-if="item.status === 5" @tap.stop.prevent="deleteDemand" :data-id="item.id" :data-index="index">删除</text>
                        <text class="arrow">></text>
                    </view>
                </view>
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
        <view class="empty-state" v-else>
            <view class="empty-icon-placeholder">📋</view>
            <text class="empty-text">暂无研发需求</text>
            <button class="btn btn-primary empty-btn" @tap="goToSubmit">立即提交需求</button>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            demandList: [],
            currentStatus: '',
            page: 1,
            pageSize: 10,
            hasMore: true,
            loading: false
        };
    },
    onLoad() {
        this.loadDemandList();
    },
    onShow() {
        // 每次显示页面时刷新列表
        this.setData({
            page: 1,
            hasMore: true
        });
        this.loadDemandList();
    },
    onPullDownRefresh() {
        this.setData({
            page: 1,
            hasMore: true
        });
        this.loadDemandList(() => {
            uni.stopPullDownRefresh();
        });
    },
    onReachBottom() {
        if (this.hasMore && !this.loading) {
            this.loadMore();
        }
    },
    methods: {
        // 加载需求列表
        loadDemandList(callback) {
            const { currentStatus, page, pageSize } = this;
            const submitterId = app.globalData.userId;
            console.log('需求列表页 - submitterId:', submitterId);
            console.log('需求列表页 - app.globalData:', app.globalData);
            this.setData({
                loading: true
            });
            let url = `/demand/list?submitterId=${submitterId}&page=${page}&pageSize=${pageSize}`;
            if (currentStatus !== '') {
                url += `&status=${currentStatus}`;
            }
            app.globalData.request({
                url,
                success: (res) => {
                    console.log('需求列表页 - 返回数据:', res);
                    console.log('需求列表页 - res.data:', res.data);
                    const { list, total, page: currentPage } = res.data;
                    console.log('需求列表页 - list:', list, 'total:', total, 'currentPage:', currentPage);
                    const formattedList = list.map((item) => ({
                        ...item,
                        statusClass: this.getStatusClass(item.status)
                    }));
                    console.log('需求列表页 - formattedList:', formattedList);
                    this.setData(
                        {
                            demandList: page === 1 ? formattedList : [...this.demandList, ...formattedList],
                            hasMore: currentPage * pageSize < total,
                            loading: false
                        },
                        () => {
                            console.log('需求列表页 - setData后 demandList:', this.demandList);
                        }
                    );
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

        // 获取状态样式类名
        getStatusClass(status) {
            const classMap = {
                0: 'pending',
                1: 'confirming',
                2: 'developing',
                3: 'sampling',
                4: 'completed',
                5: 'cancelled'
            };
            return classMap[status] || 'pending';
        },

        // 按状态筛选
        filterByStatus(e) {
            const { status } = e.currentTarget.dataset;
            this.setData({
                currentStatus: status,
                page: 1,
                hasMore: true,
                demandList: []
            });
            this.loadDemandList();
        },

        // 加载更多
        loadMore() {
            this.setData({
                page: this.page + 1
            });
            this.loadDemandList();
        },

        // 跳转到详情
        goToDetail(e) {
            const id = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/demandDetail/demandDetail?id=${id}`
            });
        },

        // 跳转到提交页面
        goToSubmit() {
            uni.navigateTo({
                url: '/pages/demandSubmit/demandSubmit'
            });
        },

        // 撤回需求
        withdrawDemand(e) {
            const { id, index } = e.currentTarget.dataset;
            uni.showModal({
                title: '确认撤回',
                content: '撤回后该需求将取消，是否确认？',
                confirmColor: '#ff4d4f',
                success: (res) => {
                    if (res.confirm) {
                        this.doWithdraw(id, index);
                    }
                }
            });
        },

        // 执行撤回
        doWithdraw(demandId, index) {
            const submitterId = app.globalData.userId;
            uni.showLoading({
                title: '处理中...'
            });
            app.globalData.request({
                url: '/demand/withdraw',
                method: 'POST',
                data: {
                    demandId: parseInt(demandId),
                    submitterId
                },
                success: (res) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '已撤回',
                        icon: 'success'
                    });

                    // 更新列表数据
                    const demandList = this.demandList;
                    demandList[index].status = 5;
                    demandList[index].statusText = '已取消';
                    demandList[index].statusClass = 'cancelled';
                    this.setData({
                        demandList
                    });

                    // 如果当前筛选不是全部，刷新列表
                    if (this.currentStatus !== '') {
                        this.loadDemandList();
                    }
                },
                fail: () => {
                    uni.hideLoading();
                }
            });
        },

        // 重新申请
        reapplyDemand(e) {
            const { id, index } = e.currentTarget.dataset;
            uni.showModal({
                title: '确认重新申请',
                content: '重新申请后将生成新的需求编号，是否确认？',
                confirmColor: '#faad14',
                success: (res) => {
                    if (res.confirm) {
                        this.doReapply(id, index);
                    }
                }
            });
        },

        // 执行重新申请
        doReapply(demandId, index) {
            const submitterId = app.globalData.userId;
            uni.showLoading({
                title: '处理中...'
            });
            app.globalData.request({
                url: '/demand/reapply',
                method: 'POST',
                data: {
                    demandId: parseInt(demandId),
                    submitterId
                },
                success: (res) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '重新申请成功',
                        icon: 'success'
                    });

                    // 更新列表数据
                    const demandList = this.demandList;
                    demandList[index].status = 0;
                    demandList[index].statusText = '待处理';
                    demandList[index].statusClass = 'pending';
                    demandList[index].demandNo = res.data.demandNo;
                    this.setData({
                        demandList
                    });

                    // 如果当前筛选不是全部或已取消，刷新列表
                    if (this.currentStatus !== '' && this.currentStatus !== '5') {
                        this.loadDemandList();
                    }
                },
                fail: () => {
                    uni.hideLoading();
                }
            });
        },

        // 删除需求
        deleteDemand(e) {
            const { id, index } = e.currentTarget.dataset;
            uni.showModal({
                title: '确认删除',
                content: '删除后数据将无法恢复，是否确认？',
                confirmColor: '#ff4d4f',
                success: (res) => {
                    if (res.confirm) {
                        this.doDelete(id, index);
                    }
                }
            });
        },

        // 执行删除
        doDelete(demandId, index) {
            const submitterId = app.globalData.userId;
            uni.showLoading({
                title: '处理中...'
            });
            app.globalData.request({
                url: '/demand/delete',
                method: 'POST',
                data: {
                    demandId: parseInt(demandId),
                    submitterId
                },
                success: (res) => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '已删除',
                        icon: 'success'
                    });

                    // 从列表中移除
                    const demandList = this.demandList;
                    demandList.splice(index, 1);
                    this.setData({
                        demandList,
                        // 如果删除后列表为空，显示空状态
                        hasMore: demandList.length > 0
                    });
                },
                fail: () => {
                    uni.hideLoading();
                }
            });
        }
    }
};
</script>
<style>
/* 筛选栏 */
.filter-bar {
    background: linear-gradient(180deg, #fff 0%, #f8f9fa 100%);
    padding: 24rpx 0;
    margin: -20rpx -20rpx 20rpx;
    border-bottom: 2rpx solid #f0f0f0;
    position: sticky;
    top: 0;
    z-index: 10;
}

.filter-scroll {
    white-space: nowrap;
    padding: 0 24rpx;
}

.filter-item {
    display: inline-block;
    padding: 18rpx 36rpx;
    margin-right: 20rpx;
    font-size: 28rpx;
    color: #666;
    background: #f0f2f5;
    border-radius: 36rpx;
    transition: all 0.3s;
    font-weight: 500;
}

.filter-item:last-child {
    margin-right: 0;
}

.filter-item.active {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
    box-shadow: 0 4rpx 16rpx rgba(245, 213, 71, 0.3);
}

/* 需求列表 */
.demand-list {
    padding: 10rpx 10rpx 40rpx;
}

.demand-card {
    background: #fff;
    border-radius: 24rpx;
    padding: 36rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    border: 2rpx solid transparent;
}

.demand-card:active {
    transform: translateY(-4rpx);
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
    border-color: #fff7e6;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    padding-bottom: 24rpx;
    border-bottom: 2rpx solid #f5f5f5;
}

.demand-no {
    font-size: 26rpx;
    color: #999;
    font-family: 'SF Mono', Monaco, monospace;
    background: #f8f9fa;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
}

/* 状态标签样式 */
.status-tag {
    font-size: 24rpx;
    padding: 10rpx 24rpx;
    border-radius: 28rpx;
    font-weight: 600;
}

.status-pending {
    background: #fff7e6;
    color: #fa8c16;
}

.status-confirming {
    background: #fffbe6;
    color: #d4a017;
}

.status-developing {
    background: #f6ffed;
    color: #52c41a;
}

.status-sampling {
    background: #f9f0ff;
    color: #722ed1;
}

.status-completed {
    background: #f6ffed;
    color: #52c41a;
}

.status-cancelled {
    background: #f5f5f5;
    color: #999;
}

.card-body {
    margin-bottom: 24rpx;
}

.demand-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 20rpx;
    line-height: 1.5;
}

.demand-info {
    background: linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%);
    padding: 24rpx;
    border-radius: 16rpx;
}

.info-item {
    display: flex;
    margin-bottom: 16rpx;
    font-size: 28rpx;
}

.info-item:last-child {
    margin-bottom: 0;
}

.info-label {
    color: #666;
    width: 140rpx;
    flex-shrink: 0;
    font-weight: 500;
}

.info-value {
    color: #1a1a1a;
    flex: 1;
    font-weight: 500;
}

.card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 24rpx;
    border-top: 2rpx dashed #e8e8e8;
}

.submit-time {
    font-size: 26rpx;
    color: #999;
    display: flex;
    align-items: center;
}

.arrow {
    font-size: 32rpx;
    color: #ccc;
    margin-left: 16rpx;
}

.card-actions {
    display: flex;
    align-items: center;
}

.action-btn {
    font-size: 24rpx;
    padding: 12rpx 20rpx;
    margin-right: 12rpx;
    border-radius: 10rpx;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
    display: inline-block;
}

.action-btn:last-child {
    margin-right: 0;
}

.withdraw-btn {
    color: #ff4d4f;
    border: 2rpx solid #ff4d4f;
    background: #fff;
}

.withdraw-btn:active {
    background-color: #fff1f0;
    transform: scale(0.95);
}

.reapply-btn {
    color: #faad14;
    border: 2rpx solid #faad14;
    background: #fff;
}

.reapply-btn:active {
    background-color: #fffbe6;
    transform: scale(0.95);
}

.delete-btn {
    color: #999;
    border: 2rpx solid #d9d9d9;
    background: #fff;
}

.delete-btn:active {
    background-color: #f5f5f5;
    transform: scale(0.95);
}

/* 加载更多 */
.load-more,
.no-more {
    text-align: center;
    padding: 40rpx;
    font-size: 28rpx;
    color: #999;
}

.load-more text {
    color: #d4a017;
    font-weight: 500;
    padding: 16rpx 40rpx;
    background: #fffbe6;
    border-radius: 32rpx;
}

/* 空状态 */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
}

.empty-icon-placeholder {
    font-size: 140rpx;
    margin-bottom: 40rpx;
    opacity: 0.8;
}

.empty-text {
    font-size: 32rpx;
    color: #999;
    margin-bottom: 40rpx;
    font-weight: 500;
}

.empty-btn {
    width: 320rpx;
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
    border-radius: 44rpx;
    font-size: 30rpx;
    font-weight: 500;
    box-shadow: 0 8rpx 24rpx rgba(245, 213, 71, 0.3);
}

.empty-btn::after {
    border: none;
}
</style>
