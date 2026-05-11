<template>
    <view class="container">
        <!-- 加载状态 -->
        <view class="loading-state" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 人才详情 -->
        <view class="detail-content" v-if="!loading && talentInfo">
            <!-- 头部信息卡片 -->
            <view class="header-card">
                <view class="header-bg"></view>
                <view class="header-info">
                    <image class="avatar" :src="talentInfo.avatar" mode="aspectFill"></image>
                    <view class="info-text">
                        <text class="name">{{ talentInfo.name }}</text>
                        <text class="title">{{ talentInfo.title }}</text>
                        <view class="region" v-if="talentInfo.region">
                            <text class="region-icon">📍</text>
                            <text class="region-text">{{ talentInfo.region }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 基本信息 -->
            <view class="section">
                <view class="section-header">
                    <text class="section-icon">📋</text>
                    <text class="section-title">基本信息</text>
                </view>
                <view class="section-body">
                    <view class="info-grid">
                        <view class="info-item">
                            <text class="info-label">从业年限</text>
                            <text class="info-value">{{ talentInfo.experienceYears }}年</text>
                        </view>
                        <view class="info-item" v-if="talentInfo.education">
                            <text class="info-label">学历</text>
                            <text class="info-value">{{ talentInfo.education }}</text>
                        </view>
                    </view>
                    <view class="info-row" v-if="talentInfo.expertiseAreas.length > 0">
                        <text class="info-label">专注领域</text>
                        <view class="tag-list">
                            <text class="tag" v-for="(item, index) in talentInfo.expertiseAreas" :key="index">{{ item }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 专业技能 -->
            <view class="section" v-if="talentInfo.skills.length > 0">
                <view class="section-header">
                    <text class="section-icon">🎯</text>
                    <text class="section-title">专业技能</text>
                </view>
                <view class="section-body">
                    <view class="skill-list">
                        <view class="skill-item" v-for="(item, index) in talentInfo.skills" :key="index">
                            <text class="skill-dot">•</text>

                            <text class="skill-text">{{ item }}</text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 个人简介 -->
            <view class="section" v-if="talentInfo.intro">
                <view class="section-header">
                    <text class="section-icon">💬</text>
                    <text class="section-title">个人简介</text>
                </view>
                <view class="section-body">
                    <text class="intro-text">{{ talentInfo.intro }}</text>
                </view>
            </view>

            <!-- 项目经验 -->
            <view class="section" v-if="talentInfo.projectExperience.length > 0">
                <view class="section-header">
                    <text class="section-icon">💼</text>
                    <text class="section-title">项目经验</text>
                </view>
                <view class="section-body">
                    <view class="project-list">
                        <view class="project-item" v-for="(item, index) in talentInfo.projectExperience" :key="index">
                            <view class="project-header">
                                <text class="project-index">{{ index + 1 }}</text>
                                <text class="project-name">{{ item.name }}</text>
                            </view>

                            <view class="project-desc" v-if="item.description">
                                <text class="desc-label">项目描述：</text>
                                <text class="desc-text">{{ item.description }}</text>
                            </view>

                            <view class="project-result" v-if="item.result">
                                <text class="result-label">项目成果：</text>
                                <text class="result-text">{{ item.result }}</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 成果荣誉 -->
            <view class="section" v-if="talentInfo.achievements.length > 0">
                <view class="section-header">
                    <text class="section-icon">🏆</text>
                    <text class="section-title">成果荣誉</text>
                </view>
                <view class="section-body">
                    <view class="achievement-list">
                        <view class="achievement-item" v-for="(item, index) in talentInfo.achievements" :key="index">
                            <text class="achievement-icon">✦</text>

                            <text class="achievement-text">{{ item }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 底部占位 -->
        <view class="bottom-space"></view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            talentId: null,
            talentInfo: null,
            loading: true
        };
    },
    onLoad(options) {
        const { id } = options;
        if (id) {
            this.setData({
                talentId: parseInt(id)
            });
            this.loadTalentDetail();
        } else {
            uni.showToast({
                title: '参数错误',
                icon: 'none'
            });
            setTimeout(() => {
                uni.navigateBack();
            }, 1500);
        }
    },
    onShareAppMessage() {
        const { talentInfo } = this;
        return {
            title: `${talentInfo.name} - ${talentInfo.title}`,
            path: `/pages/talent_pool/detail/detail?id=${this.talentId}`
        };
    },
    methods: {
        loadTalentDetail() {
            uni.showLoading({
                title: '加载中...'
            });
            app.globalData.request({
                url: `/api/talent_pool/detail/${this.talentId}`,
                success: (res) => {
                    uni.hideLoading();
                    if (res.data) {
                        this.setData({
                            talentInfo: res.data,
                            loading: false
                        });
                    } else {
                        uni.showToast({
                            title: '人才信息不存在',
                            icon: 'none'
                        });
                        setTimeout(() => {
                            uni.navigateBack();
                        }, 1500);
                    }
                },
                fail: () => {
                    uni.hideLoading();
                    uni.showToast({
                        title: '加载失败',
                        icon: 'none'
                    });
                    this.setData({
                        loading: false
                    });
                }
            });
        }
    }
};
</script>
<style>
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

/* 头部卡片 */
.header-card {
    position: relative;
    margin: -20rpx -20rpx 0;
    overflow: hidden;
}

.header-bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 260rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    border-radius: 0 0 48rpx 48rpx;
}

.header-info {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 50rpx 48rpx 40rpx;
}

.avatar {
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    border: 5rpx solid #fff;
    box-shadow: 0 6rpx 24rpx rgba(255, 193, 7, 0.4);
    margin-top: 36rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
}

.info-text {
    text-align: center;
    margin-top: 28rpx;
}

.name {
    font-size: 40rpx;
    font-weight: 700;
    color: #333;
    display: block;
    margin-bottom: 10rpx;
}

.title {
    font-size: 28rpx;
    color: #666;
    display: block;
    margin-bottom: 14rpx;
    font-weight: 500;
}

.region {
    display: flex;
    align-items: center;
    justify-content: center;
}

.region-icon {
    font-size: 24rpx;
    margin-right: 6rpx;
}

.region-text {
    font-size: 24rpx;
    color: #999;
}

/* 内容区域 */
.detail-content {
    padding: 0 24rpx;
}

/* 通用区块 */
.section {
    background: #fff;
    border-radius: 16rpx;
    padding: 28rpx;
    margin-top: 20rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 16rpx;
    border-bottom: 1rpx solid #f5f5f5;
}

.section-icon {
    font-size: 32rpx;
    margin-right: 14rpx;
}

.section-title {
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
}

.section-body {
    padding: 0 4rpx;
}

/* 基本信息 */
.info-grid {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20rpx;
}

.info-item {
    width: 50%;
    margin-bottom: 16rpx;
}

.info-label {
    font-size: 24rpx;
    color: #999;
    display: block;
    margin-bottom: 6rpx;
}

.info-value {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.info-row {
    margin-bottom: 14rpx;
}

.info-row .info-label {
    margin-bottom: 12rpx;
}

.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
}

.tag {
    font-size: 22rpx;
    color: #b8860b;
    background: rgba(255, 193, 7, 0.1);
    padding: 10rpx 20rpx;
    border-radius: 24rpx;
}

/* 专业技能 */
.skill-list {
    display: flex;
    flex-direction: column;
}

.skill-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 14rpx;
    padding: 14rpx 18rpx;
    background: #fffef5;
    border-radius: 10rpx;
    border-left: 3rpx solid #ffc107;
}

.skill-item:last-child {
    margin-bottom: 0;
}

.skill-dot {
    color: #ffc107;
    font-size: 28rpx;
    margin-right: 14rpx;
    line-height: 1;
}

.skill-text {
    font-size: 26rpx;
    color: #333;
    flex: 1;
    line-height: 1.5;
}

/* 个人简介 */
.intro-text {
    font-size: 26rpx;
    color: #333;
    line-height: 1.7;
    text-align: justify;
}

/* 项目经验 */
.project-list {
    display: flex;
    flex-direction: column;
}

.project-item {
    padding: 22rpx;
    background: #fffef5;
    border-radius: 14rpx;
    margin-bottom: 18rpx;
}

.project-item:last-child {
    margin-bottom: 0;
}

.project-header {
    display: flex;
    align-items: center;
    margin-bottom: 14rpx;
}

.project-index {
    width: 36rpx;
    height: 36rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    color: #fff;
    font-size: 22rpx;
    font-weight: 600;
    border-radius: 18rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 14rpx;
}

.project-name {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
    flex: 1;
}

.project-desc,
.project-result {
    display: flex;
    margin-bottom: 10rpx;
    padding-left: 50rpx;
}

.project-desc:last-child,
.project-result:last-child {
    margin-bottom: 0;
}

.desc-label,
.result-label {
    font-size: 24rpx;
    color: #999;
    flex-shrink: 0;
    width: 90rpx;
}

.desc-text,
.result-text {
    font-size: 24rpx;
    color: #666;
    flex: 1;
    line-height: 1.5;
}

/* 成果荣誉 */
.achievement-list {
    display: flex;
    flex-direction: column;
}

.achievement-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16rpx;
    padding: 18rpx 22rpx;
    background: #fffef5;
    border-radius: 10rpx;
}

.achievement-item:last-child {
    margin-bottom: 0;
}

.achievement-icon {
    color: #ffc107;
    font-size: 26rpx;
    margin-right: 14rpx;
    line-height: 1.4;
}

.achievement-text {
    font-size: 26rpx;
    color: #664d03;
    flex: 1;
    line-height: 1.4;
}

/* 底部占位 */
.bottom-space {
    height: 60rpx;
}
</style>
