<template>
    <view class="container">
        <!-- 需求基本信息 -->
        <view class="card header-card">
            <view class="header-title">{{ demandTitle }}</view>
            <view class="header-info">
                <text :class="'status-tag status-' + statusClass">{{ statusText }}</text>
                <text class="demand-no">{{ demandNo }}</text>
            </view>
        </view>

        <!-- 进度时间线 -->
        <view class="card">
            <view class="section-title">研发进度</view>

            <view class="timeline" v-if="progressList.length > 0">
                <view class="timeline-item" v-for="(item, index) in progressList" :key="index">
                    <view class="timeline-dot"></view>

                    <view class="timeline-content">
                        <view class="timeline-header">
                            <text class="timeline-time">{{ item.createTime }}</text>
                            <text class="timeline-operator">{{ item.operatorName }} ({{ item.operatorTypeText }})</text>
                        </view>
                        <view class="timeline-text">{{ item.progressRemark }}</view>
                        <view class="timeline-status" v-if="item.statusBefore !== null && item.statusAfter !== null">
                            <text class="status-change">{{ item.statusBeforeText }} → {{ item.statusAfterText }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-else>
                <text class="empty-text">暂无进度记录</text>
            </view>
        </view>

        <!-- 提示信息 -->
        <view class="tips-card">
            <view class="tips-title">温馨提示</view>
            <view class="tips-list">
                <text class="tips-item">• 我们会及时更新研发进度，请保持关注</text>
                <text class="tips-item">• 如有疑问可联系客服：400-xxx-xxxx</text>
                <text class="tips-item">• 您也可以在我的需求中查看所有记录</text>
            </view>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            demandId: null,
            demandTitle: '',
            demandNo: '',
            statusText: '',
            statusClass: '',
            progressList: []
        };
    },
    onLoad(options) {
        const { demandId } = options;
        if (!demandId) {
            uni.showToast({
                title: '参数错误',
                icon: 'none'
            });
            uni.navigateBack();
            return;
        }
        this.setData({
            demandId
        });
        this.loadProgress();
    },
    methods: {
        // 加载进度列表
        loadProgress() {
            const { demandId } = this;
            const submitterId = app.globalData.userId;
            uni.showLoading({
                title: '加载中...'
            });

            // 先加载需求详情
            app.globalData.request({
                url: `/demand/detail/${demandId}?submitterId=${submitterId}`,
                success: (detailRes) => {
                    const detail = detailRes.data;
                    this.setData({
                        demandTitle: detail.title,
                        demandNo: detail.demandNo,
                        statusText: detail.statusText,
                        statusClass: this.getStatusClass(detail.status)
                    });

                    // 再加载进度
                    app.globalData.request({
                        url: `/demand/progress/${demandId}?submitterId=${submitterId}`,
                        success: (progressRes) => {
                            uni.hideLoading();
                            // 倒序排列，最新的在前面
                            const progressList = progressRes.data.reverse();
                            this.setData({
                                progressList
                            });
                        },
                        fail: () => {
                            uni.hideLoading();
                        }
                    });
                },
                fail: () => {
                    uni.hideLoading();
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
        }
    }
};
</script>
<style>
.header-card {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
}

.header-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    line-height: 1.5;
}

.header-info {
    display: flex;
    align-items: center;
}

.header-info .status-tag {
    margin-right: 20rpx;
}

.header-info .demand-no {
    font-size: 24rpx;
    opacity: 0.8;
    font-family: monospace;
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 40rpx;
    padding-left: 20rpx;
    border-left: 8rpx solid #f5d547;
}

.timeline {
    position: relative;
    padding-left: 40rpx;
}

.timeline::before {
    content: '';
    position: absolute;
    left: 12rpx;
    top: 16rpx;
    bottom: 0;
    width: 2rpx;
    background: #e8e8e8;
}

.timeline-item {
    position: relative;
    padding-bottom: 40rpx;
}

.timeline-item:last-child {
    padding-bottom: 0;
}

.timeline-dot {
    position: absolute;
    left: -34rpx;
    top: 16rpx;
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: #f5d547;
    border: 4rpx solid #fff;
    box-shadow: 0 0 0 2rpx #f5d547;
}

.timeline-item:first-child .timeline-dot {
    background: #52c41a;
    box-shadow: 0 0 0 2rpx #52c41a;
}

.timeline-content {
    background: #f8f8f8;
    padding: 24rpx;
    border-radius: 12rpx;
}

.timeline-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
    flex-wrap: wrap;
}

.timeline-time {
    font-size: 24rpx;
    color: #999;
}

.timeline-operator {
    font-size: 24rpx;
    color: #d4a017;
    background: #fffbe6;
    padding: 4rpx 16rpx;
    border-radius: 8rpx;
}

.timeline-text {
    font-size: 30rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 12rpx;
}

.timeline-status {
    margin-top: 12rpx;
}

.status-change {
    font-size: 24rpx;
    color: #666;
    background: #fff;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    display: inline-block;
}

.tips-card {
    background: #fffbe6;
    border: 2rpx solid #ffe58f;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-top: 20rpx;
}

.tips-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #d48806;
    margin-bottom: 20rpx;
}

.tips-list {
    display: flex;
    flex-direction: column;
}

.tips-item {
    font-size: 26rpx;
    color: #d48806;
    line-height: 1.8;
}
</style>
