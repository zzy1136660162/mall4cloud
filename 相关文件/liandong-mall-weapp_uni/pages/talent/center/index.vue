<template>
    <!-- 达人中心页 -->
    <view class="center-container">
        <!-- 顶部渐变区域 -->
        <view class="header">
            <!-- 达人信息卡片 -->
            <view class="talent-card" v-if="isTalent">
                <view class="talent-badge">
                    <text class="badge-icon">🏅</text>
                    <text class="badge-text">认证达人</text>
                </view>
                <view class="talent-info">
                    <image class="avatar" :src="talentInfo.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" mode="aspectFill"></image>
                    <view class="info-detail">
                        <text class="name">{{ talentInfo.realName || '-' }}</text>
                        <text class="region">{{ talentInfo.region || '-' }}</text>
                        <text class="auth-time">认证时间：{{ talentInfo.auditTime || '-' }}</text>
                    </view>
                </view>
            </view>

            <!-- 非达人用户 -->
            <view class="non-talent-card" v-else>
                <view class="talent-badge">
                    <text class="badge-icon">🎯</text>
                    <text class="badge-text">成为达人</text>
                </view>
                <view class="non-talent-content">
                    <text class="non-talent-title">您还不是达人</text>
                    <text class="non-talent-desc">成为达人后可以享受专属权益，开始您的达人之旅吧！</text>
                </view>
            </view>
        </view>

        <!-- 达人条件（仅非达人显示） -->
        <view class="conditions-section" v-if="!isTalent">
            <view class="section-title">成为达人条件</view>
            <view class="conditions-list">
                <view class="condition-item">
                    <view class="condition-icon">
                        <text class="icon-text">✓</text>
                    </view>
                    <view class="condition-content">
                        <text class="condition-title">完成实名认证</text>
                        <text class="condition-desc">使用真实姓名和手机号进行认证</text>
                    </view>
                </view>
                <view class="condition-item">
                    <view class="condition-icon">
                        <text class="icon-text">✓</text>
                    </view>
                    <view class="condition-content">
                        <text class="condition-title">拥有推广意向</text>
                        <text class="condition-desc">对产品推广有浓厚兴趣</text>
                    </view>
                </view>
                <view class="condition-item">
                    <view class="condition-icon">
                        <text class="icon-text">✓</text>
                    </view>
                    <view class="condition-content">
                        <text class="condition-title">具备社交能力</text>
                        <text class="condition-desc">有一定的社交网络或推广渠道</text>
                    </view>
                </view>
            </view>

            <!-- 达人权益 -->
            <view class="benefits-box">
                <view class="benefits-title">成为达人你将获得</view>
                <view class="benefits-grid">
                    <view class="benefit-item">
                        <text class="benefit-icon">🏅</text>
                        <text class="benefit-text">专属达人标识</text>
                    </view>
                    <view class="benefit-item">
                        <text class="benefit-icon">💰</text>
                        <text class="benefit-text">推广佣金奖励</text>
                    </view>
                    <view class="benefit-item">
                        <text class="benefit-icon">📦</text>
                        <text class="benefit-text">免费样品申领</text>
                    </view>
                    <view class="benefit-item">
                        <text class="benefit-icon">🔬</text>
                        <text class="benefit-text">参与产品研发</text>
                    </view>
                </view>
            </view>

            <!-- 申请按钮 -->
            <view class="apply-btn-box">
                <view class="apply-btn" @tap="goToApply">立即申请成为达人</view>
            </view>
        </view>

        <!-- 功能入口（仅达人显示） -->
        <view class="function-section" v-if="isTalent">
            <view class="section-title">达人功能</view>

            <view class="function-list">
                <!-- 选品池 -->
                <view class="function-item" @tap="goToSelectionPool">
                    <view class="item-icon">
                        <text>🛒</text>
                    </view>
                    <view class="item-content">
                        <text class="item-name">选品池</text>
                        <text class="item-desc">挑选优质商品进行推广</text>
                    </view>
                    <text class="item-arrow">></text>
                </view>

                <!-- 样品申请 -->
                <view class="function-item" @tap="goToSampleApply">
                    <view class="item-icon">
                        <text>📦</text>
                    </view>
                    <view class="item-content">
                        <text class="item-name">样品申请</text>
                        <text class="item-desc">申请样品进行测试体验</text>
                    </view>
                    <text class="item-arrow">></text>
                </view>

                <!-- 研发需求 -->
                <view class="function-item" @tap="goToRdDemand">
                    <view class="item-icon">
                        <text>🔬</text>
                    </view>
                    <view class="item-content">
                        <text class="item-name">研发需求</text>
                        <text class="item-desc">发布定制研发需求</text>
                    </view>
                    <text class="item-arrow">></text>
                </view>
            </view>
        </view>

        <!-- 数据概览（仅达人显示） -->
        <view class="stats-section" v-if="isTalent">
            <view class="section-title">数据概览</view>
            <view class="stats-grid">
                <view class="stat-item">
                    <text class="stat-value">{{ stats.promotionCount }}</text>
                    <text class="stat-label">推广单</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ stats.sampleCount }}</text>
                    <text class="stat-label">样品单</text>
                </view>
                <view class="stat-item">
                    <text class="stat-value">{{ stats.demandCount }}</text>
                    <text class="stat-label">研发单</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
// 达人中心页
const { talentApi } = require('../../../utils/api.js');
export default {
    data() {
        return {
            isTalent: false,
            talentInfo: {
                avatar: '',
                realName: '',
                region: '',
                auditTime: ''
            },
            stats: {
                promotionCount: 0,
                sampleCount: 0,
                demandCount: 0
            }
        };
    },
    onLoad() {
        this.loadTalentInfo();
    },
    onShow() {
        this.loadTalentInfo();
    },
    methods: {
        // 加载达人信息
        loadTalentInfo() {
            uni.showLoading({
                title: '加载中'
            });
            talentApi
                .getTalentInfo()
                .then((data) => {
                    uni.hideLoading();
                    if (data && data.isTalent) {
                        this.setData({
                            isTalent: true,
                            talentInfo: data.talentInfo || this.talentInfo,
                            stats: data.stats || this.stats
                        });
                    } else {
                        this.setData({
                            isTalent: false,
                            talentInfo: {
                                avatar: '',
                                realName: '',
                                region: '',
                                auditTime: ''
                            },
                            stats: {
                                promotionCount: 0,
                                sampleCount: 0,
                                demandCount: 0
                            }
                        });
                    }
                })
                .catch((error) => {
                    uni.hideLoading();
                    console.log('不是达人或加载失败:', error);
                    this.setData({
                        isTalent: false,
                        talentInfo: {
                            avatar: '',
                            realName: '',
                            region: '',
                            auditTime: ''
                        },
                        stats: {
                            promotionCount: 0,
                            sampleCount: 0,
                            demandCount: 0
                        }
                    });
                });
        },

        // 跳转到选品池
        goToSelectionPool() {
            uni.switchTab({
                url: '/pages/xuanpinindex/xuanpinindex'
            });
        },

        // 跳转到样品申请
        goToSampleApply() {
            uni.navigateTo({
                url: '/pages/sample/apply/index'
            });
        },

        // 跳转到研发需求
        goToRdDemand() {
            uni.switchTab({
                url: '/pages/rd_index/rd_index'
            });
        },

        // 跳转到达人申请页面
        goToApply() {
            uni.navigateTo({
                url: '/pages/talent/apply/index'
            });
        }
    }
};
</script>
<style>
/* 达人中心页样式 */
.center-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 顶部渐变区域 */
.header {
    background: linear-gradient(to bottom, #fe944dff 0%, #ffffffff 100%);
    padding-bottom: 120rpx;
}

/* 达人信息卡片 */
.talent-card {
    padding: 20rpx 30rpx 0;
}

.talent-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(139, 90, 0, 0.8);
    padding: 10rpx 24rpx;
    border-radius: 30rpx;
    margin-bottom: 20rpx;
}

.badge-icon {
    font-size: 28rpx;
    margin-right: 6rpx;
}

.badge-text {
    font-size: 26rpx;
    color: #fff;
    font-weight: 500;
}

.talent-info {
    display: flex;
    align-items: center;
}

.avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    border: 4rpx solid rgba(255, 255, 255, 0.5);
    margin-right: 24rpx;
}

.info-detail {
    flex: 1;
}

.name {
    display: block;
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 10rpx;
}

.region {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 8rpx;
}

.auth-time {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.8);
}

/* 非达人卡片 */
.non-talent-card {
    padding: 20rpx 30rpx 0;
}

.non-talent-card .talent-badge {
    background: rgba(100, 100, 100, 0.8);
}

.non-talent-content {
    padding: 20rpx 0;
}

.non-talent-title {
    display: block;
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 16rpx;
}

.non-talent-desc {
    display: block;
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.6;
}

/* 达人条件区域 */
.conditions-section {
    background: #fff;
    margin: -100rpx 20rpx 20rpx;
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.conditions-list {
    margin-bottom: 30rpx;
}

.condition-item {
    display: flex;
    align-items: flex-start;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.condition-item:last-child {
    border-bottom: none;
}

.condition-icon {
    width: 48rpx;
    height: 48rpx;
    background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20rpx;
    flex-shrink: 0;
}

.icon-text {
    font-size: 24rpx;
    color: #fff;
    font-weight: bold;
}

.condition-content {
    flex: 1;
}

.condition-title {
    display: block;
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 8rpx;
}

.condition-desc {
    display: block;
    font-size: 26rpx;
    color: #999;
    line-height: 1.5;
}

/* 权益展示 */
.benefits-box {
    background: linear-gradient(135deg, #fff8f0 0%, #fff 100%);
    border-radius: 16rpx;
    padding: 24rpx;
    margin-bottom: 30rpx;
}

.benefits-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #fe944dff;
    margin-bottom: 20rpx;
    text-align: center;
}

.benefits-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;
}

.benefits-grid .benefit-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx;
}

.benefit-icon {
    font-size: 48rpx;
    margin-bottom: 12rpx;
}

.benefit-text {
    font-size: 26rpx;
    color: #666;
    text-align: center;
}

/* 申请按钮 */
.apply-btn-box {
    padding: 20rpx 0;
}

.apply-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #fe944dff 0%, #ffad73 100%);
    border-radius: 44rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 功能入口 */
.function-section {
    background: #fff;
    margin: -110rpx 20rpx 20rpx;
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
}

.function-list {
    display: flex;
    flex-direction: column;
}

.function-item {
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.function-item:last-child {
    border-bottom: none;
}

.item-icon {
    width: 80rpx;
    height: 80rpx;
    background: linear-gradient(135deg, #fe944dff 0%, #ffad73 100%);
    border-radius: 20rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 24rpx;
}

.item-icon text {
    font-size: 40rpx;
}

.item-content {
    flex: 1;
}

.item-name {
    display: block;
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 8rpx;
}

.item-desc {
    display: block;
    font-size: 26rpx;
    color: #999;
}

.item-arrow {
    font-size: 28rpx;
    color: #ccc;
}

/* 数据概览 */
.stats-section {
    background: #fff;
    margin: 20rpx;
    border-radius: 24rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.stats-grid {
    display: flex;
    justify-content: space-around;
    padding: 20rpx 0;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-value {
    display: block;
    font-size: 48rpx;
    font-weight: bold;
    color: #fe944dff;
    margin-bottom: 12rpx;
}

.stat-label {
    display: block;
    font-size: 26rpx;
    color: #999;
}
</style>
