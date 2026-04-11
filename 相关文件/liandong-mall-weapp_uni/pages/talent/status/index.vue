<template>
    <!-- 达人申请状态页 -->
    <view class="status-container">
        <!-- 状态图标 -->
        <view class="status-icon-view">
            <!-- 审核中 -->
            <view class="status-icon pending" v-if="status === 'PENDING'">
                <text class="icon">⏳</text>
            </view>
            <!-- 已通过 -->
            <view class="status-icon approved" v-else-if="status === 'APPROVED'">
                <text class="icon">✓</text>
            </view>
            <!-- 已拒绝 -->
            <view class="status-icon rejected" v-else-if="status === 'REJECTED'">
                <text class="icon">✕</text>
            </view>
            <!-- 未申请 -->
            <view class="status-icon none" v-else>
                <text class="icon">?</text>
            </view>
        </view>

        <!-- 状态标题 -->
        <view class="status-title">
            <text v-if="status === 'PENDING'">审核中</text>
            <text v-else-if="status === 'APPROVED'">审核通过</text>
            <text v-else-if="status === 'REJECTED'">审核未通过</text>
            <text v-else>未申请</text>
        </view>

        <!-- 状态描述 -->
        <view class="status-desc">
            <text v-if="status === 'PENDING'">您的达人申请已提交，工作人员将在1-3个工作日内完成审核</text>
            <text v-else-if="status === 'APPROVED'">恭喜您已成为平台认证达人！现在可以进入达人中心开始选品了</text>
            <text v-else-if="status === 'REJECTED'">您的申请未通过审核，请查看原因后重新提交申请</text>
            <text v-else>您还未申请成为达人</text>
        </view>

        <!-- 拒绝原因 -->
        <view class="reject-reason" v-if="status === 'REJECTED' && rejectReason">
            <view class="reason-title">拒绝原因</view>
            <text class="reason-text">{{ rejectReason }}</text>
        </view>

        <!-- 申请信息 -->
        <view class="apply-info" v-if="status">
            <view class="info-item">
                <text class="info-label">申请时间</text>
                <text class="info-value">{{ applyTime || '-' }}</text>
            </view>
            <view class="info-item" v-if="auditTime">
                <text class="info-label">审核时间</text>
                <text class="info-value">{{ auditTime }}</text>
            </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-section">
            <!-- 审核中 -->
            <button class="action-btn primary" v-if="status === 'PENDING'" @tap="goBack">
                <text>返回</text>
            </button>

            <!-- 已通过 -->
            <button class="action-btn primary" v-else-if="status === 'APPROVED'" @tap="goToTalentCenter">
                <text>进入达人中心</text>
            </button>

            <!-- 已拒绝 -->
            <button class="action-btn primary" v-else-if="status === 'REJECTED'" @tap="reApply">
                <text>重新申请</text>
            </button>

            <!-- 未申请 -->
            <button class="action-btn primary" v-else @tap="goToApply">
                <text>立即申请</text>
            </button>
        </view>
    </view>
</template>

<script>
// 达人申请状态页
const { api } = require('../../../utils/api.js');
export default {
    data() {
        return {
            status: null,
            statusText: '',
            applyTime: '',
            auditTime: '',
            rejectReason: ''
        };
    },
    onLoad() {
        this.loadStatus();
    },
    onShow() {
        this.loadStatus();
    },
    methods: {
        // 加载状态
        async loadStatus() {
            try {
                uni.showLoading({
                    title: '加载中'
                });
                const data = await api.get('/api/user/talent/status');
                uni.hideLoading();
                if (data) {
                    this.setData({
                        status: data.status,
                        statusText: data.statusText,
                        applyTime: data.applyTime,
                        auditTime: data.auditTime,
                        rejectReason: data.rejectReason
                    });
                } else {
                    this.setData({
                        status: 'NONE',
                        statusText: '未申请',
                        applyTime: '',
                        auditTime: '',
                        rejectReason: ''
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                uni.hideLoading();
                console.error('加载状态失败:', error);
                this.setData({
                    status: 'NONE',
                    statusText: '未申请',
                    applyTime: '',
                    auditTime: '',
                    rejectReason: ''
                });
            }
        },

        // 返回
        goBack() {
            uni.navigateBack();
        },

        // 进入达人中心
        goToTalentCenter() {
            uni.navigateTo({
                url: '/pages/talent/center/index'
            });
        },

        // 重新申请
        reApply() {
            uni.redirectTo({
                url: '/pages/talent/apply/index'
            });
        },

        // 立即申请
        goToApply() {
            uni.navigateTo({
                url: '/pages/talent/apply/index'
            });
        }
    }
};
</script>
<style>
/* 达人申请状态页样式 - 淡黄色风格 */
.status-container {
    min-height: 100vh;
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 120rpx 60rpx 60rpx;
}

/* 状态图标 */
.status-icon-view {
    margin-bottom: 40rpx;
}

.status-icon {
    width: 160rpx;
    height: 160rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status-icon.pending {
    background: #fe944d;
}

.status-icon.approved {
    background: #fe944d;
}

.status-icon.rejected {
    background: #fe944d;
}

.status-icon.none {
    background: #e0e0e0;
}

.status-icon .icon {
    font-size: 80rpx;
    color: #fff;
}

/* 状态标题 */
.status-title {
    font-size: 44rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 24rpx;
}

/* 状态描述 */
.status-desc {
    font-size: 28rpx;
    color: #666;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 40rpx;
    padding: 0 20rpx;
}

/* 拒绝原因 */
.reject-reason {
    width: 100%;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.reason-title {
    font-size: 30rpx;
    font-weight: 500;
    color: #333;
    margin-bottom: 16rpx;
}

.reason-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
}

/* 申请信息 */
.apply-info {
    width: 100%;
    background: #fff;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 0;
}

.info-item:not(:last-child) {
    border-bottom: 1rpx solid #f0f0f0;
}

.info-label {
    font-size: 28rpx;
    color: #999;
}

.info-value {
    font-size: 28rpx;
    color: #333;
}

/* 操作按钮 */
.action-section {
    width: 100%;
}

.action-btn {
    width: 100%;
    height: 96rpx;
    line-height: 96rpx;
    border-radius: 48rpx;
    font-size: 32rpx;
    font-weight: 500;
    border: none;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-btn.primary {
    background: #fe944d;
    color: #fff;
    box-shadow: 0 8rpx 24rpx rgba(254, 148, 77, 0.3);
}

.action-btn.secondary {
    background: #fff;
    color: #fe944d;
    border: 2rpx solid #fe944d;
}

.action-btn::after {
    border: none;
}

.action-btn text {
    display: block;
    text-align: center;
    width: 100%;
}
</style>
