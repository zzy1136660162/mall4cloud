<template>
    <view class="custom-tab-bar">
        <view class="tab-bar-container">
            <view
                :class="'tab-bar-item ' + (selected === index ? 'active' : '')"
                :data-path="item.pagePath"
                :data-index="index"
                @tap="switchTab"
                v-for="(item, index) in list"
                :key="index"
            >
                <image class="tab-bar-icon" :src="selected === index ? item.selectedIconPath : item.iconPath"></image>

                <text class="tab-bar-text" :style="'color: ' + (selected === index ? selectedColor : color)">{{ item.text }}</text>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            selected: 0,
            color: '#999999',
            selectedColor: '#1890ff',
            list: [
                {
                    pagePath: '/pages/index/index',
                    text: '首页',
                    iconPath: '/static/images/首页 (2).png',
                    selectedIconPath: '/static/images/首页-选中 (1).png'
                },
                {
                    pagePath: '/pages/demandList/demandList',
                    text: '我的需求',
                    iconPath: '/static/images/我的需求 (3).png',
                    selectedIconPath: '/static/images/我的需求 (1).png'
                }
            ]
        };
    },
    mounted() {
        // 处理小程序 attached 生命周期
        this.attached();
    },
    methods: {
        attached() {
            // 组件挂载时检查当前页面
            const pages = getCurrentPages();
            if (pages && pages.length > 0) {
                const currentPage = pages[pages.length - 1];
                // 只使用 route 属性，__route__ 已废弃
                const route = currentPage.route;
                if (route) {
                    const index = this.list.findIndex((item) => {
                        const itemPath = item.pagePath.replace(/^\//, '');
                        return route === itemPath;
                    });
                    if (index !== -1 && index !== this.selected) {
                        this.setData({
                            selected: index
                        });
                    }
                }
            }
        },

        switchTab(e) {
            const data = e.currentTarget.dataset;
            const url = data.path;
            uni.switchTab({
                url
            });
            this.setData({
                selected: data.index
            });
        }
    },
    created: function () {}
};
</script>
<style>
.custom-tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(120rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: transparent;
    z-index: 9999;
}

.tab-bar-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100rpx;
    margin: 10rpx 30rpx 30rpx;
    background: #ffffff;
    border-radius: 50rpx;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.12);
}

.tab-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    height: 100%;
    transition: all 0.3s;
}

.tab-bar-item:active {
    transform: scale(0.95);
}

.tab-bar-item.active {
    transform: scale(1.05);
}

.tab-bar-icon {
    width: 48rpx;
    height: 48rpx;
    margin-bottom: 8rpx;
}

.tab-bar-text {
    font-size: 24rpx;
    font-weight: 500;
}
</style>
