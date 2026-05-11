<template>
    <!-- 会员中心页 -->
    <view class="member-container">
        <!-- 会员等级卡片 -->
        <view class="member-card">
            <view class="card-header">
                <text class="card-title">{{ memberInfo.levelName || '普通用户' }}</text>
                <view class="vip-badge" v-if="memberInfo.isMember">
                    <text class="vip-icon">👑</text>
                    <text class="vip-text">VIP</text>
                </view>
            </view>
            <view class="card-body">
                <text class="discount-text" v-if="memberInfo.isMember">全场商品享{{ memberInfo.discount * 100 }}折优惠</text>
                <text class="discount-text" v-else>完成首单购买即可升级为VIP会员</text>
            </view>
            <view class="card-footer" v-if="memberInfo.validEnd">
                <text class="valid-text">有效期至：{{ memberInfo.validEnd }}</text>
            </view>
            <view class="card-footer" v-else>
                <text class="valid-text">有效期：永久</text>
            </view>
        </view>

        <!-- 会员权益 -->
        <view class="benefits-section" v-if="memberInfo.isMember">
            <view class="section-title">会员权益</view>
            <view class="benefits-grid">
                <view class="benefit-item" v-for="(item, index) in memberInfo.benefits" :key="index">
                    <view class="benefit-icon">
                        <text v-if="item.type === 'discount'">🎁</text>
                        <text v-else-if="item.type === 'points'">💰</text>
                        <text v-else-if="item.type === 'priority'">🚀</text>
                        <text v-else-if="">✨</text>
                    </view>

                    <text class="benefit-name">{{ item.name }}</text>
                </view>
            </view>
        </view>

        <!-- 升级规则 -->
        <view class="upgrade-section">
            <view class="section-title">升级规则</view>
            <view class="upgrade-steps">
                <!-- 普通用户 -->
                <view :class="'step-item ' + (currentLevel === 'normal' ? 'active' : '')">
                    <view class="step-icon">
                        <text v-if="currentLevel !== 'normal'">✓</text>
                        <text v-else-if="">1</text>
                    </view>
                    <view class="step-content">
                        <text class="step-title">普通用户</text>
                        <text class="step-desc">注册即成为普通用户</text>
                    </view>
                </view>
                <view :class="'step-line ' + (currentLevel !== 'normal' ? 'active' : '')"></view>

                <!-- VIP会员 -->
                <view :class="'step-item ' + (currentLevel === 'vip' ? 'active' : '') + ' ' + (currentLevel === 'normal' ? 'pending' : '')">
                    <view class="step-icon">
                        <text v-if="currentLevel === 'partner'">✓</text>
                        <text v-else-if="">2</text>
                    </view>
                    <view class="step-content">
                        <text class="step-title">VIP会员</text>
                        <text class="step-desc">完成首单购买自动升级，享受全场95折优惠</text>
                    </view>
                </view>
                <view :class="'step-line ' + (currentLevel === 'partner' ? 'active' : '')"></view>

                <!-- 合伙人 -->
                <view :class="'step-item ' + (currentLevel === 'partner' ? 'active' : '') + ' ' + (currentLevel !== 'partner' ? 'pending' : '')">
                    <view class="step-icon">3</view>
                    <view class="step-content">
                        <text class="step-title">合伙人</text>
                        <text class="step-desc">推广业绩达标后可申请成为合伙人</text>
                    </view>
                </view>
            </view>
        </view>

        <!-- 当前等级说明 -->
        <view class="current-level-info" v-if="memberInfo.upgradeCondition">
            <view class="info-title">当前等级说明</view>
            <text class="info-text">{{ memberInfo.upgradeCondition }}</text>
        </view>
    </view>
</template>

<script>
// 会员中心页
const { api } = require('../../../utils/api.js');
export default {
    data() {
        return {
            memberInfo: {
                isMember: false,
                levelCode: '',
                levelName: '',
                discount: 1,
                benefits: [],
                upgradeCondition: '',
                validStart: '',
                validEnd: ''
            },
            currentLevel: 'normal'
        };
    },
    onLoad() {
        this.loadMemberInfo();
    },
    onShow() {
        this.loadMemberInfo();
    },
    methods: {
        // 加载会员信息
        async loadMemberInfo() {
            try {
                uni.showLoading({
                    title: '加载中'
                });
                const userInfo = await api.get('/api/user/info');
                uni.hideLoading();
                const memberLevel = userInfo.memberLevel || {};
                this.setData({
                    memberInfo: {
                        isMember: userInfo.isMember || false,
                        levelCode: memberLevel.levelCode || 'normal',
                        levelName: memberLevel.levelName || '普通用户',
                        discount: memberLevel.discount || 1,
                        benefits: memberLevel.benefits || [],
                        upgradeCondition: memberLevel.upgradeCondition || '完成首单购买自动升级为VIP',
                        validStart: memberLevel.validStart || '',
                        validEnd: memberLevel.validEnd || ''
                    },
                    currentLevel: memberLevel.levelCode || 'normal'
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                uni.hideLoading();
                console.error('加载会员信息失败:', error);
                uni.showToast({
                    title: '加载失败',
                    icon: 'none'
                });
            }
        }
    }
};
</script>
<style>
/* 会员中心页样式 */
.member-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding: 30rpx;
}

/* 会员等级卡片 */
.member-card {
    background: linear-gradient(135deg, #fe944dff 0%, #ffb800 100%);
    border-radius: 24rpx;
    padding: 40rpx;
    color: #fff;
    margin-bottom: 30rpx;
    box-shadow: 0 8rpx 30rpx rgba(254, 148, 77, 0.3);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
}

.card-title {
    font-size: 48rpx;
    font-weight: bold;
}

.vip-badge {
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 12rpx 24rpx;
    border-radius: 30rpx;
    backdrop-filter: blur(10rpx);
}

.vip-icon {
    font-size: 32rpx;
    margin-right: 8rpx;
}

.vip-text {
    font-size: 28rpx;
    font-weight: bold;
}

.card-body {
    margin-bottom: 20rpx;
}

.discount-text {
    font-size: 32rpx;
    opacity: 0.95;
}

.card-footer {
    padding-top: 20rpx;
    border-top: 1rpx solid rgba(255, 255, 255, 0.2);
}

.valid-text {
    font-size: 26rpx;
    opacity: 0.8;
}

/* 会员权益 */
.benefits-section {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 30rpx;
}

.benefits-grid {
    display: flex;
    flex-wrap: wrap;
}

.benefit-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 33.33%;
    padding: 20rpx 0;
}

.benefit-icon {
    width: 100rpx;
    height: 100rpx;
    background: linear-gradient(135deg, #fe944dff 0%, #ffb800 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    margin-bottom: 16rpx;
}

.benefit-name {
    font-size: 26rpx;
    color: #666;
}

/* 升级规则 */
.upgrade-section {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.upgrade-steps {
    padding: 20rpx 0;
}

.step-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20rpx;
}

.step-item.active .step-icon {
    background: linear-gradient(135deg, #fe944dff 0%, #ffb800 100%);
    color: #fff;
}

.step-item.active .step-title {
    color: #fe944dff;
    font-weight: bold;
}

.step-item.pending .step-icon {
    background: #e0e0e0;
    color: #999;
}

.step-item.pending .step-title {
    color: #999;
}

.step-item.pending .step-desc {
    color: #bbb;
}

.step-icon {
    width: 60rpx;
    height: 60rpx;
    background: linear-gradient(135deg, #fe944dff 0%, #ffb800 100%);
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: bold;
    margin-right: 20rpx;
    flex-shrink: 0;
}

.step-content {
    flex: 1;
    padding-top: 8rpx;
}

.step-title {
    display: block;
    font-size: 30rpx;
    color: #333;
    margin-bottom: 8rpx;
}

.step-desc {
    display: block;
    font-size: 26rpx;
    color: #999;
    line-height: 1.4;
}

.step-line {
    width: 2rpx;
    height: 60rpx;
    background: #e0e0e0;
    margin-left: 29rpx;
    margin-bottom: 20rpx;
}

.step-line.active {
    background: linear-gradient(180deg, #fe944dff 0%, #ffb800 100%);
}

/* 当前等级说明 */
.current-level-info {
    background: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.info-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.info-text {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
}
</style>
