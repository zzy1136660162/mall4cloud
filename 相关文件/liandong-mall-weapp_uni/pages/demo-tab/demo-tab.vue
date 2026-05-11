<template>
    <view class="demo-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-top">
                    <view class="brand-section">
                        <view class="brand-name">Tab 组件</view>
                        <view class="brand-line"></view>
                    </view>
                    <view class="header-actions">
                        <view class="action-btn">
                            <text class="action-icon">🔍</text>
                        </view>
                        <view class="action-btn">
                            <text class="action-icon">⚙️</text>
                        </view>
                    </view>
                </view>
                <view class="header-desc">自定义底部导航栏组件示例</view>
            </view>
        </view>

        <view class="page-content">
            <view class="hero-section">
                <view class="hero-card">
                    <view class="hero-icon">📱</view>
                    <view class="hero-content">
                        <view class="hero-title">自定义 Tab 组件</view>
                        <view class="hero-desc">精致极简的设计风格，支持角标、动画反馈等功能</view>
                    </view>
                </view>
            </view>

            <view class="features-section">
                <view class="section-header">
                    <view class="section-title">
                        <text class="title-text">核心特性</text>
                        <view class="title-decoration"></view>
                    </view>
                </view>

                <view class="features-grid">
                    <view class="feature-card">
                        <view class="feature-icon">✨</view>
                        <view class="feature-title">极简设计</view>
                        <view class="feature-desc">黑白配色，简洁优雅</view>
                    </view>
                    <view class="feature-card">
                        <view class="feature-icon">🔔</view>
                        <view class="feature-title">角标支持</view>
                        <view class="feature-desc">显示购物车数量等信息</view>
                    </view>
                    <view class="feature-card">
                        <view class="feature-icon">🎯</view>
                        <view class="feature-title">点击反馈</view>
                        <view class="feature-desc">缩放动画，交互流畅</view>
                    </view>
                    <view class="feature-card">
                        <view class="feature-icon">📐</view>
                        <view class="feature-title">安全适配</view>
                        <view class="feature-desc">自动适配 iPhone X+</view>
                    </view>
                </view>
            </view>

            <view class="tabs-section">
                <view class="section-header">
                    <view class="section-title">
                        <text class="title-text">标签页配置</text>
                        <view class="title-decoration"></view>
                    </view>
                </view>

                <view class="tabs-list">
                    <view class="tab-config-item" v-for="(item, index) in tabConfig" :key="index">
                        <view class="tab-icon-wrapper">
                            <image class="tab-icon" :src="item.selectedIcon" mode="aspectFit" />
                        </view>

                        <view class="tab-info">
                            <view class="tab-name">{{ item.name }}</view>
                            <view class="tab-path">{{ item.path }}</view>
                        </view>

                        <view class="tab-status">
                            <text class="status-text">其他</text>
                        </view>
                    </view>
                </view>
            </view>

            <view class="usage-section">
                <view class="section-header">
                    <view class="section-title">
                        <text class="title-text">使用方法</text>
                        <view class="title-decoration"></view>
                    </view>
                </view>

                <view class="usage-steps">
                    <view class="step-card">
                        <view class="step-number">1</view>
                        <view class="step-content">
                            <view class="step-title">引入组件</view>
                            <view class="step-code">"usingComponents": { "custom-tab": "/components/custom-tab/custom-tab" }</view>
                        </view>
                    </view>
                    <view class="step-card">
                        <view class="step-number">2</view>
                        <view class="step-content">
                            <view class="step-title">使用组件</view>
                            <view class="step-code">&lt;custom-tab activeTab="{{ activeTab }}" bindtabchange="onTabChange" /&gt;</view>
                        </view>
                    </view>
                    <view class="step-card">
                        <view class="step-number">3</view>
                        <view class="step-content">
                            <view class="step-title">处理事件</view>
                            <view class="step-code">onTabChange(e) { this.setData({ activeTab: e.detail.activeTab }) }</view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="status-section">
                <view class="section-header">
                    <view class="section-title">
                        <text class="title-text">当前状态</text>
                        <view class="title-decoration"></view>
                    </view>
                </view>

                <view class="status-card">
                    <view class="status-row">
                        <text class="status-label">当前选中：</text>
                        <text class="status-value">{{ activeTabName }}</text>
                    </view>
                    <view class="status-row">
                        <text class="status-label">组件版本：</text>
                        <text class="status-value">v1.0.0</text>
                    </view>
                    <view class="status-row">
                        <text class="status-label">最后更新：</text>
                        <text class="status-value">2026-03-18</text>
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
            activeTabName: '首页',

            tabConfig: [
                {
                    id: 0,
                    name: '首页',
                    path: '/pages/index/index',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/首页 (选中).png'
                },
                {
                    id: 1,
                    name: '商城',
                    path: '/pages/Product_list_page/Product_list_page',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/商城（选中）.png'
                },
                {
                    id: 2,
                    name: '选品',
                    path: '/pages/selection/selection',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/选品（选中）.png'
                },
                {
                    id: 3,
                    name: '研发',
                    path: '/pages/rd/rd',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/研发（选中）.png'
                },
                {
                    id: 4,
                    name: '我的',
                    path: '/pages/Profile_page/Profile_page',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/我的 (选中).png'
                }
            ],

            activeTab: ''
        };
    },
    onLoad(options) {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1];
        const route = currentPage.route;
        const tabMap = {
            'pages/index/index': 0,
            'pages/Product_list_page/Product_list_page': 1,
            'pages/selection/selection': 2,
            'pages/rd/rd': 3,
            'pages/Profile_page/Profile_page': 4
        };
        const tabNames = ['首页', '商城', '选品', '研发', '我的'];
        const activeTab = tabMap[route] || 0;
        this.setData({
            activeTabName: tabNames[activeTab]
        });
    },
    methods: {}
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.demo-page {
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

.hero-section {
    margin-bottom: 40rpx;
}

.hero-card {
    background: linear-gradient(135deg, #1a1a1a 0%, #4a4a4a 100%);
    border-radius: 32rpx;
    padding: 48rpx;
    display: flex;
    align-items: center;
    gap: 32rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.hero-icon {
    font-size: 80rpx;
    width: 160rpx;
    height: 160rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.hero-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.hero-title {
    font-size: 48rpx;
    color: #ffffff;
    font-weight: 600;
    letter-spacing: 1rpx;
}

.hero-desc {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
    letter-spacing: 0.5rpx;
    line-height: 1.5;
}

.features-section {
    margin-bottom: 40rpx;
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

.features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16rpx;
}

.feature-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.feature-icon {
    font-size: 56rpx;
    width: 112rpx;
    height: 112rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.feature-title {
    font-size: 28rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.feature-desc {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.3rpx;
    text-align: center;
}

.tabs-section {
    margin-bottom: 40rpx;
}

.tabs-list {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.tab-config-item {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.tab-icon-wrapper {
    width: 80rpx;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.tab-icon {
    width: 48rpx;
    height: 48rpx;
}

.tab-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.tab-name {
    font-size: 28rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.tab-path {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.3rpx;
    font-family: 'Courier New', monospace;
}

.tab-status {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 600;
    letter-spacing: 0.5rpx;
    flex-shrink: 0;
}

.tab-status.active {
    background: #1a1a1a;
    color: #ffffff;
}

.tab-status:not(.active) {
    background: #f5f5f5;
    color: #999999;
}

.status-text {
    font-size: 22rpx;
    letter-spacing: 0.5rpx;
}

.usage-section {
    margin-bottom: 40rpx;
}

.usage-steps {
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.step-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    display: flex;
    align-items: center;
    gap: 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.step-number {
    font-size: 48rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: -1rpx;
    flex-shrink: 0;
    width: 80rpx;
    height: 80rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.step-title {
    font-size: 28rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.step-code {
    font-size: 22rpx;
    color: #666666;
    font-weight: 400;
    letter-spacing: 0.3rpx;
    font-family: 'Courier New', monospace;
    background: #f5f5f5;
    padding: 12rpx 16rpx;
    border-radius: 12rpx;
    line-height: 1.6;
}

.status-section {
    margin-bottom: 40rpx;
}

.status-card {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16rpx 0;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.status-row:last-child {
    border-bottom: none;
}

.status-label {
    font-size: 26rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.status-value {
    font-size: 28rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}
</style>
