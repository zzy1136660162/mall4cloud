<template>
    <view class="container">
        <!-- Banner区域 -->
        <view class="banner">
            <view class="banner-title">电商选品研发需求平台</view>
            <view class="banner-subtitle">提交您的研发需求，我们为您定制专属产品</view>
        </view>

        <!-- 快捷入口 -->
        <view class="card">
            <view class="section-title">快捷入口</view>
            <view class="quick-actions">
                <view class="action-item" @tap="goToSubmit">
                    <view class="action-icon submit-icon">+</view>
                    <text class="action-text">提交需求</text>
                </view>
                <view class="action-item" @tap="goToList">
                    <image class="action-icon-img" src="/static/images/我的需求 (2).png" mode="aspectFit"></image>
                    <text class="action-text">我的需求</text>
                </view>
                <view class="action-item" @tap="goToTalentPool">
                    <view class="action-icon submit-icon">🎯</view>
                    <text class="action-text">人才库</text>
                </view>
            </view>
        </view>

        <!-- 服务流程 -->
        <view class="card">
            <view class="section-title">服务流程</view>
            <view class="process-list">
                <view class="process-item">
                    <view class="process-step">1</view>
                    <view class="process-content">
                        <text class="process-title">提交需求</text>
                        <text class="process-desc">填写您的研发需求信息</text>
                    </view>
                </view>
                <view class="process-item">
                    <view class="process-step">2</view>
                    <view class="process-content">
                        <text class="process-title">需求确认</text>
                        <text class="process-desc">专业团队评估需求可行性</text>
                    </view>
                </view>
                <view class="process-item">
                    <view class="process-step">3</view>
                    <view class="process-content">
                        <text class="process-title">研发制作</text>
                        <text class="process-desc">进入产品研发阶段</text>
                    </view>
                </view>
                <view class="process-item">
                    <view class="process-step">4</view>
                    <view class="process-content">
                        <text class="process-title">进度跟踪</text>
                        <text class="process-desc">实时查看研发进度</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 最近需求 -->
        <view class="card" v-if="recentDemands.length > 0">
            <view class="section-title flex-between">
                <text>最近需求</text>
                <text class="link-text" @tap="goToList">查看全部 ></text>
            </view>
            <view class="demand-list">
                <view class="demand-item" @tap="goToDetail" :data-id="item.id" v-for="(item, index) in recentDemands" :key="index">
                    <view class="demand-header">
                        <text class="demand-title">{{ item.title }}</text>
                        <text :class="'status-tag status-' + item.statusClass">{{ item.statusText }}</text>
                    </view>

                    <view class="demand-info">
                        <text>提交时间：{{ item.submitTime }}</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部提示 -->
        <view class="footer-text">
            <text>专业定制 · 品质保障 · 全程跟踪</text>
        </view>
    </view>
</template>

<script>
// rd_index.js
const app = getApp();
export default {
    data() {
        return {
            recentDemands: []
        };
    },
    onLoad() {
        this.loadRecentDemands();
    },
    onShow() {
        this.loadRecentDemands();
    },
    methods: {
        loadRecentDemands() {
            const submitterId = app.globalData.userId;
            uni.request({
                url: `${app.globalData.apiBaseUrl}/demand/list`,
                method: 'GET',
                data: {
                    submitterId,
                    page: 1,
                    pageSize: 3
                },
                success: (res) => {
                    if (res.data.code === 200 && res.data.data) {
                        this.setData({
                            recentDemands: res.data.data.list || []
                        });
                    }
                },
                fail: (err) => {
                    console.error('加载需求列表失败', err);
                }
            });
        },

        goToSubmit() {
            // 检查是否已登录
            const token = uni.getStorageSync('token');
            if (!token) {
                uni.navigateTo({
                    url: '/pages/login/index'
                });
                return;
            }
            uni.navigateTo({
                url: '/pages/demandSubmit/demandSubmit'
            });
        },

        goToList() {
            uni.navigateTo({
                url: '/pages/demandList/demandList'
            });
        },

        goToTalentPool() {
            const token = uni.getStorageSync('token');
            if (!token) {
                uni.navigateTo({
                    url: '/pages/login/index'
                });
                return;
            }
            uni.navigateTo({
                url: '/pages/talent_pool/index/index'
            });
        },

        goToDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/demandDetail/demandDetail?id=${id}`
            });
        },

        goToChat() {
            uni.navigateTo({
                url: '/pages/chat/chat'
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

/* Banner区域 */
.banner {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    padding: 80rpx 40rpx 100rpx;
    text-align: center;
    color: #333;
    position: relative;
    overflow: hidden;
}

.banner::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 400rpx;
    height: 400rpx;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
}

.banner::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 300rpx;
    height: 300rpx;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
}

.banner-title {
    font-size: 48rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    position: relative;
    z-index: 1;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.1);
}

.banner-subtitle {
    font-size: 28rpx;
    opacity: 0.95;
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
    position: relative;
    z-index: 2;
    margin-top: -40rpx;
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
    background: linear-gradient(180deg, #1890ff 0%, #36cfc9 100%);
    border-radius: 4rpx;
    margin-right: 16rpx;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.link-text {
    font-size: 26rpx;
    color: #1890ff;
    display: flex;
    align-items: center;
    font-weight: 500;
}

/* 快捷入口 */
.quick-actions {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
}

.action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 50rpx;
    transition: transform 0.2s;
}

.action-item:active {
    transform: scale(0.95);
}

.action-icon {
    width: 140rpx;
    height: 140rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 64rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
    position: relative;
    overflow: hidden;
}

.action-icon::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
}

.submit-icon {
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
}

.list-icon {
    background: linear-gradient(135deg, #52c41a 0%, #95de64 100%);
}

.action-icon-img {
    width: 140rpx;
    height: 140rpx;
    border-radius: 36rpx;
    margin-bottom: 20rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.12);
    background: linear-gradient(135deg, #fffbe6 0%, #fff7e6 100%);
    padding: 30rpx;
    box-sizing: border-box;
}

.action-text {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
}

/* 服务流程 */
.process-list {
    padding: 10rpx 0;
}

.process-item {
    display: flex;
    align-items: center;
    margin-bottom: 36rpx;
    padding: 24rpx;
    background: #fafafa;
    border-radius: 16rpx;
    transition: all 0.3s;
}

.process-item:active {
    background: #fffbe6;
    transform: translateX(10rpx);
}

.process-item:last-child {
    margin-bottom: 0;
}

.process-step {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    margin-right: 24rpx;
    flex-shrink: 0;
    box-shadow: 0 4rpx 12rpx rgba(245, 213, 71, 0.3);
}

.process-content {
    flex: 1;
}

.process-title {
    font-size: 32rpx;
    color: #1a1a1a;
    font-weight: 600;
    display: block;
    margin-bottom: 8rpx;
}

.process-desc {
    font-size: 26rpx;
    color: #666;
    display: block;
}

/* 最近需求 */
.demand-list {
    margin-top: 20rpx;
}

.demand-item {
    background: #fff9f0;
    border-radius: 16rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    transition: all 0.3s;
    border: 2rpx solid #ffe7ba;
}

.demand-item:last-child {
    margin-bottom: 0;
}

.demand-item:active {
    background: #fff3e0;
    border-color: #ffc773;
    transform: translateY(-4rpx);
    box-shadow: 0 8rpx 24rpx rgba(255, 165, 0, 0.15);
}

.demand-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.demand-title {
    font-size: 32rpx;
    color: #5c3810;
    font-weight: 600;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 20rpx;
}

.status-tag {
    font-size: 24rpx;
    padding: 8rpx 20rpx;
    border-radius: 24rpx;
    font-weight: 500;
}

.status-pending {
    background: #fff7e6;
    color: #fa8c16;
}

.status-confirming {
    background: #e6f7ff;
    color: #1890ff;
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

.demand-info {
    font-size: 26rpx;
    color: #999;
}

/* 底部提示 */
.footer-text {
    text-align: center;
    padding: 40rpx 30rpx 60rpx;
    font-size: 26rpx;
    color: #999;
    letter-spacing: 4rpx;
}

/* 浮动提交按钮 */
.fab {
    position: fixed;
    right: 40rpx;
    bottom: 140rpx;
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #f5d547 0%, #ffec8b 100%);
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 60rpx;
    box-shadow: 0 8rpx 32rpx rgba(245, 213, 71, 0.4);
    z-index: 100;
    transition: all 0.3s;
}

.fab::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
}

.fab:active {
    transform: scale(0.9);
    box-shadow: 0 4rpx 16rpx rgba(245, 213, 71, 0.3);
}

/* 客服入口按钮 */
.customer-service-btn {
    position: fixed;
    right: 40rpx;
    bottom: 280rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 24rpx rgba(82, 196, 26, 0.4);
    z-index: 100;
    transition: all 0.3s;
}

.customer-service-btn:active {
    transform: scale(0.9);
    box-shadow: 0 4rpx 12rpx rgba(82, 196, 26, 0.3);
}

.service-icon {
    font-size: 50rpx;
}
</style>
