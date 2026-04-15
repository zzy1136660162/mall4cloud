<template>
    <view class="custom-tab-container">
        <view :class="'tab-item ' + (activeTab === item.id ? 'active' : '')" @tap="onTabChange" :data-id="item.id" :data-url="item.url" v-for="(item, index) in tabs" :key="index">
            <view class="tab-icon-wrapper">
                <image class="tab-icon" :src="activeTab === item.id ? item.selectedIcon : item.normalIcon" mode="aspectFit" />
                <view class="tab-badge" v-if="item.badge > 0">
                    <text class="badge-text">{{ item.badge > 99 ? '99+' : item.badge }}</text>
                </view>
            </view>

            <text class="tab-label">{{ item.name }}</text>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            tabs: [
                {
                    id: 0,
                    name: '首页',
                    url: '/pages/index/index',
                    normalIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/首页（未选中）.png',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/首页 (选中).png',
                    badge: 0
                },
                {
                    id: 1,
                    name: '商城',
                    url: '/pages/Product_list_page/Product_list_page',
                    normalIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/商城 (未选中).png',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/商城（选中）.png',
                    badge: 0
                },
                {
                    id: 2,
                    name: '选品',
                    url: '/pages/selection/selection',
                    normalIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/选品 (未选中).png',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/选品（选中）.png',
                    badge: 0
                },
                {
                    id: 3,
                    name: '研发',
                    url: '/pages/rd_index/rd_index',
                    normalIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/研发 (未选中).png',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/研发（选中）.png',
                    badge: 0
                },
                {
                    id: 4,
                    name: '我的',
                    url: '/pages/Profile_page/Profile_page',
                    normalIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/我的 (未选中).png',
                    selectedIcon: 'https://yuntuoengine.com/host_assets_files/jiedong_weapp_static/images/tab/我的 (选中).png',
                    badge: 0
                }
            ]
        };
    },
    props: {
        activeTab: {
            type: Number,
            default: 0
        }
    },
    methods: {
        onTabChange(e) {
            const { id, url } = e.currentTarget.dataset;
            if (id === this.activeTab) {
                return;
            }
            this.$emit('tabchange', {
                detail: {
                    activeTab: id
                }
            });
            uni.switchTab({
                url: url,
                fail: () => {
                    uni.redirectTo({
                        url: url,
                        fail: () => {
                            uni.navigateTo({
                                url: url
                            });
                        }
                    });
                }
            });
        },
        updateBadge(tabId, count) {
            const tabs = this.tabs.map((tab) => {
                if (tab.id === tabId) {
                    return {
                        ...tab,
                        badge: count
                    };
                }
                return tab;
            });
            this.setData({
                tabs
            });
        },
        setActiveTab(tabId) {
            this.$emit('tabchange', {
                detail: {
                    activeTab: tabId
                }
            });
        }
    },
    created: function () {}
};
</script>
<style>
.custom-tab-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 0 20rpx;
    border-top: 1rpx solid rgba(0, 0, 0, 0.06);
    z-index: 1000;
    padding-bottom: env(safe-area-inset-bottom);
    box-sizing: content-box;
}

.tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    padding: 12rpx 0;
    position: relative;
}

.tab-icon-wrapper {
    position: relative;
    width: 48rpx;
    height: 48rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tab-icon {
    width: 48rpx;
    height: 48rpx;
    object-fit: contain;
}

.tab-badge {
    position: absolute;
    top: -8rpx;
    right: -12rpx;
    min-width: 32rpx;
    height: 32rpx;
    background: #ff6b6b;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8rpx;
    border: 2rpx solid #ffffff;
}

.badge-text {
    font-size: 18rpx;
    color: #ffffff;
    font-weight: 600;
    line-height: 1;
}

.tab-label {
    font-size: 20rpx;
    color: #999999;
    font-weight: 400;
    letter-spacing: 0.5rpx;
    transition: color 0.2s ease;
}

.tab-item.active .tab-label {
    color: #1a1a1a;
    font-weight: 600;
}

.tab-item:active .tab-icon-wrapper {
    transform: scale(0.92);
}

.tab-item:active .tab-icon {
    opacity: 0.7;
}
</style>
