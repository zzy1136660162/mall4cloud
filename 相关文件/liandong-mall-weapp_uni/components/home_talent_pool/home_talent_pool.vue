<template>
    <view class="sp-home-talent-pool">
        <view class="section-header">
            <view class="header-left">
                <text class="section-icon">👨‍🔬</text>
                <text class="section-title">{{ title }}</text>
            </view>
            <view class="header-right" @tap="goToTalentList" v-if="showMore">
                <text class="more-text">查看更多</text>
                <text class="arrow">></text>
            </view>
        </view>

        <view class="talent-list" v-if="!loading && !error && talents.length > 0">
            <view class="talent-card" @tap="goToTalentDetail" :data-id="item.id" v-for="(item, index) in talents" :key="index">
                <view class="talent-avatar-wrapper">
                    <image class="talent-avatar" :src="item.avatar" mode="aspectFill" :lazy-load="true" />
                </view>

                <view class="talent-info">
                    <text class="talent-name">{{ item.name }}</text>
                    <text class="talent-title">{{ item.title }}</text>
                    <view class="talent-tags">
                        <text class="tag" v-for="(tag, index1) in item.expertiseAreas" :key="index1">{{ tag }}</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="loading-state" v-if="loading">
            <text class="loading-text">加载中...</text>
        </view>

        <view class="error-state" v-if="error">
            <text class="error-text">{{ error }}</text>
            <text class="retry-btn" @tap="refresh">点击重试</text>
        </view>

        <view class="empty-state" v-if="!loading && !error && talents.length === 0">
            <text class="empty-text">暂无人才信息</text>
        </view>
    </view>
</template>

<script>
const app = getApp();
export default {
    data() {
        return {
            talents: [],
            loading: true,
            error: null,
            tag: ''
        };
    },
    props: {
        title: {
            type: String,
            default: '研发人才库'
        },
        showMore: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 3
        }
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        handlePageShow() {
            if (!this.talents.length) {
                this.loadTalents();
            }
        },

        attached() {
            this.loadTalents();
        },

        async loadTalents() {
            this.setData({
                loading: true,
                error: null
            });
            try {
                const res = await new Promise((resolve, reject) => {
                    app.globalData.request({
                        url: `/api/talent_pool/list?page=1&pageSize=${this.limit}`,
                        success: (res) => {
                            console.log('人才API响应:', res);
                            resolve(res);
                        },
                        fail: (err) => reject(err)
                    });
                });
                console.log('人才数据:', res);
                let talents = [];
                if (res && res.data && res.data.list) {
                    talents = res.data.list;
                } else if (res && res.list) {
                    talents = res.list;
                }
                this.setData({
                    talents: talents,
                    loading: false
                });
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载人才信息失败:', error);
                this.setData({
                    error: '加载失败',
                    loading: false
                });
            }
        },

        goToTalentDetail(e) {
            const { id } = e.currentTarget.dataset;
            uni.navigateTo({
                url: `/pages/talent_pool/detail/detail?id=${id}`
            });
        },

        goToTalentList() {
            uni.navigateTo({
                url: '/pages/talent_pool/index/index'
            });
        },

        refresh() {
            this.loadTalents();
        }
    },
    created: function () {}
};
</script>
<style>
.sp-home-talent-pool {
    background: #ffffff;
    padding: 24rpx;
    margin-bottom: 20rpx;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24rpx;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.section-icon {
    font-size: 44rpx;
}

.section-title {
    font-size: 34rpx;
    font-weight: 600;
    color: #333333;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 10rpx 18rpx;
    background: #f5f5f5;
    border-radius: 20rpx;
}

.more-text {
    font-size: 28rpx;
    color: #666666;
}

.arrow {
    font-size: 28rpx;
    color: #999999;
}

.talent-list {
    width: 100%;
}

.talent-card {
    display: flex;
    align-items: center;
    padding: 20rpx;
    margin-bottom: 16rpx;
    background: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
    border: 1rpx solid #f0f0f0;
}

.talent-avatar-wrapper {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.talent-avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50rpx;
    border: 3rpx solid #ffffff;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
    background: #f5f5f5;
}

.talent-info {
    margin-left: 24rpx;
    flex: 1;
}

.talent-name {
    display: block;
    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
    margin-bottom: 6rpx;
}

.talent-title {
    display: block;
    font-size: 24rpx;
    color: #666666;
    margin-bottom: 12rpx;
}

.talent-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
}

.tag {
    font-size: 20rpx;
    color: #b8860b;
    background: rgba(255, 193, 7, 0.1);
    padding: 4rpx 12rpx;
    border-radius: 12rpx;
}

.loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx;
}

.loading-text {
    font-size: 26rpx;
    color: #999999;
}

.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40rpx;
}

.error-text {
    font-size: 26rpx;
    color: #666666;
    margin-bottom: 16rpx;
}

.retry-btn {
    font-size: 24rpx;
    color: #1890ff;
}

.empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40rpx;
}

.empty-text {
    font-size: 26rpx;
    color: #999999;
}
</style>
