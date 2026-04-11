<template>
    <view class="container">
        <view class="status-card">
            <view class="status-info">
                <text class="status-label">当前状态</text>
                <text :class="'status-value status-' + statusClass">{{ detail.statusText }}</text>
            </view>
            <view class="demand-no">需求编号：{{ detail.demandNo }}</view>
        </view>

        <view class="card">
            <view class="section-title">需求信息</view>
            <view class="info-row">
                <text class="info-label">需求标题</text>
                <text class="info-value">{{ detail.title }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">功能诉求</text>
                <text class="info-value">{{ detail.functionalAppeal }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">目标人群</text>
                <text class="info-value">{{ detail.targetAudience }}</text>
            </view>
            <view class="info-row" v-if="detail.dosageFormPreference">
                <text class="info-label">剂型偏好</text>
                <text class="info-value">{{ detail.dosageFormPreference }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">预算范围</text>
                <text class="info-value">{{ detail.budgetRange }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">期望交付</text>
                <text class="info-value">{{ detail.expectedDeliveryTime }}</text>
            </view>
            <view class="info-row" v-if="detail.remark">
                <text class="info-label">备注</text>
                <text class="info-value">{{ detail.remark }}</text>
            </view>
        </view>

        <view class="card" v-if="detail.adminRemark || detail.handlerName">
            <view class="section-title">处理信息</view>
            <view class="info-row" v-if="detail.handlerName">
                <text class="info-label">处理人</text>
                <text class="info-value">{{ detail.handlerName }}</text>
            </view>
            <view class="info-row" v-if="detail.adminRemark">
                <text class="info-label">处理备注</text>
                <text class="info-value highlight">{{ detail.adminRemark }}</text>
            </view>
        </view>

        <view class="card">
            <view class="section-title">提交信息</view>
            <view class="info-row">
                <text class="info-label">联系人</text>
                <text class="info-value">{{ detail.submitterName || '未填写' }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">联系电话</text>
                <text class="info-value">{{ detail.submitterPhone || '未填写' }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">提交时间</text>
                <text class="info-value">{{ detail.submitTime }}</text>
            </view>
            <view class="info-row">
                <text class="info-label">更新时间</text>
                <text class="info-value">{{ detail.updateTime }}</text>
            </view>
        </view>

        <view class="action-section">
            <button class="btn btn-primary" @tap="viewProgress">查看进度</button>
            <button class="btn btn-danger" @tap="withdrawDemand" v-if="detail.status === 0">撤回需求</button>
            <button class="btn btn-warning" @tap="reapplyDemand" v-if="detail.status === 5">重新申请</button>
            <button class="btn btn-secondary" @tap="deleteDemand" v-if="detail.status === 5">删除需求</button>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            demandId: null,

            detail: {
                statusText: '',
                demandNo: '',
                title: '',
                functionalAppeal: '',
                targetAudience: '',
                dosageFormPreference: '',
                budgetRange: '',
                expectedDeliveryTime: '',
                remark: '',
                adminRemark: '',
                handlerName: '',
                submitterName: '',
                submitterPhone: '',
                submitTime: '',
                updateTime: '',
                status: 0
            },

            statusClass: '',
            page: 0
        };
    },
    onLoad(options) {
        const { id } = options;
        if (!id) {
            uni.showToast({
                title: '参数错误',
                icon: 'none'
            });
            uni.navigateBack();
            return;
        }
        this.setData({
            demandId: id
        });
        this.loadDetail();
    },
    methods: {
        // 加载详情
        loadDetail() {
            const { demandId } = this;
            const submitterId = app.globalData.userId;
            app.globalData.request({
                url: `/demand/detail/${demandId}?submitterId=${submitterId}`,
                success: (res) => {
                    this.setData({
                        detail: res.data,
                        statusClass: this.getStatusClass(res.data.status)
                    });
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

        // 查看进度
        viewProgress() {
            const { demandId } = this;
            uni.navigateTo({
                url: `/pages/demandProgress/demandProgress?demandId=${demandId}`
            });
        },

        // 撤回需求
        withdrawDemand() {
            const { demandId, detail } = this;

            // 只有待处理状态可以撤回
            if (detail.status !== 0) {
                uni.showToast({
                    title: '该需求状态不允许撤回',
                    icon: 'none'
                });
                return;
            }
            uni.showModal({
                title: '确认撤回',
                content: '撤回后该需求将取消，是否确认？',
                confirmColor: '#ff4d4f',
                success: (res) => {
                    if (res.confirm) {
                        this.doWithdraw();
                    }
                }
            });
        },

        // 执行撤回
        doWithdraw() {
            const { demandId } = this;
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

                    // 刷新详情
                    this.loadDetail();

                    // 通知列表页刷新
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 2];
                    if (prevPage && prevPage.route === 'pages/demandList/demandList') {
                        prevPage.setData({
                            page: 1
                        });
                        prevPage.loadDemandList();
                    }
                },
                fail: () => {
                    uni.hideLoading();
                }
            });
        },

        // 重新申请
        reapplyDemand() {
            const { demandId, detail } = this;

            // 只有已取消状态可以重新申请
            if (detail.status !== 5) {
                uni.showToast({
                    title: '该需求状态不允许重新申请',
                    icon: 'none'
                });
                return;
            }
            uni.showModal({
                title: '确认重新申请',
                content: '重新申请后将生成新的需求编号，是否确认？',
                confirmColor: '#faad14',
                success: (res) => {
                    if (res.confirm) {
                        this.doReapply();
                    }
                }
            });
        },

        // 执行重新申请
        doReapply() {
            const { demandId } = this;
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

                    // 刷新详情
                    this.loadDetail();

                    // 通知列表页刷新
                    const pages = getCurrentPages();
                    const prevPage = pages[pages.length - 2];
                    if (prevPage && prevPage.route === 'pages/demandList/demandList') {
                        prevPage.setData({
                            page: 1
                        });
                        prevPage.loadDemandList();
                    }
                },
                fail: () => {
                    uni.hideLoading();
                }
            });
        },

        // 删除需求
        deleteDemand() {
            const { demandId, detail } = this;

            // 只有已取消状态可以删除
            if (detail.status !== 5) {
                uni.showToast({
                    title: '该需求状态不允许删除',
                    icon: 'none'
                });
                return;
            }
            uni.showModal({
                title: '确认删除',
                content: '删除后数据将无法恢复，是否确认？',
                confirmColor: '#ff4d4f',
                success: (res) => {
                    if (res.confirm) {
                        this.doDelete();
                    }
                }
            });
        },

        // 执行删除
        doDelete() {
            const { demandId } = this;
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

                    // 返回列表页
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 1500);
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
/* 页面容器 */
.container {
    padding: 0;
    background: linear-gradient(180deg, #fffbe6 0%, #f5f5f5 100%);
    min-height: 100vh;
}

/* 状态卡片 */
.status-card {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    border-radius: 0 0 40rpx 40rpx;
    padding: 60rpx 40rpx;
    margin: -20rpx -20rpx 30rpx;
    color: #333;
    position: relative;
    overflow: hidden;
}

.status-card::before {
    content: '';
    position: absolute;
    top: -30%;
    right: -20%;
    width: 300rpx;
    height: 300rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.status-card::after {
    content: '';
    position: absolute;
    bottom: -20%;
    left: -10%;
    width: 200rpx;
    height: 200rpx;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
}

.status-info {
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    position: relative;
    z-index: 1;
}

.status-label {
    font-size: 28rpx;
    opacity: 0.9;
    margin-right: 20rpx;
}

.status-value {
    font-size: 32rpx;
    font-weight: bold;
    padding: 16rpx 36rpx;
    border-radius: 36rpx;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(10rpx);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.status-pending {
    background: rgba(250, 173, 20, 0.4);
}
.status-confirming {
    background: rgba(245, 213, 71, 0.4);
}
.status-developing {
    background: rgba(82, 196, 26, 0.4);
}
.status-sampling {
    background: rgba(114, 46, 209, 0.4);
}
.status-completed {
    background: rgba(82, 196, 26, 0.5);
}
.status-cancelled {
    background: rgba(255, 77, 79, 0.4);
}

.demand-no {
    font-size: 26rpx;
    opacity: 0.85;
    font-family: 'SF Mono', Monaco, monospace;
    background: rgba(255, 255, 255, 0.15);
    padding: 12rpx 24rpx;
    border-radius: 12rpx;
    display: inline-block;
    position: relative;
    z-index: 1;
}

/* 卡片样式 */
.card {
    background: #fff;
    border-radius: 24rpx;
    padding: 40rpx;
    margin: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
}

.section-title {
    font-size: 34rpx;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 30rpx;
    display: flex;
    align-items: center;
}

.section-title::before {
    content: '';
    width: 8rpx;
    height: 36rpx;
    background: linear-gradient(180deg, #f5d547 0%, #ffec8b 100%);
    border-radius: 4rpx;
    margin-right: 16rpx;
}

/* 信息行 */
.info-row {
    padding: 28rpx 0;
    border-bottom: 2rpx solid #f5f5f5;
    display: flex;
    flex-direction: column;
}

.info-row:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.info-label {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 12rpx;
    font-weight: 500;
}

.info-value {
    font-size: 30rpx;
    color: #1a1a1a;
    line-height: 1.6;
    font-weight: 500;
}

.info-value.highlight {
    color: #d4a017;
    background: linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%);
    padding: 24rpx;
    border-radius: 16rpx;
    border: 2rpx solid #ffe58f;
}

/* 操作按钮区域 */
.action-section {
    padding: 40rpx 30rpx;
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

/* 通用按钮样式 */
.btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 90rpx;
    border-radius: 45rpx;
    font-size: 32rpx;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    border: none;
    outline: none;
    overflow: hidden;
    position: relative;
}

.btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.6s ease;
}

.btn:hover::before {
    left: 100%;
}

/* 主要按钮 */
.btn-primary {
    background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%);
    color: #fff;
    box-shadow: 0 6rpx 20rpx rgba(24, 144, 255, 0.4);
}

.btn-primary:active {
    transform: translateY(2rpx);
    box-shadow: 0 3rpx 10rpx rgba(24, 144, 255, 0.3);
    background: linear-gradient(135deg, #177ddc 0%, #2cb9b2 100%);
}

/* 危险按钮 */
.btn-danger {
    background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
    color: #fff;
    box-shadow: 0 6rpx 20rpx rgba(255, 77, 79, 0.4);
}

.btn-danger:active {
    transform: translateY(2rpx);
    box-shadow: 0 3rpx 10rpx rgba(255, 77, 79, 0.3);
    background: linear-gradient(135deg, #e63e40 0%, #ff5c5f 100%);
}

/* 警告按钮 */
.btn-warning {
    background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
    color: #fff;
    box-shadow: 0 6rpx 20rpx rgba(250, 173, 20, 0.4);
}

.btn-warning:active {
    transform: translateY(2rpx);
    box-shadow: 0 3rpx 10rpx rgba(250, 173, 20, 0.3);
    background: linear-gradient(135deg, #d48b0f 0%, #ffb317 100%);
}

/* 次要按钮 */
.btn-secondary {
    background: linear-gradient(135deg, #999 0%, #bbb 100%);
    color: #fff;
    box-shadow: 0 6rpx 20rpx rgba(153, 153, 153, 0.4);
}

.btn-secondary:active {
    transform: translateY(2rpx);
    box-shadow: 0 3rpx 10rpx rgba(153, 153, 153, 0.3);
    background: linear-gradient(135deg, #888 0%, #aaa 100%);
}
</style>
