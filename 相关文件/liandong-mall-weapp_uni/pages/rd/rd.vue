<template>
    <view class="rd-page">
        <view class="page-background"></view>

        <view class="page-header">
            <view class="header-content">
                <view class="header-top">
                    <view class="brand-section">
                        <view class="brand-name">研发中心</view>
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
                <view class="header-desc">创新驱动，品质保障</view>
            </view>
        </view>

        <view class="page-content">
            <view class="stats-section">
                <view class="stat-card">
                    <view class="stat-icon">🔬</view>
                    <view class="stat-content">
                        <view class="stat-value">12</view>
                        <view class="stat-label">进行中</view>
                    </view>
                </view>
                <view class="stat-card">
                    <view class="stat-icon">✅</view>
                    <view class="stat-content">
                        <view class="stat-value">28</view>
                        <view class="stat-label">已完成</view>
                    </view>
                </view>
                <view class="stat-card">
                    <view class="stat-icon">📊</view>
                    <view class="stat-content">
                        <view class="stat-value">156</view>
                        <view class="stat-label">总项目</view>
                    </view>
                </view>
            </view>

            <view class="section-header">
                <view class="section-title">
                    <text class="title-text">研发项目</text>
                    <view class="title-decoration"></view>
                </view>
                <view class="section-more" @tap="viewAllProjects">
                    <text class="more-text">全部项目</text>
                    <text class="more-arrow">→</text>
                </view>
            </view>

            <view class="project-list">
                <view class="project-card" @tap="goToProjectDetail" :data-id="item.id" v-for="(item, index) in projects" :key="index">
                    <view class="project-header">
                        <view class="project-icon">{{ item.icon }}</view>
                        <view class="project-info">
                            <view class="project-name">{{ item.name }}</view>
                            <view class="project-category">{{ item.category }}</view>
                        </view>
                        <view :class="'project-status ' + item.statusClass">{{ item.statusText }}</view>
                    </view>

                    <view class="project-body">
                        <view class="project-desc">{{ item.description }}</view>

                        <view class="project-progress">
                            <view class="progress-header">
                                <text class="progress-label">项目进度</text>
                                <text class="progress-value">{{ item.progress }}%</text>
                            </view>
                            <view class="progress-bar">
                                <view class="progress-fill" :style="'width: ' + item.progress + '%'"></view>
                            </view>
                        </view>
                    </view>

                    <view class="project-footer">
                        <view class="project-meta">
                            <view class="meta-item">
                                <text class="meta-label">负责人</text>
                                <text class="meta-value">{{ item.leader }}</text>
                            </view>
                            <view class="meta-item">
                                <text class="meta-label">截止日期</text>
                                <text class="meta-value">{{ item.deadline }}</text>
                            </view>
                        </view>
                        <view class="project-actions">
                            <view class="action-btn-small" @tap="viewProject" :data-id="item.id" @tap.stop.prevent="trueFun">
                                <text class="action-text">查看</text>
                            </view>
                        </view>
                    </view>
                </view>
            </view>

            <view class="loading-state" v-if="loading">
                <view class="loading-dots">
                    <view class="dot"></view>
                    <view class="dot"></view>
                    <view class="dot"></view>
                </view>
            </view>

            <view class="end-state" v-if="noMore && projects.length > 0">
                <view class="end-line"></view>
                <text class="end-text">已加载全部</text>
                <view class="end-line"></view>
            </view>

            <view class="empty-state" v-if="projects.length === 0 && !loading">
                <text class="empty-emoji">🔬</text>
                <text class="empty-title">暂无项目</text>
                <text class="empty-desc">探索更多研发成果</text>
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
            projects: [],
            loading: false,
            noMore: false,
            page: 1,
            pageSize: 10
        };
    },
    onLoad(options) {
        this.loadProjects();
    },
    onReachBottom() {
        if (!this.noMore && !this.loading) {
            this.loadProjects();
        }
    },
    methods: {
        async loadProjects() {
            if (this.loading || this.noMore) {
                return;
            }
            this.setData({
                loading: true
            });
            try {
                const mockProjects = this.getMockProjects();
                if (mockProjects.length === 0) {
                    this.setData({
                        noMore: true
                    });
                } else {
                    const newProjects = [...this.projects, ...mockProjects];
                    this.setData({
                        projects: newProjects,
                        page: this.page + 1
                    });
                }
            } catch (error) {
                console.log('CatchClause', error);
                console.log('CatchClause', error);
                console.error('加载项目失败:', error);
            } finally {
                this.setData({
                    loading: false
                });
            }
        },

        getMockProjects() {
            const projects = [];
            const categories = ['新材料', '工艺优化', '产品研发', '技术创新'];
            const statuses = ['active', 'completed', 'pending'];
            const statusTexts = {
                active: '进行中',
                completed: '已完成',
                pending: '待开始'
            };
            const icons = ['🔬', '⚡', '🧪', '🔧', '💡', '🎯', '📊', '🔭'];
            for (let i = 0; i < 5; i++) {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                const progress = status === 'completed' ? 100 : Math.floor(Math.random() * 90) + 10;
                projects.push({
                    id: Date.now() + i,
                    name: `研发项目 ${this.projects.length + i + 1}`,
                    category: categories[Math.floor(Math.random() * categories.length)],
                    description: '这是一个重要的研发项目，旨在提升产品质量和技术创新能力，为公司发展提供强有力的技术支撑。',
                    progress: progress,
                    statusClass: status,
                    statusText: statusTexts[status],
                    icon: icons[Math.floor(Math.random() * icons.length)],
                    leader: '研发团队',
                    deadline: '2026-06-30'
                });
            }
            return projects;
        },

        goToProjectDetail(e) {
            const projectId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/project-detail/project-detail?id=${projectId}`,
                fail: () => {
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                    });
                }
            });
        },

        viewProject(e) {
            const projectId = e.currentTarget.dataset.id;
            uni.navigateTo({
                url: `/pages/project-detail/project-detail?id=${projectId}`,
                fail: () => {
                    uni.showToast({
                        title: '页面跳转失败',
                        icon: 'none'
                    });
                }
            });
        },

        viewAllProjects() {
            uni.showToast({
                title: '查看全部项目',
                icon: 'none'
            });
        },

        onTabChange(e) {
            const { activeTab } = e.detail;
            const tabPaths = ['/pages/index/index', '/pages/Product_list_page/Product_list_page', '/pages/selection/selection', '/pages/rd/rd', '/pages/Profile_page/Profile_page'];
            if (activeTab !== 3) {
                uni.switchTab({
                    url: tabPaths[activeTab]
                });
            }
        },

        trueFun() {
            console.log('占位：函数 true 未声明');
        }
    }
};
</script>
<style>
page {
    background: #fafafa;
    min-height: 100vh;
}

.rd-page {
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

.stats-section {
    display: flex;
    gap: 16rpx;
    margin-bottom: 40rpx;
    overflow-x: auto;
}

.stat-card {
    flex: 1;
    min-width: 200rpx;
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx 24rpx;
    display: flex;
    align-items: center;
    gap: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.stat-icon {
    font-size: 48rpx;
    width: 96rpx;
    height: 96rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.stat-value {
    font-size: 48rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: -1rpx;
}

.stat-label {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
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
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}

.more-arrow {
    font-size: 24rpx;
    color: #1a1a1a;
    font-weight: 300;
}

.project-list {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}

.project-card {
    background: #ffffff;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.04);
}

.project-header {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 24rpx;
    border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.project-icon {
    font-size: 48rpx;
    width: 96rpx;
    height: 96rpx;
    background: #f5f5f5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.project-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
}

.project-name {
    font-size: 32rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.project-category {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.project-status {
    padding: 8rpx 20rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    font-weight: 600;
    letter-spacing: 0.5rpx;
    flex-shrink: 0;
}

.project-status.active {
    background: #e3f2fd;
    color: #1976d2;
}

.project-status.completed {
    background: #e8f5e9;
    color: #388e3c;
}

.project-status.pending {
    background: #fff3e0;
    color: #f57c00;
}

.project-body {
    padding: 24rpx;
}

.project-desc {
    font-size: 26rpx;
    color: #666666;
    line-height: 1.6;
    margin-bottom: 24rpx;
    letter-spacing: 0.3rpx;
}

.project-progress {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.progress-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.progress-label {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.progress-value {
    font-size: 28rpx;
    color: #1a1a1a;
    font-weight: 600;
    letter-spacing: 0.5rpx;
}

.progress-bar {
    width: 100%;
    height: 8rpx;
    background: #f5f5f5;
    border-radius: 4rpx;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1a1a1a 0%, #4a4a4a 100%);
    border-radius: 4rpx;
    transition: width 0.3s ease;
}

.project-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.06);
}

.project-meta {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
}

.meta-label {
    font-size: 22rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.3rpx;
}

.meta-value {
    font-size: 24rpx;
    color: #1a1a1a;
    font-weight: 500;
    letter-spacing: 0.3rpx;
}

.project-actions {
    display: flex;
    gap: 12rpx;
}

.action-btn-small {
    padding: 12rpx 24rpx;
    background: #1a1a1a;
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.action-text {
    font-size: 24rpx;
    color: #ffffff;
    font-weight: 500;
    letter-spacing: 0.5rpx;
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60rpx 0;
}

.loading-dots {
    display: flex;
    gap: 12rpx;
}

.dot {
    width: 12rpx;
    height: 12rpx;
    background: #1a1a1a;
    border-radius: 50%;
    animation: pulse 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
    animation-delay: 0s;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}

@keyframes pulse {
    0%,
    80%,
    100% {
        opacity: 0.3;
        transform: scale(0.8);
    }
    40% {
        opacity: 1;
        transform: scale(1);
    }
}

.end-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24rpx;
    padding: 60rpx 0;
}

.end-line {
    width: 80rpx;
    height: 1rpx;
    background: rgba(0, 0, 0, 0.1);
}

.end-text {
    font-size: 24rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 2rpx;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 160rpx 0;
}

.empty-emoji {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.3;
}

.empty-title {
    font-size: 36rpx;
    color: #1a1a1a;
    font-weight: 500;
    margin-bottom: 16rpx;
    letter-spacing: 1rpx;
}

.empty-desc {
    font-size: 26rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
}
</style>
