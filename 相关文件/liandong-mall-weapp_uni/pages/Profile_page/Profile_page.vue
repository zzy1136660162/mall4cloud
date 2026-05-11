<template>
    <view class="profile-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-top">
                    <view class="brand-section">
                        <view class="brand-name">我的</view>
                        <view class="brand-line"></view>
                    </view>
                    <view class="header-actions">
                        <view class="action-btn">
                            <text class="action-icon">🔔</text>
                        </view>
                        <view class="action-btn">
                            <text class="action-icon">⚙️</text>
                        </view>
                    </view>
                </view>
                <view class="header-desc">欢迎回来，达人用户</view>
            </view>
        </view>

        <view class="page-content">
            <view class="user-info-section">
                <view class="user-card">
                    <view class="user-avatar">
                        <image class="avatar-image" src="https://picsum.photos/120/120?random=99" mode="aspectFill" />
                    </view>
                    <view class="user-detail">
                        <view class="user-name">达人用户</view>
                        <view class="user-level">优质达人</view>
                    </view>
                    <view class="user-stats">
                        <view class="stat-item">
                            <view class="stat-value">1.2万</view>
                            <view class="stat-label">粉丝</view>
                        </view>
                        <view class="stat-item">
                            <view class="stat-value">856</view>
                            <view class="stat-label">订单</view>
                        </view>
                        <view class="stat-item">
                            <view class="stat-value">98%</view>
                            <view class="stat-label">好评</view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="order-section">
                <view class="section-header">
                    <view class="section-title">
                        <text class="title-text">我的订单</text>
                        <view class="title-decoration"></view>
                    </view>
                    <view class="section-more">
                        <text class="more-text">全部订单</text>
                        <text class="more-arrow">→</text>
                    </view>
                </view>

                <view class="order-status-bar">
                    <view class="order-status-item">
                        <view class="status-icon">💳</view>
                        <view class="status-text">待付款</view>
                        <view class="status-badge" v-if="orderCounts.pending > 0">{{ orderCounts.pending }}</view>
                    </view>
                    <view class="order-status-item">
                        <view class="status-icon">📦</view>
                        <view class="status-text">待发货</view>
                        <view class="status-badge" v-if="orderCounts.shipping > 0">{{ orderCounts.shipping }}</view>
                    </view>
                    <view class="order-status-item">
                        <view class="status-icon">🚚</view>
                        <view class="status-text">待收货</view>
                        <view class="status-badge" v-if="orderCounts.receiving > 0">{{ orderCounts.receiving }}</view>
                    </view>
                    <view class="order-status-item">
                        <view class="status-icon">⭐</view>
                        <view class="status-text">待评价</view>
                        <view class="status-badge" v-if="orderCounts.review > 0">{{ orderCounts.review }}</view>
                    </view>
                    <view class="order-status-item">
                        <view class="status-icon">🔄</view>
                        <view class="status-text">售后</view>
                    </view>
                </view>
            </view>

            <view class="menu-section">
                <view class="menu-container">
                    <view class="menu-item" @tap="onSettingsTap" hover-class="menu-item-hover">
                        <view class="menu-left">
                            <text class="menu-icon">⚙️</text>
                            <text class="menu-text">设置</text>
                        </view>
                        <text class="menu-arrow">></text>
                        <view class="menu-divider"></view>
                    </view>

                    <view class="menu-item" @tap="onAddressTap" hover-class="menu-item-hover">
                        <view class="menu-left">
                            <text class="menu-icon">📍</text>
                            <text class="menu-text">收货地址</text>
                        </view>
                        <text class="menu-arrow">></text>
                        <view class="menu-divider"></view>
                    </view>

                    <view class="menu-item" @tap="onAboutTap" hover-class="menu-item-hover">
                        <view class="menu-left">
                            <text class="menu-icon">ℹ️</text>
                            <text class="menu-text">关于我们</text>
                        </view>
                        <text class="menu-arrow">></text>
                        <view class="menu-divider"></view>
                    </view>

                    <view class="menu-item" @tap="onFeedbackTap" hover-class="menu-item-hover">
                        <view class="menu-left">
                            <text class="menu-icon">💬</text>
                            <text class="menu-text">意见反馈</text>
                        </view>
                        <text class="menu-arrow">></text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import customTab from '@/components/custom-tab/custom-tab';
export default {
    components: {
        customTab
    },
    data() {
        return {
            orderCounts: {
                pending: 3,
                shipping: 2,
                receiving: 1,
                review: 5
            }
        };
    },
    onLoad(options) {},
    methods: {
        onSettingsTap() {
            uni.showToast({
                title: '功能开发中',
                icon: 'none',
                duration: 2000
            });
        },

        onAddressTap() {
            uni.showToast({
                title: '功能开发中',
                icon: 'none',
                duration: 2000
            });
        },

        onAboutTap() {
            uni.showToast({
                title: '功能开发中',
                icon: 'none',
                duration: 2000
            });
        },

        onFeedbackTap() {
            uni.showToast({
                title: '功能开发中',
                icon: 'none',
                duration: 2000
            });
        },

        onTabChange(e) {
            const { activeTab } = e.detail;
            const tabPaths = ['/pages/index/index', '/pages/Product_list_page/Product_list_page', '/pages/selection/selection', '/pages/rd/rd', '/pages/Profile_page/Profile_page'];
            if (activeTab !== 4) {
                uni.switchTab({
                    url: tabPaths[activeTab]
                });
            }
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.profile-page {
    min-height: 100vh;
    position: relative;
    overflow: hidden;
}

.page-background {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #ffffff;
    z-index: 0;
}

.page-header {
    position: relative;
    z-index: 10;
    background: #ffffff;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.header-content {
    padding: 48rpx 40rpx 32rpx;
}

.header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.brand-section {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.brand-name {
    font-size: 56rpx;
    color: #1a1a1a;
    font-weight: 300;
    letter-spacing: 4rpx;
}

.brand-line {
    width: 60rpx;
    height: 4rpx;
    background: #1a1a1a;
    border-radius: 2rpx;
}

.header-actions {
    display: flex;
    gap: 16rpx;
}

.action-btn {
    width: 72rpx;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-icon {
    font-size: 32rpx;
    opacity: 0.6;
}

.header-desc {
    font-size: 26rpx;
    color: #999999;
    letter-spacing: 1rpx;
    font-weight: 400;
}

.page-content {
    position: relative;
    z-index: 1;
    padding: 32rpx 24rpx 120rpx;
}

.user-info-section {
    margin-bottom: 32rpx;
}

.user-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
    border-radius: 32rpx;
    padding: 40rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.user-avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
    border: 4rpx solid rgba(255, 255, 255, 0.2);
}

.avatar-image {
    width: 100%;
    height: 100%;
}

.user-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.user-name {
    font-size: 36rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1rpx;
}

.user-level {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.user-stats {
    display: flex;
    gap: 32rpx;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

.stat-value {
    font-size: 32rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.stat-label {
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.order-section {
    margin-bottom: 32rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
    padding: 0 8rpx;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.title-text {
    font-size: 36rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 1rpx;
}

.title-decoration {
    width: 40rpx;
    height: 4rpx;
    background: #1a1a1a;
    border-radius: 2rpx;
}

.section-more {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.more-text {
    font-size: 26rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.more-arrow {
    font-size: 24rpx;
    color: #999999;
}

.order-status-bar {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    display: flex;
    justify-content: space-around;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.order-status-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
    position: relative;
}

.status-icon {
    font-size: 48rpx;
}

.status-text {
    font-size: 24rpx;
    color: #666666;
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.status-badge {
    position: absolute;
    top: -8rpx;
    right: -8rpx;
    min-width: 32rpx;
    height: 32rpx;
    background: #ff4d4f;
    border-radius: 16rpx;
    padding: 0 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 0.3rpx;
}

.menu-section {
    margin-bottom: 32rpx;
}

.menu-container {
    background: #ffffff;
    border-radius: 16rpx;
    margin: 20rpx 20rpx 0;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
    position: relative;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
}

.menu-item-hover {
    background: #f5f5f5;
}

.menu-left {
    display: flex;
    align-items: center;
    gap: 16rpx;
}

.menu-icon {
    font-size: 40rpx;
    color: #666666;
}

.menu-text {
    font-size: 28rpx;
    color: #333333;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.menu-arrow {
    font-size: 28rpx;
    color: #999999;
    flex-shrink: 0;
}

.menu-divider {
    position: absolute;
    bottom: 0;
    left: 30rpx;
    right: 0;
    height: 1rpx;
    background: #f5f5f5;
}

.menu-item:last-child .menu-divider {
    display: none;
}
</style>
